import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

/**
 * API Route: AI毒舌点评排程方案
 * POST /api/ai-commentary
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sundial, language } = body;

    if (!sundial || !sundial.timeSlots) {
      return NextResponse.json(
        { error: "Sundial data is required" },
        { status: 400 }
      );
    }

    const commentary = await generateAICommentary(sundial, language || 'zh');

    return NextResponse.json({
      success: true,
      data: { commentary }
    });

  } catch (error) {
    console.error("[AI点评] API错误:", error);
    return NextResponse.json(
      {
        error: "AI点评失败: " + (error instanceof Error ? error.message : String(error))
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
  language: 'zh' | 'en'
): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'claude';

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
  language: 'zh' | 'en'
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL;
  const model = process.env.DEEPSEEK_MODEL || 'DeepSeek-V3.2-Fast';

  if (!apiKey || !baseURL) {
    console.warn("DeepSeek配置缺失，使用降级点评");
    return getFallbackCommentary(sundial, language);
  }

  // 构建分析数据
  const productCount = sundial.timeSlots.reduce((sum, slot) => sum + slot.products.length, 0);
  const conflictCount = sundial.conflicts.length;
  const synergyCount = sundial.synergies?.length || 0;

  // 提取产品和时间信息
  const scheduleInfo = sundial.timeSlots.map(slot => ({
    time: slot.time,
    products: slot.products.map((p: any) => p.product?.name || 'Unknown'),
    reasoning: slot.reasoning
  }));

  const conflictDetails = sundial.conflicts.map(c => ({
    product1: c.productAName || c.product1,
    product2: c.productBName || c.product2,
    severity: c.severity,
    explanation: c.explanation,
    timeGapRequired: c.timeGapRequired
  }));

  const prompt = language === 'zh' ? `
你是一位资深的营养学专家和药理学家，以专业、犀利、不留情面的点评风格著称。请对以下补剂排程方案进行深度点评。

排程数据：
产品总数：${productCount}
冲突数量：${conflictCount}
协同效应：${synergyCount}

详细排程：
${scheduleInfo.map((slot, i) => `${i + 1}. ${slot.time} - ${slot.products.join('、')} (${slot.reasoning})`).join('\n')}

冲突详情：
${conflictDetails.length > 0 ? conflictDetails.map((c, i) => `${i + 1}. ${c.product1} vs ${c.product2} - ${c.severity} - ${c.explanation}`).join('\n') : '无冲突'}

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
` : `
You are a senior nutritionist and pharmacologist, known for your sharp, honest feedback. Review the following supplement schedule.

Schedule:
${scheduleInfo.map((slot, i) => `${i + 1}. ${slot.time} - ${slot.products.join(', ')} (${slot.reasoning})`).join('\n')}

Conflicts:
${conflictDetails.length > 0 ? conflictDetails.map((c, i) => `${i + 1}. ${c.product1} vs ${c.product2} - ${c.severity}`).join('\n') : 'None'}

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
`;

  try {
    console.log(`[AI点评] 使用DeepSeek调用 ${baseURL}...`);

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
      console.error(`[AI点评] DeepSeek API错误 ${response.status}:`, errorText);
      throw new Error(`DeepSeek API错误: ${response.status}`);
    }

    const data = await response.json();
    console.log('[AI点评] DeepSeek响应成功');

    const commentary = data.choices?.[0]?.message?.content || "";

    if (!commentary) {
      throw new Error("AI返回空内容");
    }

    console.log(`[AI点评] DeepSeek成功生成，字数：${commentary.length}`);
    return commentary.trim();

  } catch (error) {
    console.error("[AI点评] DeepSeek调用失败:", error);
    if (error instanceof Error) {
      console.error("[AI点评] 错误详情:", error.message);
    }
    return getFallbackCommentary(sundial, language);
  }
}

async function generateCommentaryWithClaude(
  sundial: {
    timeSlots: any[];
    conflicts: any[];
    synergies: any[];
  },
  language: 'zh' | 'en'
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_claude_api_key_here') {
    console.warn("ANTHROPIC_API_KEY未配置，使用降级点评");
    return getFallbackCommentary(sundial, language);
  }

  const anthropic = new Anthropic({ apiKey });

  // 构建分析数据
  const productCount = sundial.timeSlots.reduce((sum, slot) => sum + slot.products.length, 0);
  const conflictCount = sundial.conflicts.length;
  const synergyCount = sundial.synergies?.length || 0;

  // 提取产品和时间信息
  const scheduleInfo = sundial.timeSlots.map(slot => ({
    time: slot.time,
    products: slot.products.map((p: any) => p.product?.name || 'Unknown'),
    reasoning: slot.reasoning
  }));

  const conflictDetails = sundial.conflicts.map(c => ({
    product1: c.productAName || c.product1,
    product2: c.productBName || c.product2,
    severity: c.severity,
    explanation: c.explanation,
    timeGapRequired: c.timeGapRequired
  }));

  const prompt = language === 'zh' ? `
你是一位资深的营养学专家和药理学家，以专业、犀利、不留情面的点评风格著称。请对以下补剂排程方案进行深度点评。

排程数据：
产品总数：${productCount}
冲突数量：${conflictCount}
协同效应：${synergyCount}

详细排程：
${scheduleInfo.map((slot, i) => `${i + 1}. ${slot.time} - ${slot.products.join('、')} (${slot.reasoning})`).join('\n')}

冲突详情：
${conflictDetails.length > 0 ? conflictDetails.map((c, i) => `${i + 1}. ${c.product1} vs ${c.product2} - ${c.severity} - ${c.explanation}`).join('\n') : '无冲突'}

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
` : `
You are a senior nutritionist and pharmacologist, known for your sharp, honest feedback. Review the following supplement schedule.

Schedule:
${scheduleInfo.map((slot, i) => `${i + 1}. ${slot.time} - ${slot.products.join(', ')} (${slot.reasoning})`).join('\n')}

Conflicts:
${conflictDetails.length > 0 ? conflictDetails.map((c, i) => `${i + 1}. ${c.product1} vs ${c.product2} - ${c.severity}`).join('\n') : 'None'}

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
`;

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
      throw new Error("AI返回空内容");
    }

    console.log(`[AI点评] 生成成功，字数：${commentary.length}`);
    return commentary.trim();

  } catch (error) {
    console.error("[AI点评] 调用失败:", error);
    return getFallbackCommentary(sundial, language);
  }
}

/**
 * 降级点评（当AI不可用时）
 */
