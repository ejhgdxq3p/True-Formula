import { Product, ProductCategory } from "@/types/product";
import { NUTRIENTS_DATABASE } from "./nutrients";

/**
 * 真实市场产品数据库（中国+全球热门品牌）
 */
export const PRODUCTS_DATABASE: Product[] = [
  // === 汤臣倍健 (By-Health) ===
  {
    id: "bh-calcium-d3",
    name: "汤臣倍健 液体钙软胶囊",
    brand: "汤臣倍健",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 600, unit: "mg", percentDV: 75 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 5, unit: "mcg", percentDV: 100 }
    ],
    dosagePerServing: "每次2粒",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 129,
    rating: 4.7,
  },
  {
    id: "bh-omega3",
    name: "汤臣倍健 深海鱼油软胶囊",
    brand: "汤臣倍健",
    category: ProductCategory.OMEGA,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "epa")!, amount: 180, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "dha")!, amount: 120, unit: "mg" }
    ],
    dosagePerServing: "每次2粒",
    servingsPerDay: 2,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 198,
    rating: 4.6,
  },

  // === Swisse (澳洲) ===
  {
    id: "swisse-multivitamin",
    name: "Swisse 男士复合维生素",
    brand: "Swisse",
    category: ProductCategory.MULTIVITAMIN,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-a")!, amount: 750, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-c")!, amount: 165, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 25, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-e")!, amount: 41, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 30, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "zinc")!, amount: 8, unit: "mg" },
    ],
    dosagePerServing: "每次1片",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 268,
    rating: 4.8,
  },

  // === Nature Made (美国) ===
  {
    id: "nm-vitd3",
    name: "Nature Made 维生素D3 2000IU",
    brand: "Nature Made",
    category: ProductCategory.SINGLE_VITAMIN,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 50, unit: "mcg", percentDV: 250 }
    ],
    dosagePerServing: "每次1粒",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 89,
    rating: 4.9,
  },

  // === GNC (美国) ===
  {
    id: "gnc-triple-strength",
    name: "GNC Triple Strength 鱼油1500mg",
    brand: "GNC",
    category: ProductCategory.OMEGA,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "epa")!, amount: 647, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "dha")!, amount: 253, unit: "mg" }
    ],
    dosagePerServing: "每次1粒",
    servingsPerDay: 2,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 328,
    rating: 4.7,
  },

  // === 修正 (XiuZheng) ===
  {
    id: "xz-calcium-mag",
    name: "修正 钙镁片",
    brand: "修正",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 500, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "magnesium")!, amount: 250, unit: "mg" }
    ],
    dosagePerServing: "每次2片",
    servingsPerDay: 1,
    optimalTiming: "BEFORE_BED",
    price: 68,
    rating: 4.4,
  },

  // === 纽崔莱 (Nutrilite) ===
  {
    id: "nutri-protein",
    name: "纽崔莱 蛋白质粉",
    brand: "纽崔莱",
    category: ProductCategory.PROTEIN,
    ingredients: [
      // 含所有必需氨基酸
    ],
    dosagePerServing: "每次10g (1勺)",
    servingsPerDay: 2,
    optimalTiming: "POST_WORKOUT",
    price: 398,
    rating: 4.6,
  },
];
