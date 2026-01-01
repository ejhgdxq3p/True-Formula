"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { ProductCategory } from "@/types/product";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";

interface ProductDrawerProps {
  products: Product[];
  language: Language;
}

export default function SupplementDrawer({ products, language }: ProductDrawerProps) {
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
      <div className="bg-retro-yellow border-3 border-retro-black p-2 mb-4 flex items-center gap-2">
        <RotatingPointer />
        <h2 className="font-black text-lg uppercase font-mono text-retro-black">
          {t.supplementLibrary}
        </h2>
      </div>

      {/* 搜索 */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder={t.search}
          className="w-full px-3 py-2 border-3 border-retro-green font-mono uppercase bg-white focus:outline-none focus:border-retro-yellow focus:shadow-[inset_0_0_0_2px_#FDE700] placeholder:text-retro-gray/50 text-retro-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute right-2 top-2 cursor-pointer text-sm"></span>
      </div>

      {/* 品牌筛选 */}
      <div className="mb-4 bg-retro-green/10 border-2 border-retro-green p-3 max-h-40 overflow-y-auto">
        <p className="text-xs font-bold font-mono mb-2 text-retro-black">
          [{t.brands}]
        </p>
        {brands.map(brand => (
          <label key={brand} className="flex items-center gap-2 text-sm font-mono cursor-pointer mb-1 hover:bg-retro-yellow/20 p-1 text-retro-black select-none">
            <div
              className={`w-4 h-4 border-2 border-retro-black ${selectedBrands.includes(brand) ? 'bg-retro-yellow' : 'bg-white'} flex items-center justify-center`}
              onClick={() => {
                setSelectedBrands(prev =>
                  prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                );
              }}
            >
              {selectedBrands.includes(brand) && <span className="text-xs font-bold">✓</span>}
            </div>
            <span>{brand}</span>
          </label>
        ))}
      </div>

      {/* 产品分类筛选 */}
      <div className="mb-4 bg-retro-green/10 border-2 border-retro-green p-3">
        <p className="text-xs font-bold font-mono mb-2 text-retro-black">
          [{t.category}]
        </p>
        {Object.values(ProductCategory).map(cat => (
          <label key={cat} className="flex items-center gap-2 text-xs font-mono cursor-pointer mb-1 hover:bg-retro-yellow/20 p-1 text-retro-black select-none">
            <div
              className={`w-4 h-4 border-2 border-retro-black ${selectedCategories.includes(cat) ? 'bg-retro-yellow' : 'bg-white'} flex items-center justify-center`}
              onClick={() => {
                setSelectedCategories(prev =>
                  prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                );
              }}
            >
              {selectedCategories.includes(cat) && <span className="text-xs font-bold">✓</span>}
            </div>
            <span className="uppercase">{getCategoryLabel(cat, language)}</span>
          </label>
        ))}
      </div>

      {/* 产品列表 */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredProducts.map(product => (
          <DraggableProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function DraggableProduct({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${product.id}`,
    data: { 
      type: "library-item",
      product // Pass full product data
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="opacity-50 border-3 border-retro-green bg-white p-3 shadow-[4px_4px_0_0_#0F380F]"
      >
         <div className="font-bold text-retro-black font-mono">{product.name}</div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border-3 border-retro-green bg-white p-3 hover:bg-retro-yellow hover:translate-x-1 hover:translate-y-1 transition-transform cursor-grab active:cursor-grabbing select-none shadow-[2px_2px_0_0_#0F380F]"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="text-xs text-retro-black/60 font-mono mb-1">{product.brand}</div>
          <h3 className="font-bold text-sm font-mono text-retro-black leading-tight">{product.name}</h3>
        </div>
        {product.rating && (
          <div className="text-xs font-mono text-retro-green font-bold ml-2">
            ★ {product.rating}
          </div>
        )}
      </div>

      {/* 成分预览（显示主要营养素） */}
      <div className="text-xs font-mono text-retro-black/50 border-t border-retro-green/20 pt-2 mt-2">
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
  const labels: Record<Language, Record<ProductCategory, string>> = {
    zh: {
      MULTIVITAMIN: "综合维生素",
      SINGLE_VITAMIN: "单一维生素",
      MINERAL: "矿物质",
      OMEGA: "Omega脂肪酸",
      PROTEIN: "蛋白质",
      PROBIOTIC: "益生菌",
      HERBAL: "草本植物",
      SPORTS: "运动营养",
      BEAUTY: "美容保健",
      JOINT: "关节骨骼",
      IMMUNITY: "免疫力",
      SLEEP: "助眠",
      ENERGY: "能量",

      // 新增：日常食材
      FOOD_MEAT: "肉类",
      FOOD_EGG: "蛋类",
      FOOD_VEGETABLE: "蔬菜",
      FOOD_ORGAN: "内脏",

      // 新增：健康饮品
      BEVERAGE_TEA: "茶类",
      BEVERAGE_SOY: "豆制品",
      BEVERAGE_JUICE: "果汁",
      BEVERAGE_OTHER: "其他饮品",
    },
    en: {
      MULTIVITAMIN: "MULTIVITAMIN",
      SINGLE_VITAMIN: "SINGLE VITAMIN",
      MINERAL: "MINERAL",
      OMEGA: "OMEGA",
      PROTEIN: "PROTEIN",
      PROBIOTIC: "PROBIOTIC",
      HERBAL: "HERBAL",
      SPORTS: "SPORTS",
      BEAUTY: "BEAUTY",
      JOINT: "JOINT",
      IMMUNITY: "IMMUNITY",
      SLEEP: "SLEEP",
      ENERGY: "ENERGY",

      // 新增：日常食材
      FOOD_MEAT: "MEAT",
      FOOD_EGG: "EGG",
      FOOD_VEGETABLE: "VEGETABLE",
      FOOD_ORGAN: "ORGAN",

      // 新增：健康饮品
      BEVERAGE_TEA: "TEA",
      BEVERAGE_SOY: "SOY",
      BEVERAGE_JUICE: "JUICE",
      BEVERAGE_OTHER: "BEVERAGE",
    }
  };
  return labels[lang][cat] || cat;
}
