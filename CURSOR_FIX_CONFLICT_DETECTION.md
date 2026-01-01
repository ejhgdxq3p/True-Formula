# 🔧 修复冲突检测 - 基于静态产品数据 - Cursor 执行指令

---

## 问题描述

**当前状态**：用户在 MyList 里选择了明显冲突的产品（铁片+钙片+红茶），但显示"所有成分安全，无冲突"。

**根本原因**：`src/app/page.tsx` 第 98 行直接 `setConflicts([])`，冲突检测逻辑未实现。

---

## 解决方案

创建基于 **静态产品数据**（src/data/products.ts）的冲突检测引擎，检测营养素之间的相互作用。

---

## Task 1: 创建冲突检测引擎

**新建文件**: `src/lib/product-conflict-detector.ts`

```typescript
import type { Product, MyListProduct } from "@/types/product";
import type { Conflict, ConflictSeverity } from "@/types/supplement";

/**
 * 营养素冲突规则数据库
 *
 * 基于科学研究的营养素相互作用规则
 */
const NUTRIENT_CONFLICT_RULES = [
  // === 严重冲突 (CRITICAL) ===
  {
    nutrientA: "iron",
    nutrientB: "calcium",
    severity: "CRITICAL" as ConflictSeverity,
    type: "ABSORPTION_COMPETITION",
    explanation: "钙会严重抑制铁的吸收（降低50-70%），两者必须间隔4小时以上服用",
    mechanism: "钙和铁在肠道DMT1转运蛋白处竞争性结合",
    timeGapRequired: 240, // 4小时
  },
  {
    nutrientA: "iron",
    nutrientB: "tannin", // 茶多酚
    severity: "CRITICAL" as ConflictSeverity,
    type: "ABSORPTION_INHIBITION",
    explanation: "茶多酚（单宁酸）会与铁形成不溶性复合物，严重阻碍铁吸收（降低60-90%）",
    mechanism: "单宁酸螯合铁离子形成不可吸收的复合物",
    timeGapRequired: 120, // 2小时
  },
  {
    nutrientA: "iron",
    nutrientB: "caffeine", // 咖啡因
    severity: "CRITICAL" as ConflictSeverity,
    type: "ABSORPTION_INHIBITION",
    explanation: "咖啡因会显著降低铁的吸收率（降低约40-60%）",
    mechanism: "咖啡因中的多酚类物质与铁结合",
    timeGapRequired: 120,
  },

  // === 高度冲突 (HIGH) ===
  {
    nutrientA: "calcium",
    nutrientB: "magnesium",
    severity: "HIGH" as ConflictSeverity,
    type: "ABSORPTION_COMPETITION",
    explanation: "高剂量钙会竞争性抑制镁的吸收",
    mechanism: "共用肠道转运通道",
    timeGapRequired: 120,
  },
  {
    nutrientA: "calcium",
    nutrientB: "zinc",
    severity: "HIGH" as ConflictSeverity,
    type: "ABSORPTION_COMPETITION",
    explanation: "高剂量钙会降低锌的吸收效率",
    mechanism: "竞争性抑制锌转运蛋白",
    timeGapRequired: 120,
  },
  {
    nutrientA: "iron",
    nutrientB: "zinc",
    severity: "HIGH" as ConflictSeverity,
    type: "ABSORPTION_COMPETITION",
    explanation: "铁和锌在高剂量时会相互竞争吸收",
    mechanism: "共用二价金属离子转运系统",
    timeGapRequired: 120,
  },
  {
    nutrientA: "vit-e",
    nutrientB: "epa", // 鱼油EPA
    severity: "HIGH" as ConflictSeverity,
    type: "ADVERSE_INTERACTION",
    explanation: "高剂量维生素E（>400IU）与鱼油同服会增加出血风险",
    mechanism: "两者均有抗凝血作用，叠加效应增加出血倾向",
    timeGapRequired: 0, // 不是时间问题，是剂量问题
    condition: "VitE剂量 > 400IU",
  },
  {
    nutrientA: "vit-e",
    nutrientB: "dha", // 鱼油DHA
    severity: "HIGH" as ConflictSeverity,
    type: "ADVERSE_INTERACTION",
    explanation: "高剂量维生素E（>400IU）与鱼油同服会增加出血风险",
    mechanism: "两者均有抗凝血作用，叠加效应增加出血倾向",
    timeGapRequired: 0,
    condition: "VitE剂量 > 400IU",
  },

  // === 中度冲突 (MEDIUM) ===
  {
    nutrientA: "vit-c",
    nutrientB: "copper",
    severity: "MEDIUM" as ConflictSeverity,
    type: "ABSORPTION_INHIBITION",
    explanation: "高剂量维生素C（>1000mg）可能降低铜的吸收",
    mechanism: "竞争性抑制铜离子吸收",
    timeGapRequired: 60,
  },
  {
    nutrientA: "zinc",
    nutrientB: "copper",
    severity: "MEDIUM" as ConflictSeverity,
    type: "ABSORPTION_COMPETITION",
    explanation: "高剂量锌（>50mg）会严重抑制铜的吸收，长期可导致铜缺乏",
    mechanism: "锌诱导金属硫蛋白合成，优先结合铜",
    timeGapRequired: 120,
  },
];

/**
 * 检测产品列表中的营养素冲突
 *
 * @param products - 用户的产品清单
 * @returns 检测到的冲突列表
 */
export function detectProductConflicts(products: MyListProduct[]): Conflict[] {
  const conflicts: Conflict[] = [];

  // 收集所有产品中的营养素
  const productNutrients: Map<string, { nutrientId: string; amount: number; unit: string; productId: string; productName: string }[]> = new Map();

  products.forEach(item => {
    item.product.ingredients.forEach(ing => {
      const nutrientId = ing.nutrient.id;
      if (!productNutrients.has(nutrientId)) {
        productNutrients.set(nutrientId, []);
      }
      productNutrients.get(nutrientId)!.push({
        nutrientId,
        amount: ing.amount,
        unit: ing.unit,
        productId: item.productId,
        productName: item.product.name,
      });
    });
  });

  // 检测每一对产品组合
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const productA = products[i];
      const productB = products[j];

      // 收集产品A和B的所有营养素ID
      const nutrientsA = new Set(productA.product.ingredients.map(ing => ing.nutrient.id));
      const nutrientsB = new Set(productB.product.ingredients.map(ing => ing.nutrient.id));

      // 检查是否匹配任何冲突规则
      NUTRIENT_CONFLICT_RULES.forEach(rule => {
        const hasConflict =
          (nutrientsA.has(rule.nutrientA) && nutrientsB.has(rule.nutrientB)) ||
          (nutrientsA.has(rule.nutrientB) && nutrientsB.has(rule.nutrientA));

        if (hasConflict) {
          // 特殊检查：高剂量维生素E的条件
          if (rule.nutrientA === "vit-e" || rule.nutrientB === "vit-e") {
            const vitEProduct = nutrientsA.has("vit-e") ? productA : productB;
            const vitEIngredient = vitEProduct.product.ingredients.find(ing => ing.nutrient.id === "vit-e");

            // 如果维生素E剂量 < 400 IU (约 270mg)，跳过这个冲突
            if (vitEIngredient && vitEIngredient.unit === "IU" && vitEIngredient.amount < 400) {
              return; // 跳过此规则
            }
            if (vitEIngredient && vitEIngredient.unit === "mg" && vitEIngredient.amount < 270) {
              return;
            }
          }

          conflicts.push({
            id: `conflict-${productA.productId}-${productB.productId}-${rule.nutrientA}-${rule.nutrientB}`,
            productAId: productA.productId,
            productAName: productA.product.name,
            productBId: productB.productId,
            productBName: productB.product.name,
            nutrientA: rule.nutrientA,
            nutrientB: rule.nutrientB,
            severity: rule.severity,
            type: rule.type,
            explanation: rule.explanation,
            mechanism: rule.mechanism,
            timeGapRequired: rule.timeGapRequired,
          });
        }
      });
    }
  }

  return conflicts;
}

/**
 * 获取冲突的严重程度文本
 */
export function getConflictSeverityLabel(severity: ConflictSeverity, language: 'zh' | 'en'): string {
  const labels = {
    zh: {
      CRITICAL: "🔴 严重冲突",
      HIGH: "🟠 高度冲突",
      MEDIUM: "🟡 中度冲突",
      LOW: "🟢 轻度冲突",
    },
    en: {
      CRITICAL: "🔴 CRITICAL",
      HIGH: "🟠 HIGH",
      MEDIUM: "🟡 MEDIUM",
      LOW: "🟢 LOW",
    },
  };
  return labels[language][severity] || severity;
}
```

