/**
 * DeepSeek AI Analyzer Module
 *
 * Purpose: Extract supplement information using DeepSeek model
 * Provider: SophNet
 */

import type { VideoAnalysisResult } from "@/types/supplement";

/**
 * Analyze video content using DeepSeek
 */
export async function analyzeWithDeepSeek(
  content: string,
  contentType: "transcript" | "description"
): Promise<VideoAnalysisResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const baseURL = process.env.DEEPSEEK_BASE_URL?.trim();
  const model = (process.env.DEEPSEEK_MODEL || "DeepSeek-V3.2-Fast").trim();

  if (!apiKey || !baseURL) {
    throw new Error("DEEPSEEK_API_KEY or DEEPSEEK_BASE_URL is not configured in environment variables");
  }

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
    console.log(`[DeepSeek分析] 调用API: ${baseURL}/chat/completions`);

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
      console.error(`[DeepSeek分析] API错误 ${response.status}:`, errorText);
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[DeepSeek分析] 未找到JSON，原始响应:", textContent.substring(0, 500));
      throw new Error("Failed to parse JSON from DeepSeek response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    console.log(`[DeepSeek分析] 成功解析，发现 ${parsed.supplements?.length || 0} 个补剂`);

    return {
      supplements: parsed.supplements || [],
      warnings: parsed.warnings || [],
      credibilityScore: parsed.credibilityScore || 50
    };

  } catch (error) {
    console.error("[DeepSeek分析] 错误:", error);
    if (error instanceof Error) {
      console.error("[DeepSeek分析] 错误详情:", error.message);
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
      "description"
    );
    console.log("DeepSeek connection test successful:", result);
    return true;
  } catch (error) {
    console.error("DeepSeek connection test failed:", error);
    return false;
  }
}
