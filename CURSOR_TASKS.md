# 🎨 Cursor 设计改造任务清单

> 按照顺序执行，每完成一个打勾 ✅

---

## 第一步：安装依赖和设置

### Task 1: 安装动画库
```bash
npm install framer-motion react-confetti react-countup react-circular-progressbar
```

### Task 2: 更新 globals.css
在 `src/app/globals.css` 的 `:root` 中添加：

```css
:root {
  /* 渐变 */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-health: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --gradient-success: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  --gradient-warning: linear-gradient(135deg, #fa709a 0%, #fee140 100%);

  /* 玻璃态 */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.18);

  /* 补剂颜色 */
  --vitamin: #667eea;
  --mineral: #f5576c;
  --amino: #f093fb;
  --herbal: #4facfe;
}

/* 通用动画类 */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.gradient-border {
  position: relative;
  background: white;
  border-radius: 1rem;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  padding: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

---

## 第二步：改造首页 Hero Section

### Task 3: 修改 `src/app/page.tsx` 的 Header 部分

**替换现有的 header div，改为：**

```tsx
{/* Hero Section */}
<div className="relative text-center mb-20 py-16 overflow-hidden">
  {/* 背景装饰 */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
  </div>

  {/* 主标题 */}
  <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient pb-2">
    Supplement Scheduler
  </h1>

  {/* 副标题 */}
  <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
    从视频内容到科学排程<br/>
    <span className="text-base text-gray-500">不买垃圾补剂 · 不犯致命冲突 · 智能优化健康</span>
  </p>

  {/* 统计数字 */}
  <div className="flex justify-center gap-8 mb-12 text-sm">
    <div className="text-center">
      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">1.2K+</div>
      <div className="text-gray-500">已避免危险组合</div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">50+</div>
      <div className="text-gray-500">常见补剂数据库</div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</div>
      <div className="text-gray-500">智能分析引擎</div>
    </div>
  </div>
</div>
```

**在 globals.css 添加 blob 动画：**
```css
@keyframes blob {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
```

---

## 第三步：美化进度指示器

### Task 4: 修改 `src/app/page.tsx` 的进度步骤

**替换 "Progress Steps" 部分：**

```tsx
{/* Progress Steps */}
<div className="flex justify-center mb-16">
  <div className="flex items-center gap-2">
    {/* Step 1 */}
    <div className={`relative flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 ${
      step >= 1
        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200"
        : "bg-gray-100 text-gray-400"
    }`}>
      <div className="flex items-center gap-2 font-semibold">
        {step > 1 ? "✓" : "1"}
        <span className="hidden md:inline">Analyze</span>
      </div>
    </div>

    {/* Connector */}
    <div className={`h-1 w-12 transition-all duration-500 ${
      step >= 2 ? "bg-gradient-to-r from-pink-500 to-blue-500" : "bg-gray-200"
    }`}></div>

    {/* Step 2 */}
    <div className={`relative flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 ${
      step >= 2
        ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg shadow-pink-200"
        : "bg-gray-100 text-gray-400"
    }`}>
      <div className="flex items-center gap-2 font-semibold">
        {step > 2 ? "✓" : "2"}
        <span className="hidden md:inline">Select</span>
      </div>
    </div>

    {/* Connector */}
    <div className={`h-1 w-12 transition-all duration-500 ${
      step >= 3 ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-200"
    }`}></div>

    {/* Step 3 */}
    <div className={`relative flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 ${
      step >= 3
        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200 animate-pulse"
        : "bg-gray-100 text-gray-400"
    }`}>
      <div className="flex items-center gap-2 font-semibold">
        {step > 3 ? "✓" : "3"}
        <span className="hidden md:inline">Schedule</span>
      </div>
    </div>
  </div>
</div>
```

---

## 第四步：VideoAnalyzer 组件升级

### Task 5: 修改 `src/components/VideoAnalyzer/index.tsx`

**改进点：**

1. **添加示例按钮**（在 textarea 上方）
```tsx
<div className="flex justify-between items-center mb-2">
  <label className="text-sm font-medium text-gray-700">Video Content</label>
  <button
    onClick={() => setInput(EXAMPLE_CONTENT)}
    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
  >
    <PlayCircle className="w-3 h-3" />
    Try Example
  </button>
</div>

// 在文件顶部添加示例内容
const EXAMPLE_CONTENT = `In today's video, I'm sharing my supplement stack for optimal health:

1. Vitamin D3 - 5000 IU daily with breakfast for bone health and immunity
2. Magnesium Glycinate - 400mg before bed to improve sleep quality
3. Omega-3 Fish Oil - 2000mg with morning meal for heart health
4. Vitamin C - 1000mg anytime for immune support

Remember to consult your doctor before starting any new supplements!`;
```

2. **渐变边框 textarea**
```tsx
<div className="relative">
  <textarea
    className={`w-full h-40 p-4 rounded-xl border-2 transition-all duration-300 resize-none text-sm
      ${input ? 'border-purple-300 bg-purple-50/30' : 'border-gray-200'}
      focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none
    `}
    placeholder="Paste video transcript or description here...

Example: 'Today I recommend Vitamin D3 5000 IU with breakfast, and Magnesium before bed...'"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    disabled={loading}
  />
  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
    {input.length} / 10000
  </div>
</div>
```

3. **环形 Credibility Score** (使用 react-circular-progressbar)

在文件顶部 import：
```tsx
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
```

替换 credibility score 显示：
```tsx
<div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-100">
  <div>
    <span className="text-sm font-medium text-gray-600">Credibility Score</span>
    <p className="text-xs text-gray-500 mt-1">Based on citations & science</p>
  </div>
  <div className="w-20 h-20">
    <CircularProgressbar
      value={lastResult.credibilityScore}
      text={`${lastResult.credibilityScore}`}
      styles={buildStyles({
        textSize: '24px',
        pathColor: lastResult.credibilityScore >= 80 ? '#10b981' : lastResult.credibilityScore >= 60 ? '#f59e0b' : '#ef4444',
        textColor: '#374151',
        trailColor: '#e5e7eb',
      })}
    />
  </div>
</div>
```

4. **Stagger 动画进入**

在 supplements 列表外层添加：
```tsx
import { motion } from 'framer-motion';

// 替换 supplements 的 map
{lastResult.supplements.map((s, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    className="bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300"
  >
    {/* 原有内容 */}
  </motion.div>
))}
```

---

## 第五步：ConflictGraph 暗色主题

### Task 6: 修改 `src/components/ConflictGraph/index.tsx`

**改为暗色背景：**
```tsx
<div className="relative w-full h-[600px] rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden shadow-2xl" ref={containerRef}>
  {/* 网格背景 */}
  <div className="absolute inset-0 opacity-10" style={{
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px'
  }}></div>

  <svg ref={svgRef} className="w-full h-full block relative z-10" />

  {/* Legend 玻璃态 */}
  <div className="absolute top-4 left-4 backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20 text-white shadow-lg">
    <div className="font-bold mb-3 text-sm">Categories</div>
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
        Vitamin
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        Mineral
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-violet-400"></div>
        Amino Acid
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        Herbal
      </div>
    </div>
  </div>

  {/* Edge 详情卡片也改为玻璃态 */}
  {selectedEdge && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-white/95 p-5 rounded-xl shadow-2xl border border-white/20"
    >
      {/* 原有内容 */}
    </motion.div>
  )}
</div>
```

---

## 第六步：TimelineWheel 渐变圆环

### Task 7: 修改 `src/components/TimelineWheel/index.tsx`

**渐变圆环背景：**

在 SVG 的 `<defs>` 中添加渐变定义：
```tsx
<svg width={SIZE} height={SIZE} className="w-full h-full">
  <defs>
    {/* 24小时渐变 */}
    <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#667eea" />
      <stop offset="50%" stopColor="#764ba2" />
      <stop offset="100%" stopColor="#667eea" />
    </linearGradient>
  </defs>

  {/* 背景圆环 - 使用渐变 */}
  <circle
    cx={CENTER}
    cy={CENTER}
    r={RADIUS}
    fill="none"
    stroke="url(#timeGradient)"
    strokeWidth="4"
    opacity="0.3"
  />

  {/* 外圈装饰 */}
  <circle
    cx={CENTER}
    cy={CENTER}
    r={RADIUS + 10}
    fill="none"
    stroke="#e5e7eb"
    strokeWidth="1"
    strokeDasharray="5,5"
  />
```

**节点改为发光 pill：**
```tsx
<circle
  cx={x}
  cy={y}
  r={isHovered ? 10 : 6}
  fill={isHovered ? "url(#timeGradient)" : "#667eea"}
  stroke="white"
  strokeWidth="3"
  filter="url(#glow)"
  className="transition-all duration-300"
/>

{/* 在 defs 中添加发光滤镜 */}
<filter id="glow">
  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

---

## 第七步：添加 Confetti 庆祝动画

### Task 8: 在生成完美schedule时添加庆祝

在 `src/app/page.tsx` 中：

```tsx
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use'; // npm install react-use

// 在组件中
const [showConfetti, setShowConfetti] = useState(false);
const { width, height } = useWindowSize();

// 在 handleGenerateSchedule 成功后
const scheduleResult = await scheduleRes.json();
if (scheduleResult.success) {
  setScheduleData(scheduleResult.data);

  // 检查是否完美（无冲突）
  if (scheduleResult.data.conflicts.length === 0) {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }

  setStep(3);
}

// 在 return 的最外层添加
return (
  <>
    {showConfetti && <Confetti width={width} height={height} recycle={false} />}
    <main className="min-h-screen...">
      {/* 原有内容 */}
    </main>
  </>
);
```

---

## 第八步：骨架屏 Loading

### Task 9: 创建 Skeleton 组件

**新建文件：`src/components/Skeleton.tsx`**

```tsx
export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border border-gray-200 p-4 rounded-xl">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}

export function SkeletonGraph() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-slate-100 to-purple-50 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-gray-400">Loading visualization...</div>
    </div>
  );
}
```

**在 VideoAnalyzer 中使用：**
```tsx
{loading && (
  <div className="space-y-3">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
)}
```

---

## 第九步：空状态插图

### Task 10: 添加空状态

**在 ConflictGraph 的 empty state：**
```tsx
if (!data || data.nodes.length === 0) {
  return (
    <div className="w-full h-[600px] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="text-6xl mb-4">🧬</div>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">No Interactions Yet</h3>
      <p className="text-sm">Add supplements to see conflicts and synergies</p>
    </div>
  );
}
```

---

## 最终检查清单 ✅

完成后，检查这些效果是否都有：

- [ ] Hero section 有渐变背景 + blob动画
- [ ] 标题是渐变文字
- [ ] 进度指示器是彩色pill，有连接线
- [ ] VideoAnalyzer 有"Try Example"按钮
- [ ] Textarea 有字符计数
- [ ] Credibility Score 是圆环图
- [ ] Supplements列表有stagger进入动画
- [ ] ConflictGraph 是暗色背景 + 网格
- [ ] Legend 是玻璃态卡片
- [ ] TimelineWheel 圆环是渐变色
- [ ] 节点有发光效果
- [ ] 完美schedule时有confetti
- [ ] Loading状态有骨架屏
- [ ] 空状态有友好提示

---

**开始执行吧！一个任务一个任务来，完成后这个项目就从毛坯变豪宅了！** 🚀
