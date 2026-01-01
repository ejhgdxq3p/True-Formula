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
      recommendedProducts: aiResult.supplements.map(supp => {
        // 尝试从产品库中模糊匹配
        const matchedProduct = findMatchingProduct(supp.name);

        return {
          productName: supp.name,
          dosage: supp.dosage || undefined,
          timing: supp.timing || undefined,
          reasoning: supp.reasoning,
          confidence: 0.8, // 默认置信度
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
