"use client";

import type { Sundial } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface SundialDetailModalProps {
  sundial: Sundial;
  onClose: () => void;
  onFork: () => void;
  language: Language;
}

export default function SundialDetailModal({
  sundial,
  onClose,
  onFork,
  language
}: SundialDetailModalProps) {
  const t = useTranslation(language);

  const SIZE = 400;
  const CENTER = SIZE / 2;
  const RADIUS = 150;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="retro-border bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="bg-retro-black text-retro-yellow p-4 border-b-3 border-retro-green flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <RotatingPointer />
            <div>
              <h2 className="font-black text-xl font-mono uppercase">
                {sundial.name}
              </h2>
              <p className="text-xs font-mono text-retro-yellow/70">
                {language === 'zh' ? '作者' : 'BY'}: {sundial.author}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-3xl font-bold hover:text-red-500 transition-colors"
          >
            X
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：日晷可视化 */}
          <div>
            <div className="bg-retro-green/5 border-3 border-retro-green p-6 flex items-center justify-center mb-4">
              <svg width={SIZE} height={SIZE} className="border-4 border-retro-black bg-white">
                {/* 外圈 */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="white"
                  stroke="var(--retro-green)"
                  strokeWidth="4"
                />

                {/* 刻度线 */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
                  const x1 = CENTER + (RADIUS - 12) * Math.cos(angle);
                  const y1 = CENTER + (RADIUS - 12) * Math.sin(angle);
                  const x2 = CENTER + RADIUS * Math.cos(angle);
                  const y2 = CENTER + RADIUS * Math.sin(angle);

                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--retro-black)"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* 产品分布 */}
                {sundial.timeSlots.flatMap(slot => {
                  const [h, m] = slot.time.split(':').map(Number);
                  const timeVal = h + m / 60;
                  const angle = (timeVal / 24) * 2 * Math.PI - Math.PI / 2;

                  return slot.products.map((p, idx) => {
                    const r = RADIUS * 0.7 - idx * 20;
                    const x = CENTER + r * Math.cos(angle);
                    const y = CENTER + r * Math.sin(angle);

                    return (
                      <g key={`${slot.time}-${p.productId}`}>
                        <line
                          x1={CENTER}
                          y1={CENTER}
                          x2={x}
                          y2={y}
                          stroke="var(--retro-gray)"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        <rect
                          x={x - 15}
                          y={y - 15}
                          width="30"
                          height="30"
                          fill="var(--retro-yellow)"
                          stroke="var(--retro-black)"
                          strokeWidth="3"
                        />
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-black font-mono"
                          fill="var(--retro-black)"
                        >
                          {p.product.brand.slice(0, 2)}
                        </text>
                      </g>
                    );
                  });
                })}

                <circle cx={CENTER} cy={CENTER} r="40" fill="var(--retro-black)" />
                <text
                  x={CENTER}
                  y={CENTER}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono text-sm font-bold"
                  fill="var(--retro-yellow)"
                >
                  24H
                </text>
              </svg>
            </div>

            {/* AI毒舌点评 */}
            <div className="bg-retro-yellow/20 border-3 border-retro-yellow p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h3 className="font-black text-sm font-mono uppercase text-retro-black">
                  {language === 'zh' ? 'AI 毒舌点评' : 'AI ROAST'}
                </h3>
              </div>
              <p className="text-sm font-mono text-retro-black leading-relaxed">
                {sundial.aiCommentary || generateAIRoast(sundial, language)}
              </p>
            </div>

            {/* Fork按钮 */}
            <button
              onClick={onFork}
              className="retro-button w-full py-4 mt-4 font-mono font-black text-retro-black text-lg"
            >
              {language === 'zh' ? 'FORK 这个日晷' : 'FORK THIS SUNDIAL'}
            </button>
          </div>

          {/* 右侧：产品列表 */}
          <div className="space-y-4">
            <h3 className="font-black text-lg font-mono uppercase text-retro-black border-b-3 border-retro-green pb-2">
              {language === 'zh' ? '产品清单' : 'PRODUCT LIST'}
            </h3>

            {sundial.timeSlots.map((slot, i) => (
              <div key={i} className="border-3 border-retro-green bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-retro-yellow border-2 border-retro-black px-3 py-1 font-black font-mono text-retro-black">
                    {slot.time}
                  </div>
                  <span className="text-xs font-mono text-retro-black/60">
                    {slot.products.length} {language === 'zh' ? '个产品' : 'PRODUCTS'}
                  </span>
                </div>

                <div className="space-y-2">
                  {slot.products.map((p, j) => (
                    <div key={j} className="bg-retro-green/5 border-2 border-retro-green p-2">
                      <div className="text-xs font-mono text-retro-black/60">
                        {p.product.brand}
                      </div>
                      <div className="font-bold text-sm font-mono text-retro-black">
                        {p.product.name}
                      </div>
                      <div className="text-xs font-mono text-retro-green mt-1">
                        {p.dosage}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-mono text-retro-black/50 mt-2 italic">
                  {slot.reasoning}
                </div>
              </div>
            ))}

            {/* 统计信息 */}
            <div className="bg-retro-black text-retro-yellow p-4 border-3 border-retro-yellow">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-black text-2xl font-mono">
                    {sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0)}
                  </div>
                  <div className="text-xs font-mono">
                    {language === 'zh' ? '产品' : 'PRODUCTS'}
                  </div>
                </div>
                <div>
                  <div className="font-black text-2xl font-mono text-red-400">
                    {sundial.conflicts.length}
                  </div>
                  <div className="text-xs font-mono">
                    {language === 'zh' ? '冲突' : 'CONFLICTS'}
                  </div>
                </div>
                <div>
                  <div className="font-black text-2xl font-mono text-green-400">
                    {sundial.likeCount}
                  </div>
                  <div className="text-xs font-mono">
                    {language === 'zh' ? '点赞' : 'LIKES'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI毒舌点评生成器
function generateAIRoast(sundial: Sundial, language: Language): string {
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
}
