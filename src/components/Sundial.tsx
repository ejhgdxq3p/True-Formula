"use client";

import React from "react";
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

      {/* 日晷可视化区域 */}
      <div className="bg-retro-green/5 border-3 border-retro-green p-6 flex items-center justify-center min-h-[500px] relative">
        {isOptimizing ? (
          /* AI 流星雨动画（占据整个日晷区域）*/
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
            {/* 标题 */}
            <div className="text-center mb-8">
              <h3 className="font-black text-2xl font-mono uppercase text-retro-black mb-2">
                {language === 'zh' ? 'AI 正在分析' : 'AI ANALYZING'}
              </h3>
              <p className="text-sm font-mono text-retro-black/60">
                {language === 'zh' ? '检测冲突、优化时间表...' : 'Optimizing schedule...'}
              </p>
            </div>

            {/* 流星雨进度条区域 */}
            <div className="relative w-full max-w-xl h-64 bg-retro-yellow border-3 border-retro-black overflow-hidden">
              <MeteorShowerBars language={language} />
            </div>
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
        ) : (
          /* 空状态 */
          <div className="text-center font-mono text-retro-black/50">
            <div className="text-4xl mb-4">○</div>
            <div className="text-sm">
              [{language === 'zh' ? '加产品开始优化' : 'ADD PRODUCTS TO START'}]
            </div>
          </div>
        )}
      </div>

      {/* AI 毒舌点评（替代 timeline）*/}
      {sundial && sundial.timeSlots.length > 0 && (
        <div className="bg-retro-yellow/20 border-3 border-retro-yellow p-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <h3 className="font-black text-sm font-mono uppercase text-retro-black">
              {language === 'zh' ? 'AI 毒舌点评' : 'AI ROAST'}
            </h3>
          </div>
          <p className="text-sm font-mono text-retro-black leading-relaxed">
            {generateAIRoast(sundial, language)}
          </p>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t-2 border-retro-yellow text-center text-xs font-mono">
            <div>
              <div className="font-black text-2xl text-retro-black">
                {sundial.timeSlots.reduce((sum, s) => sum + s.products.length, 0)}
              </div>
              <div className="text-retro-black/60">{language === 'zh' ? '产品' : 'PRODUCTS'}</div>
            </div>
            <div>
              <div className={`font-black text-2xl ${sundial.conflicts.length > 0 ? 'text-red-500' : 'text-retro-green'}`}>
                {sundial.conflicts.length}
              </div>
              <div className="text-retro-black/60">{language === 'zh' ? '冲突' : 'CONFLICTS'}</div>
            </div>
            <div>
              <div className="font-black text-2xl text-retro-green">
                {sundial.synergies?.length || 0}
              </div>
              <div className="text-retro-black/60">{language === 'zh' ? '协同' : 'SYNERGIES'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// AI 流星雨动画子组件
function MeteorShowerBars({ language }: { language: Language }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40); // 2秒完成

    return () => clearInterval(interval);
  }, []);

  // 6条错落有致的进度条
  const bars = [
    { delay: 0, speed: 1.0, offset: 0 },
    { delay: 200, speed: 1.2, offset: 15 },
    { delay: 100, speed: 0.9, offset: 30 },
    { delay: 300, speed: 1.1, offset: 45 },
    { delay: 150, speed: 0.95, offset: 60 },
    { delay: 250, speed: 1.05, offset: 75 },
  ];

  return (
    <>
      {bars.map((bar, i) => {
        // 计算每条进度条的实际进度（考虑延迟和速度）
        const adjustedProgress = Math.max(0, (progress - bar.delay / 40) * bar.speed);
        const clampedProgress = Math.min(100, adjustedProgress);

        return (
          <div
            key={i}
            className="absolute h-8"
            style={{
              top: `${bar.offset}%`,
              left: 0,
              right: 0,
              transform: 'skewY(-5deg)', // 斜向右下
            }}
          >
            {/* 背景：纯黄色 */}
            <div className="h-full bg-retro-yellow border-2 border-retro-black relative overflow-hidden">
              {/* 前景：纯绿色（无渐变！）*/}
              <div
                className="absolute inset-y-0 left-0 bg-retro-green transition-all duration-100 ease-linear"
                style={{
                  width: `${clampedProgress}%`,
                }}
              ></div>
            </div>
          </div>
        );
      })}

      {/* 最终全屏绿色遮罩 */}
      {progress >= 95 && (
        <div
          className="absolute inset-0 bg-retro-green transition-opacity duration-500"
          style={{
            opacity: (progress - 95) / 5, // 95-100% 逐渐显示
          }}
        ></div>
      )}

      {/* 进度百分比 */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div className="font-black text-4xl font-mono text-retro-green">
          {Math.round(progress)}%
        </div>
      </div>
    </>
  );
}

// AI 毒舌点评生成器
function generateAIRoast(sundial: SundialType, language: Language): string {
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
