import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { Language } from "@/lib/i18n";
import { getCommentaryPrompt } from "@/prompts/analysis";
import { generateFallbackCommentary } from "@/prompts/fallback";

/**
 * API Route: AI毒舌点评排程方案
 * POST /api/ai-commentary
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sundial, language = 'zh' } = body as { sundial: any; language?: Language };

    if (!sundial || !sundial.timeSlots) {
      return NextResponse.json(
        { error: "Sundial data is required" },
        { status: 400 }
      );
    }

    const commentary = await generateAICommentary(sundial, language);

    return NextResponse.json({
      success: true,
      data: { commentary }
    });

  } catch (error) {
    console.error("[AI Commentary] API error:", error);
    return NextResponse.json(
      {
        error: "AI commentary failed: " + (error instanceof Error ? error.message : String(error))
      },
      { status: 500 }
    );
  }
}

/**
 * 使用AI生成专业毒舌点评（支持DeepSeek和Claude）
 */
async function generateAICommentary(
  sundial: {
    timeSlots: any[];
    conflicts: any[];
    synergies: any[];
  },
  language: Language
): Promise<string> {
  const provider = (process.env.AI_PROVIDER || 'claude').toLowerCase().trim();

  if (provider === 'deepseek') {
    return generateCommentaryWithDeepSeek(sundial, language);
  } else {
    return generateCommentaryWithClaude(sundial, language);
  }
}

async function generateCommentaryWithDeepSeek(
  sundial: {
    timeSlots: any[];
    conflicts: any[];
    synergies: any[];
  },
  language: Language
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const baseURL = process.env.DEEPSEEK_BASE_URL?.trim();
  const model = (process.env.DEEPSEEK_MODEL || 'DeepSeek-V3.2-Fast').trim();

  if (!apiKey || !baseURL) {
    console.warn("DeepSeek config missing, using fallback commentary");
    return getFallback(sundial, language);
  }

  // 构建分析数据
  const productCount = sundial.timeSlots.reduce((sum, slot) => sum + slot.products.length, 0);
  const conflictCount = sundial.conflicts.length;
  const synergyCount = sundial.synergies?.length || 0;

  // 提取产品和时间信息
  const scheduleInfo = sundial.timeSlots.map((slot, i) => 
    `${i + 1}. ${slot.time} - ${slot.products.map((p: any) => p.product?.name || 'Unknown').join(language === 'zh' ? '、' : ', ')} (${slot.reasoning})`
  ).join('\n');

  const conflictDetails = sundial.conflicts.map((c, i) => 
    `${i + 1}. ${c.productAName || c.product1} vs ${c.productBName || c.product2} - ${c.severity}${c.explanation ? ` - ${c.explanation}` : ''}`
  ).join('\n');

  const prompt = getCommentaryPrompt(language, scheduleInfo, conflictDetails, productCount, conflictCount, synergyCount);

  try {
    console.log(`[AI Commentary] Using DeepSeek at ${baseURL}...`);

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[AI Commentary] DeepSeek API error ${response.status}:`, errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[AI Commentary] DeepSeek response success');

    const commentary = data.choices?.[0]?.message?.content || "";

    if (!commentary) {
      throw new Error("AI returned empty content");
    }

    console.log(`[AI Commentary] DeepSeek success, length: ${commentary.length}`);
    return commentary.trim();

  } catch (error) {
    console.error("[AI Commentary] DeepSeek call failed:", error);
    if (error instanceof Error) {
      console.error("[AI Commentary] Error details:", error.message);
    }
    return getFallback(sundial, language);
  }
}

async function generateCommentaryWithClaude(
  sundial: {
    timeSlots: any[];
    conflicts: any[];
    synergies: any[];
  },
  language: Language
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_claude_api_key_here') {
    console.warn("ANTHROPIC_API_KEY not configured, using fallback commentary");
    return getFallback(sundial, language);
  }

  const anthropic = new Anthropic({ apiKey });

  // 构建分析数据
  const productCount = sundial.timeSlots.reduce((sum, slot) => sum + slot.products.length, 0);
  const conflictCount = sundial.conflicts.length;
  const synergyCount = sundial.synergies?.length || 0;

  // 提取产品和时间信息
  const scheduleInfo = sundial.timeSlots.map((slot, i) => 
    `${i + 1}. ${slot.time} - ${slot.products.map((p: any) => p.product?.name || 'Unknown').join(language === 'zh' ? '、' : ', ')} (${slot.reasoning})`
  ).join('\n');

  const conflictDetails = sundial.conflicts.map((c, i) => 
    `${i + 1}. ${c.productAName || c.product1} vs ${c.productBName || c.product2} - ${c.severity}${c.explanation ? ` - ${c.explanation}` : ''}`
  ).join('\n');

  const prompt = getCommentaryPrompt(language, scheduleInfo, conflictDetails, productCount, conflictCount, synergyCount);

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      temperature: 0.9, // 提高随机性，让每次点评都不一样
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const commentary = response.content[0].type === 'text' ? response.content[0].text : "";

    if (!commentary) {
      throw new Error("AI returned empty content");
    }

    console.log(`[AI Commentary] Success, length: ${commentary.length}`);
    return commentary.trim();

  } catch (error) {
    console.error("[AI Commentary] Call failed:", error);
    return getFallback(sundial, language);
  }
}

/**
 * 获取降级点评
 */
function getFallback(
  sundial: { timeSlots: any[]; conflicts: any[]; synergies: any[] },
  language: Language
): string {
  const conflicts = sundial.conflicts.length;
  const productCount = sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0);
  return generateFallbackCommentary(conflicts, productCount, language);
}