---

## Task 2: 更新类型定义

**文件**: `src/types/supplement.ts`

确保包含以下类型定义（如果已有就保持不变）：

```typescript
export enum ConflictSeverity {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum ConflictType {
  ABSORPTION_COMPETITION = "ABSORPTION_COMPETITION",      // 吸收竞争
  ABSORPTION_INHIBITION = "ABSORPTION_INHIBITION",        // 吸收抑制
  ADVERSE_INTERACTION = "ADVERSE_INTERACTION",            // 不良相互作用
  METABOLISM_INTERFERENCE = "METABOLISM_INTERFERENCE",    // 代谢干扰
}

export interface Conflict {
  id: string;
  productAId: string;
  productAName: string;
  productBId: string;
  productBName: string;
  nutrientA: string;        // 营养素ID
  nutrientB: string;        // 营养素ID
  type: ConflictType;
  severity: ConflictSeverity;
  explanation: string;      // 用户友好的解释
  mechanism: string;        // 药理机制
  timeGapRequired?: number; // 建议间隔时间（分钟）
}
```

---

## Task 3: 在 page.tsx 中调用冲突检测

**文件**: `src/app/page.tsx`

修改 `triggerOptimization` 函数中的冲突检测部分：

**找到第 98 行**：
```typescript
setConflicts([]); // Mock empty conflicts for now
```

