import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { description, imageBase64 } = await req.json();

    if (!description && !imageBase64) {
      return NextResponse.json(
        { error: "Description or image required" },
        { status: 400 }
      );
    }

    const content: Array<Record<string, unknown>> = [];

    if (imageBase64) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/jpeg",
          data: imageBase64,
        },
      });
    }

    content.push({
      type: "text",
      text: `You are a civic issue classifier for CivicPulse AI. Analyze this issue and respond ONLY in valid JSON, no extra text:
{
  "category": "pothole|garbage|lighting|water|road_damage|flooding|graffiti|other",
  "severity": "low|medium|high|critical",
  "summary": "one precise sentence describing the issue",
  "department": "Roads & Infrastructure|Sanitation Dept|Electricity Board|Water Authority|Municipal Corp|Traffic Dept",
  "confidence": 0.0-1.0,
  "estimated_resolution_days": 1-30,
  "priority_score": 1-10
}
Description: "${description || "See attached image"}"`,
    });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content,
          },
        ],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Claude API error:", error);
      return NextResponse.json(
        { error: "AI classification failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const text = data.content[0].text;

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
