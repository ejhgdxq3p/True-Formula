# 🎯 功能增强 - 最终细节完善

---

## Task 1: 社区日晷点击弹窗

### 新建文件：`src/components/SundialDetailModal/index.tsx`

```typescript
"use client";

import type { Sundial } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface SundialDetailModalProps {
  sundial: Sundial;
  onClose: () => void;
  onFork: () => void;
  language: Language;
}

export default function SundialDetailModal({
  sundial,
  onClose,
  onFork,
  language
}: SundialDetailModalProps) {
  const t = useTranslation(language);

  const SIZE = 400;
  const CENTER = SIZE / 2;
  const RADIUS = 150;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="retro-border bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="bg-retro-black text-retro-yellow p-4 border-b-3 border-retro-green flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <RotatingPointer />
            <div>
              <h2 className="font-black text-xl font-mono uppercase">
                {sundial.name}
              </h2>
              <p className="text-xs font-mono text-retro-yellow/70">
                {language === 'zh' ? '作者' : 'BY'}: {sundial.author}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-3xl font-bold hover:text-red-500 transition-colors"
          >
            X
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：日晷可视化 */}
          <div>
            <div className="bg-retro-green/5 border-3 border-retro-green p-6 flex items-center justify-center mb-4">
              <svg width={SIZE} height={SIZE} className="border-4 border-retro-black bg-white">
                {/* 外圈 */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="white"
                  stroke="var(--retro-green)"
                  strokeWidth="4"
                />

                {/* 刻度线 */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
                  const x1 = CENTER + (RADIUS - 12) * Math.cos(angle);
                  const y1 = CENTER + (RADIUS - 12) * Math.sin(angle);
                  const x2 = CENTER + RADIUS * Math.cos(angle);
                  const y2 = CENTER + RADIUS * Math.sin(angle);

                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--retro-black)"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* 产品分布 */}
                {sundial.timeSlots.flatMap(slot => {
                  const [h, m] = slot.time.split(':').map(Number);
                  const timeVal = h + m / 60;
                  const angle = (timeVal / 24) * 2 * Math.PI - Math.PI / 2;

                  return slot.products.map((p, idx) => {
                    const r = RADIUS * 0.7 - idx * 20;
                    const x = CENTER + r * Math.cos(angle);
                    const y = CENTER + r * Math.sin(angle);

                    return (
                      <g key={`${slot.time}-${p.productId}`}>
                        <line
                          x1={CENTER}
                          y1={CENTER}
                          x2={x}
                          y2={y}
                          stroke="var(--retro-gray)"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        <rect
                          x={x - 15}
                          y={y - 15}
                          width="30"
                          height="30"
                          fill="var(--retro-yellow)"
                          stroke="var(--retro-black)"
                          strokeWidth="3"
                        />
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-black font-mono"
                          fill="var(--retro-black)"
                        >
                          {p.product.brand.slice(0, 2)}
                        </text>
                      </g>
                    );
                  });
                })}

                <circle cx={CENTER} cy={CENTER} r="40" fill="var(--retro-black)" />
                <text
                  x={CENTER}
                  y={CENTER}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono text-sm font-bold"
                  fill="var(--retro-yellow)"
                >
                  24H
                </text>
              </svg>
            </div>

            {/* AI毒舌点评 */}
            <div className="bg-retro-yellow/20 border-3 border-retro-yellow p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h3 className="font-black text-sm font-mono uppercase text-retro-black">
                  {language === 'zh' ? 'AI 毒舌点评' : 'AI ROAST'}
                </h3>
              </div>
              <p className="text-sm font-mono text-retro-black leading-relaxed">
                {sundial.aiRoast || generateAIRoast(sundial, language)}
              </p>
            </div>

            {/* Fork按钮 */}
            <button
              onClick={onFork}
              className="retro-button w-full py-4 mt-4 font-mono font-black text-retro-black text-lg"
            >
              {language === 'zh' ? 'FORK 这个日晷' : 'FORK THIS SUNDIAL'}
            </button>
          </div>

          {/* 右侧：产品列表 */}
          <div className="space-y-4">
            <h3 className="font-black text-lg font-mono uppercase text-retro-black border-b-3 border-retro-green pb-2">
              {language === 'zh' ? '产品清单' : 'PRODUCT LIST'}
            </h3>

            {sundial.timeSlots.map((slot, i) => (
              <div key={i} className="border-3 border-retro-green bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-retro-yellow border-2 border-retro-black px-3 py-1 font-black font-mono text-retro-black">
                    {slot.time}
                  </div>
                  <span className="text-xs font-mono text-retro-black/60">
                    {slot.products.length} {language === 'zh' ? '个产品' : 'PRODUCTS'}
                  </span>
                </div>

                <div className="space-y-2">
                  {slot.products.map((p, j) => (
                    <div key={j} className="bg-retro-green/5 border-2 border-retro-green p-2">
                      <div className="text-xs font-mono text-retro-black/60">
                        {p.product.brand}
                      </div>
                      <div className="font-bold text-sm font-mono text-retro-black">
                        {p.product.name}
                      </div>
                      <div className="text-xs font-mono text-retro-green mt-1">
                        {p.dosage}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-mono text-retro-black/50 mt-2 italic">
                  {slot.reasoning}
                </div>
              </div>
            ))}

            {/* 统计信息 */}
            <div className="bg-retro-black text-retro-yellow p-4 border-3 border-retro-yellow">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-black text-2xl font-mono">
                    {sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0)}
                  </div>
                  <div className="text-xs font-mono">
                    {language === 'zh' ? '产品' : 'PRODUCTS'}
                  </div>
                </div>
                <div>
                  <div className="font-black text-2xl font-mono text-red-400">
                    {sundial.conflicts.length}
                  </div>
                  <div className="text-xs font-mono">
                    {language === 'zh' ? '冲突' : 'CONFLICTS'}
                  </div>
                </div>
                <div>
                  <div className="font-black text-2xl font-mono text-green-400">
                    {sundial.likeCount}
                  </div>
                  <div className="text-xs font-mono">
                    {language === 'zh' ? '点赞' : 'LIKES'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI毒舌点评生成器
function generateAIRoast(sundial: Sundial, language: Language): string {
  const conflicts = sundial.conflicts.length;
  const productCount = sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0);

  if (language === 'zh') {
    if (conflicts === 0 && productCount <= 5) {
      return "不错嘛，简洁高效的配方。但说实话，这么保守的搭配我闭着眼睛都能设计出来。";
    } else if (conflicts === 0 && productCount > 5) {
      return "啧啧，居然真的0冲突？看来你在这上面下了功夫。不过产品有点多，钱包还好吗？";
    } else if (conflicts > 0 && conflicts <= 2) {
      return `有${conflicts}个冲突但还能抢救。建议：别瞎吃，听AI的把时间调开。现在这样吃纯属浪费。`;
    } else {
      return `${conflicts}个冲突？你这是补剂还是化学实验？建议从头来过，让AI帮你重新规划。`;
    }
  } else {
    if (conflicts === 0 && productCount <= 5) {
      return "Clean stack. Simple. Boring. But hey, at least you won't poison yourself.";
    } else if (conflicts === 0 && productCount > 5) {
      return "Zero conflicts? Impressive. But that's a lot of pills. Your liver doing okay?";
    } else if (conflicts > 0 && conflicts <= 2) {
      return `${conflicts} conflicts detected. Not terrible, but needs work. Let AI fix your timing.`;
    } else {
      return `${conflicts} conflicts. Is this a supplement stack or a chemistry disaster? Start over.`;
    }
  }
}
```

