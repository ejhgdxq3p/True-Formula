# 🎨 重构 MyList 为页签式管理 + 日晷AI点评 - Cursor 执行指令

---

## 设计目标

### 1. **日晷区域**
- ❌ 删除下方的 timeline
- ✅ 改成 **AI 毒舌点评**（类似 SundialDetailModal 的评价）
- 显示冲突统计、产品总数等

### 2. **MyList 区域（左侧）改成浏览器页签风格**
- 顶部显示 **当前 List 的标签页**
- 标签页右边有 **+ 按钮**
- 点击 + 打开 **MyListManagerModal** 弹窗

### 3. **新增 MyListManagerModal 弹窗**
- 类似 SundialDetailModal 的布局风格
- 显示两个分组：
  - "我创建的 List"
  - "我 Fork 的 List"
- 每个 List 卡片显示：名称、产品数量、冲突数、创建时间
- 点击 List 卡片 → 切换到该 List 进行编辑
- 顶部有 "新建 List" 按钮

---

## Task 1: 创建 MyList 数据类型

**文件**: `src/types/product.ts`

在现有类型后添加：

```typescript
/**
 * MyListCollection - 用户的多个产品清单集合
 */
export interface MyListCollection {
  id: string;
  name: string;              // "我的增肌方案"
  description?: string;
  products: MyListProduct[];
  createdAt: Date;
  updatedAt: Date;
  isFork: boolean;           // 是否是 fork 别人的
  originalAuthor?: string;   // 如果是 fork，原作者名
  conflictCount?: number;    // 冲突数量（缓存）
}
```

---

## Task 2: 创建 MyListManagerModal 组件

**新建文件**: `src/components/MyListManagerModal/index.tsx`

