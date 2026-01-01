import { NextRequest, NextResponse } from "next/server";
import { analyzeVideoContent } from "@/lib/ai-analyzer";
import type { InfluencerAnalysis, Product } from "@/types/product";
import { PRODUCTS_DATABASE } from "@/data/products";

/**
 * API Route: 分析博主推荐内容（文字或视频链接）
 * POST /api/analyze-influencer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, mode } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    // 调用AI分析（DeepSeek或Claude）
    console.log(`[AI分析] 使用AI provider分析内容...`);
    const aiResult = await analyzeVideoContent(text, "description");

    console.log(`[AI分析] 分析完成，发现 ${aiResult.supplements.length} 个补剂`);
    console.log(`[AI分析] 可信度评分: ${aiResult.credibilityScore}/100`);

    // 将AI结果转换为InfluencerAnalysis格式
    const analysis: InfluencerAnalysis = {
      id: `analysis-${Date.now()}`,
      sourceText: text,
      analyzedAt: new Date(),
      recommendedProducts: aiResult.supplements.map((supp: any) => {
        // 尝试从产品库中模糊匹配
        let matchedProduct = findMatchingProduct(supp.name);

        // 如果没有匹配到，且AI标记为食材或无品牌，创建临时产品
        if (!matchedProduct && (supp.isFood || !supp.brand || supp.brand === "无品牌")) {
          matchedProduct = createFoodProduct(supp);
          console.log(`[创建临时食材] ${supp.name} -> ${matchedProduct.name}`);
        }

        return {
          productName: supp.name,
          brand: supp.brand || undefined,
          dosage: supp.dosage || undefined,
          timing: supp.timing || undefined,
          reasoning: supp.reasoning,
          confidence: 0.8,
          matchedProduct: matchedProduct || undefined,
        };
      }),
      credibilityScore: aiResult.credibilityScore,
      warnings: aiResult.warnings,
    };

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error("[AI分析] API错误:", error);
    return NextResponse.json(
      {
        error: "AI分析失败: " + (error instanceof Error ? error.message : String(error))
      },
      { status: 500 }
    );
  }
}

/**
 * 创建临时食材产品（如果数据库中没有）
 */
