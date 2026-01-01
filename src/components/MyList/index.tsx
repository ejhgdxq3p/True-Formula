"use client";

import type { MyListCollection } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface MyListProps {
  currentList: MyListCollection | null;
  conflicts: any[];
  onOpenWorkbench: () => void;
  onAddProduct: () => void;
  onRemoveProduct: (productId: string) => void;
  language: Language;
}

export default function MyList({
  currentList,
  conflicts,
  onOpenWorkbench,
  onAddProduct,
  onRemoveProduct,
  language
}: MyListProps) {
  const t = useTranslation(language);

  const products = currentList?.products || [];
  const hasConflicts = conflicts.length > 0;

  return (
    <div className="h-full flex flex-col">
      {/* 页签区域 - 3D 立体效果 */}
      <div className="flex items-end gap-1 mb-0 relative z-10">
        {/* 页签1：我的清单 - 白色背景 + 黑色字体 */}
        <div className="relative">
          <div className="absolute inset-0 bg-retro-black translate-x-1 translate-y-1"></div>
          <div className="relative bg-white border-3 border-retro-black px-4 py-3 min-w-[120px]">
            <h2 className="font-black text-xs uppercase font-mono text-retro-black">
              {language === 'zh' ? '我的清单' : 'MY LIST'}
            </h2>
          </div>
        </div>

        {/* 页签2：工作台 - 黄色背景 + 黑色字体 */}
        <button
          onClick={onOpenWorkbench}
          className="relative group"
          title={language === 'zh' ? '打开工作台' : 'Open Workbench'}
        >
          <div className="absolute inset-0 bg-retro-black translate-x-1 translate-y-1"></div>
          <div className="relative bg-retro-yellow border-3 border-retro-black px-4 py-3 group-hover:bg-retro-yellow/80 transition-colors">
            <span className="font-black text-xs font-mono text-retro-black uppercase">
              {language === 'zh' ? '工作台' : 'BENCH'}
            </span>
          </div>
        </button>
      </div>

      {/* 内容区域 */}
      <div className="retro-border bg-white flex-1 flex flex-col p-4 -mt-[3px] relative z-0">

        {!currentList ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-mono text-retro-black/50 mb-4">
                [{language === 'zh' ? '点击工作台选择清单' : 'CLICK BENCH'}]
              </div>
              <button
                onClick={onOpenWorkbench}
                className="retro-button px-6 py-3 font-mono font-black"
              >
                {language === 'zh' ? '打开工作台' : 'OPEN BENCH'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 加产品按钮 */}
            <button
              onClick={onAddProduct}
              className="retro-button w-full py-3 mb-4 font-mono font-black text-retro-black"
            >
              + {language === 'zh' ? '加产品' : 'ADD'}
            </button>

            {/* 产品列表 */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {products.length === 0 ? (
                <div className="text-center py-10 text-retro-black/50 font-mono text-xs">
                  [{language === 'zh' ? '暂无产品' : 'EMPTY'}]
                </div>
              ) : (
                products.map((item) => (
                  <div
                    key={item.productId}
                    className="border-2 border-retro-green bg-white p-3 hover:bg-retro-green/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
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
                        className="flex-shrink-0 w-8 h-8 bg-retro-black text-retro-yellow font-black hover:bg-red-500 hover:text-white flex items-center justify-center text-sm border-2 border-retro-black shadow-hard transition-all group-hover:scale-110"
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
                hasConflicts ? 'border-red-500 bg-red-50' : 'border-retro-green bg-retro-green/5'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 ${hasConflicts ? 'bg-red-500' : 'bg-retro-green'}`}></div>
                  <h3 className="font-black text-xs font-mono uppercase text-retro-black">
                    {language === 'zh' ? '冲突' : 'CONFLICTS'}
                  </h3>
                </div>

                {hasConflicts ? (
                  <div>
                    <div className="text-sm font-mono text-red-600 font-bold mb-2">
                      ⚠ {conflicts.length}
                    </div>
                    <div className="space-y-1 text-xs font-mono text-retro-black">
                      {conflicts.slice(0, 2).map((conflict: any, i: number) => (
                        <div key={i} className="bg-white border-2 border-red-300 p-2">
                          <div className="font-bold text-red-600 text-[10px]">
                            {conflict.severity === 'CRITICAL' ? '🔴' : '🟠'}
                            {' '}{conflict.productAName.split(' ')[0]} ↔ {conflict.productBName.split(' ')[0]}
                          </div>
                        </div>
                      ))}
                      {conflicts.length > 2 && (
                        <div className="text-center text-retro-black/50 text-[10px]">
                          +{conflicts.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm font-mono text-retro-green">
                    ✓ {language === 'zh' ? '无冲突' : 'SAFE'}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
