"use client";

import { useTranslation, type Language } from "@/lib/i18n";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStack: any[];
  language: Language;
}

export default function PostModal({ isOpen, onClose, currentStack, language }: PostModalProps) {
  const t = useTranslation(language);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="retro-border bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 标题 */}
        <div className="bg-retro-black text-retro-yellow p-3 mb-6 flex items-center justify-between border-b-2 border-retro-green">
          <h2 className="font-black text-xl font-mono uppercase">
            <span className="cursor-3d mr-2"></span>
            {t.postTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 font-bold"
          >
            X
          </button>
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-sm font-mono mb-2 text-retro-black">
              {t.stackTitle}
            </label>
            <input
              type="text"
              placeholder={t.stackTitlePlaceholder}
              className="w-full px-3 py-2 border-3 border-retro-green font-mono bg-white focus:outline-none focus:border-retro-yellow text-retro-black placeholder:text-retro-gray/50"
            />
          </div>

          <div>
            <label className="block font-bold text-sm font-mono mb-2 text-retro-black">
              {t.description}
            </label>
            <textarea
              placeholder={t.descriptionPlaceholder}
              className="w-full px-3 py-2 border-3 border-retro-green font-mono bg-white focus:outline-none focus:border-retro-yellow h-24 text-retro-black placeholder:text-retro-gray/50 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-sm font-mono mb-2 text-retro-black">
              {t.currentSupplements}
            </label>
            <div className="border-2 border-retro-green p-3 bg-retro-green/5">
              {currentStack.length === 0 ? (
                <p className="text-sm font-mono text-retro-gray">
                  {t.noSupplements}
                </p>
              ) : (
                <div className="space-y-2">
                  {currentStack.map((supp, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-mono text-retro-black">
                      <span className="w-3 h-3 bg-retro-yellow border border-retro-black"></span>
                      <span>{supp.name}</span>
                      <span className="text-xs text-retro-black/50 ml-auto">{supp.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-retro-green">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-retro-black bg-white py-3 font-mono font-bold hover:bg-gray-100 text-retro-black"
            >
              {t.cancel}
            </button>
            <button className="flex-1 retro-button py-3 font-mono font-bold text-retro-black">
              {t.publish}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
