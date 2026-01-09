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
import { getProductDisplayName } from "@/lib/product-translator";
import { getFallbackTexts } from "@/prompts/fallback";
import type { Product, MyListProduct, Sundial as SundialType, SundialSlot, MyListCollection } from "@/types/product";
import { detectProductConflicts } from "@/lib/product-conflict-detector";

export default function Home() {
  const [language, setLanguage] = useState<Language>('zh');
  const t = useTranslation(language);

  // === 多 List 管理 ===
  const [myLists, setMyLists] = useState<MyListCollection[]>([
    {
      id: "default-list",
      name: t.myList,
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
      console.log(`[Schedule] Detected ${detectedConflicts.length} conflicts`);

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
          console.log(`[Schedule] AI generated ${schedule.length} time slots`);
        } else {
          throw new Error('AI schedule format error');
        }
      } else {
        // AI排程失败，使用降级方案
        console.warn('[Schedule] AI scheduling failed, using fallback');
        throw new Error('AI scheduling unavailable');
      }

      // 构建日晷数据
      const sundialData: SundialType = {
        id: `sundial-${Date.now()}`,
        name: currentList?.name || "My Schedule",
        timeSlots: schedule.map((slot: any) => ({
          time: slot.time,
          products: slot.supplements
            .map((supp: any) => {
              const productItem = products.find(p => p.productId === supp.id);
              if (!productItem) {
                console.warn(`[Schedule] Product not found for id: ${supp.id}`);
                return null;
              }
              return {
                productId: supp.id,
                product: productItem.product,
                dosage: supp.dosage || productItem.product.dosagePerServing
              };
            })
            .filter((p: any): p is NonNullable<typeof p> => p !== null),
          reasoning: slot.reasoning || (language === 'zh' ? "AI优化排程" : "AI optimized schedule")
        })).filter((slot: any) => slot.products.length > 0),
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
        console.error('[Schedule] AI commentary failed, continuing with sundial:', error);
        sundialData.aiCommentary = t.aiCommentaryUnavailable;
      }

      setSundial(sundialData);
      setConflicts(apiConflicts || []);
      updateCurrentList({ conflictCount: (apiConflicts || []).length });

    } catch (error) {
      console.error('Schedule optimization failed:', error);

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
          slot = { time, products: [], reasoning: language === 'zh' ? "基于产品推荐时间" : "Based on recommended timing" };
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
        aiCommentary: t.aiServiceUnavailable
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
      console.log('[AI Commentary] Calling API...');
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

      console.log('[AI Commentary] API response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AI Commentary] API error:', errorText);
        throw new Error(`AI commentary API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('[AI Commentary] API result:', result);

      if (!result.success || !result.data?.commentary) {
        console.error('[AI Commentary] Format error:', result);
        throw new Error('AI commentary format error');
      }

      console.log('[AI Commentary] Success, length:', result.data.commentary.length);
      return result.data.commentary;
    } catch (error) {
      console.error('[AI Commentary] Full error:', error);
      throw error; // 重新抛出错误，让外层处理
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
        <header className="border-b-4 border-retro-black px-6 py-4 sticky top-0 z-40" style={{ backgroundColor: '#FDE700' }}>
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
                {getProductDisplayName(activeProduct, language)}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </main>
    </DndContext>
  );
}
