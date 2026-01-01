# 🎮 Cursor执行指令 - 复古游戏机风格改造

> **直接复制下面的指令给Cursor执行**

---

## 🎨 配色改造

### Task 1: 更新配色系统

修改 `src/app/globals.css` 的 `:root` 部分：

```css
:root {
  /* Retro Game Console Palette */
  --retro-yellow: #FDE700;      /* 主色 - Game Boy黄 */
  --retro-green: #009640;       /* 强调色 - 边框/点缀 */
  --retro-black: #0F380F;       /* 深绿黑 - 文字 */
  --retro-gray: #8BAC0F;        /* 中间色 - 辅助 */
  --retro-white: #FAFAFA;       /* 背景 */

  /* 补剂类型色（游戏机调色板风格）*/
  --vitamin: #FDE700;
  --mineral: #FF6B35;
  --amino: #AF52DE;
  --herbal: #009640;

  /* UI */
  --background: var(--retro-white);
  --foreground: var(--retro-black);
  --primary: var(--retro-yellow);
  --accent: var(--retro-green);
}

body {
  color: var(--foreground);
  background: var(--background);
  /* 保留网格纸 */
  background-image:
    linear-gradient(var(--retro-green) 1px, transparent 1px),
    linear-gradient(90deg, var(--retro-green) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.05; /* 网格很淡 */
}
```

**添加复古像素边框样式：**

```css
/* 复古像素边框 */
.retro-border {
  border: 3px solid var(--retro-green);
  box-shadow:
    inset 0 0 0 2px var(--retro-yellow),
    4px 4px 0 0 var(--retro-black);
  background: white;
}

.retro-button {
  background: var(--retro-yellow);
  border: 3px solid var(--retro-green);
  box-shadow:
    inset -2px -2px 0 0 rgba(0,0,0,0.2),
    2px 2px 0 0 var(--retro-black);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.1s;
}

.retro-button:hover {
  transform: translate(2px, 2px);
  box-shadow:
    inset -2px -2px 0 0 rgba(0,0,0,0.2),
    0px 0px 0 0 var(--retro-black);
}

.retro-button:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}
```

**添加伪3D旋转光标：**

```css
/* 3D旋转光标 */
@keyframes cursor-rotate {
  0% { transform: perspective(200px) rotateY(0deg); }
  100% { transform: perspective(200px) rotateY(360deg); }
}

.cursor-3d {
  display: inline-block;
  animation: cursor-rotate 2s linear infinite;
  font-size: 1.2em;
  color: var(--retro-yellow);
  text-shadow: 2px 2px 0 var(--retro-green);
}

/* 自定义鼠标指针 */
body {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect x="0" y="0" width="8" height="8" fill="%23FDE700"/><rect x="8" y="8" width="8" height="8" fill="%23009640"/></svg>'), auto;
}

button, a, .clickable {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect x="0" y="0" width="12" height="12" fill="%23FDE700"/></svg>'), pointer;
}
```

---

## 🎮 UI组件改造

### Task 2: 改造Header为游戏机屏幕风格

修改 `src/app/page.tsx` 的 Header：

```tsx
<header className="border-b-4 border-retro-green bg-retro-yellow px-6 py-4 shadow-[0_4px_0_0_#009640]">
  <div className="max-w-[1800px] mx-auto flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-retro-green border-2 border-retro-black flex items-center justify-center font-bold text-white text-xl">
        💊
      </div>
      <div>
        <h1 className="text-2xl font-black text-retro-black uppercase tracking-wider font-mono">
          SUPPLEMENT LAB
          <span className="cursor-3d ml-2">▶</span>
        </h1>
        <p className="text-xs text-retro-black font-mono">
          [INTERACTIVE SCHEDULING v1.0]
        </p>
      </div>
    </div>

    <div className="flex gap-3">
      <button className="retro-button px-4 py-2 text-sm font-mono">
        📹 导入视频
      </button>
      <button className="retro-button px-4 py-2 text-sm font-mono">
        💾 保存
      </button>
      <button className="retro-button px-4 py-2 text-sm font-mono">
        🌐 中文/EN
      </button>
    </div>
  </div>
</header>
```

