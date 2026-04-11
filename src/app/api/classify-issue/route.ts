import { NextResponse } from "next/server";

type AiResult = {
  category: "pothole" | "garbage" | "lighting" | "water" | "road_damage" | "flooding" | "graffiti" | "other";
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
  department: "Roads & Infrastructure" | "Sanitation Dept" | "Electricity Board" | "Water Authority" | "Municipal Corp" | "Traffic Dept";
  confidence: number;
  estimated_resolution_days: number;
  priority_score: number;
};

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function heuristicClassification(description: string): AiResult {
  const text = (description || "").toLowerCase();

  let category: AiResult["category"] = "other";
  if (/(pothole|crack|road damage|damaged road|sinkhole|uneven road)/.test(text)) category = "pothole";
  else if (/(garbage|trash|waste|dump|overflow|litter)/.test(text)) category = "garbage";
  else if (/(streetlight|light not working|dark street|no light|lamp post)/.test(text)) category = "lighting";
  else if (/(water leak|pipeline|sewage|drain|water logging|waterlogging)/.test(text)) category = "water";
  else if (/(flood|flooding|water on road|inundated)/.test(text)) category = "flooding";
  else if (/(graffiti|vandalism|wall paint)/.test(text)) category = "graffiti";
  else if (/(road|street|carriageway|asphalt)/.test(text)) category = "road_damage";

  let severity: AiResult["severity"] = "medium";
  if (/(urgent|danger|accident|injury|critical|hazard)/.test(text)) severity = "critical";
  else if (/(major|deep|blocked|serious|high risk)/.test(text)) severity = "high";
  else if (/(minor|small|low risk)/.test(text)) severity = "low";

  const departmentMap: Record<AiResult["category"], AiResult["department"]> = {
    pothole: "Roads & Infrastructure",
    road_damage: "Roads & Infrastructure",
    garbage: "Municipal Corp",
    lighting: "Electricity Board",
    water: "Water Authority",
    flooding: "Municipal Corp",
    graffiti: "Municipal Corp",
    other: "Municipal Corp",
  };

  const dayMap: Record<AiResult["severity"], number> = {
    low: 10,
    medium: 6,
    high: 3,
    critical: 1,
  };

  const priorityMap: Record<AiResult["severity"], number> = {
    low: 3,
    medium: 6,
    high: 8,
    critical: 10,
  };

  const cleanDescription = (description || "").trim();
  const summary = cleanDescription
    ? `Citizen reported ${category.replace("_", " ")} issue: ${cleanDescription.slice(0, 140)}${cleanDescription.length > 140 ? "..." : ""}`
    : `Citizen reported ${category.replace("_", " ")} issue requiring municipal attention.`;

  return {
    category,
    severity,
    summary,
    department: departmentMap[category],
    confidence: 0.74,
    estimated_resolution_days: dayMap[severity],
    priority_score: priorityMap[severity],
  };
}

function keywordCategoryOverride(description: string): AiResult["category"] | null {
  const text = (description || "").toLowerCase();
  if (/(pothole|road damage|damaged road|sinkhole|crack in road|broken road|uneven road)/.test(text)) return "pothole";
  if (/(garbage|trash|waste|dump yard|overflow bin|litter)/.test(text)) return "garbage";
  if (/(streetlight|light not working|lamp post|dark street)/.test(text)) return "lighting";
  if (/(water leak|pipeline|sewage|drainage|drain|waterlogging|water logging)/.test(text)) return "water";
  if (/(flood|flooding|inundated)/.test(text)) return "flooding";
  return null;
}

function departmentForCategory(category: AiResult["category"]): AiResult["department"] {
  const routeMap: Record<AiResult["category"], AiResult["department"]> = {
    pothole: "Roads & Infrastructure",
    road_damage: "Roads & Infrastructure",
    garbage: "Municipal Corp",
    lighting: "Electricity Board",
    water: "Water Authority",
    flooding: "Municipal Corp",
    graffiti: "Municipal Corp",
    other: "Municipal Corp",
  };

  return routeMap[category];
}

function sanitizeResult(input: any, fallback: AiResult, description: string): AiResult {
  const allowedCategories = new Set(["pothole", "garbage", "lighting", "water", "road_damage", "flooding", "graffiti", "other"]);
  const allowedSeverity = new Set(["low", "medium", "high", "critical"]);
  const modelCategory = allowedCategories.has(input?.category) ? input.category : fallback.category;
  const overrideCategory = keywordCategoryOverride(description);
  const category = overrideCategory || modelCategory;
  const severity = allowedSeverity.has(input?.severity) ? input.severity : fallback.severity;
  // Department is derived from category to prevent wrong model routing guesses.
  const department = departmentForCategory(category as AiResult["category"]);

  return {
    category,
    severity,
    summary: typeof input?.summary === "string" && input.summary.trim().length > 5 ? input.summary.trim() : fallback.summary,
    department,
    confidence: clamp(Number(input?.confidence || fallback.confidence), 0, 1),
    estimated_resolution_days: clamp(Math.round(Number(input?.estimated_resolution_days || fallback.estimated_resolution_days)), 1, 30),
    priority_score: clamp(Math.round(Number(input?.priority_score || fallback.priority_score)), 1, 10),
  };
}

export async function POST(req: Request) {
  try {
    const { description, imageBase64, imageMimeType } = await req.json();

    if (!description && !imageBase64) {
      return NextResponse.json(
        { error: "Description or image required" },
        { status: 400 }
      );
    }

    const fallback = heuristicClassification(description || "");

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(fallback);
    }

    const prompt = `You are a civic issue classifier for CivicPulse AI.
Analyze the provided citizen complaint and return ONLY valid JSON with no markdown:
{
  "category": "pothole|garbage|lighting|water|road_damage|flooding|graffiti|other",
  "severity": "low|medium|high|critical",
  "summary": "one precise sentence describing the issue",
  "department": "Roads & Infrastructure|Sanitation Dept|Electricity Board|Water Authority|Municipal Corp|Traffic Dept",
  "confidence": 0.0-1.0,
  "estimated_resolution_days": 1-30,
  "priority_score": 1-10
}
Citizen description: "${description || "See attached image"}"`;

    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: imageMimeType || "image/jpeg",
          data: imageBase64,
        },
      });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!res.ok) {
      console.error("Gemini API error:", await res.text());
      return NextResponse.json(fallback);
    }

    const data = await res.json();
    const text = (data?.candidates || [])
      .flatMap((candidate: any) => candidate?.content?.parts || [])
      .map((part: any) => part?.text || "")
      .join("\n");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(fallback);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(sanitizeResult(parsed, fallback, description || ""));
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(heuristicClassification(""));
  }
}
