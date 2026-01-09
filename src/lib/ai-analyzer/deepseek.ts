/**
 * DeepSeek AI Analyzer Module
 *
 * Purpose: Extract supplement information using DeepSeek model
 * Provider: SophNet
 */

import type { VideoAnalysisResult } from "@/types/supplement";
import type { Language } from "@/lib/i18n";
import { getAnalysisPrompt } from "@/prompts/analysis";

/**
 * Analyze video content using DeepSeek
 */
export async function analyzeWithDeepSeek(
  content: string,
  contentType: "transcript" | "description",
  language: Language = 'zh'
): Promise<VideoAnalysisResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const baseURL = process.env.DEEPSEEK_BASE_URL?.trim();
  const model = (process.env.DEEPSEEK_MODEL || "DeepSeek-V3.2-Fast").trim();

  if (!apiKey || !baseURL) {
    throw new Error("DEEPSEEK_API_KEY or DEEPSEEK_BASE_URL is not configured in environment variables");
  }

  // Use localized prompt
  const prompt = getAnalysisPrompt(language) + content;

  try {
    console.log(`[DeepSeek Analysis] Calling API: ${baseURL}/chat/completions`);

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
        max_tokens: 4096,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DeepSeek Analysis] API error ${response.status}:`, errorText);
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[DeepSeek Analysis] JSON not found, raw response:", textContent.substring(0, 500));
      throw new Error("Failed to parse JSON from DeepSeek response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    console.log(`[DeepSeek Analysis] Success, found ${parsed.supplements?.length || 0} supplements`);

    return {
      supplements: parsed.supplements || [],
      warnings: parsed.warnings || [],
      credibilityScore: parsed.credibilityScore || 50
    };

  } catch (error) {
    console.error("[DeepSeek Analysis] Error:", error);
    if (error instanceof Error) {
      console.error("[DeepSeek Analysis] Error details:", error.message);
    }
    throw new Error(
      "DeepSeek Analysis failed: " +
      (error instanceof Error ? error.message : String(error))
    );
  }
}

/**
 * Test DeepSeek connection
 */
export async function testDeepSeekConnection(): Promise<boolean> {
  try {
    const result = await analyzeWithDeepSeek(
      "这个视频推荐每天服用维生素C 1000mg，可以提高免疫力。",
      "description",
      "zh"
    );
    console.log("DeepSeek connection test successful:", result);
    return true;
  } catch (error) {
    console.error("DeepSeek connection test failed:", error);
    return false;
  }
}
