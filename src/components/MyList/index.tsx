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

  // 计算总体冲突状态
  const hasConflicts = conflicts.length > 0;
  // const conflictPairs = conflicts.map(c => [c.productAId, c.productBId]);

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
  // Simple fallback, ideally map to common names
  return nutrientId;
}
