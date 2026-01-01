"use client";

import { useEffect, useState } from "react";

interface AILoadingAnimationProps {
  isActive: boolean;
  language: 'zh' | 'en';
}

export default function AILoadingAnimation({ isActive, language }: AILoadingAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40); // 每40ms增加2%，总共2秒完成

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  // 生成6条错落有致的进度条
  const bars = [
    { delay: 0, speed: 1.0, offset: 0 },
    { delay: 0.2, speed: 1.2, offset: 15 },
    { delay: 0.1, speed: 0.9, offset: 30 },
    { delay: 0.3, speed: 1.1, offset: 45 },
    { delay: 0.15, speed: 0.95, offset: 60 },
    { delay: 0.25, speed: 1.05, offset: 75 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="retro-border bg-white p-8 max-w-2xl w-full">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="font-black text-2xl font-mono uppercase text-retro-black mb-2">
            {language === 'zh' ? 'AI 正在分析' : 'AI ANALYZING'}
          </h2>
          <p className="text-sm font-mono text-retro-black/60">
            {language === 'zh' ? '检测冲突、优化时间表...' : 'Detecting conflicts, optimizing schedule...'}
          </p>
        </div>

        {/* 流星雨进度条 */}
        <div className="relative h-64 bg-retro-yellow/20 border-3 border-retro-black overflow-hidden">
          {bars.map((bar, i) => {
            // 计算每条进度条的实际进度（考虑延迟和速度）
            const adjustedProgress = Math.max(0, (progress - bar.delay * 100) * bar.speed);
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
                {/* 背景（黄色）*/}
                <div className="h-full bg-retro-yellow border-2 border-retro-black relative overflow-hidden">
                  {/* 前景（绿色进度）*/}
                  <div
                    className="absolute inset-y-0 left-0 bg-retro-green transition-all duration-100 ease-linear"
                    style={{
                      width: `${clampedProgress}%`,
                    }}
                  >
                    {/* 流星尾巴效果 */}
                    <div
                      className="absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-retro-green/0"
                      style={{
                        background: 'linear-gradient(to right, rgba(0, 150, 64, 0.3), rgba(0, 150, 64, 1))',
                      }}
                    ></div>
                  </div>
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
        </div>

        {/* 进度百分比 */}
        <div className="text-center mt-6">
          <div className="font-black text-4xl font-mono text-retro-green">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
