# 🔥 紧急重构 - 产品化逻辑

> **用户要的是产品，不是营养素！**

---

## 核心问题

❌ **现在的反人类设计：**
- 左边：Vitamin D3, Magnesium...（谁tm记得化学名？）
- 用户思维：我买了Nature Made的维生素D
- 社区墙：展示营养素组合（没人关心）

✅ **应该的设计：**
- 左边：**产品库**（汤臣倍健钙片、Swisse鱼油、GNC综合维生素）
- 每个产品包含多个营养素成分
- 社区墙：展示其他人用的**产品组合**
- 冲突检测：后台基于产品内的营养素成分

---

## Task 1: 更新项目名称

### 修改所有出现"SUPPLEMENT LAB"的地方：

**文件：`src/lib/i18n.ts`**

```typescript
zh: {
  appTitle: "真配方",
  appSubtitle: "科学补剂排程 v1.0",
  // ...
}
en: {
  appTitle: "TRUE FORMULA",
  appSubtitle: "SCIENTIFIC SUPPLEMENT SCHEDULING v1.0",
  // ...
}
```

**文件：`package.json`**
```json
{
  "name": "true-formula",
  "description": "TRUE FORMULA - Scientific supplement scheduling platform"
}
```

**文件：`README.md` - 第一行改为：**
```markdown
# TRUE FORMULA - 真配方
```

---

## Task 2: 删除所有emoji

### 全局搜索替换：

```bash
# 删除这些emoji（保留文字）
📹 → 空
💾 → 空
🌐 → 空
💊 → 空
📝 → 空
🔍 → 空
🔴 → 空
🟡 → 空
🟢 → 空
⚡ → 空
✕ → X
📼 → 空
🛡️ → 空
⚙️ → 空
⚠️ → !
✓ → ✓（这个保留）
✅ → 空
🔱 → 空
💬 → 空
👍 → 空
🧪 → 空
🚀 → 空
```

**具体操作：**
- 在VSCode中 Ctrl+Shift+F 全局搜索每个emoji
- 替换为空或对应文字
- 按钮文字直接用英文大写

---

## Task 3: 重构数据模型 - 从营养素到产品

### 新建类型：`src/types/product.ts`

```typescript
/**
 * 产品模型 - 用户实际购买的商品
 */
export interface Product {
  id: string;
  name: string;              // "Nature Made 维生素D3软胶囊"
  brand: string;             // "Nature Made"
  category: ProductCategory; // 品类
  imageUrl?: string;

  // 包含的营养素成分
  ingredients: NutrientContent[];

  // 服用建议
  dosagePerServing: string;  // "每次1粒"
  servingsPerDay: number;    // 1
  optimalTiming: TimingPreference;

  // 购买信息
  price?: number;
  buyLink?: string;

  // 用户反馈
  rating?: number;
  reviewCount?: number;
}

export interface NutrientContent {
  nutrient: Nutrient;        // 营养素对象
  amount: number;            // 含量
  unit: string;              // "mg" / "IU" / "mcg"
  percentDV?: number;        // 每日推荐摄入量百分比
}

export enum ProductCategory {
  MULTIVITAMIN = "MULTIVITAMIN",        // 综合维生素
  SINGLE_VITAMIN = "SINGLE_VITAMIN",    // 单一维生素
  MINERAL = "MINERAL",                  // 矿物质
  OMEGA = "OMEGA",                      // Omega-3/6/9
  PROTEIN = "PROTEIN",                  // 蛋白粉
  PROBIOTIC = "PROBIOTIC",              // 益生菌
  HERBAL = "HERBAL",                    // 草本/植物提取
  SPORTS = "SPORTS",                    // 运动营养
  BEAUTY = "BEAUTY",                    // 美容保健
  JOINT = "JOINT",                      // 关节骨骼
  IMMUNITY = "IMMUNITY",                // 免疫力
  SLEEP = "SLEEP",                      // 助眠
  ENERGY = "ENERGY",                    // 能量/抗疲劳
}

/**
 * 营养素 - 产品的成分（后台用于冲突检测）
 */
export interface Nutrient {
  id: string;
  name: string;              // "维生素D3 (胆钙化醇)"
  commonName: string;        // "维生素D"
  category: NutrientCategory;
  aliases: string[];         // ["Vitamin D", "Cholecalciferol", "VD3"]
}

export enum NutrientCategory {
  // 维生素
  VITAMIN_FAT_SOLUBLE = "VITAMIN_FAT_SOLUBLE",    // 脂溶性维生素 (A,D,E,K)
  VITAMIN_WATER_SOLUBLE = "VITAMIN_WATER_SOLUBLE",// 水溶性维生素 (B,C)

  // 矿物质
  MACRO_MINERAL = "MACRO_MINERAL",                // 常量矿物质 (钙镁钾钠)
  TRACE_MINERAL = "TRACE_MINERAL",                // 微量矿物质 (铁锌硒铬)

  // 氨基酸
  ESSENTIAL_AMINO = "ESSENTIAL_AMINO",            // 必需氨基酸
  BCAA = "BCAA",                                  // 支链氨基酸

  // 脂肪酸
  OMEGA_3 = "OMEGA_3",                            // EPA/DHA
  OMEGA_6 = "OMEGA_6",

  // 其他
  PROBIOTIC_STRAIN = "PROBIOTIC_STRAIN",          // 益生菌菌株
  HERBAL_EXTRACT = "HERBAL_EXTRACT",              // 草本提取物
  ANTIOXIDANT = "ANTIOXIDANT",                    // 抗氧化剂
  COENZYME = "COENZYME",                          // 辅酶 (CoQ10等)
}
```

