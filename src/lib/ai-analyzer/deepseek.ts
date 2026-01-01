/**
 * DeepSeek AI Analyzer Module
 *
 * Purpose: Extract supplement information using DeepSeek R1 model
 * Provider: SophNet (OpenAI-compatible API)
 */

import OpenAI from "openai";
import type { VideoAnalysisResult } from "@/types/supplement";

/**
 * Analyze video content using DeepSeek R1
 */
export async function analyzeWithDeepSeek(
  content: string,
  contentType: "transcript" | "description"
): Promise<VideoAnalysisResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL;
  const model = process.env.DEEPSEEK_MODEL || "DeepSeek-R1";

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured in environment variables");
  }

  // Initialize OpenAI client with DeepSeek configuration
  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });

  const systemPrompt = `你是一位专业的营养学家和药理学专家。你的任务是分析视频内容中的补剂信息，去除营销噱头，提取真实可靠的科学建议。`;

  const userPrompt = `
分析以下视频${contentType === "transcript" ? "文稿" : "描述"}，提取补剂推荐信息：

**任务要求：**
1. 识别所有提到的补剂（使用标准化名称，如 "维生素D3"）
2. 提取推荐剂量和服用时间（如果提到）
3. 识别内容中给出的理由
4. 检测任何警告、副作用或危险组合
5. 评估内容可信度（0-100分）：
   - 是否引用科学文献？（+20分）
   - 是否正确解释生物学机制？（+20分）
   - 是否存在夸大的营销宣传？（-30分）
   - 剂量建议是否安全？（+20分）
   - 是否提到潜在风险？（+20分）

**输出格式（必须是纯JSON，不要有其他文字）：**
{
  "supplements": [
    {
      "name": "标准化名称（如：维生素D3）",
      "dosage": "剂量（如：2000 IU，如果未提到则为null）",
      "timing": "服用时间（如：早上随脂肪摄入，如果未提到则为null）",
      "reasoning": "推荐理由的简要说明"
    }
  ],
  "warnings": ["警告1", "警告2"],
  "credibilityScore": 75
}

**待分析内容：**
${content}
`;

  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 4096,
    });

    const textContent = response.choices[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("DeepSeek response:", textContent);
      throw new Error("Failed to parse JSON from DeepSeek response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      supplements: parsed.supplements || [],
      warnings: parsed.warnings || [],
      credibilityScore: parsed.credibilityScore || 50
    };

  } catch (error) {
    console.error("Error analyzing with DeepSeek:", error);
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
      "description"
    );
    console.log("DeepSeek connection test successful:", result);
    return true;
  } catch (error) {
    console.error("DeepSeek connection test failed:", error);
    return false;
  }
}
