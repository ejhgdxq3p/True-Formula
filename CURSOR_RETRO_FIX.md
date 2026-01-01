# 🎮 Cursor修正指令 - 绿色背景 + 双色指针

> **直接复制给Cursor执行**

---

## Task 1: 修正背景为高饱和绿色

**修改 `src/app/globals.css`：**

```css
:root {
  /* Retro Game Console Palette */
  --retro-yellow: #FDE700;      /* 黄色 */
  --retro-green: #009640;       /* 绿色 - 主背景 */
  --retro-black: #0F380F;       /* 深绿黑 */
  --retro-white: #FAFAFA;       /* 纯白 */

  --background: var(--retro-green);    /* 背景改为绿色！ */
  --foreground: var(--retro-white);    /* 文字改为白色 */
  --primary: var(--retro-yellow);
  --accent: var(--retro-yellow);
}

body {
  color: var(--retro-white);
  background: var(--retro-green);  /* 绿色背景 */

  /* 淡化网格纸（在绿底上用黄色网格） */
  background-image:
    linear-gradient(rgba(253, 231, 0, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(253, 231, 0, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

---

## Task 2: 创建双色旋转指针

**在 `src/app/globals.css` 添加：**

```css
/* 双色旋转指针 */
.cursor-3d-pointer {
  display: inline-block;
  width: 24px;
  height: 24px;
  position: relative;
  animation: pointer-rotate 2s linear infinite;
}

@keyframes pointer-rotate {
  0% {
    transform: perspective(400px) rotateY(0deg);
  }
  100% {
    transform: perspective(400px) rotateY(360deg);
  }
}

