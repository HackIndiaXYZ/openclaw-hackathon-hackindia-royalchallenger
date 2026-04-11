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

    const nvidiaContent: any[] = [
      {
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
      },
    ];

    if (imageBase64) {
      nvidiaContent.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${imageBase64}`,
        },
      });
    }

    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ANTHROPIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-90b-vision-instruct",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: nvidiaContent,
          },
        ],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("NVIDIA API error:", error);
      return NextResponse.json(
        { error: "AI classification failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const text = data.choices[0].message.content;

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