### 修改 CommunityWall 添加点击事件：

```typescript
const [selectedSundial, setSelectedSundial] = useState<Sundial | null>(null);

// 卡片添加点击
<div
  onClick={() => setSelectedSundial(sundial)}
  className="border-3 border-retro-green bg-white p-4 cursor-pointer hover:bg-retro-yellow/10 transition-colors"
>
  {/* ... */}
</div>

// Modal
{selectedSundial && (
  <SundialDetailModal
    sundial={selectedSundial}
    onClose={() => setSelectedSundial(null)}
    onFork={() => {
      handleForkSundial(selectedSundial);
      setSelectedSundial(null);
    }}
    language={language}
  />
)}
```

---

## Task 2: 博主分析支持视频+文字

### 修改 `src/components/InfluencerPanel/index.tsx`：

```typescript
const [inputMode, setInputMode] = useState<'text' | 'video'>('text');
const [videoUrl, setVideoUrl] = useState("");

return (
  <div className="retro-border p-4 bg-white h-full flex flex-col">
    {/* 标题 */}
    <div className="bg-retro-yellow border-3 border-retro-black p-2 mb-4">
      <h2 className="font-black text-lg uppercase font-mono text-retro-black flex items-center gap-2">
        <RotatingPointer />
        {language === 'zh' ? '博主推荐' : 'INFLUENCER'}
      </h2>
    </div>

    {/* 模式切换 */}
    <div className="flex gap-2 mb-3">
      <button
        onClick={() => setInputMode('text')}
        className={`flex-1 py-2 font-mono font-bold border-2 border-retro-black ${
          inputMode === 'text'
            ? 'bg-retro-yellow text-retro-black'
            : 'bg-white text-retro-black hover:bg-gray-100'
        }`}
      >
        {language === 'zh' ? '文字' : 'TEXT'}
      </button>
      <button
        onClick={() => setInputMode('video')}
        className={`flex-1 py-2 font-mono font-bold border-2 border-retro-black ${
          inputMode === 'video'
            ? 'bg-retro-yellow text-retro-black'
            : 'bg-white text-retro-black hover:bg-gray-100'
        }`}
      >
        {language === 'zh' ? '视频' : 'VIDEO'}
      </button>
    </div>

    {/* 输入区 - 文字模式 */}
    {inputMode === 'text' && (
      <textarea
        className="w-full h-32 p-3 border-3 border-retro-green font-mono text-sm bg-white mb-3 resize-none text-retro-black placeholder:text-retro-gray/50"
        placeholder={language === 'zh' ? '粘贴博主推荐文字...' : 'PASTE CONTENT...'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    )}

    {/* 输入区 - 视频模式 */}
    {inputMode === 'video' && (
      <div className="space-y-3 mb-3">
        <input
          type="text"
          className="w-full p-3 border-3 border-retro-green font-mono text-sm bg-white text-retro-black placeholder:text-retro-gray/50"
          placeholder={language === 'zh' ? '粘贴视频链接 (YouTube/B站/抖音)...' : 'PASTE VIDEO URL...'}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <div className="text-xs font-mono text-retro-black/50 bg-retro-green/10 p-2 border-2 border-retro-green">
          {language === 'zh' ? '支持' : 'SUPPORTED'}: YouTube, Bilibili, Douyin, Xiaohongshu
        </div>
      </div>
    )}

    {/* 分析按钮 */}
    <button
      onClick={handleAnalyze}
      disabled={loading || (inputMode === 'text' ? !input.trim() : !videoUrl.trim())}
      className="retro-button w-full py-3 mb-4 font-mono font-black text-retro-black disabled:opacity-50"
    >
      {loading
        ? (language === 'zh' ? 'AI分析中...' : 'ANALYZING...')
        : (language === 'zh' ? 'AI分析' : 'AI ANALYZE')
      }
    </button>

    {/* 其余部分保持不变 */}
  </div>
);
```

