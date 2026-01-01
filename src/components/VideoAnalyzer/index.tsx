/**
 * Video Analyzer Component
 *
 * Features:
 * - Paste video URL or transcript
 * - Show loading state while analyzing
 * - Display extracted supplements in cards
 * - Show credibility score and warnings
 */

"use client";

import { useState } from "react";
import type { VideoAnalysisResult } from "@/types/supplement";
import { useTranslation, type Language } from "@/lib/i18n";

interface VideoAnalyzerProps {
  onAnalysisComplete: (result: VideoAnalysisResult) => void;
  language: Language;
}

export default function VideoAnalyzer({ onAnalysisComplete, language }: VideoAnalyzerProps) {
  const t = useTranslation(language);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<VideoAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setLastResult(null);

    try {
      const contentType = "transcript"; 

      const response = await fetch("/api/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input, contentType }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      const result: VideoAnalysisResult = data.data;
      setLastResult(result);
      onAnalysisComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-retro-green/10 border-2 border-retro-green p-4 flex items-center gap-3">
        <div className="bg-retro-green p-2 border-2 border-retro-black shadow-hard-sm">
          <span className="text-white text-xl"></span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-retro-black font-mono uppercase">{t.analysisUnit}</h2>
          <p className="text-xs text-retro-black/70 font-mono">{t.insertData}</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          className="w-full h-40 p-4 border-3 border-retro-black font-mono text-sm bg-retro-white focus:outline-none focus:border-retro-yellow focus:ring-2 focus:ring-retro-green resize-none text-retro-black placeholder:text-retro-gray"
          placeholder={t.pasteTranscript}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="retro-button px-6 py-3 font-mono text-retro-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin"></span>
                {t.processing}
              </>
            ) : (
              <>
                <span></span>
                {t.analyze}
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 border-2 border-retro-black text-white p-4 font-mono text-xs shadow-hard-sm">
          <p className="font-bold flex items-center gap-2">
            <span>!</span> {t.error}: {error.toUpperCase()}
          </p>
        </div>
      )}

      {lastResult && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between bg-retro-white p-4 border-3 border-retro-black shadow-hard">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold font-mono text-retro-black">{t.credibilityScore}</span>
            </div>
            <div className={`text-3xl font-black font-mono ${getScoreColor(lastResult.credibilityScore)}`}>
              {lastResult.credibilityScore}/100
            </div>
          </div>

          {lastResult.warnings.length > 0 && (
            <div className="bg-yellow-400 border-3 border-retro-black p-4 space-y-2 shadow-hard">
              <h4 className="text-sm font-black text-retro-black font-mono flex items-center gap-2 uppercase">
                <span>!</span> {t.warningsDetected}
              </h4>
              <ul className="text-xs text-retro-black font-mono space-y-1 pl-6 list-disc">
                {lastResult.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-black text-retro-black font-mono mb-3 flex items-center gap-2 uppercase">
              <span></span> {t.identifiedSupplements} ({lastResult.supplements.length})
            </h3>
            <div className="grid gap-3">
              {lastResult.supplements.map((s, i) => (
                <div key={i} className="bg-white border-2 border-retro-gray p-4 hover:border-retro-green transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-retro-black font-mono uppercase">{s.name}</h4>
                    {s.dosage && (
                      <span className="text-xs bg-retro-gray text-white px-2 py-1 font-mono border border-retro-black">
                        {s.dosage}
                      </span>
                    )}
                  </div>
                  {s.timing && (
                    <p className="text-xs text-retro-green font-bold font-mono mb-1">{s.timing}</p>
                  )}
                  {s.reasoning && (
                    <p className="text-xs text-retro-black/60 font-mono italic">&quot;{s.reasoning}&quot;</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-retro-green";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}
