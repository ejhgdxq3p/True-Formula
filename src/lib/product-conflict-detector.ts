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
  {
    nutrientA: "vit-c",
    nutrientB: "epa",
    severity: "MEDIUM" as ConflictSeverity,
    type: "OXIDATION_RISK",
    explanation: "高剂量维生素C（>1000mg）与鱼油同服可能加速鱼油氧化，降低效果",
    mechanism: "维生素C在某些条件下可能促进脂质氧化",
    timeGapRequired: 120,
  },
  {
    nutrientA: "vit-c",
    nutrientB: "dha",
    severity: "MEDIUM" as ConflictSeverity,
    type: "OXIDATION_RISK",
    explanation: "高剂量维生素C（>1000mg）与鱼油同服可能加速鱼油氧化，降低效果",
    mechanism: "维生素C在某些条件下可能促进脂质氧化",
    timeGapRequired: 120,
  },
  {
    nutrientA: "calcium",
    nutrientB: "protein",
    severity: "MEDIUM" as ConflictSeverity,
    type: "ABSORPTION_COMPETITION",
    explanation: "高钙摄入可能影响蛋白质吸收，建议间隔1-2小时",
    mechanism: "钙可能与蛋白质形成不溶性复合物",
    timeGapRequired: 90,
  },

  // === 轻度冲突 (LOW) ===
  {
    nutrientA: "vit-e",
    nutrientB: "vit-c",
    severity: "LOW" as ConflictSeverity,
    type: "SYNERGY_REDUCED",
    explanation: "维生素E和C虽然协同，但大剂量同服可能相互氧化，建议分开服用",
    mechanism: "两者在体内相互作用可能降低彼此稳定性",
    timeGapRequired: 60,
  },
  {
    nutrientA: "iron",
    nutrientB: "protein",
    severity: "LOW" as ConflictSeverity,
    type: "ABSORPTION_ENHANCED",
    explanation: "蛋白质会增强铁的吸收，这是好事，但注意铁过量风险",
    mechanism: "蛋白质提供氨基酸帮助铁转运",
    timeGapRequired: 0,
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
            type: rule.type as any, // Temporary cast until enum is fully aligned
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