---

### Task 3: 改造补剂库为游戏机菜单风格

修改 `src/components/SupplementDrawer/index.tsx`：

```tsx
<div className="retro-border p-4 bg-white sticky top-6">
  <div className="bg-retro-yellow border-2 border-retro-green p-2 mb-4 flex items-center gap-2">
    <span className="cursor-3d">▶</span>
    <h2 className="font-black text-lg uppercase font-mono">补剂库</h2>
  </div>

  {/* Search - 游戏机输入框 */}
  <div className="mb-4 relative">
    <input
      type="text"
      placeholder="SEARCH..."
      className="w-full px-3 py-2 border-3 border-retro-green font-mono uppercase bg-white focus:outline-none focus:border-retro-yellow focus:shadow-[inset_0_0_0_2px_#FDE700]"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <span className="absolute right-2 top-2 cursor-3d">🔍</span>
  </div>

  {/* Filters - 复选框改为游戏机风格 */}
  <div className="mb-4 bg-retro-green/10 border-2 border-retro-green p-3">
    <p className="text-xs font-bold font-mono mb-2 text-retro-black">
      [FILTER]
    </p>
    {Object.keys(filters).map((key) => (
      <label key={key} className="flex items-center gap-2 text-sm font-mono cursor-pointer mb-1 hover:bg-retro-yellow/20 p-1">
        <div className={`w-4 h-4 border-2 border-retro-black ${filters[key] ? 'bg-retro-yellow' : 'bg-white'} flex items-center justify-center`}>
          {filters[key] && <span className="text-xs">✓</span>}
        </div>
        <span className="uppercase">{key.replace('_', ' ')}</span>
      </label>
    ))}
  </div>

  {/* Pills - 像素化卡片 */}
  <div className="space-y-2">
    {supplements.map((supp) => (
      <div
        key={supp.id}
        className="border-3 border-retro-green bg-white p-3 hover:bg-retro-yellow hover:translate-x-1 hover:translate-y-1 transition-transform cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-retro-green"></span>
              <h3 className="font-bold text-sm font-mono uppercase">
                {supp.name}
              </h3>
            </div>
            <p className="text-xs font-mono mt-1 text-retro-gray">
              {supp.dosage.min}-{supp.dosage.max} {supp.dosage.unit}
            </p>
          </div>
          <button className="w-6 h-6 bg-retro-yellow border-2 border-retro-black font-bold hover:bg-retro-green hover:text-white">
            +
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

### Task 4: 日晷改为游戏机屏幕风格

修改 `src/components/SundialTimeline/index.tsx`：

```tsx
<div className="retro-border p-6 bg-white">
  {/* 游戏机屏幕标题 */}
  <div className="bg-retro-black text-retro-yellow p-3 mb-6 text-center border-2 border-retro-green">
    <h2 className="font-black text-xl font-mono uppercase tracking-widest">
      <span className="cursor-3d mr-2">◀</span>
      24 HOUR TIMELINE
      <span className="cursor-3d ml-2">▶</span>
    </h2>
    <p className="text-xs mt-1 font-mono">
      [DRAG & DROP SUPPLEMENTS]
    </p>
  </div>

  {/* SVG日晷 - 游戏机风格 */}
  <div className="flex justify-center bg-retro-green/5 p-8 border-2 border-retro-green">
    <svg width={SIZE} height={SIZE} className="border-4 border-retro-black bg-white" style={{ imageRendering: 'pixelated' }}>
      {/* 外圈 - 像素化粗线条 */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="white"
        stroke="var(--retro-green)"
        strokeWidth="4"
      />

      {/* 刻度线 - 粗像素风格 */}
      {Array.from({ length: 48 }).map((_, i) => {
        const angle = (i / 48) * 2 * Math.PI - Math.PI / 2;
        const x1 = CENTER + (RADIUS - 15) * Math.cos(angle);
        const y1 = CENTER + (RADIUS - 15) * Math.sin(angle);
        const x2 = CENTER + RADIUS * Math.cos(angle);
        const y2 = CENTER + RADIUS * Math.sin(angle);
        const isHour = i % 2 === 0;

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isHour ? "var(--retro-black)" : "var(--retro-gray)"}
            strokeWidth={isHour ? "3" : "2"}
          />
        );
      })}

      {/* 时间标签 - 像素字体 */}
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

      {/* 中心 - 游戏机指示器 */}
      <circle cx={CENTER} cy={CENTER} r="40" fill="var(--retro-black)" />
      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-mono text-xs font-bold"
        fill="var(--retro-yellow)"
      >
        DRAG
      </text>
      <text
        x={CENTER}
        y={CENTER + 12}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-mono text-xs font-bold"
        fill="var(--retro-yellow)"
      >
        HERE
      </text>

      {/* Pills - 像素化方块 */}
      {supplements.map((supp, i) => {
        const angle = (parseFloat(supp.time) / 24) * 2 * Math.PI - Math.PI / 2;
        const x = CENTER + RADIUS * 0.75 * Math.cos(angle);
        const y = CENTER + RADIUS * 0.75 * Math.sin(angle);

        return (
          <g key={supp.id} className="cursor-pointer">
            {/* 外边框 */}
            <rect
              x={x - 18}
              y={y - 18}
              width="36"
              height="36"
              fill="var(--retro-yellow)"
              stroke="var(--retro-black)"
              strokeWidth="3"
            />
            {/* 内边框 */}
            <rect
              x={x - 15}
              y={y - 15}
              width="30"
              height="30"
              fill="white"
              stroke="var(--retro-green)"
              strokeWidth="2"
            />
            {/* 文字 */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-black font-mono"
              fill="var(--retro-black)"
            >
              {supp.name.slice(0, 2)}
            </text>
          </g>
        );
      })}
    </svg>
  </div>
</div>
```

---

### Task 5: 冲突面板 - 游戏机警报风格

修改 `src/components/ConflictPanel/index.tsx`：

```tsx
<div className="retro-border p-4 bg-white sticky top-6">
  {/* 标题 - 警报样式 */}
  <div className="bg-retro-black text-retro-yellow p-2 mb-4 border-2 border-retro-green flex items-center gap-2">
    <span className="cursor-3d animate-pulse">⚠</span>
    <h2 className="font-black text-lg uppercase font-mono">冲突监控</h2>
  </div>

  {/* 统计 - 游戏机计分板 */}
  <div className="space-y-2 mb-6">
    <div className="flex items-center justify-between p-2 bg-red-500 border-2 border-retro-black text-white">
      <span className="text-sm font-bold font-mono">🔴 CRITICAL</span>
      <span className="font-mono font-black text-xl">{criticalCount}</span>
    </div>
    <div className="flex items-center justify-between p-2 bg-yellow-400 border-2 border-retro-black">
      <span className="text-sm font-bold font-mono">🟡 HIGH</span>
      <span className="font-mono font-black text-xl">{highCount}</span>
    </div>
    <div className="flex items-center justify-between p-2 bg-green-400 border-2 border-retro-black">
      <span className="text-sm font-bold font-mono">🟢 MEDIUM</span>
      <span className="font-mono font-black text-xl">{mediumCount}</span>
    </div>
  </div>

  {/* 自动优化按钮 - 大型游戏机按钮 */}
  {conflicts.length > 0 && (
    <button className="retro-button w-full py-4 mb-6 text-lg font-mono font-black">
      ⚡ AUTO OPTIMIZE
    </button>
  )}

  {/* 冲突列表 */}
  <div className="space-y-3">
    {conflicts.map((conflict, i) => (
      <div
        key={i}
        className="border-3 border-retro-black p-3 bg-retro-yellow/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black font-mono bg-retro-black text-retro-yellow px-2 py-1">
            {conflict.severity}
          </span>
          <span className="text-xs font-mono">⏱ {conflict.timeGapRequired}min</span>
        </div>
        <p className="text-sm font-bold font-mono mb-1">
          {conflict.supplementA} ✕ {conflict.supplementB}
        </p>
        <p className="text-xs font-mono text-retro-gray">
          {conflict.explanation}
        </p>
      </div>
    ))}
  </div>
</div>
```

---

## 🌐 社区墙改造

### Task 6: 创建配比社群（可Fork）

**修改 `src/components/CommunityWall/index.tsx`：**

```tsx
"use client";

import { useState } from "react";

export default function CommunityWall() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "健康玩家A",
      title: "完美0冲突方案",
      supplements: ["Vitamin D3", "Magnesium", "Omega-3"],
      conflicts: 0,
      likes: 24,
      forks: 8,
      timestamp: "2小时前"
    },
    {
      id: 2,
      author: "营养大师B",
      title: "增肌补剂组合",
      supplements: ["Protein", "Creatine", "BCAA", "Vitamin B"],
      conflicts: 1,
      likes: 15,
      forks: 3,
      timestamp: "5小时前"
    },
    {
      id: 3,
      author: "科学派C",
      title: "抗氧化套餐",
      supplements: ["Vitamin C", "Vitamin E", "CoQ10"],
      conflicts: 0,
      likes: 32,
      forks: 12,
      timestamp: "1天前"
    },
  ]);

  const handleFork = (postId: number) => {
    alert(`已复制方案 #${postId} 到你的日晷！`);
  };

  return (
    <div className="retro-border p-6 bg-white">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-retro-yellow border-2 border-retro-black p-2">
            <span className="cursor-3d text-2xl">🧪</span>
          </div>
          <div>
            <h2 className="font-black text-2xl font-mono uppercase">
              社区配比墙
            </h2>
            <p className="text-sm font-mono text-retro-gray">
              [COMMUNITY STACKS - FORK & SHARE]
            </p>
          </div>
        </div>

        {/* 发帖按钮 */}
        <button className="retro-button px-6 py-3 font-mono font-bold">
          📝 发布我的方案
        </button>
      </div>

      {/* 帖子网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border-3 border-retro-green bg-white p-4 hover:bg-retro-yellow/10 transition-colors"
          >
            {/* 作者信息 */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-retro-green border-2 border-retro-black flex items-center justify-center font-bold text-white text-sm">
                {post.author[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm font-mono">{post.author}</p>
                <p className="text-xs font-mono text-retro-gray">{post.timestamp}</p>
              </div>
            </div>

            {/* 标题 */}
            <h3 className="font-black text-lg font-mono mb-3 bg-retro-black text-retro-yellow px-2 py-1">
              {post.title}
            </h3>

            {/* 补剂列表 */}
            <div className="mb-3 space-y-1">
              {post.supplements.map((supp, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 bg-retro-green"></span>
                  <span>{supp}</span>
                </div>
              ))}
            </div>

            {/* 统计 */}
            <div className="flex items-center gap-4 mb-3 text-xs font-mono">
              <span className={`font-bold ${post.conflicts === 0 ? 'text-retro-green' : 'text-red-500'}`}>
                {post.conflicts === 0 ? '✓' : '⚠'} {post.conflicts} 冲突
              </span>
              <span>👍 {post.likes}</span>
              <span>🔱 {post.forks} Forks</span>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFork(post.id)}
                className="flex-1 retro-button py-2 text-xs font-mono font-bold"
              >
                🔱 FORK
              </button>
              <button className="flex-1 border-2 border-retro-green bg-white py-2 text-xs font-mono font-bold hover:bg-retro-green hover:text-white">
                💬 评论
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      <div className="text-center mt-6">
        <button className="retro-button px-8 py-3 font-mono font-bold">
          LOAD MORE <span className="cursor-3d ml-2">▼</span>
        </button>
      </div>
    </div>
  );
}
```

---

### Task 7: 添加发帖Modal

**新建文件：`src/components/PostModal/index.tsx`**

```tsx
"use client";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStack: any[];
}

