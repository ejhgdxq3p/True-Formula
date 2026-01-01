"use client";

import { useState } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { Sundial } from "@/components/Sundial";
import MyList from "@/components/MyList";
import WorkbenchModal from "@/components/WorkbenchModal";
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
  const [showWorkbench, setShowWorkbench] = useState(false);

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
    if (products.length === 0) {
      setSundial(null);
      setConflicts([]);
      updateCurrentList({ conflictCount: 0 });
      return;
    }

    setIsOptimizing(true);

    try {
      // 步骤1：先检测冲突
      const detectedConflicts = detectProductConflicts(products);
      console.log(`[排程] 检测到 ${detectedConflicts.length} 个冲突`);

      // 步骤2：调用AI智能排程（让AI真正思考时间分配）
      const aiResponse = await fetch('/api/ai-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: products.map(p => p.product),
          conflicts: detectedConflicts,
          language
        })
      });

      let schedule;
      let apiConflicts = detectedConflicts;
      let aiResult: any = null;

      if (aiResponse.ok) {
        aiResult = await aiResponse.json();
        if (aiResult.success && aiResult.data?.schedule) {
          schedule = aiResult.data.schedule;
          console.log(`[排程] AI生成 ${schedule.length} 个时间槽`);
        } else {
          throw new Error('AI排程返回格式错误');
        }
      } else {
        // AI排程失败，使用降级方案
        console.warn('[排程] AI排程失败，使用降级方案');
        throw new Error('AI排程不可用');
      }

      // 构建日晷数据
      const sundialData: SundialType = {
        id: `sundial-${Date.now()}`,
        name: currentList?.name || "My Schedule",
        timeSlots: schedule.map((slot: any) => ({
          time: slot.time,
          products: slot.supplements.map((supp: any) => {
            const productItem = products.find(p => p.productId === supp.id);
            return {
              productId: supp.id,
              product: productItem!.product,
              dosage: supp.dosage || productItem!.product.dosagePerServing
            };
          }),
          reasoning: slot.reasoning || "AI优化排程"
        })),
        conflicts: apiConflicts || [],
        synergies: aiResult?.data?.synergies || [],
        optimizedAt: new Date(),
        isPublic: false,
        forkCount: 0,
        likeCount: 0
      };

      // 调用AI点评
      try {
        const aiCommentary = await fetchAICommentary(sundialData);
        sundialData.aiCommentary = aiCommentary;
      } catch (error) {
        console.error('[排程] AI点评失败，但继续显示日晷:', error);
        sundialData.aiCommentary = language === 'zh'
          ? "AI点评暂时不可用，请检查API配置。"
          : "AI commentary unavailable. Please check API configuration.";
      }

      setSundial(sundialData);
      setConflicts(apiConflicts || []);
      updateCurrentList({ conflictCount: (apiConflicts || []).length });

    } catch (error) {
      console.error('排程优化失败:', error);

      // 降级到简单排程
      const detectedConflicts = detectProductConflicts(products);
      const simpleSlots: SundialSlot[] = [];

      products.forEach(item => {
        let time = "08:00";
        if (item.product.optimalTiming === "BEFORE_BED") time = "22:00";
        if (item.product.optimalTiming === "EVENING") time = "19:00";
        if (item.product.optimalTiming === "POST_WORKOUT") time = "18:00";
        if (item.product.optimalTiming === "AFTERNOON") time = "14:00";
        if (item.product.optimalTiming === "MORNING") time = "07:00";

        let slot = simpleSlots.find(s => s.time === time);
        if (!slot) {
          slot = { time, products: [], reasoning: "基于产品推荐时间" };
          simpleSlots.push(slot);
        }
        slot.products.push({
          productId: item.productId,
          product: item.product,
          dosage: item.product.dosagePerServing
        });
      });

      const fallbackSundial: SundialType = {
        id: "generated-fallback",
        name: currentList?.name || "My Schedule",
        timeSlots: simpleSlots.sort((a, b) => a.time.localeCompare(b.time)),
        conflicts: detectedConflicts,
        synergies: [],
        optimizedAt: new Date(),
        isPublic: false,
        forkCount: 0,
        likeCount: 0,
        aiCommentary: language === 'zh'
          ? "AI排程服务暂时不可用，已为您生成基础排程。"
          : "AI service unavailable. Basic schedule generated."
      };

      setSundial(fallbackSundial);
      setConflicts(detectedConflicts);
      updateCurrentList({ conflictCount: detectedConflicts.length });
    } finally {
      setIsOptimizing(false);
    }
  };

  // 获取AI点评（确保使用真实AI）
  const fetchAICommentary = async (sundial: SundialType): Promise<string> => {
    try {
      console.log('[AI点评] 开始调用API...');
      const response = await fetch('/api/ai-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sundial: {
            timeSlots: sundial.timeSlots,
            conflicts: sundial.conflicts,
            synergies: sundial.synergies
          },
          language
        })
      });

      console.log('[AI点评] API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AI点评] API返回错误:', errorText);
        throw new Error(`AI点评API错误: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('[AI点评] API返回结果:', result);

      if (!result.success || !result.data?.commentary) {
        console.error('[AI点评] 返回格式错误:', result);
        throw new Error('AI点评返回格式错误');
      }

      console.log('[AI点评] 成功生成，长度:', result.data.commentary.length);
      return result.data.commentary;
    } catch (error) {
      console.error('[AI点评] 完整错误信息:', error);
      throw error; // 重新抛出错误，让外层处理
    }
  };

  // 降级点评
  const generateFallbackCommentary = (sundial: SundialType): string => {
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

  // Fork Sundial Logic
  const handleForkSundial = (sundial: SundialType) => {
    const forkedList: MyListCollection = {
      id: `forked-${sundial.id}-${Date.now()}`,
      name: sundial.name,
      description: `Forked from ${sundial.author || 'Community'}`,
      products: sundial.timeSlots.flatMap(slot =>
        slot.products.map(p => ({
          productId: p.productId,
          product: p.product,
          addedAt: new Date(),
        }))
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
      isFork: true,
      originalAuthor: sundial.author,
      conflictCount: sundial.conflicts.length,
    };

    setForkedLists(prev => [...prev, forkedList]);
    setCurrentListId(forkedList.id);
    setShowWorkbench(false);

    // 自动滚动到顶部以便用户看到新 List
    window.scrollTo({ top: 0, behavior: 'smooth' });

    triggerOptimization(forkedList.products);
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
              onOpenWorkbench={() => setShowWorkbench(true)}
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
          <CommunityWall 
            language={language} 
            onForkSundial={handleForkSundial}
          />
        </div>

        {/* 工作台弹窗 (MyList 管理) */}
        {showWorkbench && (
          <WorkbenchModal
            myLists={myLists}
            forkedLists={forkedLists}
            currentListId={currentListId}
            onSelectList={handleSelectList}
            onCreateNew={handleCreateNewList}
            onClose={() => setShowWorkbench(false)}
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
