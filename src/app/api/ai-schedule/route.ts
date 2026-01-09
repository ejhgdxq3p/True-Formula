import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { Product } from "@/types/product";

/**
 * API Route: AI智能排程（让AI真正思考时间分配和冲突规避）
 * POST /api/ai-schedule
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products, conflicts, language } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Products array is required" },
        { status: 400 }
      );
    }

    console.log(`[AI排程] 处理 ${products.length} 个产品，${conflicts?.length || 0} 个冲突`);

    const schedule = await generateAISchedule(products, conflicts || [], language || 'zh');

    return NextResponse.json({
      success: true,
      data: {
        schedule,
        synergies: [] // TODO: 未来可以让AI也分析协同效应
      }
    });

  } catch (error) {
    console.error("[AI排程] 错误:", error);
    return NextResponse.json(
      {
        error: "AI排程失败: " + (error instanceof Error ? error.message : String(error)),
        fallback: true
      },
      { status: 500 }
    );
  }
}

/**
 * 使用AI生成智能排程（支持DeepSeek和Claude）
 */
async function generateAISchedule(
  products: Product[],
  conflicts: any[],
  language: 'zh' | 'en'
): Promise<any[]> {
  const provider = (process.env.AI_PROVIDER || 'claude').toLowerCase().trim();

  if (provider === 'deepseek') {
    return generateAIScheduleWithDeepSeek(products, conflicts, language);
  } else {
    return generateAIScheduleWithClaude(products, conflicts, language);
  }
}

