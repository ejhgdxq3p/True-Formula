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
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "protein")!, amount: 8, unit: "g", percentDV: 16 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 50, unit: "mg", percentDV: 6 },
    ],
    dosagePerServing: "每次10g (1勺)",
    servingsPerDay: 2,
    optimalTiming: "POST_WORKOUT",
    price: 398,
    rating: 4.6,
  },

  // === 高冲突补剂 - 铁剂系列 ===
  {
    id: "iron-supplement-1",
    name: "汤臣倍健 补铁片",
    brand: "汤臣倍健",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 14, unit: "mg", percentDV: 100 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-c")!, amount: 60, unit: "mg" }, // 促进铁吸收
    ],
    dosagePerServing: "每次1片",
    servingsPerDay: 1,
    optimalTiming: "MORNING_EMPTY_STOMACH",
    price: 89,
    rating: 4.5,
  },
  {
    id: "iron-supplement-2",
    name: "Swisse 血红素铁",
    brand: "Swisse",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 24, unit: "mg", percentDV: 170 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 9, unit: "mcg" },
    ],
    dosagePerServing: "每次1粒",
    servingsPerDay: 1,
    optimalTiming: "MORNING_EMPTY_STOMACH",
    price: 168,
    rating: 4.7,
  },
  {
    id: "iron-supplement-3",
    name: "Nature Made 铁片",
    brand: "Nature Made",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 65, unit: "mg", percentDV: 361 },
    ],
    dosagePerServing: "每次1片",
    servingsPerDay: 1,
    optimalTiming: "MORNING_EMPTY_STOMACH",
    price: 78,
    rating: 4.3,
  },

  // === 高冲突补剂 - 钙剂系列 ===
  {
    id: "calcium-supplement-1",
    name: "钙尔奇 碳酸钙D3片",
    brand: "钙尔奇",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 600, unit: "mg", percentDV: 75 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 125, unit: "IU" },
    ],
    dosagePerServing: "每次1片",
    servingsPerDay: 2,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 128,
    rating: 4.8,
  },
  {
    id: "calcium-supplement-2",
    name: "Swisse 柠檬酸钙",
    brand: "Swisse",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 333, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 200, unit: "IU" },
    ],
    dosagePerServing: "每次2片",
    servingsPerDay: 1,
    optimalTiming: "BEFORE_BED",
    price: 198,
    rating: 4.6,
  },
  {
    id: "calcium-magnesium",
    name: "GNC 钙镁锌片",
    brand: "GNC",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 1000, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "magnesium")!, amount: 400, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "zinc")!, amount: 15, unit: "mg" },
    ],
    dosagePerServing: "每次3粒",
    servingsPerDay: 1,
    optimalTiming: "BEFORE_BED",
    price: 218,
    rating: 4.5,
  },

  // === 高冲突补剂 - 锌剂系列 ===
  {
    id: "zinc-supplement-1",
    name: "汤臣倍健 锌硒片",
    brand: "汤臣倍健",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "zinc")!, amount: 15, unit: "mg", percentDV: 136 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "selenium")!, amount: 50, unit: "mcg" },
    ],
    dosagePerServing: "每次2片",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 98,
    rating: 4.4,
  },
  {
    id: "zinc-supplement-2",
    name: "Nature's Bounty 葡萄糖酸锌",
    brand: "Nature's Bounty",
    category: ProductCategory.MINERAL,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "zinc")!, amount: 50, unit: "mg", percentDV: 455 },
    ],
    dosagePerServing: "每次1粒",
    servingsPerDay: 1,
    optimalTiming: "MORNING_EMPTY_STOMACH",
    price: 88,
    rating: 4.2,
  },

  // === 高冲突补剂 - 高剂量维生素E ===
  {
    id: "vit-e-high-dose",
    name: "Puritan's Pride 维生素E 1000IU",
    brand: "Puritan's Pride",
    category: ProductCategory.SINGLE_VITAMIN,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-e")!, amount: 1000, unit: "IU", percentDV: 6667 },
    ],
    dosagePerServing: "每次1粒",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 128,
    rating: 4.5,
  },
  {
    id: "vit-e-normal",
    name: "汤臣倍健 天然维生素E",
    brand: "汤臣倍健",
    category: ProductCategory.SINGLE_VITAMIN,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-e")!, amount: 250, unit: "mg" },
    ],
    dosagePerServing: "每次1粒",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 158,
    rating: 4.7,
  },

  // === 高冲突补剂 - 更多鱼油 ===
  {
    id: "omega3-high-dose",
    name: "Nordic Naturals Ultimate Omega",
    brand: "Nordic Naturals",
    category: ProductCategory.OMEGA,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "epa")!, amount: 1100, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "dha")!, amount: 850, unit: "mg" },
    ],
    dosagePerServing: "每次2粒",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 398,
    rating: 4.9,
  },

  // === 日常食材 - 高铁食物（会和钙/茶冲突）===
  {
    id: "food-red-meat",
    name: "牛肉",
    brand: "日常食材",
    category: ProductCategory.FOOD_MEAT,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 2.6, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "zinc")!, amount: 4.8, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 2.4, unit: "mcg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "food-pork-liver",
    name: "猪肝",
    brand: "日常食材",
    category: ProductCategory.FOOD_ORGAN,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 22.6, unit: "mg", percentDV: 126 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-a")!, amount: 4972, unit: "mcg", percentDV: 552 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 26, unit: "mcg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "food-chicken-liver",
    name: "鸡肝",
    brand: "日常食材",
    category: ProductCategory.FOOD_ORGAN,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 11.6, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-a")!, amount: 3290, unit: "mcg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },

  // === 日常食材 - 高钙食物 ===
  {
    id: "food-milk",
    name: "牛奶",
    brand: "日常食材",
    category: ProductCategory.FOOD_EGG, // 乳制品暂用蛋类分类
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 120, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 1.2, unit: "mcg" },
    ],
    dosagePerServing: "250ml",
    servingsPerDay: 2,
    optimalTiming: "MORNING_WITH_FOOD",
  },
  {
    id: "food-yogurt",
    name: "酸奶",
    brand: "日常食材",
    category: ProductCategory.FOOD_EGG,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 150, unit: "mg" },
    ],
    dosagePerServing: "200ml",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
  },
  {
    id: "food-tofu",
    name: "豆腐",
    brand: "日常食材",
    category: ProductCategory.FOOD_VEGETABLE,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 350, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 5.4, unit: "mg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "food-cheese",
    name: "奶酪",
    brand: "日常食材",
    category: ProductCategory.FOOD_EGG,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 721, unit: "mg", percentDV: 90 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "zinc")!, amount: 3.1, unit: "mg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
  },

  // === 更多蔬菜（含铁/钙）===
  {
    id: "food-kale",
    name: "羽衣甘蓝",
    brand: "日常食材",
    category: ProductCategory.FOOD_VEGETABLE,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 150, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 1.5, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-k1")!, amount: 704, unit: "mcg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },

  // === 健康饮品 - 咖啡因/茶多酚（抑制铁吸收）===
  {
    id: "beverage-espresso",
    name: "浓缩咖啡",
    brand: "健康饮品",
    category: ProductCategory.BEVERAGE_OTHER,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "caffeine")!, amount: 150, unit: "mg" },
    ],
    dosagePerServing: "30ml",
    servingsPerDay: 3,
    optimalTiming: "MORNING",
  },
  {
    id: "beverage-black-tea",
    name: "红茶",
    brand: "健康饮品",
    category: ProductCategory.BEVERAGE_TEA,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "tannin")!, amount: 300, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "caffeine")!, amount: 40, unit: "mg" },
    ],
    dosagePerServing: "250ml",
    servingsPerDay: 3,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "beverage-oolong-tea",
    name: "乌龙茶",
    brand: "健康饮品",
    category: ProductCategory.BEVERAGE_TEA,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "tannin")!, amount: 250, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "caffeine")!, amount: 30, unit: "mg" },
    ],
    dosagePerServing: "250ml",
    servingsPerDay: 2,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "beverage-orange-juice",
    name: "鲜榨橙汁",
    brand: "健康饮品",
    category: ProductCategory.BEVERAGE_JUICE,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-c")!, amount: 50, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 11, unit: "mg" },
    ],
    dosagePerServing: "250ml",
    servingsPerDay: 1,
    optimalTiming: "MORNING",
  },

  // === 更多综合维生素（脂溶性过量风险）===
  {
    id: "multivitamin-complete",
    name: "善存 复合维生素",
    brand: "善存",
    category: ProductCategory.MULTIVITAMIN,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-a")!, amount: 700, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 15, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-e")!, amount: 13.5, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-k1")!, amount: 30, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-c")!, amount: 90, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 6, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 200, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 8, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "zinc")!, amount: 8, unit: "mg" },
    ],
    dosagePerServing: "每次1片",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
    price: 138,
    rating: 4.6,
  },

  // === 日常食材 ===
  {
    id: "food-beef-liver",
    name: "牛肝",
    brand: "日常食材",
    category: ProductCategory.FOOD_ORGAN,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-a")!, amount: 16899, unit: "mcg", percentDV: 1877 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 111, unit: "mcg", percentDV: 4625 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 6.5, unit: "mg", percentDV: 36 },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "copper")!, amount: 12, unit: "mg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "food-egg",
    name: "鸡蛋",
    brand: "日常食材",
    category: ProductCategory.FOOD_EGG,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 1.3, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 2, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "selenium")!, amount: 31, unit: "mcg" },
    ],
    dosagePerServing: "1个 (50g)",
    servingsPerDay: 2,
    optimalTiming: "MORNING_WITH_FOOD",
  },
  {
    id: "food-spinach",
    name: "菠菜",
    brand: "日常食材",
    category: ProductCategory.FOOD_VEGETABLE,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-k1")!, amount: 483, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-a")!, amount: 469, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "iron")!, amount: 2.7, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "magnesium")!, amount: 79, unit: "mg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "food-salmon",
    name: "三文鱼",
    brand: "日常食材",
    category: ProductCategory.FOOD_MEAT,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "epa")!, amount: 862, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "dha")!, amount: 1104, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 3.2, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 11, unit: "mcg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },

  // === 健康饮品 ===
  {
    id: "beverage-soy-milk",
    name: "豆浆",
    brand: "健康饮品",
    category: ProductCategory.BEVERAGE_SOY,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "calcium")!, amount: 25, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "magnesium")!, amount: 25, unit: "mg" },
      // 大豆异黄酮等
    ],
    dosagePerServing: "250ml",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD",
  },
  {
    id: "beverage-green-tea",
    name: "绿茶",
    brand: "健康饮品",
    category: ProductCategory.BEVERAGE_TEA,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "green-tea")!, amount: 200, unit: "mg" }, // EGCG
      // 咖啡因、茶多酚等
    ],
    dosagePerServing: "250ml",
    servingsPerDay: 3,
    optimalTiming: "MORNING",
  },
  {
    id: "beverage-matcha",
    name: "抹茶",
    brand: "健康饮品",
    category: ProductCategory.BEVERAGE_TEA,
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "green-tea")!, amount: 500, unit: "mg" },
      // 更高浓度的茶多酚
    ],
    dosagePerServing: "2g粉 + 250ml水",
    servingsPerDay: 1,
    optimalTiming: "MORNING",
  },
  {
    id: "beverage-black-coffee",
    name: "黑咖啡",
    brand: "健康饮品",
    category: ProductCategory.BEVERAGE_OTHER,
    ingredients: [
      // 咖啡因、抗氧化剂
    ],
    dosagePerServing: "250ml",
    servingsPerDay: 2,
    optimalTiming: "MORNING",
  },
];
