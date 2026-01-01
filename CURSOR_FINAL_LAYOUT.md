# 🎯 终极布局 - MyList + 日晷 + 博主分析

> **核心概念：以日晷为单位管理和分享**

---

## 📐 最终布局

```
┌─────────────────────────────────────────────────────────────┐
│  Header: 真配方 TRUE FORMULA                                 │
├───────────────┬─────────────────────┬────────────────────────┤
│               │                     │                        │
│   MyList      │      日晷            │   博主视频分析          │
│   我的产品     │   (AI智能排程)       │   (产品推荐来源)        │
│               │                     │                        │
│  [+ 加产品]   │   00:00 ─ 24:00     │  [粘贴视频/文本]       │
│               │    ╱       ╲        │                        │
│  产品1        │   ◉ 产品A   ◉       │  [AI分析] →            │
│  ⚠ 与产品2冲突│    ╲       ╱        │                        │
│               │     ◉ 产品B         │  发现产品：            │
│  产品2        │                     │  □ 产品X               │
│  ✓ 安全       │   [AI重新规划中...] │  □ 产品Y               │
│               │    (2D动画)         │  □ 产品Z               │
│  产品3        │                     │                        │
│               │   调整时间:          │  [采用全部]            │
│               │   08:00 - 产品A     │                        │
│               │   12:00 - 产品B     │                        │
│               │   22:00 - 产品C     │                        │
│               │                     │                        │
├───────────────┴─────────────────────┴────────────────────────┤
│  社区日晷墙 - 其他用户的完整日晷配置                            │
│  [日晷1] [日晷2] [日晷3] → 点击Fork整个日晷                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Task 1: 更新数据模型

### 修改 `src/types/product.ts`：

```typescript
/**
 * MyList - 用户手上的产品清单
 */
export interface MyList {
  id: string;
  userId?: string;
  products: MyListProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MyListProduct {
  productId: string;
  product: Product;
  addedAt: Date;
  notes?: string;  // 用户备注
}

/**
 * 日晷 - 用户的实际排程（以此为单位分享）
 */
export interface Sundial {
  id: string;
  userId?: string;
  name: string;              // "我的增肌方案"
  description?: string;

  // 产品在时间线上的分布
  timeSlots: SundialSlot[];

  // 检测结果
  conflicts: Conflict[];
  synergies: Synergy[];

  // 元数据
  optimizedAt: Date;         // 最后一次AI优化时间
  isPublic: boolean;         // 是否公开到社区
  forkCount: number;
  likeCount: number;
}

export interface SundialSlot {
  time: string;              // "08:00"
  products: {
    productId: string;
    product: Product;
    dosage: string;          // "按推荐量"
  }[];
  reasoning: string;         // "早餐时段，脂溶性维生素吸收最佳"
}

/**
 * 博主分析结果
 */
export interface InfluencerAnalysis {
  id: string;
  sourceUrl?: string;
  sourceText: string;
  analyzedAt: Date;

  // AI识别出的产品推荐
  recommendedProducts: {
    productName: string;
    brand?: string;
    dosage?: string;
    timing?: string;
    reasoning?: string;
    confidence: number;      // 0-1，识别置信度

    // 匹配到数据库的产品（可能为空）
    matchedProduct?: Product;
  }[];