async function generateAIScheduleWithDeepSeek(
  products: Product[],
  conflicts: any[],
  language: 'zh' | 'en'
): Promise<any[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const baseURL = process.env.DEEPSEEK_BASE_URL?.trim();
  const model = (process.env.DEEPSEEK_MODEL || 'DeepSeek-V3.2-Fast').trim();

  if (!apiKey || !baseURL) {
    console.error("DeepSeek配置缺失");
    throw new Error("DeepSeek API未配置");
  }

  // 构建产品信息
  const productsInfo = products.map((p, idx) => ({
    index: idx,
    name: p.name,
    brand: p.brand,
    category: p.category,
    ingredients: p.ingredients.map(ing => ({
      name: ing.nutrient.name,
      amount: ing.amount,
      unit: ing.unit
    })),
    recommendedTiming: p.optimalTiming,
    dosage: p.dosagePerServing
  }));

  // 构建冲突信息
  const conflictsInfo = conflicts.map(c => ({
    product1: c.productAName || c.product1,
    product2: c.productBName || c.product2,
    severity: c.severity,
    explanation: c.explanation,
    timeGapRequired: c.timeGapRequired
  }));

  const prompt = language === 'zh' ? `
你是一位资深药理学家和营养学专家。请为以下产品列表生成一份24小时智能排程。

产品列表：
${JSON.stringify(productsInfo, null, 2)}

已检测到的冲突：
${JSON.stringify(conflictsInfo, null, 2)}

任务要求：
1. 仔细分析每个产品的营养成分和推荐时间
2. **重点关注冲突**：有冲突的产品必须间隔足够时间（根据timeGapRequired）
3. 合理分配到24小时内的不同时间点（如：07:00, 08:00, 12:00, 17:00, 19:00, 22:00等）
4. 考虑实际生活场景：早餐、午餐、晚餐、睡前
5. 空腹吸收的放早晨，脂溶性维生素放饭后，助眠的放睡前
6. 为每个时间槽提供清晰的理由说明

输出纯JSON格式，不要额外文字：
{
  "schedule": [
    {
      "time": "07:00",
      "products": [
        {
          "index": 0,
          "name": "产品名称"
        }
      ],
      "reasoning": "为什么选择这个时间（必须说明是否考虑了冲突）"
    }
  ]
}

**关键规则**：
- 如果两个产品有冲突且需要间隔4小时，它们之间必须至少相隔4小时
- 如果两个产品有冲突且需要间隔2小时，它们之间必须至少相隔2小时
- 优先考虑冲突规避，其次才是推荐时间
- 每个时间槽最多3个产品
` : `
You are a senior pharmacologist and nutritionist. Generate a 24-hour smart schedule for the following products.

Products:
${JSON.stringify(productsInfo, null, 2)}

Detected Conflicts:
${JSON.stringify(conflictsInfo, null, 2)}

Requirements:
1. Analyze each product's nutrients and recommended timing
2. **Focus on conflicts**: Products with conflicts must be separated by sufficient time
3. Distribute across 24 hours (e.g., 07:00, 08:00, 12:00, 17:00, 19:00, 22:00)
4. Consider real-life scenarios: breakfast, lunch, dinner, bedtime
5. Provide clear reasoning for each time slot

Output pure JSON, no extra text:
{
  "schedule": [
    {
      "time": "07:00",
      "products": [{ "index": 0, "name": "Product Name" }],
      "reasoning": "Why this time (must explain conflict considerations)"
    }
  ]
}

**Key Rules**:
- If conflict requires 4h gap, products must be ≥4h apart
- If conflict requires 2h gap, products must be ≥2h apart
- Prioritize conflict avoidance over recommended timing
`;

  try {
    console.log(`[AI排程] 使用DeepSeek API调用 ${baseURL}...`);

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
        max_tokens: 3000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[AI排程] DeepSeek API错误 ${response.status}:`, errorText);
      throw new Error(`DeepSeek API错误: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[AI排程] DeepSeek响应成功`);

    const textContent = data.choices?.[0]?.message?.content || "";
    console.log(`[AI排程] 响应内容长度: ${textContent.length}字符`);

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[AI排程] 未找到JSON，原始响应:", textContent.substring(0, 200));
      throw new Error("AI未返回有效JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.schedule || !Array.isArray(parsed.schedule)) {
      console.error("[AI排程] JSON格式错误:", parsed);
      throw new Error("AI返回的JSON格式错误");
    }

    console.log(`[AI排程] 成功生成 ${parsed.schedule.length} 个时间槽`);

    const validSchedule = parsed.schedule.map((slot: any) => ({
      time: slot.time,
      supplements: slot.products
        .map((p: any) => {
          const product = products[p.index];
          if (!product) {
            console.warn(`[AI排程] 产品索引越界: ${p.index}, 总产品数: ${products.length}`);
            return null;
          }
          return {
            id: product.id,
            name: product.name,
            dosage: product.dosagePerServing
          };
        })
        .filter((s: any): s is NonNullable<typeof s> => s !== null),
      reasoning: slot.reasoning
    })).filter((slot: any) => slot.supplements.length > 0);

    return validSchedule;

  } catch (error) {
    console.error("[AI排程] DeepSeek调用失败:", error);
    if (error instanceof Error) {
      console.error("[AI排程] 错误详情:", error.message);
    }
    throw error;
  }
}

async function generateAIScheduleWithClaude(
  products: Product[],
  conflicts: any[],
  language: 'zh' | 'en'
): Promise<any[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_claude_api_key_here') {
    console.warn("ANTHROPIC_API_KEY未配置");
    throw new Error("Claude API Key未配置");
  }

  const anthropic = new Anthropic({ apiKey });

  // 构建产品信息
  const productsInfo = products.map((p, idx) => ({
    index: idx,
    name: p.name,
    brand: p.brand,
    category: p.category,
    ingredients: p.ingredients.map(ing => ({
      name: ing.nutrient.name,
      amount: ing.amount,
      unit: ing.unit
    })),
    recommendedTiming: p.optimalTiming,
    dosage: p.dosagePerServing
  }));

  // 构建冲突信息
  const conflictsInfo = conflicts.map(c => ({
    product1: c.productAName || c.product1,
    product2: c.productBName || c.product2,
    severity: c.severity,
    explanation: c.explanation,
    timeGapRequired: c.timeGapRequired
  }));

  const prompt = language === 'zh' ? `
你是一位资深药理学家和营养学专家。请为以下产品列表生成一份24小时智能排程。

产品列表：
${JSON.stringify(productsInfo, null, 2)}

已检测到的冲突：
${JSON.stringify(conflictsInfo, null, 2)}

任务要求：
1. 仔细分析每个产品的营养成分和推荐时间
2. **重点关注冲突**：有冲突的产品必须间隔足够时间（根据timeGapRequired）
3. 合理分配到24小时内的不同时间点（如：07:00, 08:00, 12:00, 17:00, 19:00, 22:00等）
4. 考虑实际生活场景：早餐、午餐、晚餐、睡前
5. 空腹吸收的放早晨，脂溶性维生素放饭后，助眠的放睡前
6. 为每个时间槽提供清晰的理由说明

输出纯JSON格式，不要额外文字：
{
  "schedule": [
    {
      "time": "07:00",
      "products": [
        {
          "index": 0,
          "name": "产品名称"
        }
      ],
      "reasoning": "为什么选择这个时间（必须说明是否考虑了冲突）"
    }
  ]
}

**关键规则**：
- 如果两个产品有冲突且需要间隔4小时，它们之间必须至少相隔4小时
- 如果两个产品有冲突且需要间隔2小时，它们之间必须至少相隔2小时
- 优先考虑冲突规避，其次才是推荐时间
- 每个时间槽最多3个产品
` : `
You are a senior pharmacologist and nutritionist. Generate a 24-hour smart schedule for the following products.

Products:
${JSON.stringify(productsInfo, null, 2)}

Detected Conflicts:
${JSON.stringify(conflictsInfo, null, 2)}

Requirements:
1. Analyze each product's nutrients and recommended timing
2. **Focus on conflicts**: Products with conflicts must be separated by sufficient time
3. Distribute across 24 hours (e.g., 07:00, 08:00, 12:00, 17:00, 19:00, 22:00)
4. Consider real-life scenarios: breakfast, lunch, dinner, bedtime
5. Provide clear reasoning for each time slot

Output pure JSON, no extra text:
{
  "schedule": [
    {
      "time": "07:00",
      "products": [{ "index": 0, "name": "Product Name" }],
      "reasoning": "Why this time (must explain conflict considerations)"
    }
  ]
}

**Key Rules**:
- If conflict requires 4h gap, products must be ≥4h apart
- If conflict requires 2h gap, products must be ≥2h apart
- Prioritize conflict avoidance over recommended timing
`;

  try {
    console.log(`[AI排程] 开始调用Claude API...`);
    console.log(`[AI排程] 产品数: ${products.length}, 冲突数: ${conflicts.length}`);

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      temperature: 0.7,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    console.log(`[AI排程] Claude API 响应成功`);
    const textContent = response.content[0].type === 'text' ? response.content[0].text : "";
    console.log(`[AI排程] 响应内容长度: ${textContent.length}字符`);

    // 提取JSON
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[AI排程] 未找到JSON，原始响应:", textContent.substring(0, 200));
      throw new Error("AI未返回有效JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.schedule || !Array.isArray(parsed.schedule)) {
      console.error("[AI排程] JSON格式错误:", parsed);
      throw new Error("AI返回的JSON格式错误");
    }

    console.log(`[AI排程] 成功生成 ${parsed.schedule.length} 个时间槽`);

    // 验证并映射产品
    const validSchedule = parsed.schedule.map((slot: any) => ({
      time: slot.time,
      supplements: slot.products
        .map((p: any) => {
          const product = products[p.index];
          if (!product) {
            console.warn(`[AI排程] 产品索引越界: ${p.index}, 总产品数: ${products.length}`);
            return null;
          }
          return {
            id: product.id,
            name: product.name,
            dosage: product.dosagePerServing
          };
        })
        .filter((s: any): s is NonNullable<typeof s> => s !== null),
      reasoning: slot.reasoning
    })).filter((slot: any) => slot.supplements.length > 0);

    console.log(`[AI排程] 验证并映射完成`);
    return validSchedule;

  } catch (error) {
    console.error("[AI排程] 调用失败，完整错误:", error);
    if (error instanceof Error) {
      console.error("[AI排程] 错误消息:", error.message);
      console.error("[AI排程] 错误堆栈:", error.stack);
    }
    throw error;
  }
}
