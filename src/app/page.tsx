"use client";

import { useState } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { Sundial } from "@/components/Sundial";
import MyList from "@/components/MyList";
import InfluencerPanel from "@/components/InfluencerPanel";
import CommunityWall from "@/components/CommunityWall";
import ProductLibraryModal from "@/components/ProductLibraryModal";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";
import type { Product, MyListProduct, Sundial as SundialType, SundialSlot } from "@/types/product";

export default function Home() {
  const [language, setLanguage] = useState<Language>('zh');
  const t = useTranslation(language);
  const [myList, setMyList] = useState<MyListProduct[]>([]);
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

  // 加产品到MyList
  const handleAddProduct = (product: Product) => {
    const newItem: MyListProduct = {
      productId: product.id,
      product,
      addedAt: new Date(),
    };
    const newList = [...myList, newItem];
    setMyList(newList);

    // 触发AI重新规划
    triggerOptimization(newList);
  };

  // AI重新规划日晷
  const triggerOptimization = async (products: MyListProduct[]) => {
    setIsOptimizing(true);

    // 模拟AI计算（实际调用API）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response generation
    const mockSlots: SundialSlot[] = [];
    const usedProducts = new Set<string>();

    products.forEach(item => {
        let time = "08:00";
        if (item.product.optimalTiming === "BEFORE_BED") time = "22:00";
        if (item.product.optimalTiming === "EVENING") time = "19:00";
        if (item.product.optimalTiming === "POST_WORKOUT") time = "18:00";

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

    const mockSundial: SundialType = {
        id: "generated-1",
        name: "My Optimized Schedule",
        timeSlots: mockSlots.sort((a, b) => a.time.localeCompare(b.time)),
        conflicts: [],
        synergies: [],
        optimizedAt: new Date(),
        isPublic: false,
        forkCount: 0,
        likeCount: 0
    };

    /* In real implementation:
    const res = await fetch('/api/optimize-sundial', {
      method: 'POST',
      body: JSON.stringify({ products }),
    });
    const data = await res.json();
    setSundial(data.sundial);
    setConflicts(data.conflicts);
    */
    
    setSundial(mockSundial);
    setConflicts([]); // Mock empty conflicts for now
    setIsOptimizing(false);
  };

  // 从博主推荐采用产品
  const handleAdoptProducts = (products: Product[]) => {
    const newItems = products.map(p => ({
      productId: p.id,
      product: p,
      addedAt: new Date(),
    }));

    const newList = [...myList, ...newItems];
    setMyList(newList);
    triggerOptimization(newList);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    // For now, drag drop logic is mainly for visual effect or rearranging in MyList/Sundial if needed
    // The main flow is adding to MyList -> AI Optimization
    setActiveId(null);
  };

  const activeProduct = activeId ? myList.find(p => `library-${p.productId}` === activeId)?.product : null;

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

          {/* 左：MyList */}
          <div className="md:col-span-3 h-full overflow-hidden">
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
