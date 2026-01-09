"use client";

import { useState } from "react";
import type { InfluencerAnalysis, Product } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface InfluencerPanelProps {
  onAdoptProducts: (products: Product[]) => void;
  language: Language;
}

export default function InfluencerPanel({ onAdoptProducts, language }: InfluencerPanelProps) {
  const t = useTranslation(language);
  const [input, setInput] = useState("");
  const [inputMode, setInputMode] = useState<'text' | 'video'>('text');
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InfluencerAnalysis | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // 调用真实的AI分析API
      const res = await fetch('/api/analyze-influencer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputMode === 'text' ? input : videoUrl,
          mode: inputMode,
          language
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t.analysisFailed);
      }

      const data = await res.json();

      if (!data.success || !data.data) {
        throw new Error('API返回数据格式错误');
      }

      setAnalysis(data.data);
      // 默认全选
      setSelectedProducts(data.data.recommendedProducts.map((_: any, i: number) => i.toString()));
    } catch (err) {
      console.error('AI分析错误:', err);
      alert(
        `${t.analysisFailed}: ${err instanceof Error ? err.message : t.unknownError}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptAll = () => {
    const productsToAdopt = analysis!.recommendedProducts
      .filter((_, i) => selectedProducts.includes(i.toString()))
      .map(rp => rp.matchedProduct!)
      .filter(Boolean);

    onAdoptProducts(productsToAdopt);

    // 清空选择状态，避免重复添加
    setSelectedProducts([]);
    setAnalysis(null);
    setInput('');
    setVideoUrl('');
  };

  return (
    <div className="retro-border p-4 bg-white h-full flex flex-col">
      {/* 标题 */}
      <div className="bg-retro-yellow border-3 border-retro-black p-2 mb-4">
        <h2 className="font-black text-lg uppercase font-mono text-retro-black flex items-center gap-2">
          <RotatingPointer />
          {t.influencerRecommend}
        </h2>
      </div>

      {/* 模式切换 */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setInputMode('text')}
          className={`flex-1 py-2 font-mono font-bold border-2 border-retro-black ${
            inputMode === 'text'
              ? 'bg-retro-yellow text-retro-black'
              : 'bg-white text-retro-black hover:bg-gray-100'
          }`}
        >
          {t.textMode}
        </button>
        <button
          onClick={() => setInputMode('video')}
          className={`flex-1 py-2 font-mono font-bold border-2 border-retro-black ${
            inputMode === 'video'
              ? 'bg-retro-yellow text-retro-black'
              : 'bg-white text-retro-black hover:bg-gray-100'
          }`}
        >
          {t.videoMode}
        </button>
      </div>

      {/* 输入区 - 文字模式 */}
      {inputMode === 'text' && (
        <textarea
          className="w-full h-32 p-3 border-3 border-retro-green font-mono text-sm bg-white mb-3 resize-none text-retro-black placeholder:text-retro-gray/50"
          placeholder={t.pasteInfluencerText}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      {/* 输入区 - 视频模式 */}
      {inputMode === 'video' && (
        <div className="space-y-3 mb-3">
          <input
            type="text"
            className="w-full p-3 border-3 border-retro-green font-mono text-sm bg-white text-retro-black placeholder:text-retro-gray/50"
            placeholder={t.pasteVideoUrl}
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <div className="text-xs font-mono text-retro-black/50 bg-retro-green/10 p-2 border-2 border-retro-green">
            {t.supportedPlatforms}: YouTube, Bilibili, Douyin, Xiaohongshu
          </div>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading || (inputMode === 'text' ? !input.trim() : !videoUrl.trim())}
        className="retro-button w-full py-3 mb-4 font-mono font-black text-retro-black disabled:opacity-50"
      >
        {loading ? t.analyzing : t.aiAnalyze}
      </button>

      {/* 分析结果 */}
      {analysis && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="bg-retro-green/10 border-2 border-retro-green p-3">
            <div className="text-xs font-mono text-retro-black mb-2">
              {t.credibility}: {analysis.credibilityScore}/100
            </div>
            {analysis.warnings.length > 0 && (
              <div className="text-xs font-mono text-red-500">
                ! {analysis.warnings[0]}
              </div>
            )}
          </div>

          <div className="font-bold text-sm font-mono text-retro-black mb-2">
            {t.foundProducts}:
          </div>

          {analysis.recommendedProducts.map((rp, i) => (
            <div
              key={i}
              className={`border-3 p-3 cursor-pointer ${
                selectedProducts.includes(i.toString())
                  ? 'border-retro-yellow bg-retro-yellow/10'
                  : 'border-retro-green bg-white'
              }`}
              onClick={() => {
                setSelectedProducts(prev =>
                  prev.includes(i.toString())
                    ? prev.filter(id => id !== i.toString())
                    : [...prev, i.toString()]
                );
              }}
            >
              <div className="flex items-start gap-2">
                <div className={`w-4 h-4 border-2 border-retro-black mt-0.5 ${
                  selectedProducts.includes(i.toString()) ? 'bg-retro-yellow' : 'bg-white'
                }`}>
                  {selectedProducts.includes(i.toString()) && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm font-mono text-retro-black">
                    {rp.productName}
                  </div>
                  {rp.brand && (
                    <div className="text-xs font-mono text-retro-black/60">
                      {rp.brand}
                    </div>
                  )}
                  {rp.dosage && (
                    <div className="text-xs font-mono text-retro-green mt-1">
                      {rp.dosage}
                    </div>
                  )}
                  {!rp.matchedProduct && (
                    <div className="text-xs font-mono text-red-500 mt-1">
                      ! {t.notInDatabase}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAdoptAll}
            className="retro-button w-full py-3 font-mono font-black text-retro-black"
          >
            {t.adoptSelected} ({selectedProducts.length})
          </button>
        </div>
      )}

      {!analysis && !loading && (
        <div className="flex-1 flex items-center justify-center text-center font-mono text-xs text-retro-black/50">
          [{t.pasteContentToStart}]
        </div>
      )}
    </div>
  );
}