export default function PostModal({ isOpen, onClose, currentStack }: PostModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="retro-border bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 标题 */}
        <div className="bg-retro-black text-retro-yellow p-3 mb-6 flex items-center justify-between">
          <h2 className="font-black text-xl font-mono uppercase">
            <span className="cursor-3d mr-2">📝</span>
            发布方案
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-sm font-mono mb-2">
              方案标题
            </label>
            <input
              type="text"
              placeholder="给你的方案起个名字..."
              className="w-full px-3 py-2 border-3 border-retro-green font-mono bg-white focus:outline-none focus:border-retro-yellow"
            />
          </div>

          <div>
            <label className="block font-bold text-sm font-mono mb-2">
              描述（选填）
            </label>
            <textarea
              placeholder="分享你的经验和心得..."
              className="w-full px-3 py-2 border-3 border-retro-green font-mono bg-white focus:outline-none focus:border-retro-yellow h-24"
            />
          </div>

          <div>
            <label className="block font-bold text-sm font-mono mb-2">
              当前补剂
            </label>
            <div className="border-2 border-retro-green p-3 bg-retro-green/5">
              {currentStack.length === 0 ? (
                <p className="text-sm font-mono text-retro-gray">
                  还没有添加补剂
                </p>
              ) : (
                <div className="space-y-2">
                  {currentStack.map((supp, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-mono">
                      <span className="w-3 h-3 bg-retro-yellow border border-retro-black"></span>
                      <span>{supp.name}</span>
                      <span className="text-xs text-retro-gray ml-auto">{supp.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-retro-green">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-retro-black bg-white py-3 font-mono font-bold hover:bg-gray-100"
            >
              取消
            </button>
            <button className="flex-1 retro-button py-3 font-mono font-bold">
              🚀 发布
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 8: 添加中英文切换

**修改 Header，添加语言切换逻辑：**

```tsx
const [language, setLanguage] = useState<'zh' | 'en'>('zh');

const t = {
  zh: {
    title: "补剂实验室",
    import: "导入视频",
    save: "保存",
    search: "搜索...",
    filter: "筛选",
    autoOptimize: "自动优化",
    community: "社区配比墙",
    post: "发布方案",
  },
  en: {
    title: "SUPPLEMENT LAB",
    import: "IMPORT VIDEO",
    save: "SAVE",
    search: "SEARCH...",
    filter: "FILTER",
    autoOptimize: "AUTO OPTIMIZE",
    community: "COMMUNITY WALL",
    post: "POST STACK",
  }
};

// 在按钮上：
<button
  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
  className="retro-button px-4 py-2 text-sm font-mono"
>
  🌐 {language === 'zh' ? 'EN' : '中文'}
</button>
```

---

## ✅ 执行清单

完成后必须有：

- [ ] 黄绿撞色配色（#FDE700 + #009640）
- [ ] 所有按钮都是retro-button样式（按下有3D效果）
- [ ] 标题旁边有旋转的3D光标 `▶`
- [ ] 鼠标指针是自定义像素方块
- [ ] 社区墙可以看到其他人的方案
- [ ] 有Fork按钮（点击复制方案）
- [ ] 有发帖Modal
- [ ] 有中英文切换按钮
- [ ] 所有边框都是3px粗线
- [ ] 字体用等宽字体（JetBrains Mono）

---

**Cursor，按照这个彻底改造成游戏机风格！** 🎮
