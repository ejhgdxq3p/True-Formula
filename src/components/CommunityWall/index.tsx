"use client";

import { useState } from "react";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";
import SundialDetailModal from "@/components/SundialDetailModal";
import type { Sundial, Product, SundialSlot } from "@/types/product";
import { ProductCategory, TimingPreference } from "@/types/product";

// Mock helper to create a minimal product for display
const mockProduct = (id: string, name: string, brand: string): Product => ({
  id,
  name,
  brand,
  category: ProductCategory.MULTIVITAMIN,
  ingredients: [],
  dosagePerServing: "1粒",
  servingsPerDay: 1,
  optimalTiming: "MORNING_WITH_FOOD" as TimingPreference,
});

export default function CommunityWall({
  language,
  onForkSundial
}: {
  language: Language;
  onForkSundial?: (sundial: Sundial) => void;
}) {
  const t = useTranslation(language);
  const [selectedSundial, setSelectedSundial] = useState<Sundial | null>(null);

  const [sundials] = useState<Sundial[]>([
    {
      id: "sundial-1",
      author: "健身达人小王",
      name: "增肌补剂日晷",
      description: "适合健身人群",
      timeSlots: [
        { 
          time: "07:00", 
          productCount: 2,
          reasoning: "晨起补充基础维生素",
          products: [
            { productId: "p1", product: mockProduct("p1", "综合维生素", "Swisse"), dosage: "1粒" },
            { productId: "p2", product: mockProduct("p2", "鱼油", "Nature Made"), dosage: "2粒" }
          ]
        },
        { 
          time: "14:00", 
          productCount: 1,
          reasoning: "午餐后补充",
          products: [
             { productId: "p3", product: mockProduct("p3", "维生素D3", "Doctor's Best"), dosage: "5000IU" }
          ]
        },
        { 
          time: "20:00", 
          productCount: 3,
          reasoning: "运动后恢复",
          products: [
            { productId: "p4", product: mockProduct("p4", "乳清蛋白", "Optimum Nutrition"), dosage: "1勺" },
            { productId: "p5", product: mockProduct("p5", "肌酸", "Muscletech"), dosage: "5g" },
            { productId: "p6", product: mockProduct("p6", "谷氨酰胺", "Now Foods"), dosage: "5g" }
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
      author: "养生达人李姐",
      name: "女性抗氧化日晷",
      description: "皮肤变好",
      timeSlots: [
        { 
          time: "08:00", 
          productCount: 1,
          reasoning: "随早餐服用吸收好",
          products: [
            { productId: "p7", product: mockProduct("p7", "葡萄籽", "Swisse"), dosage: "2粒" }
          ]
        },
        { 
          time: "12:00", 
          productCount: 1,
          reasoning: "午餐时补充",
          products: [
            { productId: "p8", product: mockProduct("p8", "维生素C", "Jamieson"), dosage: "500mg" }
          ]
        },
        { 
          time: "21:00", 
          productCount: 1,
          reasoning: "睡前抗氧化",
          products: [
            { productId: "p9", product: mockProduct("p9", "胶原蛋白", "Swisse"), dosage: "1瓶" }
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
      author: "熬夜冠军张三",
      name: "护肝提神日晷",
      description: "打工人必备",
      timeSlots: [
        { 
          time: "09:00", 
          productCount: 1,
          reasoning: "提神醒脑",
          products: [
            { productId: "p10", product: mockProduct("p10", "B族维生素", "Fancl"), dosage: "2粒" }
          ]
        },
        { 
          time: "13:00", 
          productCount: 1,
          reasoning: "午后护肝",
          products: [
            { productId: "p11", product: mockProduct("p11", "奶蓟草", "Swisse"), dosage: "2粒" }
          ]
        },
        { 
          time: "23:00", 
          productCount: 1,
          reasoning: "熬夜急救",
          products: [
            { productId: "p12", product: mockProduct("p12", "辅酶Q10", "Doctor's Best"), dosage: "1粒" }
          ]
        },
      ],
      conflicts: [{ id: "c1", supplementA: "p10", supplementB: "p12", description: "可能引起过度兴奋", severity: "LOW", nutrientA: "vit-b", nutrientB: "coq10" } as any],
      synergies: [],
      likeCount: 210,
      forkCount: 67,
      createdAt: "2024-01-14",
      isPublic: true,
      optimizedAt: new Date(),
    },
  ]);

  const handleForkSundial = (sundial: Sundial) => {
    if (onForkSundial) {
      onForkSundial(sundial);
    } else {
      alert(`已复制日晷 "${sundial.name}" 到你的工作台！`);
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
              {sundial.timeSlots.length} {language === 'zh' ? '个时间点' : 'SLOTS'} · {sundial.timeSlots.reduce((sum, s) => sum + (s.productCount || s.products.length), 0)} {language === 'zh' ? '个产品' : 'PRODUCTS'}
            </div>

            {/* 统计 */}
            <div className="flex items-center justify-between gap-4 mb-3 text-xs font-mono text-retro-black px-2">
              <span className={`font-bold ${sundial.conflicts.length === 0 ? 'text-retro-green' : 'text-red-500'}`}>
                {sundial.conflicts.length === 0 ? '✓' : '!'} {sundial.conflicts.length} {t.conflicts}
              </span>
              <span>👍 {sundial.likeCount}</span>
              <span>🔱 {sundial.forkCount} Forks</span>
            </div>

            {/* 操作按钮 (prevent bubbling) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleForkSundial(sundial);
              }}
              className="retro-button w-full py-2 text-sm font-mono font-black text-retro-black"
            >
              {language === 'zh' ? 'FORK 此日晷' : 'FORK THIS SUNDIAL'}
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
