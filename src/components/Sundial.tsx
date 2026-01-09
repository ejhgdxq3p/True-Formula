"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Sundial as SundialType } from "@/types/product";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";
import { getProductDisplayName, translateDosage } from "@/lib/product-translator";
import { generateFallbackCommentary } from "@/prompts/fallback";

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

  const [hoveredProduct, setHoveredProduct] = React.useState<{
    product: any;
    x: number;
    y: number;
  } | null>(null);

  const SIZE = 500;
  const CENTER = SIZE / 2;
  const RADIUS = 180;

  // 翻译时间标签
  const getTimingLabel = (timing: string) => {
    const timingMap: Record<string, string> = {
      'MORNING': t.timingMorning,
      'AFTERNOON': t.timingAfternoon,
      'EVENING': t.timingEvening,
      'POST_WORKOUT': t.timingPostWorkout,
      'BEFORE_BED': t.timingBeforeBed,
      'WITH_FOOD': t.timingWithFood,
      'MORNING_WITH_FOOD': t.timingMorning,
      'MORNING_EMPTY_STOMACH': t.timingEmptyStomach,
      'EMPTY_STOMACH': t.timingEmptyStomach,
      'ANYTIME': t.timingAnytime,
    };
    return timingMap[timing] || timing;
  };

  return (
    <div className="retro-border p-6 bg-white h-full flex flex-col overflow-y-auto">
      {/* 标题 */}
      <div className="bg-retro-black text-retro-yellow p-3 mb-6 text-center border-3 border-retro-yellow">
        <h2 className="font-black text-xl font-mono uppercase flex items-center justify-center gap-3">
          <RotatingPointer />
          {t.mySundial}
          <RotatingPointer />
        </h2>
        {sundial && (
          <p className="text-xs mt-1 font-mono text-retro-yellow/80">
            {t.lastOptimized}: {new Date(sundial.optimizedAt).toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US')}
          </p>
        )}
      </div>

      {/* 日晷可视化区域 */}
      <div className="bg-retro-green/5 border-3 border-retro-green p-6 flex items-center justify-center min-h-[450px] relative">
        {isOptimizing ? (
          /* AI 流星雨动画（占据整个日晷区域）*/
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
            {/* 标题 */}
            <div className="text-center mb-8">
              <h3 className="font-black text-2xl font-mono uppercase text-retro-black mb-2">
                {t.aiAnalyzing}
              </h3>
              <p className="text-sm font-mono text-retro-black/60">
                {t.optimizingSchedule}
              </p>
            </div>

            {/* 圆形轨道流星动画 */}
            <MeteorShowerBars language={language} />
          </div>
        ) : sundial ? (
          /* 正常日晷 SVG */
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
                  <g
                    key={`${slot.time}-${p.productId}`}
                    onMouseEnter={() => setHoveredProduct({ product: p, x, y })}
                    onMouseLeave={() => setHoveredProduct(null)}
                    style={{ cursor: 'pointer' }}
                  >
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
                      {(p.product?.brand || p.product?.name || '??').slice(0, 2)}
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
        ) : (
          /* 空状态 */
          <div className="text-center font-mono text-retro-black/50">
            <div className="text-4xl mb-4">○</div>
            <div className="text-sm">
              [{t.addProductsToStart}]
            </div>
          </div>
        )}

        {/* 产品信息 Tooltip */}
        {hoveredProduct && (
          <div
            className="absolute bg-white border-4 border-retro-black p-4 shadow-hard z-50 w-72"
            style={{
              left: `${hoveredProduct.x > SIZE / 2 ? hoveredProduct.x - 280 : hoveredProduct.x + 50}px`,
              top: `${hoveredProduct.y}px`,
              pointerEvents: 'none',
            }}
          >
            {/* 产品名称 */}
            <div className="font-black text-sm font-mono text-retro-black mb-1 uppercase border-b-2 border-retro-yellow pb-1">
              {getProductDisplayName(hoveredProduct.product.product, language)}
            </div>

            {/* 品牌 */}
            <div className="text-xs font-mono text-retro-black/60 mb-2">
              {hoveredProduct.product.product.brand}
            </div>

            {/* 用量 */}
            <div className="bg-retro-green/10 border-2 border-retro-green px-2 py-1 mb-2">
              <span className="text-xs font-mono font-bold text-retro-black">
                {t.dosage}: {translateDosage(hoveredProduct.product.dosage || hoveredProduct.product.product.dosagePerServing, language)}
              </span>
            </div>

            {/* 成分 */}
            {hoveredProduct.product.product.ingredients && hoveredProduct.product.product.ingredients.length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-mono font-bold text-retro-black mb-1">
                  {t.ingredients}:
                </div>
                <div className="space-y-1">
                  {hoveredProduct.product.product.ingredients.slice(0, 5).map((ing: any, idx: number) => (
                    <div key={idx} className="text-xs font-mono text-retro-black/70 flex justify-between">
                      <span>{ing.nutrient.commonName || ing.nutrient.name}</span>
                      <span className="font-bold text-retro-green">
                        {ing.amount}{ing.unit}
                      </span>
                    </div>
                  ))}
                  {hoveredProduct.product.product.ingredients.length > 5 && (
                    <div className="text-xs font-mono text-retro-black/50">
                      +{hoveredProduct.product.product.ingredients.length - 5} {t.more}...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 推荐时间 */}
            <div className="bg-retro-yellow/20 border-2 border-retro-yellow px-2 py-1 text-xs font-mono">
              <span className="font-bold">{t.timing}:</span>{' '}
              <span className="text-retro-black/70">
                {getTimingLabel(hoveredProduct.product.product.optimalTiming)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* AI 毒舌点评（替代 timeline）*/}
      {sundial && sundial.timeSlots.length > 0 && (
        <div className="bg-retro-yellow/20 border-3 border-retro-yellow p-4 mt-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-black text-sm font-mono uppercase text-retro-black">
              {t.aiRoast}
            </h3>
          </div>
          <div className="max-h-32 overflow-y-auto pr-2">
            <p className="text-sm font-mono text-retro-black leading-relaxed whitespace-pre-wrap">
              {sundial.aiCommentary || generateFallbackCommentary(
                sundial.conflicts.length,
                sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0),
                language
              )}
            </p>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t-2 border-retro-yellow text-center text-xs font-mono">
            <div>
              <div className="font-black text-2xl text-retro-black">
                {sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0)}
              </div>
              <div className="text-retro-black/60">{t.products}</div>
            </div>
            <div>
              <div className={`font-black text-2xl ${sundial.conflicts.length > 0 ? 'text-red-500' : 'text-retro-green'}`}>
                {sundial.conflicts.length}
              </div>
              <div className="text-retro-black/60">{t.conflicts}</div>
            </div>
            <div>
              <div className="font-black text-2xl text-retro-green">
                {sundial.synergies?.length || 0}
              </div>
              <div className="text-retro-black/60">{t.synergies}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// AI 圆形轨道流星动画
function MeteorShowerBars({ language }: { language: Language }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30); // 约2秒完成

    return () => clearInterval(interval);
  }, []);

  const SIZE = 450;
  const CENTER = SIZE / 2;

  // 3个同心圆轨道
  const tracks = [
    { radius: 180, count: 16 }, // 外圈：16条流星
    { radius: 130, count: 12 }, // 中圈：12条流星
    { radius: 80, count: 8 },   // 内圈：8条流星
  ];

  // 生成所有轨道的流星
  const allMeteors = tracks.flatMap((track, trackIdx) =>
    Array.from({ length: track.count }, (_, i) => ({
      radius: track.radius,
      angle: (i / track.count) * 360, // 均匀分布
      delay: trackIdx * 15 + i * 5, // 轨道间错开 + 流星间错开
      speed: 0.9 + Math.random() * 0.3, // 随机速度
    }))
  );

  return (
    <div className="relative w-[450px] h-[450px]">
      <svg width={SIZE} height={SIZE} className="border-4 border-retro-black bg-white">
        {/* 中心圆 */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r="40"
          fill="var(--retro-black)"
        />

        {/* 绘制3个轨道圆圈 */}
        {tracks.map((track, idx) => (
          <circle
            key={`track-${idx}`}
            cx={CENTER}
            cy={CENTER}
            r={track.radius}
            fill="none"
            stroke="var(--retro-gray)"
            strokeWidth="3"
            strokeDasharray="6 6"
            opacity="0.3"
          />
        ))}

        {/* 所有流星轨迹 */}
        {allMeteors.map((meteor, i) => {
          const adjustedProgress = Math.max(0, (progress - meteor.delay) * meteor.speed);
          const clampedProgress = Math.min(100, adjustedProgress);

          // 计算起始和结束位置
          const startAngle = (meteor.angle - 90) * Math.PI / 180; // 从12点方向开始
          const arcLength = (clampedProgress / 100) * (2 * Math.PI); // 轨迹长度

          // 流星尾巴长度（约40度弧长）
          const tailLength = Math.PI / 4.5;
          const startArc = startAngle;
          const endArc = startAngle + arcLength;

          // 黄色背景条（整条轨迹）
          const yellowPath = `
            M ${CENTER + meteor.radius * Math.cos(startArc)} ${CENTER + meteor.radius * Math.sin(startArc)}
            A ${meteor.radius} ${meteor.radius} 0 ${arcLength > Math.PI ? 1 : 0} 1
            ${CENTER + meteor.radius * Math.cos(endArc)} ${CENTER + meteor.radius * Math.sin(endArc)}
          `;

          // 绿色前景条（流星头部）
          const greenStartArc = Math.max(startArc, endArc - tailLength);
          const greenPath = clampedProgress > 0 ? `
            M ${CENTER + meteor.radius * Math.cos(greenStartArc)} ${CENTER + meteor.radius * Math.sin(greenStartArc)}
            A ${meteor.radius} ${meteor.radius} 0 ${(endArc - greenStartArc) > Math.PI ? 1 : 0} 1
            ${CENTER + meteor.radius * Math.cos(endArc)} ${CENTER + meteor.radius * Math.sin(endArc)}
          ` : '';

          return (
            <g key={i}>
              {/* 黄色轨迹 */}
              {clampedProgress > 0 && (
                <path
                  d={yellowPath}
                  fill="none"
                  stroke="var(--retro-yellow)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              )}
              {/* 绿色流星头 */}
              {clampedProgress > 10 && greenPath && (
                <path
                  d={greenPath}
                  fill="none"
                  stroke="var(--retro-green)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {/* 中心文字 */}
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-mono text-2xl font-black fill-retro-yellow"
        >
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
}
