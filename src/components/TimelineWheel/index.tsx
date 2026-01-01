/**
 * Timeline Wheel Component (日晷时间轴)
 *
 * Features:
 * - Circular chart representing 24 hours
 * - Supplement pill icons placed at optimal times
 * - Color-coded by category (using simple default color for now)
 * - Hover to see details
 */

"use client";

import type { ScheduleSlot } from "@/types/supplement";
import { useState } from "react";

interface TimelineWheelProps {
  schedule: ScheduleSlot[];
}

export default function TimelineWheel({ schedule }: TimelineWheelProps) {
  const [hoveredSlot, setHoveredSlot] = useState<ScheduleSlot | null>(null);

  // Constants
  const SIZE = 400;
  const CENTER = SIZE / 2;
  const RADIUS = 140;
  const TICK_RADIUS = 160;

  // Helper to get coordinates
  const getCoords = (time: string, radius: number) => {
    const [h, m] = time.split(":").map(Number);
    const totalMinutes = h * 60 + m;
    // 00:00 is at top (-90 deg in standard trig, or use sin/cos adjustment)
    // angle in radians. 0 is top.
    const angle = (totalMinutes / (24 * 60)) * 2 * Math.PI;
    
    // SVG coord system: 0 angle is usually 3 o'clock.
    // We want 0 at 12 o'clock.
    // x = r * sin(a) + cx
    // y = -r * cos(a) + cy
    const x = CENTER + radius * Math.sin(angle);
    const y = CENTER - radius * Math.cos(angle);
    return { x, y, angle };
  };

  if (!schedule || schedule.length === 0) {
     return <div className="text-center text-gray-500 py-10">No schedule generated yet</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[400px] h-[400px]">
        <svg width={SIZE} height={SIZE} className="w-full h-full">
          {/* Background Circle */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="2" />
          
          {/* Hour Markers */}
          {[0, 6, 12, 18].map(h => {
             const { x, y } = getCoords(`${h}:00`, TICK_RADIUS);
             return (
               <text 
                 key={h} 
                 x={x} 
                 y={y} 
                 textAnchor="middle" 
                 dominantBaseline="middle" 
                 className="text-xs font-bold fill-gray-400"
               >
                 {h}:00
               </text>
             );
          })}

          {/* Schedule Slots */}
          {schedule.map((slot, i) => {
            const { x, y } = getCoords(slot.time, RADIUS);
            const isHovered = hoveredSlot === slot;

            return (
              <g 
                key={i} 
                onMouseEnter={() => setHoveredSlot(slot)}
                onMouseLeave={() => setHoveredSlot(null)}
                className="cursor-pointer transition-all duration-300"
                style={{ opacity: hoveredSlot && !isHovered ? 0.3 : 1 }}
              >
                {/* Connecting Line to Center if hovered */}
                {isHovered && (
                  <line 
                    x1={CENTER} 
                    y1={CENTER} 
                    x2={x} 
                    y2={y} 
                    stroke="#3b82f6" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                )}

                {/* Node */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? 8 : 5} 
                  fill={isHovered ? "#3b82f6" : "#60a5fa"} 
                  stroke="white" 
                  strokeWidth="2"
                />

                {/* Label (Time) */}
                {isHovered && (
                  <text 
                    x={x} 
                    y={y - 15} 
                    textAnchor="middle" 
                    className="text-xs font-bold fill-blue-600 bg-white"
                    style={{ textShadow: "0px 0px 4px white" }}
                  >
                    {slot.time}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Center Text */}
          <text x={CENTER} y={CENTER} textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium fill-gray-400">
            24h
          </text>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredSlot && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 bg-white p-4 rounded-lg shadow-xl border border-blue-100 z-10 w-64 pointer-events-none animate-in fade-in zoom-in-95">
            <div className="text-center border-b border-gray-100 pb-2 mb-2">
              <span className="text-lg font-bold text-blue-600">{hoveredSlot.time}</span>
              <p className="text-xs text-gray-500">{hoveredSlot.reasoning.split("based on")[0]}</p>
            </div>
            <ul className="space-y-1">
              {hoveredSlot.supplements.map((s, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-800">{s.name}</span>
                  <span className="text-gray-500 text-xs">{s.dosage}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* List View for accessibility/mobile */}
      <div className="mt-8 w-full max-w-md space-y-4">
        <h3 className="font-bold text-gray-900 border-b pb-2">Schedule Details</h3>
        {schedule.map((slot, i) => (
          <div key={i} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg">
            <div className="font-mono font-bold text-blue-600 w-12 pt-0.5">{slot.time}</div>
            <div>
              <div className="flex flex-wrap gap-2 mb-1">
                {slot.supplements.map((s, j) => (
                  <span key={j} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{slot.reasoning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
