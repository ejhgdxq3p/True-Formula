# 💥 扩充补剂库 - 增加高冲突产品 - Cursor 执行指令

---

## 目标

扩充 `src/data/products.ts` 和 `src/data/nutrients.ts`，添加**容易产生冲突**的补剂、食材和饮品，让用户随便选几个就能触发冲突检测！

---

## 核心冲突组合（必须覆盖）

### 🔴 严重冲突 (CRITICAL)
1. **铁 + 钙** - 严重竞争吸收，必须间隔4小时以上
2. **铁 + 茶/咖啡** - 茶多酚/咖啡因严重抑制铁吸收
3. **高剂量维生素E + 鱼油** - 抗凝血作用叠加，出血风险
4. **钙 + 甲状腺药物** - 严重影响药物吸收

### 🟠 高度冲突 (HIGH)
1. **钙 + 镁** - 竞争同一吸收通道
2. **铁 + 锌** - 竞争吸收
3. **钙 + 锌** - 竞争吸收
4. **维生素C高剂量 + 铜** - 影响铜吸收

### 🟡 中度冲突 (MEDIUM)
1. **脂溶性维生素过量组合** (A+D+E+K)
2. **B族维生素不平衡** (单独大量B6会影响其他B族)
3. **钙 + 铁 + 锌** 三者同时服用

---

## Task 1: 扩充营养素数据库

**文件**: `src/data/nutrients.ts`

确保包含以下营养素（如果没有就添加）：

```typescript
export const NUTRIENTS_DATABASE: Nutrient[] = [
  // === 已有的保持不变 ===

  // === 确保以下营养素存在 ===

  // 容易冲突的矿物质
  {
    id: "iron",
    name: "铁 (Fe)",
    commonName: "铁",
    category: NutrientCategory.TRACE_MINERAL,
    aliases: ["Iron", "Fe", "Ferrous", "血红素铁"]
  },
  {
    id: "calcium",
    name: "钙 (Ca)",
    commonName: "钙",
    category: NutrientCategory.MACRO_MINERAL,
    aliases: ["Calcium", "Ca", "碳酸钙", "柠檬酸钙"]
  },
  {
    id: "zinc",
    name: "锌 (Zn)",
    commonName: "锌",
    category: NutrientCategory.TRACE_MINERAL,
    aliases: ["Zinc", "Zn", "葡萄糖酸锌"]
  },
  {
    id: "magnesium",
    name: "镁 (Mg)",
    commonName: "镁",
    category: NutrientCategory.MACRO_MINERAL,
    aliases: ["Magnesium", "Mg", "氧化镁"]
  },
  {
    id: "copper",
    name: "铜 (Cu)",
    commonName: "铜",
    category: NutrientCategory.TRACE_MINERAL,
    aliases: ["Copper", "Cu"]
  },

  // 抗氧化剂/抗凝血相关
  {
    id: "vit-e",
    name: "维生素E (生育酚)",
    commonName: "维生素E",
    category: NutrientCategory.VITAMIN_FAT_SOLUBLE,
    aliases: ["Vitamin E", "Tocopherol", "VE"]
  },
  {
    id: "vit-k1",
    name: "维生素K1 (叶绿醌)",
    commonName: "维生素K",
    category: NutrientCategory.VITAMIN_FAT_SOLUBLE,
    aliases: ["Vitamin K", "Phylloquinone", "VK"]
  },

  // 其他
  {
    id: "caffeine",
    name: "咖啡因",
    commonName: "咖啡因",
    category: NutrientCategory.ANTIOXIDANT,
    aliases: ["Caffeine", "咖啡碱"]
  },
  {
    id: "tannin",
    name: "单宁酸/茶多酚",
    commonName: "茶多酚",
    category: NutrientCategory.ANTIOXIDANT,
    aliases: ["Tannin", "茶多酚", "EGCG"]
  },
];
```

---

## Task 2: 大量扩充产品数据库

**文件**: `src/data/products.ts`

在现有产品后添加以下产品：

```typescript
export const PRODUCTS_DATABASE: Product[] = [
  // ...保留现有所有产品

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
];
```

---

## Task 3: 更新 SupplementDrawer 分类标签

**文件**: `src/components/SupplementDrawer/index.tsx`

在 `getCategoryLabel` 函数中添加新分类的标签：

```typescript
function getCategoryLabel(cat: ProductCategory, lang: Language): string {
  const labels: Record<Language, Record<ProductCategory, string>> = {
    zh: {
      MULTIVITAMIN: "综合维生素",
      SINGLE_VITAMIN: "单一维生素",
      MINERAL: "矿物质",
      OMEGA: "Omega脂肪酸",
      PROTEIN: "蛋白质",
      PROBIOTIC: "益生菌",
      HERBAL: "草本植物",
      SPORTS: "运动营养",
      BEAUTY: "美容保健",
      JOINT: "关节骨骼",
      IMMUNITY: "免疫力",
      SLEEP: "助眠",
      ENERGY: "能量",

      // 日常食材
      FOOD_MEAT: "肉类",
      FOOD_EGG: "蛋类",
      FOOD_VEGETABLE: "蔬菜",
      FOOD_ORGAN: "内脏",

      // 健康饮品
      BEVERAGE_TEA: "茶类",
      BEVERAGE_SOY: "豆制品",
      BEVERAGE_JUICE: "果汁",
      BEVERAGE_OTHER: "其他饮品",
    },
    en: {
      MULTIVITAMIN: "MULTIVITAMIN",
      SINGLE_VITAMIN: "SINGLE VITAMIN",
      MINERAL: "MINERAL",
      OMEGA: "OMEGA",
      PROTEIN: "PROTEIN",
      PROBIOTIC: "PROBIOTIC",
      HERBAL: "HERBAL",
      SPORTS: "SPORTS",
      BEAUTY: "BEAUTY",
      JOINT: "JOINT",
      IMMUNITY: "IMMUNITY",
      SLEEP: "SLEEP",
      ENERGY: "ENERGY",

      // 日常食材
      FOOD_MEAT: "MEAT",
      FOOD_EGG: "EGG",
      FOOD_VEGETABLE: "VEGETABLE",
      FOOD_ORGAN: "ORGAN",

      // 健康饮品
      BEVERAGE_TEA: "TEA",
      BEVERAGE_SOY: "SOY",
      BEVERAGE_JUICE: "JUICE",
      BEVERAGE_OTHER: "BEVERAGE",
    }
  };
  return labels[lang][cat] || cat;
}
```

---

## ✅ 验收标准

完成后应该：
- [ ] 补剂库至少有 **30+ 产品**
- [ ] 包含 **铁剂 3+ 种**（会和钙/茶/咖啡冲突）
- [ ] 包含 **钙剂 3+ 种**（会和铁/锌/镁冲突）
- [ ] 包含 **锌剂 2+ 种**（会和铁/钙冲突）
- [ ] 包含 **高剂量维生素E 2+ 种**（会和鱼油冲突）
- [ ] 包含 **咖啡/茶类饮品 5+ 种**（会抑制铁吸收）
- [ ] 包含 **高铁食材 5+ 种**（肝脏、红肉等）
- [ ] 包含 **高钙食材 5+ 种**（牛奶、奶酪、豆腐等）
- [ ] 用户随便选择 **铁剂 + 钙剂** → 立刻触发严重冲突 🔴
- [ ] 用户选择 **铁剂 + 绿茶** → 触发高度冲突 🟠
- [ ] 用户选择 **钙镁锌片 + 铁剂** → 触发多重冲突 💥

---

**Cursor，开始扩充产品库，让冲突满天飞！** 💥
