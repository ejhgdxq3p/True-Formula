"use client";

import { useState, useMemo } from "react";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";
import SundialDetailModal from "@/components/SundialDetailModal";
import type { Sundial, Product, SundialSlot } from "@/types/product";
import { ProductCategory, TimingPreference } from "@/types/product";

export default function CommunityWall({
  language,
  onForkSundial
}: {
  language: Language;
  onForkSundial?: (sundial: Sundial) => void;
}) {
  const t = useTranslation(language);
  const [selectedSundial, setSelectedSundial] = useState<Sundial | null>(null);

  // Mock helper to create a minimal product for display
  const mockProduct = (id: string, name: string, brand: string): Product => ({
    id,
    name,
    brand,
    category: ProductCategory.MULTIVITAMIN,
    ingredients: [],
    dosagePerServing: language === 'zh' ? "1粒" : "1 capsule",
    servingsPerDay: 1,
    optimalTiming: "MORNING_WITH_FOOD" as TimingPreference,
  });

  // 使用 useMemo 确保语言变化时重新生成 Mock 数据
  const sundials = useMemo<Sundial[]>(() => [
    {
      id: "sundial-1",
      author: t.mockAuthor1,
      name: t.mockTitle1,
      description: t.mockDesc1,
      timeSlots: [
        { 
          time: "07:00", 
          productCount: 2,
          reasoning: language === 'zh' ? "晨起补充基础维生素" : "Morning vitamin boost",
          products: [
            { productId: "p1", product: mockProduct("p1", language === 'zh' ? "综合维生素" : "Multivitamin", "Swisse"), dosage: language === 'zh' ? "1粒" : "1 capsule" },
            { productId: "p2", product: mockProduct("p2", language === 'zh' ? "鱼油" : "Fish Oil", "Nature Made"), dosage: language === 'zh' ? "2粒" : "2 capsules" }
          ]
        },
        { 
          time: "14:00", 
          productCount: 1,
          reasoning: language === 'zh' ? "午餐后补充" : "After lunch supplement",
          products: [
             { productId: "p3", product: mockProduct("p3", language === 'zh' ? "维生素D3" : "Vitamin D3", "Doctor's Best"), dosage: "5000IU" }
          ]
        },
        { 
          time: "20:00", 
          productCount: 3,
          reasoning: language === 'zh' ? "运动后恢复" : "Post-workout recovery",
          products: [
            { productId: "p4", product: mockProduct("p4", language === 'zh' ? "乳清蛋白" : "Whey Protein", "Optimum Nutrition"), dosage: language === 'zh' ? "1勺" : "1 scoop" },
            { productId: "p5", product: mockProduct("p5", language === 'zh' ? "肌酸" : "Creatine", "Muscletech"), dosage: "5g" },
            { productId: "p6", product: mockProduct("p6", language === 'zh' ? "谷氨酰胺" : "Glutamine", "Now Foods"), dosage: "5g" }
          ]
        },
      ],
      conflicts: [],
      synergies: [],
      likeCount: 152,
      forkCount: 43,
      createdAt: "2024-01-15",
      isPublic: true,
      optimizedAt: new Date(),
    },
    {
      id: "sundial-2",
      author: t.mockAuthor2,
      name: t.mockTitle2,
      description: t.mockDesc2,
      timeSlots: [
        { 
          time: "08:00", 
          productCount: 1,
          reasoning: language === 'zh' ? "随早餐服用吸收好" : "Better absorption with breakfast",
          products: [
            { productId: "p7", product: mockProduct("p7", language === 'zh' ? "葡萄籽" : "Grape Seed", "Swisse"), dosage: language === 'zh' ? "2粒" : "2 capsules" }
          ]
        },
        { 
          time: "12:00", 
          productCount: 1,
          reasoning: language === 'zh' ? "午餐时补充" : "Lunchtime supplement",
          products: [
            { productId: "p8", product: mockProduct("p8", language === 'zh' ? "维生素C" : "Vitamin C", "Jamieson"), dosage: "500mg" }
          ]
        },
        { 
          time: "21:00", 
          productCount: 1,
          reasoning: language === 'zh' ? "睡前抗氧化" : "Pre-sleep antioxidant",
          products: [
            { productId: "p9", product: mockProduct("p9", language === 'zh' ? "胶原蛋白" : "Collagen", "Swisse"), dosage: language === 'zh' ? "1瓶" : "1 bottle" }
          ]
        },
      ],
      conflicts: [],
      synergies: [],
      likeCount: 89,
      forkCount: 21,
      createdAt: "2024-01-16",
      isPublic: true,
      optimizedAt: new Date(),
    },
    {
      id: "sundial-3",
      author: t.mockAuthor3,
      name: t.mockTitle3,
      description: t.mockDesc3,
      timeSlots: [
        { 
          time: "09:00", 
          productCount: 1,
          reasoning: language === 'zh' ? "提神醒脑" : "Morning energy boost",
          products: [
            { productId: "p10", product: mockProduct("p10", language === 'zh' ? "B族维生素" : "B-Complex", "Fancl"), dosage: language === 'zh' ? "2粒" : "2 capsules" }
          ]
        },
        { 
          time: "13:00", 
          productCount: 1,
          reasoning: language === 'zh' ? "午后护肝" : "Afternoon liver support",
          products: [
            { productId: "p11", product: mockProduct("p11", language === 'zh' ? "奶蓟草" : "Milk Thistle", "Swisse"), dosage: language === 'zh' ? "2粒" : "2 capsules" }
          ]
        },
        { 
          time: "23:00", 
          productCount: 1,
          reasoning: language === 'zh' ? "熬夜急救" : "Late night support",
          products: [
            { productId: "p12", product: mockProduct("p12", language === 'zh' ? "辅酶Q10" : "CoQ10", "Doctor's Best"), dosage: language === 'zh' ? "1粒" : "1 capsule" }
          ]
        },
      ],
      conflicts: [{ id: "c1", supplementA: "p10", supplementB: "p12", description: language === 'zh' ? "可能引起过度兴奋" : "May cause over-stimulation", severity: "LOW", nutrientA: "vit-b", nutrientB: "coq10" } as any],
      synergies: [],
      likeCount: 210,
      forkCount: 67,
      createdAt: "2024-01-14",
      isPublic: true,
      optimizedAt: new Date(),
    },
  ], [language, t]);

  const handleForkSundial = (sundial: Sundial) => {
    if (onForkSundial) {
      onForkSundial(sundial);
    } else {
      alert(t.forkSundialAlert);
    }
  };

  return (
    <div className="retro-border p-6 bg-white">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-retro-yellow border-3 border-retro-black p-3">
            <RotatingPointer />
          </div>
          <div>
            <h2 className="font-black text-2xl font-mono uppercase text-retro-black">
              {t.communityWall}
            </h2>
            <p className="text-sm font-mono text-retro-green font-bold">
              [{t.communitySubtitle}]
            </p>
          </div>
        </div>

        {/* 发帖按钮 */}
        <button className="retro-button px-6 py-3 font-mono font-bold text-retro-black">
          {t.postMyStack}
        </button>
      </div>

      {/* 帖子网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sundials.map((sundial) => (
          <div
            key={sundial.id}
            onClick={() => setSelectedSundial(sundial)}
            className="border-3 border-retro-green bg-white p-4 cursor-pointer hover:bg-retro-yellow/10 transition-colors"
          >
            {/* 作者信息 */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-retro-green border-2 border-retro-black flex items-center justify-center font-bold text-white text-sm">
                {sundial.author?.[0] || "?"}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm font-mono text-retro-black">{sundial.author}</p>
                <p className="text-xs font-mono text-retro-black/50">{sundial.createdAt}</p>
              </div>
            </div>

            {/* 标题 */}
            <h3 className="font-black text-lg font-mono mb-2 bg-retro-black text-retro-yellow px-2 py-1 truncate">
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
                <circle cx="60" cy="60" r="15" fill="#0F380F" />
              </svg>
            </div>

            <div className="text-xs font-mono text-retro-black mb-3 text-center">
              {sundial.timeSlots.length} {t.slots} · {sundial.timeSlots.reduce((sum, s) => sum + (s.productCount || s.products.length), 0)} {t.products}
            </div>

            {/* 统计 */}
            <div className="flex items-center justify-between gap-4 mb-3 text-xs font-mono text-retro-black px-2">
              <span className={`font-bold ${sundial.conflicts.length === 0 ? 'text-retro-green' : 'text-red-500'}`}>
                {sundial.conflicts.length === 0 ? '✓' : '!'} {sundial.conflicts.length} {t.conflicts}
              </span>
              <span>👍 {sundial.likeCount}</span>
              <span>🔱 {sundial.forkCount} {t.forks}</span>
            </div>

            {/* 操作按钮 (prevent bubbling) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleForkSundial(sundial);
              }}
              className="retro-button w-full py-2 text-sm font-mono font-black text-retro-black"
            >
              {t.forkThisSundial}
            </button>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      <div className="text-center mt-6">
        <button className="retro-button px-8 py-3 font-mono font-bold text-retro-black">
          {t.loadMore}
        </button>
      </div>

      {/* 详情弹窗 */}
      {selectedSundial && (
        <SundialDetailModal
          sundial={selectedSundial}
          onClose={() => setSelectedSundial(null)}
          onFork={() => {
            handleForkSundial(selectedSundial);
            setSelectedSundial(null);
          }}
          language={language}
        />
      )}
    </div>
  );
}