**替换为**：
```typescript
// 检测产品冲突
import { detectProductConflicts } from "@/lib/product-conflict-detector";

// ... 在 triggerOptimization 函数内

// 检测冲突
const detectedConflicts = detectProductConflicts(products);
setConflicts(detectedConflicts);

// 更新 mockSundial 的 conflicts 字段
mockSundial.conflicts = detectedConflicts;
```

**完整修改后的 triggerOptimization 函数**：

```typescript
// AI重新规划日晷
const triggerOptimization = async (products: MyListProduct[]) => {
  setIsOptimizing(true);

  // 模拟AI计算（实际调用API）
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock response generation
  const mockSlots: SundialSlot[] = [];

  products.forEach(item => {
    let time = "08:00";
    if (item.product.optimalTiming === "BEFORE_BED") time = "22:00";
    if (item.product.optimalTiming === "EVENING") time = "19:00";
    if (item.product.optimalTiming === "POST_WORKOUT") time = "18:00";
    if (item.product.optimalTiming === "AFTERNOON") time = "14:00";

    let slot = mockSlots.find(s => s.time === time);
    if (!slot) {
      slot = { time, products: [], reasoning: "Based on product timing" };
      mockSlots.push(slot);
    }
    slot.products.push({
      productId: item.productId,
      product: item.product,
      dosage: item.product.dosagePerServing
    });
  });

  // 🔧 NEW: 检测冲突
  const detectedConflicts = detectProductConflicts(products);

  const mockSundial: SundialType = {
    id: "generated-1",
    name: "My Optimized Schedule",
    timeSlots: mockSlots.sort((a, b) => a.time.localeCompare(b.time)),
    conflicts: detectedConflicts,  // 使用真实检测结果
    synergies: [],
    optimizedAt: new Date(),
    isPublic: false,
    forkCount: 0,
    likeCount: 0
  };

  setSundial(mockSundial);
  setConflicts(detectedConflicts);  // 传递给 MyList
  setIsOptimizing(false);
};
```