---

## Task 4: 创建超全营养素数据库

### 新建文件：`src/data/nutrients.ts`

```typescript
/**
 * 全球常见营养素数据库
 */
export const NUTRIENTS_DATABASE: Nutrient[] = [
  // === 脂溶性维生素 ===
  { id: "vit-a", name: "维生素A (视黄醇)", commonName: "维生素A", category: "VITAMIN_FAT_SOLUBLE", aliases: ["Vitamin A", "Retinol", "VA"] },
  { id: "vit-d2", name: "维生素D2 (麦角钙化醇)", commonName: "维生素D", category: "VITAMIN_FAT_SOLUBLE", aliases: ["Vitamin D2", "Ergocalciferol"] },
  { id: "vit-d3", name: "维生素D3 (胆钙化醇)", commonName: "维生素D", category: "VITAMIN_FAT_SOLUBLE", aliases: ["Vitamin D3", "Cholecalciferol", "VD3"] },
  { id: "vit-e", name: "维生素E (生育酚)", commonName: "维生素E", category: "VITAMIN_FAT_SOLUBLE", aliases: ["Vitamin E", "Tocopherol", "VE"] },
  { id: "vit-k1", name: "维生素K1 (叶绿醌)", commonName: "维生素K", category: "VITAMIN_FAT_SOLUBLE", aliases: ["Vitamin K1", "Phylloquinone"] },
  { id: "vit-k2", name: "维生素K2 (甲萘醌)", commonName: "维生素K", category: "VITAMIN_FAT_SOLUBLE", aliases: ["Vitamin K2", "Menaquinone", "MK-7"] },

  // === 水溶性维生素 ===
  { id: "vit-c", name: "维生素C (抗坏血酸)", commonName: "维生素C", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin C", "Ascorbic Acid", "VC"] },
  { id: "vit-b1", name: "维生素B1 (硫胺素)", commonName: "维生素B1", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin B1", "Thiamine", "VB1"] },
  { id: "vit-b2", name: "维生素B2 (核黄素)", commonName: "维生素B2", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin B2", "Riboflavin", "VB2"] },
  { id: "vit-b3", name: "维生素B3 (烟酸)", commonName: "维生素B3", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin B3", "Niacin", "VB3"] },
  { id: "vit-b5", name: "维生素B5 (泛酸)", commonName: "维生素B5", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin B5", "Pantothenic Acid", "VB5"] },
  { id: "vit-b6", name: "维生素B6 (吡哆醇)", commonName: "维生素B6", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin B6", "Pyridoxine", "VB6"] },
  { id: "vit-b7", name: "维生素B7 (生物素)", commonName: "生物素", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin B7", "Biotin", "VB7"] },
  { id: "vit-b9", name: "维生素B9 (叶酸)", commonName: "叶酸", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin B9", "Folic Acid", "Folate"] },
  { id: "vit-b12", name: "维生素B12 (钴胺素)", commonName: "维生素B12", category: "VITAMIN_WATER_SOLUBLE", aliases: ["Vitamin B12", "Cobalamin", "VB12"] },

  // === 常量矿物质 ===
  { id: "calcium", name: "钙", commonName: "钙", category: "MACRO_MINERAL", aliases: ["Calcium", "Ca"] },
  { id: "magnesium", name: "镁", commonName: "镁", category: "MACRO_MINERAL", aliases: ["Magnesium", "Mg"] },
  { id: "potassium", name: "钾", commonName: "钾", category: "MACRO_MINERAL", aliases: ["Potassium", "K"] },
  { id: "sodium", name: "钠", commonName: "钠", category: "MACRO_MINERAL", aliases: ["Sodium", "Na"] },
  { id: "phosphorus", name: "磷", commonName: "磷", category: "MACRO_MINERAL", aliases: ["Phosphorus", "P"] },

  // === 微量矿物质 ===
  { id: "iron", name: "铁", commonName: "铁", category: "TRACE_MINERAL", aliases: ["Iron", "Fe"] },
  { id: "zinc", name: "锌", commonName: "锌", category: "TRACE_MINERAL", aliases: ["Zinc", "Zn"] },
  { id: "copper", name: "铜", commonName: "铜", category: "TRACE_MINERAL", aliases: ["Copper", "Cu"] },
  { id: "selenium", name: "硒", commonName: "硒", category: "TRACE_MINERAL", aliases: ["Selenium", "Se"] },
  { id: "iodine", name: "碘", commonName: "碘", category: "TRACE_MINERAL", aliases: ["Iodine", "I"] },
  { id: "chromium", name: "铬", commonName: "铬", category: "TRACE_MINERAL", aliases: ["Chromium", "Cr"] },
  { id: "manganese", name: "锰", commonName: "锰", category: "TRACE_MINERAL", aliases: ["Manganese", "Mn"] },
  { id: "molybdenum", name: "钼", commonName: "钼", category: "TRACE_MINERAL", aliases: ["Molybdenum", "Mo"] },

  // === 必需氨基酸 ===
  { id: "leucine", name: "亮氨酸", commonName: "亮氨酸", category: "BCAA", aliases: ["Leucine", "L-Leucine"] },
  { id: "isoleucine", name: "异亮氨酸", commonName: "异亮氨酸", category: "BCAA", aliases: ["Isoleucine", "L-Isoleucine"] },
  { id: "valine", name: "缬氨酸", commonName: "缬氨酸", category: "BCAA", aliases: ["Valine", "L-Valine"] },
  { id: "lysine", name: "赖氨酸", commonName: "赖氨酸", category: "ESSENTIAL_AMINO", aliases: ["Lysine", "L-Lysine"] },
  { id: "methionine", name: "蛋氨酸", commonName: "蛋氨酸", category: "ESSENTIAL_AMINO", aliases: ["Methionine", "L-Methionine"] },
  { id: "phenylalanine", name: "苯丙氨酸", commonName: "苯丙氨酸", category: "ESSENTIAL_AMINO", aliases: ["Phenylalanine", "L-Phenylalanine"] },
  { id: "threonine", name: "苏氨酸", commonName: "苏氨酸", category: "ESSENTIAL_AMINO", aliases: ["Threonine", "L-Threonine"] },
  { id: "tryptophan", name: "色氨酸", commonName: "色氨酸", category: "ESSENTIAL_AMINO", aliases: ["Tryptophan", "L-Tryptophan"] },

  // === Omega脂肪酸 ===
  { id: "epa", name: "EPA (二十碳五烯酸)", commonName: "EPA", category: "OMEGA_3", aliases: ["EPA", "Eicosapentaenoic Acid"] },
  { id: "dha", name: "DHA (二十二碳六烯酸)", commonName: "DHA", category: "OMEGA_3", aliases: ["DHA", "Docosahexaenoic Acid"] },
  { id: "ala", name: "ALA (α-亚麻酸)", commonName: "ALA", category: "OMEGA_3", aliases: ["ALA", "Alpha-Linolenic Acid"] },

  // === 辅酶与抗氧化剂 ===
  { id: "coq10", name: "辅酶Q10", commonName: "辅酶Q10", category: "COENZYME", aliases: ["CoQ10", "Ubiquinone"] },
  { id: "glutathione", name: "谷胱甘肽", commonName: "谷胱甘肽", category: "ANTIOXIDANT", aliases: ["Glutathione", "GSH"] },
  { id: "resveratrol", name: "白藜芦醇", commonName: "白藜芦醇", category: "ANTIOXIDANT", aliases: ["Resveratrol"] },
  { id: "astaxanthin", name: "虾青素", commonName: "虾青素", category: "ANTIOXIDANT", aliases: ["Astaxanthin"] },

  // === 草本提取物 ===
  { id: "curcumin", name: "姜黄素", commonName: "姜黄素", category: "HERBAL_EXTRACT", aliases: ["Curcumin", "Turmeric"] },
  { id: "green-tea", name: "绿茶提取物", commonName: "绿茶", category: "HERBAL_EXTRACT", aliases: ["Green Tea Extract", "EGCG"] },
  { id: "ginseng", name: "人参提取物", commonName: "人参", category: "HERBAL_EXTRACT", aliases: ["Ginseng", "Panax Ginseng"] },
  { id: "ashwagandha", name: "南非醉茄", commonName: "南非醉茄", category: "HERBAL_EXTRACT", aliases: ["Ashwagandha"] },
  { id: "rhodiola", name: "红景天", commonName: "红景天", category: "HERBAL_EXTRACT", aliases: ["Rhodiola"] },

  // === 益生菌菌株 ===
  { id: "lacto-acidophilus", name: "嗜酸乳杆菌", commonName: "嗜酸乳杆菌", category: "PROBIOTIC_STRAIN", aliases: ["Lactobacillus Acidophilus"] },
  { id: "bifido-bifidum", name: "双歧杆菌", commonName: "双歧杆菌", category: "PROBIOTIC_STRAIN", aliases: ["Bifidobacterium Bifidum"] },
];

// 共计 50+ 营养素，可继续扩展
```