/* 指针SVG样式 */
.cursor-3d-pointer svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.3));
}
```

---

## Task 3: 创建旋转指针组件

**新建文件：`src/components/RotatingPointer/index.tsx`**

```tsx
export default function RotatingPointer() {
  return (
    <span className="cursor-3d-pointer inline-block">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {/* 黄色部分（箭头左半） */}
        <polygon
          points="4,12 12,4 12,20"
          fill="#FDE700"
          stroke="#0F380F"
          strokeWidth="1.5"
        />
        {/* 绿色部分（箭头右半） */}
        <polygon
          points="12,4 20,12 12,20"
          fill="#009640"
          stroke="#0F380F"
          strokeWidth="1.5"
        />
        {/* 中间分割线 */}
        <line
          x1="12"
          y1="4"
          x2="12"
          y2="20"
          stroke="#0F380F"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}
```

---

## Task 4: 更新Header为绿底黄字

**修改 `src/app/page.tsx` 的 Header：**

```tsx
import RotatingPointer from "@/components/RotatingPointer";

<header className="border-b-4 border-retro-black bg-retro-yellow px-6 py-4 shadow-[0_4px_0_0_#0F380F]">
  <div className="max-w-[1800px] mx-auto flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-retro-green border-3 border-retro-black flex items-center justify-center font-bold text-white text-xl">
        💊
      </div>
      <div>
        <h1 className="text-2xl font-black text-retro-black uppercase tracking-wider font-mono flex items-center gap-2">
          SUPPLEMENT LAB
          <RotatingPointer />
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

## Task 5: 调整卡片颜色（绿底适配）

**在 `src/app/globals.css` 更新：**

```css
/* 卡片在绿色背景上 */
.retro-border {
  border: 3px solid var(--retro-black);
  box-shadow:
    inset 0 0 0 2px var(--retro-yellow),
    6px 6px 0 0 var(--retro-black);
  background: white;  /* 保持白底 */
}

/* 按钮 */
.retro-button {
  background: var(--retro-yellow);
  border: 3px solid var(--retro-black);
  color: var(--retro-black);
  box-shadow:
    inset -2px -2px 0 0 rgba(0,0,0,0.2),
    4px 4px 0 0 var(--retro-black);
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
    2px 2px 0 0 var(--retro-black);
}

.retro-button:active {
  transform: translate(4px, 4px);
  box-shadow:
    inset -2px -2px 0 0 rgba(0,0,0,0.4);
}
```

---

## Task 6: 更新所有组件的标题栏（使用旋转指针）

**修改 `src/components/SupplementDrawer/index.tsx`：**

```tsx
import RotatingPointer from "@/components/RotatingPointer";

<div className="bg-retro-yellow border-3 border-retro-black p-2 mb-4 flex items-center gap-2">
  <RotatingPointer />
  <h2 className="font-black text-lg uppercase font-mono text-retro-black">补剂库</h2>
</div>
```

**修改 `src/components/SundialTimeline/index.tsx`：**

```tsx
import RotatingPointer from "@/components/RotatingPointer";

<div className="bg-retro-black text-retro-yellow p-3 mb-6 text-center border-3 border-retro-yellow">
  <h2 className="font-black text-xl font-mono uppercase tracking-widest flex items-center justify-center gap-3">
    <RotatingPointer />
    24 HOUR TIMELINE
    <RotatingPointer />
  </h2>
  <p className="text-xs mt-1 font-mono">
    [DRAG & DROP SUPPLEMENTS]
  </p>
</div>
```

**修改 `src/components/ConflictPanel/index.tsx`：**

```tsx
import RotatingPointer from "@/components/RotatingPointer";

<div className="bg-retro-black text-retro-yellow p-2 mb-4 border-3 border-retro-yellow flex items-center gap-2">
  <RotatingPointer />
  <h2 className="font-black text-lg uppercase font-mono">冲突监控</h2>
</div>
```

**修改 `src/components/CommunityWall/index.tsx`：**

```tsx
import RotatingPointer from "@/components/RotatingPointer";

<div className="flex items-center gap-3">
  <div className="bg-retro-yellow border-3 border-retro-black p-3">
    <RotatingPointer />
  </div>
  <div>
    <h2 className="font-black text-2xl font-mono uppercase text-white">
      社区配比墙
    </h2>
    <p className="text-sm font-mono text-retro-yellow">
      [COMMUNITY STACKS - FORK & SHARE]
    </p>
  </div>
</div>
```

---

## Task 7: 优化绿色背景上的文字可读性

**在 `src/app/globals.css` 添加：**

```css
/* 主区域 - 确保在绿底上可读 */
main {
  color: var(--retro-white);
}

/* 白色卡片内的文字保持黑色 */
.retro-border {
  color: var(--retro-black);
}

/* 链接和按钮文字 */
a, button {
  color: inherit;
}

/* 在绿色背景上的文字 */
.text-on-green {
  color: var(--retro-white);
  text-shadow: 2px 2px 0 var(--retro-black);
}

/* 标题在绿底上 */
h1, h2, h3 {
  color: var(--retro-white);
}

/* 卡片内标题 */
.retro-border h1,
.retro-border h2,
.retro-border h3 {
  color: var(--retro-black);
}
```

---

## Task 8: 自定义鼠标指针（双色箭头）

**修改 `src/app/globals.css`：**

```css
/* 自定义双色像素鼠标 */
body {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><polygon points="4,4 4,20 12,12 20,20 20,4" fill="%23FDE700" stroke="%230F380F" stroke-width="2"/><polygon points="12,12 20,4 20,20" fill="%23009640" stroke="%230F380F" stroke-width="2"/></svg>') 4 4, auto;
}

button, a, .clickable {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><polygon points="6,6 6,22 14,14 22,22 22,6" fill="%23FDE700" stroke="%230F380F" stroke-width="2"/><polygon points="14,14 22,6 22,22" fill="%23009640" stroke="%230F380F" stroke-width="2"/></svg>') 4 4, pointer;
}
```

---

## ✅ 验收标准

完成后必须：

- [ ] 整个页面背景是绿色 #009640
- [ ] 网格线是淡黄色（在绿底上可见）
- [ ] 标题旁有双色（黄+绿）旋转指针
- [ ] 旋转指针是3D透视旋转效果
- [ ] 鼠标指针是黄绿双色箭头
- [ ] 白色卡片在绿色背景上有强对比
- [ ] 所有按钮是黄色底黑字
- [ ] 文字在绿底上是白色且清晰可读

---

**Cursor，执行这些修正！绿色背景 + 双色旋转指针！** 🎮
