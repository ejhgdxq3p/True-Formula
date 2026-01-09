/**
 * AI Video Analyzer Module
 *
 * Purpose: Extract supplement information from video transcripts or descriptions
 * using AI providers (Claude or DeepSeek).
 */

import Anthropic from "@anthropic-ai/sdk";
import type { VideoAnalysisResult } from "@/types/supplement";
import type { Language } from "@/lib/i18n";
import { getAnalysisPrompt } from "@/prompts/analysis";
import { analyzeWithDeepSeek } from "./deepseek";

/**
 * Get AI provider from environment variable
 */
function getAIProvider(): "claude" | "deepseek" {
  const provider = process.env.AI_PROVIDER?.toLowerCase().trim();
  if (provider === "deepseek") return "deepseek";
  return "claude"; // Default to Claude
}

/**
 * Analyze video content (transcript or description) to extract supplement info
 * Automatically selects AI provider based on AI_PROVIDER environment variable
 */
export async function analyzeVideoContent(
  content: string,
  contentType: "transcript" | "description",
  language: Language = 'zh'
): Promise<VideoAnalysisResult> {
  const provider = getAIProvider();

  console.log(`Using AI provider: ${provider.toUpperCase()}`);

  // Route to appropriate AI provider
  if (provider === "deepseek") {
    return analyzeWithDeepSeek(content, contentType, language);
  }

  // Default: Claude
  return analyzeWithClaude(content, contentType, language);
}

/**
 * Analyze using Claude (original implementation)
 */
async function analyzeWithClaude(
  content: string,
  contentType: "transcript" | "description",
  language: Language = 'zh'
): Promise<VideoAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn("ANTHROPIC_API_KEY is not set. Using mock response for development.");
    return getMockAnalysisResult(language);
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  // Use localized prompt
  const prompt = getAnalysisPrompt(language) + content;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const textContent = response.content[0].type === 'text' ? response.content[0].text : "";
    
    // Find JSON in the response (in case of extra chatter)
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Claude response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      supplements: parsed.supplements || [],
      warnings: parsed.warnings || [],
      credibilityScore: parsed.credibilityScore || 50
    };

  } catch (error) {
    console.error("Error analyzing video content:", error);
    // Return empty result or throw
    throw new Error("AI Analysis failed: " + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Mock result for development when API key is missing
 */
function getMockAnalysisResult(language: Language): VideoAnalysisResult {
  if (language === 'en') {
    return {
      supplements: [
        {
          name: "Vitamin D3",
          dosage: "5000 IU",
          timing: "Morning with breakfast",
          reasoning: "Improves mood and bone health, mentioned as essential."
        },
        {
          name: "Magnesium Glycinate",
          dosage: "400 mg",
          timing: "Before bed",
          reasoning: "Helps with sleep and recovery."
        }
      ],
      warnings: [
        "High dosage of Vitamin D3 recommended without K2 mentioned.",
        "Content is anecdotal."
      ],
      credibilityScore: 60
    };
  }
  
  return {
    supplements: [
      {
        name: "维生素D3",
        dosage: "5000 IU",
        timing: "早餐时服用",
        reasoning: "改善情绪和骨骼健康，被认为是必需的。"
      },
      {
        name: "甘氨酸镁",
        dosage: "400 mg",
        timing: "睡前",
        reasoning: "帮助睡眠和恢复。"
      }
    ],
    warnings: [
      "推荐的维生素D3剂量较高，但未提及K2。",
      "内容基于个人经验。"
    ],
    credibilityScore: 60
  };
}

/**
 * Batch analysis (Phase 2)
 */
export async function analyzeBatch(videos: string[]): Promise<VideoAnalysisResult> {
  // TODO: Analyze each video
  // TODO: Merge results, handle duplicates
  // TODO: Flag conflicting recommendations across videos
  throw new Error("Not implemented - Phase 2 feature");
}

/**
 * Export provider-specific analyzers for testing
 */
export { analyzeWithDeepSeek } from "./deepseek";
export { analyzeWithClaude };
