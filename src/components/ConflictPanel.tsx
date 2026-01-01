"use client";

import { useEffect, useState } from "react";
import type { Conflict, ScheduleSlot } from "@/types/supplement";
import RotatingPointer from "@/components/RotatingPointer";
import { useTranslation, type Language } from "@/lib/i18n";

interface ConflictPanelProps {
  schedule: ScheduleSlot[];
  language: Language;
}

export function ConflictPanel({ schedule, language }: ConflictPanelProps) {
  const t = useTranslation(language);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(false);

  // Stats
  const criticalCount = conflicts.filter(c => c.severity === 'CRITICAL').length;
  const highCount = conflicts.filter(c => c.severity === 'HIGH').length;
  const mediumCount = conflicts.filter(c => c.severity === 'MEDIUM').length;

  const activeSupplementIds = schedule.flatMap(slot => slot.supplements.map(s => s.id));
  const uniqueIds = Array.from(new Set(activeSupplementIds));

  useEffect(() => {
    const checkConflicts = async () => {
      if (uniqueIds.length < 2) {
        setConflicts([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/generate-schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            supplementIds: uniqueIds,
            constraints: { mealTimes: {}, sleepTime: "22:00", preferences: {} } 
          }),
        });
        
        const data = await res.json();
        if (data.success && data.data.conflicts) {
          setConflicts(data.data.conflicts);
        }
      } catch (err) {
        console.error("Failed to check conflicts", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(checkConflicts, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule]);

  return (
    <div className="retro-border p-4 bg-white sticky top-6 h-full flex flex-col">
      {/* 标题 - 警报样式 */}
      <div className="bg-retro-black text-retro-yellow p-2 mb-4 border-3 border-retro-yellow flex items-center gap-2">
        <RotatingPointer />
        <h2 className="font-black text-lg uppercase font-mono">{t.conflictMonitor}</h2>
      </div>

      {/* 统计 - 游戏机计分板 */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between p-2 bg-red-500 border-2 border-retro-black text-white">
          <span className="text-sm font-bold font-mono">{t.critical}</span>
          <span className="font-mono font-black text-xl">{criticalCount}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-yellow-400 border-2 border-retro-black text-retro-black">
          <span className="text-sm font-bold font-mono">{t.high}</span>
          <span className="font-mono font-black text-xl">{highCount}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-green-400 border-2 border-retro-black text-retro-black">
          <span className="text-sm font-bold font-mono">{t.medium}</span>
          <span className="font-mono font-black text-xl">{mediumCount}</span>
        </div>
      </div>

      {/* 自动优化按钮 - 大型游戏机按钮 */}
      {conflicts.length > 0 && (
        <button className="retro-button w-full py-4 mb-6 text-lg font-mono font-black flex items-center justify-center gap-2">
          {t.autoOptimize}
        </button>
      )}

      {/* 冲突列表 */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {loading ? (
           <div className="text-center font-mono text-retro-black animate-pulse py-10">{t.scanning}</div>
        ) : conflicts.length === 0 && uniqueIds.length > 0 ? (
           <div className="text-center font-mono text-retro-green py-10 border-2 border-dashed border-retro-green bg-retro-green/5">
              {t.allSystemsStable}
           </div>
        ) : conflicts.map((conflict, i) => (
          <div
            key={i}
            className="border-3 border-retro-black p-3 bg-retro-yellow/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-black font-mono px-2 py-1 border border-retro-black ${
                  conflict.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 
                  conflict.severity === 'HIGH' ? 'bg-yellow-400 text-retro-black' : 
                  'bg-green-400 text-retro-black'
              }`}>
                {conflict.severity}
              </span>
              {conflict.timeGapRequired && (
                 <span className="text-xs font-mono bg-white px-1 border border-retro-black text-retro-black">{conflict.timeGapRequired}{t.min}</span>
              )}
            </div>
            <p className="text-sm font-bold font-mono mb-1 text-retro-black">
              {getSuppName(conflict.supplementA, schedule)} ✕ {getSuppName(conflict.supplementB, schedule)}
            </p>
            <p className="text-xs font-mono text-retro-black/70">
              {conflict.explanation}
            </p>
          </div>
        ))}
        {uniqueIds.length === 0 && (
            <div className="text-center text-gray-400 mt-10 font-mono text-xs">
              [{t.waitingForInput}]
            </div>
        )}
      </div>
    </div>
  );
}

// Helper to find name from ID in the schedule
function getSuppName(id: string | undefined, schedule: ScheduleSlot[]) {
  if (!id) return "Unknown";
  for (const slot of schedule) {
    const found = slot.supplements.find(s => s.id === id);
    if (found) return found.name;
  }
  return id; 
}
