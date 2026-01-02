/**
 * AI Video Analyzer Module
 *
 * Purpose: Extract supplement information from video transcripts or descriptions
 * using AI providers (Claude or DeepSeek).
 */

import Anthropic from "@anthropic-ai/sdk";
import type { VideoAnalysisResult } from "@/types/supplement";
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
  contentType: "transcript" | "description"
): Promise<VideoAnalysisResult> {
  const provider = getAIProvider();

  console.log(`Using AI provider: ${provider.toUpperCase()}`);

  // Route to appropriate AI provider
  if (provider === "deepseek") {
    return analyzeWithDeepSeek(content, contentType);
  }

  // Default: Claude
  return analyzeWithClaude(content, contentType);
}

/**
 * Analyze using Claude (original implementation)
 */
async function analyzeWithClaude(
  content: string,
  contentType: "transcript" | "description"
): Promise<VideoAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn("ANTHROPIC_API_KEY is not set. Using mock response for development.");
    return getMockAnalysisResult();
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  const prompt = `
  你是一位资深营养学家和药理学专家。分析以下内容，提取所有与健康相关的补剂和食材。

  重要规则：
  1. 识别所有提到的补剂（维生素、矿物质、蛋白粉等）
  2. 识别所有提到的日常食材（肉类、蔬菜、水果、蛋类、豆制品等）
  3. 只要提到健康特性、营养成分、食物相冲等信息，都要提取
  4. 不要卡得太严，有一点点健康相关就提取
  5. 如果没有明确品牌，标记为 "无品牌"
  6. 提取剂量、时间、原因（如果有）
  7. 标注食物之间的冲突或协同（如果提到）

  输出纯JSON格式，不要额外文字：
  {
    "supplements": [
      {
        "name": "标准名称（如：维生素D3 或 鸡蛋 或 西兰花）",
        "brand": "品牌名（如果有）或 null",
        "dosage": "剂量（如：2000 IU 或 每天1个 或 100g）或 null",
        "timing": "时间（如：早晨空腹 或 饭后）或 null",
        "reasoning": "推荐原因",
        "isFood": true/false,
        "category": "补剂类别或食材类别（如：SINGLE_VITAMIN, FOOD_EGG, FOOD_MEAT等）"
      }
    ],
    "warnings": ["警告1（如：不要和XX一起吃）"],
    "credibilityScore": 0-100
  }

  内容：
  ${content}
  `;

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
function getMockAnalysisResult(): VideoAnalysisResult {
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
