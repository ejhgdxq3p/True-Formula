import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS_DATABASE } from "@/data/products";
import { detectProductConflicts } from "@/lib/product-conflict-detector";
import type { Product } from "@/types/product";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supplementIds, products: clientProducts, constraints } = body;

    // 支持两种模式：
    // 1. 传递 products 数组（包含完整产品对象）- 推荐用于临时产品
    // 2. 传递 supplementIds 数组（仅ID，从数据库查询）- 用于已有产品
    let products: Product[] = [];

    if (clientProducts && Array.isArray(clientProducts) && clientProducts.length > 0) {
      // 模式1：使用客户端传递的完整产品对象
      products = clientProducts;
      console.log(`[排程API] 使用客户端产品数据，共 ${products.length} 个`);
    } else if (supplementIds && Array.isArray(supplementIds) && supplementIds.length > 0) {
      // 模式2：从数据库查询
      products = supplementIds
        .map(id => PRODUCTS_DATABASE.find(p => p.id === id))
        .filter((p): p is Product => p !== null);
      console.log(`[排程API] 从数据库查询到 ${products.length} 个产品`);
    }

    if (products.length === 0) {
      return NextResponse.json(
        { error: "No valid products provided" },
        { status: 400 }
      );
    }

    // 2. 检测冲突（使用产品冲突检测器）
    const myListProducts = products.map(p => ({
      productId: p.id,
      product: p,
      addedAt: new Date()
    }));

    const conflicts = detectProductConflicts(myListProducts);
    console.log(`[排程API] 检测到 ${conflicts.length} 个冲突`);

    // 3. 生成智能排程
    const schedule = generateOptimalSchedule(products, conflicts, constraints);

    return NextResponse.json({
      success: true,
      data: {
        schedule,
        conflicts,
        synergies: [], // 暂时为空，后续可以添加协同逻辑
      }
    });

  } catch (error) {
    console.error("[排程API] 错误:", error);
    return NextResponse.json(
      { error: "排程生成失败: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

/**
 * 生成智能排程（基于产品推荐时间和冲突规避）
 */
function generateOptimalSchedule(
  products: Product[],
  conflicts: any[],
  constraints: any
) {
  const timeSlots: any[] = [];
  const conflictPairs = new Set(
    conflicts.map(c => `${c.product1}-${c.product2}`)
  );

  // 按推荐时间分组
  products.forEach(product => {
    let targetTime = getOptimalTime(product.optimalTiming, constraints);

    // 检查是否与该时间槽的其他产品冲突
    let slot = timeSlots.find(s => s.time === targetTime);

    if (slot) {
      // 检查冲突
      const hasConflict = slot.supplements.some((existing: any) => {
        const pair1 = `${existing.id}-${product.id}`;
        const pair2 = `${product.id}-${existing.id}`;
        return conflictPairs.has(pair1) || conflictPairs.has(pair2);
      });

      // 如果有冲突，尝试找其他时间槽
      if (hasConflict) {
        targetTime = findAlternativeTime(targetTime, timeSlots, product.id, conflictPairs);
        slot = timeSlots.find(s => s.time === targetTime);
      }
    }

    if (!slot) {
      slot = {
        time: targetTime,
        supplements: [],
        reasoning: getReasoningForTime(product.optimalTiming)
      };
      timeSlots.push(slot);
    }

    slot.supplements.push({
      id: product.id,
      name: product.name,
      dosage: product.dosagePerServing
    });
  });

  // 按时间排序
  return timeSlots.sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * 根据TimingPreference获取最佳时间
 */
function getOptimalTime(timing: any, constraints: any): string {
  const mealTimes = constraints?.mealTimes || {
    breakfast: "08:00",
    lunch: "12:00",
    dinner: "19:00"
  };

  switch (timing) {
    case "MORNING_EMPTY_STOMACH":
      return "07:00";
    case "MORNING_WITH_FOOD":
    case "MORNING":
      return mealTimes.breakfast;
    case "AFTERNOON":
      return mealTimes.lunch;
    case "EVENING":
      return mealTimes.dinner;
    case "BEFORE_BED":
      return "22:00";
    case "POST_WORKOUT":
      return "18:00";
    case "PRE_WORKOUT":
      return "17:00";
    default:
      return mealTimes.breakfast;
  }
}

/**
 * 查找替代时间（避免冲突）
 */
function findAlternativeTime(
  originalTime: string,
  existingSlots: any[],
  productId: string,
  conflictPairs: Set<string>
): string {
  const alternatives = [
    "07:00", "08:00", "10:00", "12:00", "14:00", "17:00", "19:00", "22:00"
  ];

  for (const time of alternatives) {
    if (time === originalTime) continue;

    const slot = existingSlots.find(s => s.time === time);
    if (!slot) return time;

    // 检查是否有冲突
    const hasConflict = slot.supplements.some((existing: any) => {
      const pair1 = `${existing.id}-${productId}`;
      const pair2 = `${productId}-${existing.id}`;
      return conflictPairs.has(pair1) || conflictPairs.has(pair2);
    });

    if (!hasConflict) return time;
  }

  // 如果都有冲突，返回原时间并警告
  console.warn(`[排程] 产品 ${productId} 无法找到无冲突时间槽`);
  return originalTime;
}

/**
 * 获取时间说明
 */
function getReasoningForTime(timing: any): string {
  const reasons: Record<string, string> = {
    "MORNING_EMPTY_STOMACH": "空腹服用，吸收更佳",
    "MORNING_WITH_FOOD": "早餐时段，配合脂肪吸收",
    "MORNING": "早晨服用，开启活力一天",
    "AFTERNOON": "午餐时段，补充能量",
    "EVENING": "晚餐时段，促进恢复",
    "BEFORE_BED": "睡前服用，助眠修复",
    "POST_WORKOUT": "运动后补充，促进恢复",
    "PRE_WORKOUT": "运动前补充，提升表现",
    "ANYTIME": "任意时间，灵活安排"
  };

  return reasons[timing] || "AI优化排程";
}