function createFoodProduct(aiResult: any): Product {
  const category = determineFoodCategory(aiResult.name, aiResult.category);
  const ingredients = inferNutrients(aiResult.name, category);

  return {
    id: `temp-food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: aiResult.name,
    brand: aiResult.brand || "日常食材",
    category: category,
    ingredients: ingredients,
    dosagePerServing: aiResult.dosage || "适量",
    servingsPerDay: 1,
    optimalTiming: determineTimingFromAI(aiResult.timing),
  };
}

/**
 * 根据食材名称推断营养成分（用于冲突检测）
 */
function inferNutrients(name: string, category: any): any[] {
  const normalized = name.toLowerCase();
  const nutrients: any[] = [];

  // 维生素C相关
  if (/(维生素c|维c|vc|vit.*c|ascorbic|卡姆果|针叶樱桃|橙|柠檬|猕猴桃)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "vit-c", name: "维生素C", commonName: "VC", category: "VITAMIN_WATER_SOLUBLE", aliases: [] },
      amount: 100,
      unit: "mg",
      percentDV: 100
    });
  }

  // 铁
  if (/(铁|iron|补铁|菠菜|肝|血)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "iron", name: "铁", commonName: "铁", category: "TRACE_MINERAL", aliases: [] },
      amount: 10,
      unit: "mg",
      percentDV: 50
    });
  }

  // 钙
  if (/(钙|calcium|补钙|奶|豆腐)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "calcium", name: "钙", commonName: "钙", category: "MACRO_MINERAL", aliases: [] },
      amount: 300,
      unit: "mg",
      percentDV: 30
    });
  }

  // 镁
  if (/(镁|magnesium|坚果)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "magnesium", name: "镁", commonName: "镁", category: "MACRO_MINERAL", aliases: [] },
      amount: 100,
      unit: "mg",
      percentDV: 25
    });
  }

  // 锌
  if (/(锌|zinc|海鲜|牡蛎)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "zinc", name: "锌", commonName: "锌", category: "TRACE_MINERAL", aliases: [] },
      amount: 10,
      unit: "mg",
      percentDV: 67
    });
  }

  // 铜
  if (/(铜|copper)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "copper", name: "铜", commonName: "铜", category: "TRACE_MINERAL", aliases: [] },
      amount: 1,
      unit: "mg",
      percentDV: 50
    });
  }

  // 鱼油 (EPA/DHA)
  if (/(鱼油|fish.*oil|omega|epa|dha|深海)/i.test(normalized)) {
    nutrients.push(
      {
        nutrient: { id: "epa", name: "EPA", commonName: "EPA", category: "OMEGA_3", aliases: [] },
        amount: 180,
        unit: "mg",
        percentDV: 0
      },
      {
        nutrient: { id: "dha", name: "DHA", commonName: "DHA", category: "OMEGA_3", aliases: [] },
        amount: 120,
        unit: "mg",
        percentDV: 0
      }
    );
  }

  // 维生素E
  if (/(维生素e|维e|ve|vit.*e|tocopherol)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "vit-e", name: "维生素E", commonName: "VE", category: "VITAMIN_FAT_SOLUBLE", aliases: [] },
      amount: 15,
      unit: "mg",
      percentDV: 100
    });
  }

  // 维生素D
  if (/(维生素d|维d|vd|vit.*d|cholecalciferol)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "vit-d", name: "维生素D", commonName: "VD", category: "VITAMIN_FAT_SOLUBLE", aliases: [] },
      amount: 1000,
      unit: "IU",
      percentDV: 250
    });
  }

  // 茶多酚/单宁酸（茶类）
  if (/(茶|tea|绿茶|红茶|乌龙)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "tannin", name: "茶多酚", commonName: "单宁酸", category: "ANTIOXIDANT", aliases: [] },
      amount: 100,
      unit: "mg",
      percentDV: 0
    });
  }

  // 咖啡因
  if (/(咖啡|coffee|caffeine)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "caffeine", name: "咖啡因", commonName: "咖啡因", category: "ANTIOXIDANT", aliases: [] },
      amount: 80,
      unit: "mg",
      percentDV: 0
    });
  }

  // 蛋白质（蛋类、肉类、蛋白粉）
  if (/(蛋白|protein|肉|鸡|鱼|蛋|乳清)/i.test(normalized)) {
    nutrients.push({
      nutrient: { id: "protein", name: "蛋白质", commonName: "蛋白质", category: "ESSENTIAL_AMINO", aliases: [] },
      amount: 20,
      unit: "g",
      percentDV: 40
    });
  }

  return nutrients;
}

/**
 * 根据食材名称判断类别
 */
function determineFoodCategory(name: string, aiCategory?: string): any {
  const normalized = name.toLowerCase();

  // 如果AI已经提供了类别，优先使用
  if (aiCategory) {
    const categoryMap: Record<string, any> = {
      "FOOD_MEAT": "FOOD_MEAT",
      "FOOD_EGG": "FOOD_EGG",
      "FOOD_VEGETABLE": "FOOD_VEGETABLE",
      "FOOD_ORGAN": "FOOD_ORGAN",
      "BEVERAGE_TEA": "BEVERAGE_TEA",
      "BEVERAGE_SOY": "BEVERAGE_SOY",
      "BEVERAGE_JUICE": "BEVERAGE_JUICE",
    };
    if (categoryMap[aiCategory]) return categoryMap[aiCategory];
  }

  // 肉类
  if (/(肉|鸡|鸭|鱼|猪|牛|羊|虾|蟹|贝|海鲜|chicken|beef|pork|fish|seafood)/i.test(normalized)) {
    return "FOOD_MEAT";
  }

  // 蛋类
  if (/(蛋|egg)/i.test(normalized)) {
    return "FOOD_EGG";
  }

  // 内脏
  if (/(肝|心|肾|腰|脑|肚|肠|liver|kidney|heart)/i.test(normalized)) {
    return "FOOD_ORGAN";
  }

  // 蔬菜
  if (/(菜|芹|菠|西兰花|花椰|番茄|黄瓜|胡萝卜|土豆|vegetable|broccoli|spinach|carrot)/i.test(normalized)) {
    return "FOOD_VEGETABLE";
  }

  // 豆制品
  if (/(豆|豆浆|豆腐|豆奶|soy|tofu)/i.test(normalized)) {
    return "BEVERAGE_SOY";
  }

  // 茶类
  if (/(茶|tea)/i.test(normalized)) {
    return "BEVERAGE_TEA";
  }

  // 果汁
  if (/(汁|juice|橙汁|苹果汁)/i.test(normalized)) {
    return "BEVERAGE_JUICE";
  }

  // 默认为其他饮品
  return "BEVERAGE_OTHER";
}

/**
 * 从AI的时间描述转换为TimingPreference
 */
function determineTimingFromAI(timing?: string): any {
  if (!timing) return "ANYTIME";

  const normalized = timing.toLowerCase();

  if (/(早|晨|morning|breakfast)/i.test(normalized)) {
    if (/(空腹|empty)/i.test(normalized)) return "MORNING_EMPTY_STOMACH";
    return "MORNING_WITH_FOOD";
  }

  if (/(睡前|床前|before bed|night)/i.test(normalized)) {
    return "BEFORE_BED";
  }

  if (/(晚|evening|dinner)/i.test(normalized)) {
    return "EVENING";
  }

  if (/(午|下午|afternoon|lunch)/i.test(normalized)) {
    return "AFTERNOON";
  }

  if (/(运动后|锻炼后|post.*workout)/i.test(normalized)) {
    return "POST_WORKOUT";
  }

  if (/(运动前|锻炼前|pre.*workout)/i.test(normalized)) {
    return "PRE_WORKOUT";
  }

  return "ANYTIME";
}

/**
 * 从产品库中模糊匹配产品
 */
function findMatchingProduct(supplementName: string): Product | null {
  const normalized = supplementName.toLowerCase().trim();

  // 关键词映射
  const keywordMap: Record<string, string> = {
    "维生素d": "vd3",
    "维生素c": "vc",
    "维生素e": "ve",
    "维生素a": "va",
    "维生素b": "vb",
    "omega-3": "omega",
    "鱼油": "omega",
    "dha": "omega",
    "蛋白粉": "protein",
    "乳清蛋白": "protein",
    "益生菌": "probiotic",
    "辅酶q10": "coq10",
    "coq10": "coq10",
  };

  // 查找匹配的产品
  for (const [keyword, productKey] of Object.entries(keywordMap)) {
    if (normalized.includes(keyword)) {
      const product = PRODUCTS_DATABASE.find(p =>
        p.id.toLowerCase().includes(productKey) ||
        p.name.toLowerCase().includes(keyword)
      );
      if (product) {
        console.log(`[产品匹配] ${supplementName} -> ${product.name}`);
        return product;
      }
    }
  }

  // 直接名称匹配
  const directMatch = PRODUCTS_DATABASE.find(p =>
    p.name.toLowerCase().includes(normalized) ||
    normalized.includes(p.name.toLowerCase())
  );

  if (directMatch) {
    console.log(`[产品匹配] ${supplementName} -> ${directMatch.name}`);
  } else {
    console.log(`[产品匹配] ${supplementName} -> 未找到匹配产品`);
  }

  return directMatch || null;
}