---

## Task 5: 创建真实产品数据库

### 新建文件：`src/data/products.ts`

```typescript
import { Product, ProductCategory } from "@/types/product";

/**
 * 真实市场产品数据库（中国+全球热门品牌）
 */
export const PRODUCTS_DATABASE: Product[] = [
  // === 汤臣倍健 (By-Health) ===
  {
    id: "bh-calcium-d3",
    name: "汤臣倍健 液体钙软胶囊",
    brand: "汤臣倍健",
    category: "MINERAL",
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
    category: "OMEGA",
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
    category: "MULTIVITAMIN",
    ingredients: [
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-a")!, amount: 750, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-c")!, amount: 165, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-d3")!, amount: 25, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-e")!, amount: 41, unit: "mg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "vit-b12")!, amount: 30, unit: "mcg" },
      { nutrient: NUTRIENTS_DATABASE.find(n => n.id === "zinc")!, amount: 8, unit: "mg" },
      // ... 等等，一个综合维生素可能含20+种营养素
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
    category: "SINGLE_VITAMIN",
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
    category: "OMEGA",
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
    category: "MINERAL",
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
    category: "PROTEIN",
    ingredients: [
      // 含所有必需氨基酸
    ],
    dosagePerServing: "每次10g (1勺)",
    servingsPerDay: 2,
    optimalTiming: "POST_WORKOUT",
    price: 398,
    rating: 4.6,
  },

  // TODO: Cursor继续添加更多真实产品
  // - Blackmores (澳洲)
  // - Centrum (善存)
  // - Kirkland (Costco自有品牌)
  // - Optimum Nutrition (运动营养)
  // - Garden of Life (有机)
  // ... 至少100个产品
];
```

