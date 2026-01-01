"use client";

import { useState } from "react";
import type { MyListCollection } from "@/types/product";
import { useTranslation, type Language } from "@/lib/i18n";
import RotatingPointer from "@/components/RotatingPointer";

interface WorkbenchModalProps {
  myLists: MyListCollection[];
  forkedLists: MyListCollection[];
  currentListId: string;
  onSelectList: (listId: string) => void;
  onCreateNew: (name: string) => void;
  onClose: () => void;
  language: Language;
}

export default function WorkbenchModal({
  myLists,
  forkedLists,
  currentListId,
  onSelectList,
  onCreateNew,
  onClose,
  language
}: WorkbenchModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleCreate = () => {
    if (newListName.trim()) {
      onCreateNew(newListName.trim());
      setNewListName("");
      setIsCreating(false);
    }
  };

  // 渲染 List 卡片（完全复刻 CommunityWall 的卡片样式）
  const renderListCard = (list: MyListCollection) => {
    const isActive = list.id === currentListId;

    return (
      <div
        key={list.id}
        onClick={() => {
          onSelectList(list.id);
          onClose();
        }}
        className="border-3 border-retro-green bg-white p-4 cursor-pointer hover:bg-retro-yellow/10 transition-colors"
      >
        {/* 作者信息 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-retro-green border-2 border-retro-black flex items-center justify-center font-bold text-white text-sm">
            {list.isFork ? (list.originalAuthor?.[0] || 'F') : (language === 'zh' ? '我' : 'M')}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm font-mono text-retro-black">
              {list.isFork ? list.originalAuthor : (language === 'zh' ? '我的清单' : 'My List')}
            </p>
            <p className="text-xs font-mono text-retro-black/50">
              {new Date(list.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 标题（黑底黄字）*/}
        <h3 className={`font-black text-lg font-mono mb-2 px-2 py-1 truncate ${
          isActive ? 'bg-retro-yellow text-retro-black border-2 border-retro-black' : 'bg-retro-black text-retro-yellow'
        }`}>
          {list.name}
        </h3>

        {/* 日晷缩略图 */}
        <div className="h-32 bg-retro-green/5 border-2 border-retro-green mb-3 flex items-center justify-center">
          <svg width="120" height="120">
            <circle cx="60" cy="60" r="50" fill="white" stroke="#009640" strokeWidth="2" />
            {list.products.slice(0, 8).map((item, i) => {
              const angle = ((i / 8) * 2 * Math.PI) - Math.PI / 2;
              const x = 60 + 35 * Math.cos(angle);
              const y = 60 + 35 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="5" fill="#FDE700" stroke="#0F380F" strokeWidth="1" />;
            })}
            <circle cx="60" cy="60" r="15" fill="#0F380F" />
            {isActive && (
              <text x="60" y="65" textAnchor="middle" className="text-xs font-bold fill-retro-yellow">✓</text>
            )}
          </svg>
        </div>

        {/* 统计 */}
        <div className="text-xs font-mono text-retro-black mb-3 text-center">
          {list.products.length} {language === 'zh' ? '个产品' : 'PRODUCTS'}
        </div>

        {/* 底部统计条 */}
        <div className="flex items-center justify-between gap-4 mb-3 text-xs font-mono text-retro-black px-2">
          <span className={`font-bold ${!list.conflictCount || list.conflictCount === 0 ? 'text-retro-green' : 'text-red-500'}`}>
            {!list.conflictCount || list.conflictCount === 0 ? '✓' : '!'} {list.conflictCount || 0} {language === 'zh' ? '冲突' : 'CONF'}
          </span>
          {list.isFork && <span>🔱 FORK</span>}
          <span className="text-retro-black/60">
            {new Date(list.updatedAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
          </span>
        </div>

        {/* 操作按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectList(list.id);
            onClose();
          }}
          className={`retro-button w-full py-2 text-sm font-mono font-black text-retro-black`}
        >
          {isActive ? (language === 'zh' ? '✓ 当前' : '✓ ACTIVE') : (language === 'zh' ? '选择' : 'SELECT')}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="retro-border bg-white max-w-7xl w-full my-6">
        {/* 标题栏（复刻 CommunityWall）*/}
        <div className="p-6 border-b-3 border-retro-green">
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center gap-3">
              <div className="bg-retro-yellow border-3 border-retro-black p-3">
                <RotatingPointer />
              </div>
              <div>
                <h2 className="font-black text-2xl font-mono uppercase text-retro-black">
                  {language === 'zh' ? '我的工作台' : 'MY WORKBENCH'}
                </h2>
                <p className="text-sm font-mono text-retro-green font-bold">
                  [{language === 'zh' ? '管理你的所有产品清单' : 'MANAGE ALL LISTS'}]
                </p>
              </div>
            </div>

            {/* 右上角：新建清单 或 关闭 */}
            <div className="flex gap-2">
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="retro-button px-6 py-3 font-mono font-bold text-retro-black"
                >
                  + {language === 'zh' ? '新建清单' : 'NEW'}
                </button>
              )}
              <button
                onClick={onClose}
                className="w-12 h-12 bg-retro-black text-retro-yellow hover:bg-red-500 hover:text-white font-black text-2xl border-3 border-retro-black transition-colors"
              >
                X
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* 新建清单输入框 */}
          {isCreating && (
            <div className="retro-border bg-retro-yellow/10 p-6 mb-6">
              <h3 className="font-black text-sm font-mono uppercase text-retro-black mb-3">
                {language === 'zh' ? '新建产品清单' : 'CREATE NEW LIST'}
              </h3>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder={language === 'zh' ? '输入清单名称 (如：增肌配方)' : 'Name...'}
                className="w-full p-3 border-3 border-retro-green font-mono text-sm bg-white mb-3"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={!newListName.trim()}
                  className="retro-button flex-1 py-3 font-mono font-bold disabled:opacity-50"
                >
                  {language === 'zh' ? '创建' : 'CREATE'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewListName("");
                  }}
                  className="border-3 border-retro-black bg-white hover:bg-gray-100 flex-1 py-3 font-mono font-bold"
                >
                  {language === 'zh' ? '取消' : 'CANCEL'}
                </button>
              </div>
            </div>
          )}

          {/* 我创建的清单 */}
          {myLists.length > 0 && (
            <div className="mb-8">
              <div className="bg-retro-green border-3 border-retro-black p-3 mb-4">
                <h3 className="font-black text-sm font-mono uppercase text-retro-black">
                  {language === 'zh' ? '我创建的清单' : 'MY LISTS'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myLists.map(renderListCard)}
              </div>
            </div>
          )}

          {/* 我 Fork 的清单 */}
          {forkedLists.length > 0 && (
            <div>
              <div className="bg-retro-yellow border-3 border-retro-black p-3 mb-4">
                <h3 className="font-black text-sm font-mono uppercase text-retro-black">
                  {language === 'zh' ? '我 FORK 的清单' : 'FORKED LISTS'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forkedLists.map(renderListCard)}
              </div>
            </div>
          )}

          {/* 空状态 */}
          {myLists.length === 0 && forkedLists.length === 0 && !isCreating && (
            <div className="text-center py-16">
              <div className="text-sm font-mono text-retro-black/50 mb-4">
                [{language === 'zh' ? '还没有清单，点击右上角新建' : 'NO LISTS'}]
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
