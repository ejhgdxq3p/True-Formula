import { NextRequest, NextResponse } from "next/server";
import { analyzeVideoContent } from "@/lib/ai-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, contentType } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required and must be a string" },
        { status: 400 }
      );
    }

    if (contentType !== "transcript" && contentType !== "description") {
      return NextResponse.json(
        { error: "ContentType must be 'transcript' or 'description'" },
        { status: 400 }
      );
    }

    const result = await analyzeVideoContent(content, contentType);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze video. " + (error instanceof Error ? error.message : "") },
      { status: 500 }
    );
  }
}