---

## Task 6: 重构左侧为产品库

### 修改 `src/components/SupplementDrawer/index.tsx`：

```typescript
// 删除现有的supplement逻辑
// 改为产品逻辑

interface ProductDrawerProps {
  products: Product[];
  language: Language;
}

export default function ProductDrawer({ products, language }: ProductDrawerProps) {
  const t = useTranslation(language);
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);

  // 品牌列表（从产品中提取）
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();

  // 筛选逻辑
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                       p.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    return matchSearch && matchBrand && matchCategory;
  });

  return (
    <div className="retro-border p-4 bg-white sticky top-6 h-full flex flex-col">
      <div className="bg-retro-yellow border-3 border-retro-black p-2 mb-4">
        <h2 className="font-black text-lg uppercase font-mono text-retro-black">
          {language === 'zh' ? '产品库' : 'PRODUCTS'}
        </h2>
      </div>

      {/* 搜索 */}
      <input
        type="text"
        placeholder={language === 'zh' ? '搜索产品或品牌...' : 'SEARCH...'}
        className="w-full px-3 py-2 border-3 border-retro-green font-mono bg-white mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 品牌筛选 */}
      <div className="mb-4 bg-retro-green/10 border-2 border-retro-green p-3 max-h-40 overflow-y-auto">
        <p className="text-xs font-bold font-mono mb-2 text-retro-black">
          [{language === 'zh' ? '品牌' : 'BRANDS'}]
        </p>
        {brands.map(brand => (
          <label key={brand} className="flex items-center gap-2 text-sm font-mono cursor-pointer mb-1 hover:bg-retro-yellow/20 p-1">
            <div
              className={`w-4 h-4 border-2 border-retro-black ${selectedBrands.includes(brand) ? 'bg-retro-yellow' : 'bg-white'}`}
              onClick={() => {
                setSelectedBrands(prev =>
                  prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                );
              }}
            >
              {selectedBrands.includes(brand) && <span className="text-xs">✓</span>}
            </div>
            <span>{brand}</span>
          </label>
        ))}
      </div>

      {/* 产品分类筛选 */}
      <div className="mb-4 bg-retro-green/10 border-2 border-retro-green p-3">
        <p className="text-xs font-bold font-mono mb-2 text-retro-black">
          [{language === 'zh' ? '分类' : 'CATEGORY'}]
        </p>
        {Object.values(ProductCategory).map(cat => (
          <label key={cat} className="flex items-center gap-2 text-xs font-mono cursor-pointer mb-1">
            <div
              className={`w-4 h-4 border-2 border-retro-black ${selectedCategories.includes(cat) ? 'bg-retro-yellow' : 'bg-white'}`}
              onClick={() => {
                setSelectedCategories(prev =>
                  prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                );
              }}
            >
              {selectedCategories.includes(cat) && <span className="text-xs">✓</span>}
            </div>
            <span>{getCategoryLabel(cat, language)}</span>
          </label>
        ))}
      </div>

      {/* 产品列表 */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredProducts.map(product => (
          <DraggableProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function DraggableProduct({ product }: { product: Product }) {
  // 拖拽逻辑...

  return (
    <div className="border-3 border-retro-green bg-white p-3 hover:bg-retro-yellow cursor-grab">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="text-xs text-retro-black/60 font-mono">{product.brand}</div>
          <h3 className="font-bold text-sm font-mono text-retro-black">{product.name}</h3>
        </div>
        {product.rating && (
          <div className="text-xs font-mono text-retro-green">
            ★ {product.rating}
          </div>
        )}
      </div>

      {/* 成分预览（显示主要营养素） */}
      <div className="text-xs font-mono text-retro-black/50">
        {product.ingredients.slice(0, 3).map((ing, i) => (
          <span key={i}>
            {ing.nutrient.commonName} {ing.amount}{ing.unit}
            {i < Math.min(2, product.ingredients.length - 1) && ' · '}
          </span>
        ))}
        {product.ingredients.length > 3 && '...'}
      </div>
    </div>
  );
}

function getCategoryLabel(cat: ProductCategory, lang: Language): string {
  const labels = {
    zh: {
      MULTIVITAMIN: "综合维生素",
      SINGLE_VITAMIN: "单一维生素",
      MINERAL: "矿物质",
      OMEGA: "Omega",
      PROTEIN: "蛋白粉",
      PROBIOTIC: "益生菌",
      HERBAL: "草本",
      SPORTS: "运动营养",
      BEAUTY: "美容",
      JOINT: "骨骼关节",
      IMMUNITY: "免疫力",
      SLEEP: "助眠",
      ENERGY: "能量",
    },
    en: {
      // 全大写...
    }
  };
  return labels[lang][cat] || cat;
}
```