---

## Task 4: 在 page.tsx 顶部添加 import

**文件**: `src/app/page.tsx`

在文件顶部添加：

```typescript
import { detectProductConflicts } from "@/lib/product-conflict-detector";
```

---

## Task 5: 更新 MyList 显示冲突详情

**文件**: `src/components/MyList/index.tsx`

在底部总结区域添加冲突详情显示：

**找到第 93-120 行的冲突总结部分**，替换为：

```typescript
{/* 底部总结 - 冲突检测 */}
{products.length > 0 && (
  <div className={`border-3 p-4 ${
    hasConflicts
      ? 'border-red-500 bg-red-50'
      : 'border-retro-green bg-retro-green/5'
  }`}>
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-3 h-3 ${hasConflicts ? 'bg-red-500' : 'bg-retro-green'}`}></div>
      <h3 className="font-black text-xs font-mono uppercase text-retro-black">
        {language === 'zh' ? '冲突检测' : 'CONFLICT DETECTION'}
      </h3>
    </div>

    {hasConflicts ? (
      <div>
        <div className="text-sm font-mono text-red-600 font-bold mb-3">
          {language === 'zh'
            ? `发现 ${conflicts.length} 个营养素冲突`
            : `${conflicts.length} CONFLICTS DETECTED`
          }
        </div>

        {/* 显示前3个冲突详情 */}
        <div className="space-y-2 text-xs font-mono text-retro-black">
          {conflicts.slice(0, 3).map((conflict: any, i: number) => (
            <div key={i} className="bg-white border-2 border-red-300 p-2">
              <div className="font-bold text-red-600">
                {conflict.severity === 'CRITICAL' ? '🔴' : conflict.severity === 'HIGH' ? '🟠' : '🟡'}
                {' '}{conflict.productAName} ↔ {conflict.productBName}
              </div>
              <div className="text-retro-black/70 mt-1">
                {conflict.explanation}
              </div>
              {conflict.timeGapRequired && conflict.timeGapRequired > 0 && (
                <div className="text-retro-green mt-1 font-bold">
                  → {language === 'zh' ? '建议间隔' : 'Gap'}: {conflict.timeGapRequired / 60}h
                </div>
              )}
            </div>
          ))}

          {conflicts.length > 3 && (
            <div className="text-center text-retro-black/50 pt-2">
              +{conflicts.length - 3} {language === 'zh' ? '个更多冲突' : 'more...'}
            </div>
          )}
        </div>

        <div className="text-xs font-mono text-retro-black mt-3 pt-3 border-t border-red-300">
          → {language === 'zh'
            ? '需要日晷优化调整时间'
            : 'Use Sundial to optimize timing'
          }
        </div>
      </div>
    ) : (
      <div className="text-sm font-mono text-retro-green">
        ✓ {language === 'zh' ? '所有成分安全，无冲突' : 'All safe, no conflicts'}
      </div>
    )}
  </div>
)}
```

---

## ✅ 验收标准

完成后测试以下场景：

1. **严重冲突测试**：
   - 选择 "汤臣倍健 补铁片" + "钙尔奇" → 应显示 🔴 严重冲突（铁+钙）
   - 选择 "Nature Made 铁片" + "红茶" → 应显示 🔴 严重冲突（铁+茶多酚）

2. **高度冲突测试**：
   - 选择 "钙尔奇" + "GNC 钙镁锌片" → 应显示 🟠 高度冲突（钙+镁+锌多重竞争）
   - 选择 "铁片" + "汤臣倍健锌硒片" → 应显示 🟠 高度冲突（铁+锌）

3. **多重冲突测试**：
   - 选择 "铁片" + "钙片" + "红茶" + "锌片" → 应显示多个冲突
   - MyList 底部应显示冲突总数和前3个详情

4. **无冲突测试**：
   - 仅选择 "三文鱼" + "鸡蛋" → 应显示 ✓ 无冲突

---

**Cursor，开始修复冲突检测，让用户的铁片+钙片组合炸出满屏警告！** 🔴💥