---

## Task 3: MyList改进 - 总结式冲突检测

### 修改 `src/components/MyList/index.tsx`：

```typescript
export default function MyList({
  products,
  conflicts,
  onAddProduct,
  onRemoveProduct,
  language
}: MyListProps) {
  const t = useTranslation(language);

  // 计算总体冲突状态
  const hasConflicts = conflicts.length > 0;
  const conflictPairs = conflicts.map(c => [c.productAId, c.productBId]);

  return (
    <div className="retro-border p-4 bg-white h-full flex flex-col">
      {/* 标题 */}
      <div className="bg-retro-yellow border-3 border-retro-black p-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotatingPointer />
          <h2 className="font-black text-lg uppercase font-mono text-retro-black">
            MY LIST
          </h2>
        </div>
        <span className="text-xs font-mono text-retro-black">
          {products.length} {language === 'zh' ? '个' : 'ITEMS'}
        </span>
      </div>

      {/* 加产品按钮 */}
      <button
        onClick={onAddProduct}
        className="retro-button w-full py-3 mb-4 font-mono font-black text-retro-black"
      >
        + {language === 'zh' ? '加产品' : 'ADD PRODUCT'}
      </button>

      {/* 产品列表（简洁版，不显示单个冲突） */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {products.length === 0 ? (
          <div className="text-center py-10 text-retro-black/50 font-mono text-xs">
            [{language === 'zh' ? '还没有产品' : 'NO PRODUCTS YET'}]
          </div>
        ) : (
          products.map((item) => (
            <div
              key={item.productId}
              className="border-2 border-retro-green bg-white p-3 hover:bg-retro-green/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs font-mono text-retro-black/60">
                    {item.product.brand}
                  </div>
                  <h3 className="font-bold text-sm font-mono text-retro-black">
                    {item.product.name}
                  </h3>
                  <div className="text-xs font-mono text-retro-black/50 mt-1">
                    {item.product.ingredients.slice(0, 2).map((ing, i) => (
                      <span key={i}>
                        {ing.nutrient.commonName}
                        {i < Math.min(1, item.product.ingredients.length - 1) && ' · '}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveProduct(item.productId)}
                  className="w-6 h-6 bg-retro-black text-white font-bold hover:bg-red-500 flex items-center justify-center text-xs"
                >
                  X
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 底部总结 - 冲突检测 */}
      {products.length > 0 && (
        <div className={`border-3 p-4 ${
          hasConflicts
            ? 'border-red-500 bg-red-50'
            : 'border-retro-green bg-retro-green/5'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">
              {hasConflicts ? '⚠' : '✓'}
            </span>
            <h3 className="font-black text-sm font-mono uppercase text-retro-black">
              {language === 'zh' ? '成分检测' : 'INGREDIENT CHECK'}
            </h3>
          </div>

          {hasConflicts ? (
            <div>
              <div className="text-sm font-bold font-mono text-red-600 mb-2">
                {language === 'zh'
                  ? `发现 ${conflicts.length} 个营养素冲突`
                  : `${conflicts.length} CONFLICTS DETECTED`
                }
              </div>
              <div className="text-xs font-mono text-retro-black/70 mb-3">
                {conflicts.slice(0, 2).map((c, i) => (
                  <div key={i}>
                    · {getNutrientName(c.nutrientA)} × {getNutrientName(c.nutrientB)}
                  </div>
                ))}
                {conflicts.length > 2 && (
                  <div className="text-retro-black/50">
                    ...{language === 'zh' ? '还有' : 'AND'} {conflicts.length - 2} {language === 'zh' ? '个' : 'MORE'}
                  </div>
                )}
              </div>
              <div className="text-xs font-mono text-red-700 font-bold">
                {language === 'zh'
                  ? '→ 需要日晷优化调整时间'
                  : '→ NEEDS SUNDIAL OPTIMIZATION'}
              </div>
            </div>
          ) : (
            <div className="text-sm font-mono text-retro-green font-bold">
              {language === 'zh'
                ? '所有成分安全，无冲突'
                : 'ALL INGREDIENTS SAFE'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getNutrientName(nutrientId: string): string {
  // TODO: 从数据库查询营养素名称
  return nutrientId;
}
```

---

## Task 4: 添加日常食材和健康饮食

### 修改 `src/types/product.ts` 添加新分类：

```typescript
export enum ProductCategory {
  // 原有分类...
  MULTIVITAMIN = "MULTIVITAMIN",
  SINGLE_VITAMIN = "SINGLE_VITAMIN",
  // ...

  // 新增：日常食材
  FOOD_MEAT = "FOOD_MEAT",           // 肉类
  FOOD_EGG = "FOOD_EGG",             // 蛋类
  FOOD_VEGETABLE = "FOOD_VEGETABLE", // 蔬菜
  FOOD_ORGAN = "FOOD_ORGAN",         // 内脏

  // 新增：健康饮品
  BEVERAGE_TEA = "BEVERAGE_TEA",     // 茶类
  BEVERAGE_SOY = "BEVERAGE_SOY",     // 豆制品饮料
  BEVERAGE_JUICE = "BEVERAGE_JUICE", // 果汁
  BEVERAGE_OTHER = "BEVERAGE_OTHER", // 其他饮品
}
```

### 扩展 `src/data/products.ts`：

```typescript
export const PRODUCTS_DATABASE: Product[] = [
  // ...原有补剂产品

  // === 日常食材 ===
  {
    id: "food-beef-liver",
    name: "牛肝",
    brand: "日常食材",
    category: "FOOD_ORGAN",
    ingredients: [
      { nutrient: NUTRIENTS.find(n => n.id === "vit-a")!, amount: 16899, unit: "mcg", percentDV: 1877 },
      { nutrient: NUTRIENTS.find(n => n.id === "vit-b12")!, amount: 111, unit: "mcg", percentDV: 4625 },
      { nutrient: NUTRIENTS.find(n => n.id === "iron")!, amount: 6.5, unit: "mg", percentDV: 36 },
      { nutrient: NUTRIENTS.find(n => n.id === "copper")!, amount: 12, unit: "mg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "food-egg",
    name: "鸡蛋",
    brand: "日常食材",
    category: "FOOD_EGG",
    ingredients: [
      { nutrient: NUTRIENTS.find(n => n.id === "vit-b12")!, amount: 1.3, unit: "mcg" },
      { nutrient: NUTRIENTS.find(n => n.id === "vit-d3")!, amount: 2, unit: "mcg" },
      { nutrient: NUTRIENTS.find(n => n.id === "selenium")!, amount: 31, unit: "mcg" },
    ],
    dosagePerServing: "1个 (50g)",
    servingsPerDay: 2,
    optimalTiming: "MORNING_WITH_FOOD",
  },
  {
    id: "food-spinach",
    name: "菠菜",
    brand: "日常食材",
    category: "FOOD_VEGETABLE",
    ingredients: [
      { nutrient: NUTRIENTS.find(n => n.id === "vit-k1")!, amount: 483, unit: "mcg" },
      { nutrient: NUTRIENTS.find(n => n.id === "vit-a")!, amount: 469, unit: "mcg" },
      { nutrient: NUTRIENTS.find(n => n.id === "iron")!, amount: 2.7, unit: "mg" },
      { nutrient: NUTRIENTS.find(n => n.id === "magnesium")!, amount: 79, unit: "mg" },
    ],
    dosagePerServing: "100g",
    servingsPerDay: 1,
    optimalTiming: "AFTERNOON",
  },
  {
    id: "food-salmon",
    name: "三文鱼",
    brand: "日常食材",
    category: "FOOD_MEAT",
    ingredients: [
      { nutrient: NUTRIENTS.find(n => n.id === "epa")!, amount: 862, unit: "mg" },
      { nutrient: NUTRIENTS.find(n => n.id === "dha")!, amount: 1104, unit: "mg" },
      { nutrient: NUTRIENTS.find(n => n.id === "vit-b12")!, amount: 3.2, unit: "mcg" },
      { nutrient: NUTRIENTS.find(n => n.id === "vit-d3")!, amount: 11, unit: "mcg" },
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
    category: "BEVERAGE_SOY",
    ingredients: [
      { nutrient: NUTRIENTS.find(n => n.id === "calcium")!, amount: 25, unit: "mg" },
      { nutrient: NUTRIENTS.find(n => n.id === "magnesium")!, amount: 25, unit: "mg" },
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
    category: "BEVERAGE_TEA",
    ingredients: [
      { nutrient: NUTRIENTS.find(n => n.id === "green-tea")!, amount: 200, unit: "mg" }, // EGCG
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
    category: "BEVERAGE_TEA",
    ingredients: [
      { nutrient: NUTRIENTS.find(n => n.id === "green-tea")!, amount: 500, unit: "mg" },
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
    category: "BEVERAGE_OTHER",
    ingredients: [
      // 咖啡因、抗氧化剂
    ],
    dosagePerServing: "250ml",
    servingsPerDay: 2,
    optimalTiming: "MORNING",
  },

  // TODO: 继续添加更多食材和饮品
  // - 牛奶、酸奶
  // - 各种肉类（鸡胸肉、牛肉）
  // - 各种蔬菜（西蓝花、胡萝卜）
  // - 坚果类（核桃、杏仁）
  // - 水果（蓝莓、橙子）
];
```

### 更新分类标签：

```typescript
function getCategoryLabel(cat: ProductCategory, lang: Language): string {
  const labels = {
    zh: {
      // ...原有
      FOOD_MEAT: "肉类",
      FOOD_EGG: "蛋类",
      FOOD_VEGETABLE: "蔬菜",
      FOOD_ORGAN: "内脏",
      BEVERAGE_TEA: "茶类",
      BEVERAGE_SOY: "豆制品",
      BEVERAGE_JUICE: "果汁",
      BEVERAGE_OTHER: "其他饮品",
    },
    en: {
      // ...
      FOOD_MEAT: "MEAT",
      FOOD_EGG: "EGG",
      FOOD_VEGETABLE: "VEGETABLE",
      FOOD_ORGAN: "ORGAN",
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

## Task 5: 更新 Sundial 类型添加 aiRoast

### 修改 `src/types/product.ts`：

```typescript
export interface Sundial {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  author?: string;  // 添加作者字段

  timeSlots: SundialSlot[];
  conflicts: Conflict[];
  synergies: Synergy[];

  // AI毒舌点评
  aiRoast?: string;

  optimizedAt: Date;
  isPublic: boolean;
  forkCount: number;
  likeCount: number;
}
```

---

## ✅ 验收标准

- [ ] 点击社区日晷卡片 → 弹出详情Modal
- [ ] Modal显示完整日晷可视化
- [ ] Modal右侧列出所有产品（按时间分组）
- [ ] Modal有AI毒舌点评（不是重复时间线）
- [ ] 点评根据冲突数量和产品数量变化
- [ ] 博主分析面板有"文字/视频"切换按钮
- [ ] 视频模式可以粘贴视频链接
- [ ] MyList不再单独显示每个产品的冲突
- [ ] MyList底部有总结框：显示总冲突数
- [ ] 有冲突时提示"需要日晷优化"
- [ ] 产品库包含日常食材（肉蛋菜内脏）
- [ ] 产品库包含健康饮品（豆浆、绿茶、咖啡等）
- [ ] 分类筛选包含新的食材和饮品分类

---

**Cursor，完成这些最终细节！** 🎯
