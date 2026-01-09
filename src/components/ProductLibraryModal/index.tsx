"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { ProductCategory } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import { getProductDisplayName, translateBrand } from "@/lib/product-translator";
import { PRODUCTS_DATABASE } from "@/data/products";

interface ProductLibraryModalProps {
  onSelect: (product: Product) => void;
  onClose: () => void;
  language: Language;
}

export default function ProductLibraryModal({ onSelect, onClose, language }: ProductLibraryModalProps) {
  const t = useTranslation(language);
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);

  // 品牌列表
  const brands = Array.from(new Set(PRODUCTS_DATABASE.map(p => p.brand))).sort();

  // 筛选逻辑
  const filteredProducts = PRODUCTS_DATABASE.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                       p.brand.toLowerCase().includes(search.toLowerCase()) ||
                       getProductDisplayName(p, 'en').toLowerCase().includes(search.toLowerCase());
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    return matchSearch && matchBrand && matchCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="retro-border bg-white w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-retro-black text-retro-yellow p-4 flex justify-between items-center border-b-2 border-retro-green">
          <h2 className="font-black text-xl font-mono uppercase">
            {t.productLibrary}
          </h2>
          <button onClick={onClose} className="text-retro-yellow hover:text-white text-2xl font-bold">X</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Filters Sidebar */}
          <div className="w-64 border-r-2 border-retro-green p-4 overflow-y-auto bg-retro-green/5">
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder={t.search}
                className="w-full px-3 py-2 border-3 border-retro-green font-mono uppercase bg-white focus:outline-none focus:border-retro-yellow text-sm text-retro-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-sm font-mono mb-2 text-retro-black">[{t.brands}]</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 text-xs font-mono cursor-pointer hover:bg-retro-yellow/20 p-1">
                    <div
                      className={`w-3 h-3 border-2 border-retro-black ${selectedBrands.includes(brand) ? 'bg-retro-yellow' : 'bg-white'} flex items-center justify-center`}
                      onClick={() => {
                        setSelectedBrands(prev =>
                          prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                        );
                      }}
                    >
                      {selectedBrands.includes(brand) && <span className="text-[8px] font-bold">✓</span>}
                    </div>
                    <span>{translateBrand(brand, language)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-sm font-mono mb-2 text-retro-black">[{t.category}]</h3>
              <div className="space-y-1">
                {Object.values(ProductCategory).map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-xs font-mono cursor-pointer hover:bg-retro-yellow/20 p-1">
                    <div
                      className={`w-3 h-3 border-2 border-retro-black ${selectedCategories.includes(cat) ? 'bg-retro-yellow' : 'bg-white'} flex items-center justify-center`}
                      onClick={() => {
                        setSelectedCategories(prev =>
                          prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                        );
                      }}
                    >
                      {selectedCategories.includes(cat) && <span className="text-[8px] font-bold">✓</span>}
                    </div>
                    <span className="uppercase">{cat.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 p-4 overflow-y-auto bg-grid-pattern">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="border-3 border-retro-green bg-white p-3 hover:bg-retro-yellow/10 transition-colors cursor-pointer group relative"
                  onClick={() => {
                    onSelect(product);
                    onClose();
                  }}
                >
                  <div className="text-xs text-retro-black/60 font-mono mb-1">
                    {translateBrand(product.brand, language)}
                  </div>
                  <h3 className="font-bold text-sm font-mono text-retro-black mb-2 leading-tight">
                    {getProductDisplayName(product, language)}
                  </h3>
                  
                  {/* Ingredients Preview */}
                  <div className="text-xs font-mono text-retro-black/50 border-t border-retro-green/20 pt-2">
                    {product.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i}>
                        {ing.nutrient.commonName} {ing.amount}{ing.unit}
                        {i < Math.min(2, product.ingredients.length - 1) && ' · '}
                      </span>
                    ))}
                  </div>

                  {/* Add Button Overlay */}
                  <div className="absolute inset-0 bg-retro-yellow/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="font-black font-mono text-retro-black text-lg border-2 border-retro-black px-4 py-2 bg-white">
                      + {t.add}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