function getFallbackCommentary(
  sundial: { timeSlots: any[]; conflicts: any[]; synergies: any[] },
  language: 'zh' | 'en'
): string {
  const conflicts = sundial.conflicts.length;
  const productCount = sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0);

  if (language === 'zh') {
    if (conflicts === 0 && productCount <= 5) {
      return "不错嘛，简洁高效的配方。但说实话，这么保守的搭配我闭着眼睛都能设计出来。产品选择合理，时间分配也算靠谱，继续保持吧。";
    } else if (conflicts === 0 && productCount > 5) {
      return "啧啧，居然真的0冲突？看来你在这上面下了功夫。不过产品有点多，钱包还好吗？建议精简一下，很多功能是重复的。";
    } else if (conflicts > 0 && conflicts <= 2) {
      return `有${conflicts}个冲突但还能抢救。建议：别瞎吃，听AI的把时间调开。现在这样吃纯属浪费，冲突的产品会互相抵消吸收率。调整一下时间间隔，至少隔开4小时。`;
    } else {
      return `${conflicts}个冲突？你这是补剂还是化学实验？建议从头来过，让AI帮你重新规划。很多产品放在一起完全是浪费钱，有些甚至可能有副作用。赶紧调整吧。`;
    }
  } else {
    if (conflicts === 0 && productCount <= 5) {
      return "Clean stack. Simple. Boring. But hey, at least you won't poison yourself. Decent product selection and timing, keep it up.";
    } else if (conflicts === 0 && productCount > 5) {
      return "Zero conflicts? Impressive. But that's a lot of pills. Your liver doing okay? Consider cutting down—many of these overlap in function.";
    } else if (conflicts > 0 && conflicts <= 2) {
      return `${conflicts} conflicts detected. Not terrible, but needs work. Let AI fix your timing. Some products are blocking each other's absorption. Space them out by at least 4 hours.`;
    } else {
      return `${conflicts} conflicts. Is this a supplement stack or a chemistry disaster? Start over and let AI rebuild it properly. You're literally wasting money and possibly risking side effects.`;
    }
  }
}
