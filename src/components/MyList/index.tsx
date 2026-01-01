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
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
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
                    className="w-6 h-6 bg-retro-black text-white font-bold hover:bg-red-500 flex items-center justify-center text-xs"
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
