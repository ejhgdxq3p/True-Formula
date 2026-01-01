"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Sundial as SundialType } from "@/types/product";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";

interface SundialProps {
  sundial: SundialType | null;
  isOptimizing: boolean;  // AI正在规划
  language: Language;
}

export function Sundial({ sundial, isOptimizing, language }: SundialProps) {
  const t = useTranslation(language);
  const { setNodeRef, isOver } = useDroppable({
    id: "sundial-drop-zone",
  });

  const SIZE = 500;
  const CENTER = SIZE / 2;
  const RADIUS = 180;

  return (
    <div className="retro-border p-6 bg-white h-full flex flex-col">
      {/* 标题 */}
      <div className="bg-retro-black text-retro-yellow p-3 mb-6 text-center border-3 border-retro-yellow">
        <h2 className="font-black text-xl font-mono uppercase flex items-center justify-center gap-3">
          <RotatingPointer />
          {language === 'zh' ? '我的日晷' : 'MY SUNDIAL'}
          <RotatingPointer />
        </h2>
        {sundial && (
          <p className="text-xs mt-1 font-mono text-retro-yellow/80">
            {language === 'zh' ? '最后优化' : 'LAST OPTIMIZED'}: {new Date(sundial.optimizedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* AI优化动画 */}
      {isOptimizing && (
        <div className="absolute inset-0 bg-retro-green/20 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-retro-black border-4 border-retro-yellow p-8 text-center">
            <div className="text-6xl mb-4 animate-spin">⚙</div>
            <div className="font-black text-2xl font-mono text-retro-yellow mb-2">
              AI {language === 'zh' ? '优化中' : 'OPTIMIZING'}
            </div>
            <div className="text-sm font-mono text-retro-yellow/80">
              {language === 'zh' ? '分析营养素冲突...' : 'ANALYZING CONFLICTS...'}
            </div>
            <div className="text-sm font-mono text-retro-yellow/80">
              {language === 'zh' ? '计算最佳时间...' : 'CALCULATING OPTIMAL TIMING...'}
            </div>
          </div>
        </div>
      )}

      {/* 日晷可视化 */}
      <div 
        ref={setNodeRef}
        className={`flex-1 flex items-center justify-center bg-retro-green/5 border-2 border-retro-green ${isOver ? "bg-retro-yellow/10" : ""}`}
      >
        {!sundial || sundial.timeSlots.length === 0 ? (
          <div className="text-center font-mono text-retro-black/50">
            <div className="text-4xl mb-4">○</div>
            <div className="text-sm">
              [{language === 'zh' ? '从左边加产品开始' : 'ADD PRODUCTS TO START'}]
            </div>
          </div>
        ) : (
          <svg width={SIZE} height={SIZE} className="border-4 border-retro-black bg-white" style={{ imageRendering: 'pixelated' }}>
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
              const x1 = CENTER + (RADIUS - 15) * Math.cos(angle);
              const y1 = CENTER + (RADIUS - 15) * Math.sin(angle);
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

            {/* 时间标签 */}
            {[0, 6, 12, 18].map((hour) => {
              const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
              const x = CENTER + (RADIUS + 35) * Math.cos(angle);
              const y = CENTER + (RADIUS + 35) * Math.sin(angle);

              return (
                <g key={hour}>
                  <rect
                    x={x - 20}
                    y={y - 12}
                    width="40"
                    height="24"
                    fill="var(--retro-yellow)"
                    stroke="var(--retro-black)"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono font-black text-sm"
                    fill="var(--retro-black)"
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </text>
                </g>
              );
            })}

            {/* 产品分布 */}
            {sundial.timeSlots.flatMap(slot => {
              const [h, m] = slot.time.split(':').map(Number);
              const timeVal = h + m / 60;
              const angle = (timeVal / 24) * 2 * Math.PI - Math.PI / 2;

              return slot.products.map((p, idx) => {
                const r = RADIUS * 0.7 - idx * 25;
                const x = CENTER + r * Math.cos(angle);
                const y = CENTER + r * Math.sin(angle);

                return (
                  <g key={`${slot.time}-${p.productId}`}>
                    {/* 连线 */}
                    <line
                      x1={CENTER}
                      y1={CENTER}
                      x2={x}
                      y2={y}
                      stroke="var(--retro-gray)"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />

                    {/* 产品方块 */}
                    <rect
                      x={x - 20}
                      y={y - 20}
                      width="40"
                      height="40"
                      fill="var(--retro-yellow)"
                      stroke="var(--retro-black)"
                      strokeWidth="3"
                    />
                    <rect
                      x={x - 17}
                      y={y - 17}
                      width="34"
                      height="34"
                      fill="white"
                      stroke="var(--retro-green)"
                      strokeWidth="2"
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

            {/* 中心 */}
            <circle cx={CENTER} cy={CENTER} r="50" fill="var(--retro-black)" />
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
        )}
      </div>

      {/* 时间线列表 */}
      {sundial && sundial.timeSlots.length > 0 && (
        <div className="mt-6 space-y-2 max-h-40 overflow-y-auto">
          <h3 className="font-bold text-sm font-mono text-retro-black mb-2 border-b-2 border-retro-green pb-1">
            {language === 'zh' ? '时间线' : 'TIMELINE'}
          </h3>
          {sundial.timeSlots.map((slot, i) => (
            <div key={i} className="flex gap-3 text-xs font-mono">
              <span className="font-black text-retro-green w-12">{slot.time}</span>
              <div className="flex-1">
                {slot.products.map((p, j) => (
                  <div key={j} className="text-retro-black">
                    {p.product.brand} - {p.product.name.slice(0, 20)}...
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