```typescript
"use client";

import { useState } from "react";
import type { MyListCollection } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface MyListManagerModalProps {
  myLists: MyListCollection[];
  forkedLists: MyListCollection[];
  currentListId: string;
  onSelectList: (listId: string) => void;
  onCreateNew: (name: string) => void;
  onClose: () => void;
  language: Language;
}

export default function MyListManagerModal({
  myLists,
  forkedLists,
  currentListId,
  onSelectList,
  onCreateNew,
  onClose,
  language
}: MyListManagerModalProps) {
  const t = useTranslation(language);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleCreate = () => {
    if (newListName.trim()) {
      onCreateNew(newListName.trim());
      setNewListName("");
      setIsCreating(false);
    }
  };

  const renderListCard = (list: MyListCollection) => {
    const isActive = list.id === currentListId;
    return (
      <div
        key={list.id}
        onClick={() => {
          onSelectList(list.id);
          onClose();
        }}
        className={`border-3 p-4 cursor-pointer transition-all ${
          isActive
            ? 'border-retro-yellow bg-retro-yellow/20 shadow-hard'
            : 'border-retro-green bg-white hover:bg-retro-green/5'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-black text-sm font-mono text-retro-black">
              {list.name}
            </h3>
            {list.isFork && list.originalAuthor && (
              <div className="text-xs font-mono text-retro-black/50 mt-1">
                Fork from: {list.originalAuthor}
              </div>
            )}
          </div>
          {isActive && (
            <div className="bg-retro-yellow border-2 border-retro-black px-2 py-1 text-xs font-mono font-bold">
              ✓
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div>
            <div className="font-bold text-retro-black">{list.products.length}</div>
            <div className="text-retro-black/50">{language === 'zh' ? '产品' : 'ITEMS'}</div>
          </div>
          <div>
            <div className={`font-bold ${list.conflictCount ? list.conflictCount > 0 ? 'text-red-500' : 'text-retro-green' : 'text-retro-black/30'}`}>
              {list.conflictCount ?? '-'}
            </div>
            <div className="text-retro-black/50">{language === 'zh' ? '冲突' : 'CONFLICTS'}</div>
          </div>
          <div>
            <div className="font-bold text-retro-black/60">
              {new Date(list.createdAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
            </div>
            <div className="text-retro-black/50">{language === 'zh' ? '创建' : 'CREATED'}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="retro-border bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="bg-retro-black text-retro-yellow p-4 border-b-3 border-retro-green flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <RotatingPointer />
            <h2 className="font-black text-xl font-mono uppercase">
              {language === 'zh' ? '我的产品清单' : 'MY LISTS'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-3xl font-bold hover:text-red-500 transition-colors"
          >
            X
          </button>
        </div>

        <div className="p-6">
          {/* 新建按钮 */}
          <div className="mb-6">
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="retro-button w-full py-4 font-mono font-black text-retro-black text-lg"
              >
                + {language === 'zh' ? '新建产品清单' : 'NEW LIST'}
              </button>
            ) : (
              <div className="border-3 border-retro-yellow bg-retro-yellow/10 p-4">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder={language === 'zh' ? '输入清单名称...' : 'Enter list name...'}
                  className="w-full p-3 border-3 border-retro-green font-mono text-sm bg-white mb-3"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') setIsCreating(false);
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className="retro-button flex-1 py-2 font-mono font-bold"
                  >
                    {language === 'zh' ? '创建' : 'CREATE'}
                  </button>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="border-2 border-retro-black bg-white hover:bg-gray-100 flex-1 py-2 font-mono font-bold"
                  >
                    {language === 'zh' ? '取消' : 'CANCEL'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 我创建的 List */}
          <div className="mb-6">
            <h3 className="font-black text-lg font-mono uppercase text-retro-black border-b-3 border-retro-green pb-2 mb-4 flex items-center gap-2">
              <RotatingPointer />
              {language === 'zh' ? '我创建的' : 'MY LISTS'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLists.length === 0 ? (
                <div className="col-span-2 text-center py-10 text-retro-black/50 font-mono text-xs">
                  [{language === 'zh' ? '还没有创建清单' : 'NO LISTS YET'}]
                </div>
              ) : (
                myLists.map(renderListCard)
              )}
            </div>
          </div>

          {/* Fork 的 List */}
          {forkedLists.length > 0 && (
            <div>
              <h3 className="font-black text-lg font-mono uppercase text-retro-black border-b-3 border-retro-green pb-2 mb-4 flex items-center gap-2">
                <RotatingPointer />
                {language === 'zh' ? '我 Fork 的' : 'FORKED LISTS'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forkedLists.map(renderListCard)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Task 3: 修改 MyList 组件为页签风格

**文件**: `src/components/MyList/index.tsx`

**完全替换为**：

```typescript
"use client";

import { useState } from "react";
import type { Product, MyListProduct, MyListCollection } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface MyListProps {
  currentList: MyListCollection | null;
  conflicts: any[];
  onOpenListManager: () => void;
  onAddProduct: () => void;
  onRemoveProduct: (productId: string) => void;
  language: Language;
}

export default function MyList({
  currentList,
  conflicts,
  onOpenListManager,
  onAddProduct,
  onRemoveProduct,
  language
}: MyListProps) {
  const t = useTranslation(language);

  const products = currentList?.products || [];
  const hasConflicts = conflicts.length > 0;

  return (
    <div className="retro-border p-4 bg-white h-full flex flex-col">
      {/* 顶部：浏览器页签风格 */}
      <div className="flex items-stretch mb-4 -mx-4 -mt-4">
        {/* 当前 List 页签 */}
        <div className="bg-retro-yellow border-b-3 border-r-3 border-retro-black px-4 py-3 flex items-center gap-2 min-w-[180px]">
          <RotatingPointer />
          <h2 className="font-black text-sm uppercase font-mono text-retro-black truncate">
            {currentList?.name || (language === 'zh' ? '未选择' : 'NO LIST')}
          </h2>
        </div>

        {/* + 按钮页签 */}
        <button
          onClick={onOpenListManager}
          className="bg-white hover:bg-retro-green/10 border-b-3 border-r-3 border-retro-black px-4 py-3 font-black text-lg transition-colors"
          title={language === 'zh' ? '管理我的清单' : 'Manage Lists'}
        >
          +
        </button>

        {/* 剩余空间填充 */}
        <div className="flex-1 border-b-3 border-retro-black bg-white"></div>
      </div>

      {/* 如果没有选中 List */}
      {!currentList ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-mono text-retro-black/50 mb-4">
              [{language === 'zh' ? '点击上方 + 创建或选择清单' : 'CLICK + TO CREATE OR SELECT LIST'}]
            </div>
            <button
              onClick={onOpenListManager}
              className="retro-button px-6 py-3 font-mono font-black"
            >
              {language === 'zh' ? '打开清单管理' : 'OPEN LIST MANAGER'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 统计信息 */}
          <div className="bg-retro-green/5 border-2 border-retro-green p-3 mb-4">
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div>
                <div className="font-black text-lg text-retro-black">{products.length}</div>
                <div className="text-retro-black/60">{language === 'zh' ? '产品' : 'PRODUCTS'}</div>
              </div>
              <div>
                <div className={`font-black text-lg ${hasConflicts ? 'text-red-500' : 'text-retro-green'}`}>
                  {conflicts.length}
                </div>
                <div className="text-retro-black/60">{language === 'zh' ? '冲突' : 'CONFLICTS'}</div>
              </div>
            </div>
          </div>

          {/* 加产品按钮 */}
          <button
            onClick={onAddProduct}
            className="retro-button w-full py-3 mb-4 font-mono font-black text-retro-black"
          >
            + {language === 'zh' ? '加产品' : 'ADD PRODUCT'}
          </button>

          {/* 产品列表 */}
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

          {/* 底部冲突检测 */}
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

                  {/* 显示前2个冲突 */}
                  <div className="space-y-2 text-xs font-mono text-retro-black">
                    {conflicts.slice(0, 2).map((conflict: any, i: number) => (
                      <div key={i} className="bg-white border-2 border-red-300 p-2">
                        <div className="font-bold text-red-600">
                          {conflict.severity === 'CRITICAL' ? '🔴' : conflict.severity === 'HIGH' ? '🟠' : '🟡'}
                          {' '}{conflict.productAName} ↔ {conflict.productBName}
                        </div>
                        <div className="text-retro-black/70 mt-1">
                          {conflict.explanation}
                        </div>
                      </div>
                    ))}

                    {conflicts.length > 2 && (
                      <div className="text-center text-retro-black/50 pt-2">
                        +{conflicts.length - 2} more...
                      </div>
                    )}
                  </div>

                  <div className="text-xs font-mono text-retro-black mt-3 pt-3 border-t border-red-300">
                    → {language === 'zh' ? '查看日晷优化建议' : 'Check Sundial for optimization'}
                  </div>
                </div>
              ) : (
                <div className="text-sm font-mono text-retro-green">
                  ✓ {language === 'zh' ? '所有成分安全，无冲突' : 'All safe, no conflicts'}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## Task 4: 修改 Sundial 组件，添加 AI 点评

**文件**: `src/components/Sundial/index.tsx`

找到日晷可视化下方的 timeline 部分，**删除整个 timeline 相关代码**。

在日晷可视化 SVG 后面，添加 **AI 毒舌点评**：

```typescript
{/* AI 毒舌点评（替代 timeline）*/}
{sundial && sundial.timeSlots.length > 0 && (
  <div className="bg-retro-yellow/20 border-3 border-retro-yellow p-4 mt-6">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xl">🤖</span>
      <h3 className="font-black text-sm font-mono uppercase text-retro-black">
        {language === 'zh' ? 'AI 毒舌点评' : 'AI ROAST'}
      </h3>
    </div>
    <p className="text-sm font-mono text-retro-black leading-relaxed">
      {generateAIRoast(sundial, language)}
    </p>

    {/* 统计信息 */}
    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t-2 border-retro-yellow text-center text-xs font-mono">
      <div>
        <div className="font-black text-2xl text-retro-black">
          {sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0)}
        </div>
        <div className="text-retro-black/60">{language === 'zh' ? '产品' : 'PRODUCTS'}</div>
      </div>
      <div>
        <div className={`font-black text-2xl ${sundial.conflicts.length > 0 ? 'text-red-500' : 'text-retro-green'}`}>
          {sundial.conflicts.length}
        </div>
        <div className="text-retro-black/60">{language === 'zh' ? '冲突' : 'CONFLICTS'}</div>
      </div>
      <div>
        <div className="font-black text-2xl text-retro-green">
          {sundial.synergies?.length || 0}
        </div>
        <div className="text-retro-black/60">{language === 'zh' ? '协同' : 'SYNERGIES'}</div>
      </div>
    </div>
  </div>
)}
```

在文件底部添加 AI 点评生成函数：

```typescript
// AI 毒舌点评生成器
function generateAIRoast(sundial: SundialType, language: Language): string {
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

---

## Task 5: 更新 page.tsx 主逻辑

**文件**: `src/app/page.tsx`

修改状态管理和逻辑：

```typescript
"use client";

import { useState } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { Sundial } from "@/components/Sundial";
import MyList from "@/components/MyList";
import MyListManagerModal from "@/components/MyListManagerModal";
import InfluencerPanel from "@/components/InfluencerPanel";
import CommunityWall from "@/components/CommunityWall";
import ProductLibraryModal from "@/components/ProductLibraryModal";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";
import type { Product, MyListProduct, Sundial as SundialType, SundialSlot, MyListCollection } from "@/types/product";
import { detectProductConflicts } from "@/lib/product-conflict-detector";

export default function Home() {
  const [language, setLanguage] = useState<Language>('zh');
  const t = useTranslation(language);

  // === 多 List 管理 ===
  const [myLists, setMyLists] = useState<MyListCollection[]>([
    {
      id: "default-list",
      name: language === 'zh' ? "我的配方" : "My Stack",
      products: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFork: false,
      conflictCount: 0,
    }
  ]);
  const [forkedLists, setForkedLists] = useState<MyListCollection[]>([]);
  const [currentListId, setCurrentListId] = useState<string>("default-list");
  const [showListManager, setShowListManager] = useState(false);

  const currentList = myLists.find(l => l.id === currentListId) || forkedLists.find(l => l.id === currentListId) || null;

  const [sundial, setSundial] = useState<SundialType | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showProductLibrary, setShowProductLibrary] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 更新当前 List
  const updateCurrentList = (updates: Partial<MyListCollection>) => {
    const updateList = (lists: MyListCollection[]) =>
      lists.map(l => l.id === currentListId ? { ...l, ...updates, updatedAt: new Date() } : l);

    setMyLists(prev => updateList(prev));
    setForkedLists(prev => updateList(prev));
  };

  // 加产品到当前 List
  const handleAddProduct = (product: Product) => {
    if (!currentList) return;

    const newItem: MyListProduct = {
      productId: product.id,
      product,
      addedAt: new Date(),
    };
    const newProducts = [...currentList.products, newItem];
    updateCurrentList({ products: newProducts });
    triggerOptimization(newProducts);
  };

  // 从当前 List 移除产品
  const handleRemoveProduct = (productId: string) => {
    if (!currentList) return;

    const newProducts = currentList.products.filter(p => p.productId !== productId);
    updateCurrentList({ products: newProducts });
    triggerOptimization(newProducts);
  };

  // AI 重新规划日晷
  const triggerOptimization = async (products: MyListProduct[]) => {
    setIsOptimizing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockSlots: SundialSlot[] = [];

    products.forEach(item => {
      let time = "08:00";
      if (item.product.optimalTiming === "BEFORE_BED") time = "22:00";
      if (item.product.optimalTiming === "EVENING") time = "19:00";
      if (item.product.optimalTiming === "POST_WORKOUT") time = "18:00";
      if (item.product.optimalTiming === "AFTERNOON") time = "14:00";
      if (item.product.optimalTiming === "MORNING") time = "07:00";

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

    const detectedConflicts = detectProductConflicts(products);

    const mockSundial: SundialType = {
      id: "generated-1",
      name: currentList?.name || "My Schedule",
      timeSlots: mockSlots.sort((a, b) => a.time.localeCompare(b.time)),
      conflicts: detectedConflicts,
      synergies: [],
      optimizedAt: new Date(),
      isPublic: false,
      forkCount: 0,
      likeCount: 0
    };

    setSundial(mockSundial);
    setConflicts(detectedConflicts);
    updateCurrentList({ conflictCount: detectedConflicts.length });
    setIsOptimizing(false);
  };

  // 从博主推荐采用产品
  const handleAdoptProducts = (products: Product[]) => {
    if (!currentList) return;

    const newItems = products.map(p => ({
      productId: p.id,
      product: p,
      addedAt: new Date(),
    }));

    const newProducts = [...currentList.products, ...newItems];
    updateCurrentList({ products: newProducts });
    triggerOptimization(newProducts);
  };

  // 创建新 List
  const handleCreateNewList = (name: string) => {
    const newList: MyListCollection = {
      id: `list-${Date.now()}`,
      name,
      products: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFork: false,
      conflictCount: 0,
    };
    setMyLists(prev => [...prev, newList]);
    setCurrentListId(newList.id);
  };

  // 选择 List
  const handleSelectList = (listId: string) => {
    setCurrentListId(listId);
    const selectedList = myLists.find(l => l.id === listId) || forkedLists.find(l => l.id === listId);
    if (selectedList) {
      triggerOptimization(selectedList.products);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
  };

  const activeProduct = activeId ? currentList?.products.find(p => `library-${p.productId}` === activeId)?.product : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="min-h-screen bg-grid-pattern text-retro-black font-sans">
        {/* Header */}
        <header className="border-b-4 border-retro-black bg-retro-yellow px-6 py-4 sticky top-0 z-40 shadow-sm">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-black text-retro-black uppercase font-mono flex items-center gap-2">
              {t.appTitle}
              <RotatingPointer />
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="retro-button px-4 py-2 text-sm font-mono"
              >
                {t.langSwitch}
              </button>
            </div>
          </div>
        </header>

        {/* 3栏布局 */}
        <div className="max-w-[1800px] mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[calc(100vh-120px)] min-h-[800px]">

          {/* 左：MyList（页签风格）*/}
          <div className="md:col-span-3 h-full overflow-hidden">
            <MyList
              currentList={currentList}
              conflicts={conflicts}
              onOpenListManager={() => setShowListManager(true)}
              onAddProduct={() => setShowProductLibrary(true)}
              onRemoveProduct={handleRemoveProduct}
              language={language}
            />
          </div>

          {/* 中：日晷 */}
          <div className="md:col-span-6 h-full overflow-hidden">
            <Sundial
              sundial={sundial}
              isOptimizing={isOptimizing}
              language={language}
            />
          </div>

          {/* 右：博主分析 */}
          <div className="md:col-span-3 h-full overflow-hidden">
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

        {/* MyList 管理弹窗 */}
        {showListManager && (
          <MyListManagerModal
            myLists={myLists}
            forkedLists={forkedLists}
            currentListId={currentListId}
            onSelectList={handleSelectList}
            onCreateNew={handleCreateNewList}
            onClose={() => setShowListManager(false)}
            language={language}
          />
        )}

        {/* 产品库Modal */}
        {showProductLibrary && (
          <ProductLibraryModal
            onSelect={handleAddProduct}
            onClose={() => setShowProductLibrary(false)}
            language={language}
          />
        )}

        <DragOverlay>
          {activeProduct ? (
            <div className="border-3 border-retro-green bg-white p-3 shadow-hard w-64 rotate-3 opacity-90 cursor-grabbing">
              <div className="font-bold text-sm font-mono uppercase text-retro-black">
                {activeProduct.name}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </main>
    </DndContext>
  );
}
```

---

## ✅ 验收标准

完成后应该：

1. **MyList 左侧顶部**：
   - [ ] 显示浏览器页签风格
   - [ ] 当前 List 名称显示在页签上
   - [ ] 页签右边有 + 按钮

2. **点击 + 按钮**：
   - [ ] 打开 MyListManagerModal 弹窗
   - [ ] 弹窗显示 "我创建的" 和 "我 Fork 的" 两个分组
   - [ ] 可以点击 "新建产品清单" 创建新 List
   - [ ] 点击 List 卡片切换到该 List

3. **日晷区域**：
   - [ ] 下方不再显示 timeline
   - [ ] 显示 AI 毒舌点评
   - [ ] 显示产品数、冲突数、协同数统计

4. **功能测试**：
   - [ ] 创建新 List，加产品，检测冲突 → 正常工作
   - [ ] 切换不同 List → 内容正确切换
   - [ ] AI 点评根据冲突数量生成不同内容

---

**Cursor，开始重构！把 MyList 改成页签管理，日晷换成 AI 毒舌点评！** 🎨✨
