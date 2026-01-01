"use client";

import { Heart, MessageSquare, Share2 } from "lucide-react";

interface CommunityStackProps {
  id: string;
  user: string;
  name: string;
  score: number;
  tags: string[];
  likes: number;
  supplements: string[];
}

export function CommunityStackCard({ stack }: { stack: CommunityStackProps }) {
  return (
    <div className="min-w-[280px] bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-hard-sm hover:-translate-y-1 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-gray-800 text-sm">{stack.name}</h4>
          <p className="text-xs text-gray-500 font-mono">by @{stack.user}</p>
        </div>
        <div className={`text-xs font-bold px-1.5 py-0.5 rounded border ${
          stack.score >= 90 ? "bg-green-50 text-green-600 border-green-200" :
          stack.score >= 70 ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
          "bg-gray-50 text-gray-600 border-gray-200"
        }`}>
          SCORE: {stack.score}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {stack.supplements.slice(0, 3).map((s, i) => (
          <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
            {s}
          </span>
        ))}
        {stack.supplements.length > 3 && (
          <span className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded">
            +{stack.supplements.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-gray-400 text-xs mt-auto pt-2 border-t border-gray-100 group-hover:text-gray-600 transition-colors">
        <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
          <Heart className="w-3 h-3" /> {stack.likes}
        </span>
        <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
          <MessageSquare className="w-3 h-3" /> 12
        </span>
        <span className="ml-auto hover:text-gray-900 transition-colors">
          <Share2 className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
