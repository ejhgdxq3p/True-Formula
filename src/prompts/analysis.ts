import type { Language } from "@/lib/i18n";

/**
 * 视频/博主内容分析 Prompt 模板
 */
export const ANALYSIS_PROMPTS = {
  zh: `你是一位资深营养学家和药理学专家。分析以下内容，提取所有与健康相关的补剂和食材。

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
`,

  en: `You are a senior nutritionist and pharmacology expert. Analyze the following content and extract all health-related supplements and foods.

Important Rules:
1. Identify all mentioned supplements (vitamins, minerals, protein powder, etc.)
2. Identify all mentioned daily foods (meat, vegetables, fruits, eggs, soy products, etc.)
3. Extract anything related to health properties, nutritional content, or food interactions
4. Don't be too strict - extract anything even slightly health-related
5. If no brand is mentioned, mark as "No Brand"
6. Extract dosage, timing, and reasoning (if available)
7. Note any conflicts or synergies between foods (if mentioned)

Output in pure JSON format, no extra text:
{
  "supplements": [
    {
      "name": "Standard name (e.g., Vitamin D3 or Eggs or Broccoli)",
      "brand": "Brand name (if any) or null",
      "dosage": "Dosage (e.g., 2000 IU or 1 daily or 100g) or null",
      "timing": "Timing (e.g., morning empty stomach or after meals) or null",
      "reasoning": "Reason for recommendation",
      "isFood": true/false,
      "category": "Supplement or food category (e.g., SINGLE_VITAMIN, FOOD_EGG, FOOD_MEAT)"
    }
  ],
  "warnings": ["Warning 1 (e.g., Don't take with XX)"],
  "credibilityScore": 0-100
}

Content:
`,
};

/**
 * 获取分析 Prompt（根据语言）
 */
export function getAnalysisPrompt(language: Language): string {
  return ANALYSIS_PROMPTS[language];
}

/**
 * AI 点评 Prompt 模板
 */
export const COMMENTARY_PROMPTS = {
  zh: (scheduleInfo: string, conflictDetails: string, productCount: number, conflictCount: number, synergyCount: number) => `
你是一位资深的营养学专家和药理学家，以专业、犀利、不留情面的点评风格著称。请对以下补剂排程方案进行深度点评。

排程数据：
产品总数：${productCount}
冲突数量：${conflictCount}
协同效应：${synergyCount}

详细排程：
${scheduleInfo}

冲突详情：
${conflictDetails || '无冲突'}

要求：
1. **不要使用任何模板化语言**，每次点评都要全新创作
2. 用专业但犀利的语气，像和朋友聊天一样自然
3. 具体分析排程的时间安排是否合理
4. 如果有冲突，重点评价冲突处理是否得当
5. 提供1-2条实用建议（基于科学事实）
6. 风格：真诚、直接、有个性，但不要刻薄
7. 长度：100-150字

**严禁使用以下套话**：
- "不错嘛"
- "啧啧"
- "这么保守的搭配"
- "闭着眼睛都能设计"
- "钱包还好吗"

直接输出点评内容，不要前缀后缀：
`,

  en: (scheduleInfo: string, conflictDetails: string, productCount: number, conflictCount: number, synergyCount: number) => `
You are a senior nutritionist and pharmacologist, known for your sharp, honest feedback. Review the following supplement schedule.

Schedule Data:
Total Products: ${productCount}
Conflicts: ${conflictCount}
Synergies: ${synergyCount}

Schedule Details:
${scheduleInfo}

Conflict Details:
${conflictDetails || 'None'}

Requirements:
1. **No template language** - make each review fresh and unique
2. Professional but conversational tone
3. Analyze timing and conflict handling specifically
4. Provide 1-2 practical suggestions
5. Style: Genuine, direct, personable (not mean)
6. Length: 80-120 words

**Avoid these phrases**:
- "Clean stack"
- "Boring"
- "Your liver doing okay"
- "Chemistry disaster"

Output directly:
`,
};

/**
 * 获取点评 Prompt（根据语言）
 */
export function getCommentaryPrompt(
  language: Language,
  scheduleInfo: string,
  conflictDetails: string,
  productCount: number,
  conflictCount: number,
  synergyCount: number
): string {
  return COMMENTARY_PROMPTS[language](scheduleInfo, conflictDetails, productCount, conflictCount, synergyCount);
}