---

## Task 7: 社区墙展示产品

### 修改 `src/components/CommunityWall/index.tsx`：

```typescript
// Mock数据改为产品组合
const [posts, setPosts] = useState([
  {
    id: 1,
    author: "健身达人小王",
    title: "我的增肌补剂Stack",
    products: [
      { name: "Optimum Nutrition 金标乳清蛋白粉", brand: "ON" },
      { name: "Muscletech 肌酸一水肌酸", brand: "Muscletech" },
      { name: "GNC Triple Strength 鱼油", brand: "GNC" },
      { name: "汤臣倍健 维生素D3", brand: "汤臣倍健" }
    ],
    conflicts: 0,
    likes: 152,
    forks: 43,
    timestamp: "3小时前"
  },
  // ...
]);

// 卡片中显示产品列表
<div className="mb-3 space-y-1">
  {post.products.map((product, i) => (
    <div key={i} className="text-xs font-mono text-retro-black">
      <span className="font-bold">{product.brand}</span> - {product.name}
    </div>
  ))}
</div>
```

---

## ✅ 验收标准

- [ ] 项目名称改为"真配方 / TRUE FORMULA"
- [ ] 所有emoji删除（保留✓）
- [ ] 左边是产品库（汤臣倍健钙片、Swisse鱼油等）
- [ ] 筛选可以按品牌和分类
- [ ] 筛选勾选有效
- [ ] 至少有50个真实产品
- [ ] 营养素数据库至少50种
- [ ] 社区墙展示产品组合（不是营养素）
- [ ] 每个产品显示品牌+名称+主要成分

---

**Cursor，彻底重构！用户要的是产品，不是化学课本！** 🔬
