"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Supplement } from "@/types/supplement";

interface DraggablePillProps {
  supplement: Supplement;
}

export function DraggablePill({ supplement }: DraggablePillProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${supplement.id}`,
    data: { 
      type: "library-item",
      supplement 
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="opacity-80 border-3 border-retro-green bg-white p-3 shadow-[4px_4px_0_0_#0F380F]"
      >
         <div className="font-bold text-retro-black font-mono">{supplement.name}</div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border-3 border-retro-green bg-white p-3 hover:bg-retro-yellow hover:translate-x-1 hover:translate-y-1 transition-transform cursor-grab active:cursor-grabbing w-full group select-none shadow-[2px_2px_0_0_#0F380F]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-retro-green border border-retro-black"></span>
            <h3 className="font-bold text-sm font-mono uppercase text-retro-black">
              {supplement.name}
            </h3>
          </div>
          <div className="text-xs font-mono mt-1 text-retro-black/60 truncate">
            {supplement.commonNames[0] || supplement.category} | {supplement.dosage.min}{supplement.dosage.unit}
          </div>
        </div>
      </div>
    </div>
  );
}