  credibilityScore: number;
  warnings: string[];
}
```

---

## Task 2: 左栏 - MyList组件

### 新建文件：`src/components/MyList/index.tsx`

```typescript
"use client";

import { useState } from "react";
import type { Product, MyListProduct } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface MyListProps {
  products: MyListProduct[];
  conflicts: any[];  // 冲突检测结果
  onAddProduct: () => void;
  onRemoveProduct: (productId: string) => void;
  language: Language;
}

export default function MyList({
  products,
  conflicts,
  onAddProduct,
  onRemoveProduct,
  language
}: MyListProps) {
  const t = useTranslation(language);

  return (
    <div className="retro-border p-4 bg-white h-full flex flex-col">
      {/* 标题 */}
      <div className="bg-retro-yellow border-3 border-retro-black p-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotatingPointer />
          <h2 className="font-black text-lg uppercase font-mono text-retro-black">
            {language === 'zh' ? 'MY LIST' : 'MY LIST'}
          </h2>
        </div>
        <span className="text-xs font-mono text-retro-black">
          {products.length} {language === 'zh' ? '个产品' : 'ITEMS'}
        </span>
      </div>

      {/* 加产品按钮 */}
      <button
        onClick={onAddProduct}
        className="retro-button w-full py-3 mb-4 font-mono font-black text-retro-black"
      >
        + {language === 'zh' ? '加产品' : 'ADD PRODUCT'}
      </button>

      {/* 产品列表 */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-10 text-retro-black/50 font-mono text-xs">
            [{language === 'zh' ? '还没有产品' : 'NO PRODUCTS YET'}]
          </div>
        ) : (
          products.map((item) => {
            // 检查这个产品是否有冲突
            const productConflicts = conflicts.filter(c =>
              c.productAId === item.productId || c.productBId === item.productId
            );

            return (
              <div
                key={item.productId}
                className={`border-3 p-3 ${
                  productConflicts.length > 0
                    ? 'border-red-500 bg-red-50'
                    : 'border-retro-green bg-white'
                }`}
              >
                {/* 产品信息 */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-mono text-retro-black/60">
                      {item.product.brand}
                    </div>
                    <h3 className="font-bold text-sm font-mono text-retro-black">
                      {item.product.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => onRemoveProduct(item.productId)}
                    className="w-6 h-6 bg-retro-black text-white font-bold hover:bg-red-500"
                  >
                    X
                  </button>
                </div>

                {/* 主要成分预览 */}
                <div className="text-xs font-mono text-retro-black/50 mb-2">
                  {item.product.ingredients.slice(0, 2).map((ing, i) => (
                    <span key={i}>
                      {ing.nutrient.commonName}
                      {i < Math.min(1, item.product.ingredients.length - 1) && ' · '}
                    </span>
                  ))}
                  {item.product.ingredients.length > 2 && '...'}
                </div>

                {/* 冲突警告 */}
                {productConflicts.length > 0 && (
                  <div className="bg-red-500 text-white p-2 mt-2 font-mono text-xs">
                    <div className="font-bold mb-1">
                      ! {language === 'zh' ? '检测到冲突' : 'CONFLICT DETECTED'}
                    </div>
                    {productConflicts.map((c, i) => (
                      <div key={i} className="text-xs">
                        {language === 'zh'
                          ? `与 ${getProductName(c.productAId === item.productId ? c.productBId : c.productAId, products)} 冲突`
                          : `WITH ${getProductName(c.productAId === item.productId ? c.productBId : c.productAId, products)}`
                        }
                      </div>
                    ))}
                    <div className="text-xs mt-1 text-red-100">
                      {language === 'zh' ? '可通过调整服用时间规避' : 'CAN BE RESOLVED BY TIMING'}
                    </div>
                  </div>
                )}

                {/* 安全标记 */}
                {productConflicts.length === 0 && products.length > 1 && (
                  <div className="text-retro-green text-xs font-mono font-bold mt-2">
                    ✓ {language === 'zh' ? '安全' : 'SAFE'}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// 辅助函数
function getProductName(productId: string, products: MyListProduct[]): string {
  const product = products.find(p => p.productId === productId);
  return product?.product.name || productId;
}
```

---

## Task 3: 中间 - 日晷组件（带AI动画）

### 修改 `src/components/Sundial.tsx`：

```typescript
"use client";

import { useState, useEffect } from "react";
import type { Sundial as SundialType, SundialSlot } from "@/types/product";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";

interface SundialProps {
  sundial: SundialType | null;
  isOptimizing: boolean;  // AI正在规划
  language: Language;
}

export function Sundial({ sundial, isOptimizing, language }: SundialProps) {
  const t = useTranslation(language);
  const SIZE = 500;
  const CENTER = SIZE / 2;
  const RADIUS = 180;

  return (
    <div className="retro-border p-6 bg-white h-full flex flex-col">
      {/* 标题 */}
      <div className="bg-retro-black text-retro-yellow p-3 mb-6 text-center border-3 border-retro-yellow">
        <h2 className="font-black text-xl font-mono uppercase flex items-center justify-center gap-3">
          <RotatingPointer />
          {language === 'zh' ? '我的日晷' : 'MY SUNDIAL'}
          <RotatingPointer />
        </h2>
        {sundial && (
          <p className="text-xs mt-1 font-mono text-retro-yellow/80">
            {language === 'zh' ? '最后优化' : 'LAST OPTIMIZED'}: {new Date(sundial.optimizedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* AI优化动画 */}
      {isOptimizing && (
        <div className="absolute inset-0 bg-retro-green/20 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-retro-black border-4 border-retro-yellow p-8 text-center">
            <div className="text-6xl mb-4 animate-spin">⚙</div>
            <div className="font-black text-2xl font-mono text-retro-yellow mb-2">
              AI {language === 'zh' ? '优化中' : 'OPTIMIZING'}
            </div>
            <div className="text-sm font-mono text-retro-yellow/80">
              {language === 'zh' ? '分析营养素冲突...' : 'ANALYZING CONFLICTS...'}
            </div>
            <div className="text-sm font-mono text-retro-yellow/80">
              {language === 'zh' ? '计算最佳时间...' : 'CALCULATING OPTIMAL TIMING...'}
            </div>
          </div>
        </div>
      )}

      {/* 日晷可视化 */}
      <div className="flex-1 flex items-center justify-center bg-retro-green/5 border-2 border-retro-green">
        {!sundial || sundial.timeSlots.length === 0 ? (
          <div className="text-center font-mono text-retro-black/50">
            <div className="text-4xl mb-4">○</div>
            <div className="text-sm">
              [{language === 'zh' ? '从左边加产品开始' : 'ADD PRODUCTS TO START'}]
            </div>
          </div>
        ) : (
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
              const x1 = CENTER + (RADIUS - 15) * Math.cos(angle);
              const y1 = CENTER + (RADIUS - 15) * Math.sin(angle);
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

            {/* 时间标签 */}
            {[0, 6, 12, 18].map((hour) => {
              const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
              const x = CENTER + (RADIUS + 35) * Math.cos(angle);
              const y = CENTER + (RADIUS + 35) * Math.sin(angle);

              return (
                <g key={hour}>
                  <rect
                    x={x - 20}
                    y={y - 12}
                    width="40"
                    height="24"
                    fill="var(--retro-yellow)"
                    stroke="var(--retro-black)"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono font-black text-sm"
                    fill="var(--retro-black)"
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </text>
                </g>
              );
            })}

            {/* 产品分布 */}
            {sundial.timeSlots.flatMap(slot => {
              const [h, m] = slot.time.split(':').map(Number);
              const timeVal = h + m / 60;
              const angle = (timeVal / 24) * 2 * Math.PI - Math.PI / 2;

              return slot.products.map((p, idx) => {
                const r = RADIUS * 0.7 - idx * 25;
                const x = CENTER + r * Math.cos(angle);
                const y = CENTER + r * Math.sin(angle);

                return (
                  <g key={`${slot.time}-${p.productId}`}>
                    {/* 连线 */}
                    <line
                      x1={CENTER}
                      y1={CENTER}
                      x2={x}
                      y2={y}
                      stroke="var(--retro-gray)"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />

                    {/* 产品方块 */}
                    <rect
                      x={x - 20}
                      y={y - 20}
                      width="40"
                      height="40"
                      fill="var(--retro-yellow)"
                      stroke="var(--retro-black)"
                      strokeWidth="3"
                    />
                    <rect
                      x={x - 17}
                      y={y - 17}
                      width="34"
                      height="34"
                      fill="white"
                      stroke="var(--retro-green)"
                      strokeWidth="2"
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

            {/* 中心 */}
            <circle cx={CENTER} cy={CENTER} r="50" fill="var(--retro-black)" />
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
        )}
      </div>

      {/* 时间线列表 */}
      {sundial && sundial.timeSlots.length > 0 && (
        <div className="mt-6 space-y-2 max-h-40 overflow-y-auto">
          <h3 className="font-bold text-sm font-mono text-retro-black mb-2 border-b-2 border-retro-green pb-1">
            {language === 'zh' ? '时间线' : 'TIMELINE'}
          </h3>
          {sundial.timeSlots.map((slot, i) => (
            <div key={i} className="flex gap-3 text-xs font-mono">
              <span className="font-black text-retro-green w-12">{slot.time}</span>
              <div className="flex-1">
                {slot.products.map((p, j) => (
                  <div key={j} className="text-retro-black">
                    {p.product.brand} - {p.product.name.slice(0, 20)}...
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Task 4: 右栏 - 博主视频分析面板

### 新建文件：`src/components/InfluencerPanel/index.tsx`

```typescript
"use client";

import { useState } from "react";
import type { InfluencerAnalysis, Product } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface InfluencerPanelProps {
  onAdoptProducts: (products: Product[]) => void;
  language: Language;
}

export default function InfluencerPanel({ onAdoptProducts, language }: InfluencerPanelProps) {
  const t = useTranslation(language);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InfluencerAnalysis | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-influencer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setAnalysis(data.data);
      // 默认全选
      setSelectedProducts(data.data.recommendedProducts.map((p: any, i: number) => i.toString()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptAll = () => {
    const productsToAdopt = analysis!.recommendedProducts
      .filter((_, i) => selectedProducts.includes(i.toString()))
      .map(rp => rp.matchedProduct!)
      .filter(Boolean);

    onAdoptProducts(productsToAdopt);
  };

  return (
    <div className="retro-border p-4 bg-white h-full flex flex-col">
      {/* 标题 */}
      <div className="bg-retro-yellow border-3 border-retro-black p-2 mb-4">
        <h2 className="font-black text-lg uppercase font-mono text-retro-black flex items-center gap-2">
          <RotatingPointer />
          {language === 'zh' ? '博主推荐' : 'INFLUENCER'}
        </h2>
      </div>

      {/* 输入区 */}
      <textarea
        className="w-full h-32 p-3 border-3 border-retro-green font-mono text-sm bg-white mb-3 resize-none text-retro-black placeholder:text-retro-gray/50"
        placeholder={language === 'zh' ? '粘贴博主推荐文字...' : 'PASTE INFLUENCER CONTENT...'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !input.trim()}
        className="retro-button w-full py-3 mb-4 font-mono font-black text-retro-black disabled:opacity-50"
      >
        {loading
          ? (language === 'zh' ? 'AI分析中...' : 'ANALYZING...')
          : (language === 'zh' ? 'AI分析' : 'AI ANALYZE')
        }
      </button>

      {/* 分析结果 */}
      {analysis && (
        <div className="flex-1 overflow-y-auto space-y-3">
          <div className="bg-retro-green/10 border-2 border-retro-green p-3">
            <div className="text-xs font-mono text-retro-black mb-2">
              {language === 'zh' ? '可信度' : 'CREDIBILITY'}: {analysis.credibilityScore}/100
            </div>
            {analysis.warnings.length > 0 && (
              <div className="text-xs font-mono text-red-500">
                ! {analysis.warnings[0]}
              </div>
            )}
          </div>

          <div className="font-bold text-sm font-mono text-retro-black mb-2">
            {language === 'zh' ? '发现产品' : 'FOUND PRODUCTS'}:
          </div>

          {analysis.recommendedProducts.map((rp, i) => (
            <div
              key={i}
              className={`border-3 p-3 cursor-pointer ${
                selectedProducts.includes(i.toString())
                  ? 'border-retro-yellow bg-retro-yellow/10'
                  : 'border-retro-green bg-white'
              }`}
              onClick={() => {
                setSelectedProducts(prev =>
                  prev.includes(i.toString())
                    ? prev.filter(id => id !== i.toString())
                    : [...prev, i.toString()]
                );
              }}
            >
              <div className="flex items-start gap-2">
                <div className={`w-4 h-4 border-2 border-retro-black mt-0.5 ${
                  selectedProducts.includes(i.toString()) ? 'bg-retro-yellow' : 'bg-white'
                }`}>
                  {selectedProducts.includes(i.toString()) && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm font-mono text-retro-black">
                    {rp.productName}
                  </div>
                  {rp.brand && (
                    <div className="text-xs font-mono text-retro-black/60">
                      {rp.brand}
                    </div>
                  )}
                  {rp.dosage && (
                    <div className="text-xs font-mono text-retro-green mt-1">
                      {rp.dosage}
                    </div>
                  )}
                  {!rp.matchedProduct && (
                    <div className="text-xs font-mono text-red-500 mt-1">
                      ! {language === 'zh' ? '数据库中未找到' : 'NOT IN DATABASE'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAdoptAll}
            className="retro-button w-full py-3 font-mono font-black text-retro-black"
          >
            {language === 'zh' ? '采用选中产品' : 'ADOPT SELECTED'} ({selectedProducts.length})
          </button>
        </div>
      )}

      {!analysis && !loading && (
        <div className="flex-1 flex items-center justify-center text-center font-mono text-xs text-retro-black/50">
          [{language === 'zh' ? '粘贴博主内容开始分析' : 'PASTE CONTENT TO START'}]
        </div>
      )}
    </div>
  );
}
```

---

## Task 5: 社区日晷墙

### 修改 `src/components/CommunityWall/index.tsx`：

```typescript
// 数据改为日晷
const [sundials, setSundials] = useState([
  {
    id: "sundial-1",
    author: "健身达人小王",
    name: "增肌补剂日晷",
    description: "适合健身人群",
    timeSlots: [
      { time: "07:00", productCount: 2 },
      { time: "14:00", productCount: 1 },
      { time: "20:00", productCount: 3 },
    ],
    conflicts: 0,
    likes: 152,
    forks: 43,
    createdAt: "2024-01-15"
  },
  // ...
]);

// 卡片显示日晷预览
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {sundials.map(sundial => (
    <div key={sundial.id} className="border-3 border-retro-green bg-white p-4">
      <h3 className="font-black text-lg font-mono mb-2 bg-retro-black text-retro-yellow px-2 py-1">
        {sundial.name}
      </h3>

      {/* 日晷缩略图 */}
      <div className="h-32 bg-retro-green/5 border-2 border-retro-green mb-3 flex items-center justify-center">
        <svg width="120" height="120">
          <circle cx="60" cy="60" r="50" fill="white" stroke="#009640" strokeWidth="2" />
          {sundial.timeSlots.map((slot, i) => {
            const [h] = slot.time.split(':').map(Number);
            const angle = (h / 24) * 2 * Math.PI - Math.PI / 2;
            const x = 60 + 35 * Math.cos(angle);
            const y = 60 + 35 * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="5" fill="#FDE700" stroke="#0F380F" strokeWidth="1" />;
          })}
        </svg>
      </div>

      <div className="text-xs font-mono text-retro-black mb-3">
        {sundial.timeSlots.length} 个时间点 · {sundial.timeSlots.reduce((sum, s) => sum + s.productCount, 0)} 个产品
      </div>

      <button
        onClick={() => handleForkSundial(sundial.id)}
        className="retro-button w-full py-2 text-sm font-mono font-black text-retro-black"
      >
        {language === 'zh' ? 'FORK 此日晷' : 'FORK THIS SUNDIAL'}
      </button>
    </div>
  ))}
</div>
```

---

## Task 6: 主页整合

### 修改 `src/app/page.tsx`：

```typescript
export default function Home() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [myList, setMyList] = useState<MyListProduct[]>([]);
  const [sundial, setSundial] = useState<SundialType | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showProductLibrary, setShowProductLibrary] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);

  // 加产品到MyList
  const handleAddProduct = (product: Product) => {
    const newItem: MyListProduct = {
      productId: product.id,
      product,
      addedAt: new Date(),
    };
    setMyList(prev => [...prev, newItem]);

    // 触发AI重新规划
    triggerOptimization([...myList, newItem]);
  };

  // AI重新规划日晷
  const triggerOptimization = async (products: MyListProduct[]) => {
    setIsOptimizing(true);

    // 模拟AI计算（实际调用API）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 调用API生成日晷
    const res = await fetch('/api/optimize-sundial', {
      method: 'POST',
      body: JSON.stringify({ products }),
    });
    const data = await res.json();

    setSundial(data.sundial);
    setConflicts(data.conflicts);
    setIsOptimizing(false);
  };

  // 从博主推荐采用产品
  const handleAdoptProducts = (products: Product[]) => {
    const newItems = products.map(p => ({
      productId: p.id,
      product: p,
      addedAt: new Date(),
    }));

    setMyList(prev => [...prev, ...newItems]);
    triggerOptimization([...myList, ...newItems]);
  };

  return (
    <main className="min-h-screen bg-grid-pattern">
      {/* Header */}
      <header className="border-b-4 border-retro-black bg-retro-yellow px-6 py-4">
        <h1 className="text-2xl font-black text-retro-black uppercase font-mono">
          真配方 TRUE FORMULA
        </h1>
      </header>

      {/* 3栏布局 */}
      <div className="max-w-[1800px] mx-auto p-6 grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">

        {/* 左：MyList */}
        <div className="col-span-3">
          <MyList
            products={myList}
            conflicts={conflicts}
            onAddProduct={() => setShowProductLibrary(true)}
            onRemoveProduct={(id) => {
              const newList = myList.filter(p => p.productId !== id);
              setMyList(newList);
              triggerOptimization(newList);
            }}
            language={language}
          />
        </div>

        {/* 中：日晷 */}
        <div className="col-span-6">
          <Sundial
            sundial={sundial}
            isOptimizing={isOptimizing}
            language={language}
          />
        </div>

        {/* 右：博主分析 */}
        <div className="col-span-3">
          <InfluencerPanel
            onAdoptProducts={handleAdoptProducts}
            language={language}
          />
        </div>
      </div>

      {/* 社区日晷墙 */}
      <div className="max-w-[1800px] mx-auto px-6 pb-12">
        <CommunityWall language={language} />
      </div>

      {/* 产品库Modal */}
      {showProductLibrary && (
        <ProductLibraryModal
          onSelect={handleAddProduct}
          onClose={() => setShowProductLibrary(false)}
          language={language}
        />
      )}
    </main>
  );
}
```

---

## ✅ 验收标准

- [ ] 左边是MyList（我的产品列表）
- [ ] MyList有"加产品"按钮 → 弹出产品库Modal
- [ ] 加产品后立即检测冲突，显示红色警告
- [ ] 中间是日晷可视化
- [ ] 加产品触发AI优化动画（2D主题色动画）
- [ ] 右边是博主视频分析面板
- [ ] 粘贴文字 → AI分析 → 列出产品 → 勾选 → 采用
- [ ] 采用后也过一遍AI动画
- [ ] 社区墙展示其他人的日晷（不是产品列表）
- [ ] Fork日晷 → AI重新规划 → 变成自己的

---

**Cursor，按照这个最终方案彻底重构！** 🎯
