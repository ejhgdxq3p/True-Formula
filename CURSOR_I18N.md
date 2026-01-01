# 🌐 Cursor多语言实现指令

> **直接复制给Cursor执行**

---

## 发现的英文文本清单

### Header区域
- `SUPPLEMENT LAB` → 补剂实验室
- `INTERACTIVE SCHEDULING v1.0` → 交互式排程 v1.0
- `IMPORT VIDEO` → 导入视频
- `POST STACK` → 发布方案
- `EN` / `中文` ← 已有

### SupplementDrawer
- `补剂库` ← 已有
- `SEARCH...` → 搜索...
- `[FILTER]` → [筛选]
- `vitamins` → 维生素类
- `minerals` → 矿物质类
- `amino_acids` → 氨基酸类
- `others` → 其他类

### ConflictPanel
- `冲突监控` ← 已有
- `CRITICAL` → 严重
- `HIGH` → 高度
- `MEDIUM` → 中度
- `AUTO OPTIMIZE` → 自动优化
- `SCANNING...` → 扫描中...
- `ALL SYSTEMS STABLE` → 系统稳定
- `[WAITING FOR INPUT]` → [等待输入]

### Sundial
- `24 HOUR TIMELINE` → 24小时时间轴
- `[DRAG & DROP SUPPLEMENTS]` → [拖放补剂到此处]
- `DRAG HERE` → 拖到这里

### CommunityWall
- `社区配比墙` ← 已有
- `[COMMUNITY STACKS - FORK & SHARE]` → [社区配方 - 复刻分享]
- `发布我的方案` ← 已有
- `冲突` ← 已有
- `FORK` → 复刻
- `评论` ← 已有
- `LOAD MORE` → 加载更多

### VideoAnalyzer
- `ANALYSIS UNIT` → 分析单元
- `INSERT DATA FOR PROCESSING` → 输入数据以处理
- `PASTE TRANSCRIPT OR DESCRIPTION HERE...` → 粘贴视频文本或描述...
- `PROCESSING...` → 处理中...
- `ANALYZE` → 分析
- `ERROR` → 错误
- `CREDIBILITY SCORE` → 可信度评分
- `Warnings Detected` → 检测到警告
- `Identified Supplements` → 识别出的补剂

---

## Task 1: 创建多语言配置文件

**新建文件：`src/lib/i18n.ts`**

```typescript
export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // Header
    appTitle: "补剂实验室",
    appSubtitle: "交互式排程 v1.0",
    importVideo: "导入视频",
    postStack: "发布方案",
    langSwitch: "EN",

    // SupplementDrawer
    supplementLibrary: "补剂库",
    search: "搜索...",
    filter: "筛选",
    vitamins: "维生素类",
    minerals: "矿物质类",
    aminoAcids: "氨基酸类",
    others: "其他类",

    // ConflictPanel
    conflictMonitor: "冲突监控",
    critical: "严重",
    high: "高度",
    medium: "中度",
    autoOptimize: "自动优化",
    scanning: "扫描中...",
    allSystemsStable: "系统稳定",
    waitingForInput: "等待输入",

    // Sundial
    hourTimeline: "24小时时间轴",
    dragDropPrompt: "拖放补剂到此处",
    dragHere: "拖到这里",

    // CommunityWall
    communityWall: "社区配比墙",
    communitySubtitle: "社区配方 - 复刻分享",
    postMyStack: "发布我的方案",
    conflicts: "冲突",
    fork: "复刻",
    comment: "评论",
    loadMore: "加载更多",

    // VideoAnalyzer
    analysisUnit: "分析单元",
    insertData: "输入数据以处理",
    pasteTranscript: "粘贴视频文本或描述...",
    processing: "处理中...",
    analyze: "分析",
    error: "错误",
    credibilityScore: "可信度评分",
    warningsDetected: "检测到警告",
    identifiedSupplements: "识别出的补剂",

    // PostModal
    postTitle: "发布方案",
    stackTitle: "方案标题",
    stackTitlePlaceholder: "给你的方案起个名字...",
    description: "描述（选填）",
    descriptionPlaceholder: "分享你的经验和心得...",
    currentSupplements: "当前补剂",
    noSupplements: "还没有添加补剂",
    cancel: "取消",
    publish: "发布",

    // Common
    min: "分钟",
  },
  en: {
    // Header
    appTitle: "SUPPLEMENT LAB",
    appSubtitle: "INTERACTIVE SCHEDULING v1.0",
    importVideo: "IMPORT VIDEO",
    postStack: "POST STACK",
    langSwitch: "中文",

    // SupplementDrawer
    supplementLibrary: "LIBRARY",
    search: "SEARCH...",
    filter: "FILTER",
    vitamins: "VITAMINS",
    minerals: "MINERALS",
    aminoAcids: "AMINO ACIDS",
    others: "OTHERS",

    // ConflictPanel
    conflictMonitor: "CONFLICT MONITOR",
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    autoOptimize: "AUTO OPTIMIZE",
    scanning: "SCANNING...",
    allSystemsStable: "ALL SYSTEMS STABLE",
    waitingForInput: "WAITING FOR INPUT",

    // Sundial
    hourTimeline: "24 HOUR TIMELINE",
    dragDropPrompt: "DRAG & DROP SUPPLEMENTS",
    dragHere: "DRAG HERE",

    // CommunityWall
    communityWall: "COMMUNITY WALL",
    communitySubtitle: "COMMUNITY STACKS - FORK & SHARE",
    postMyStack: "POST MY STACK",
    conflicts: "CONFLICTS",
    fork: "FORK",
    comment: "COMMENT",
    loadMore: "LOAD MORE",

    // VideoAnalyzer
    analysisUnit: "ANALYSIS UNIT",
    insertData: "INSERT DATA FOR PROCESSING",
    pasteTranscript: "PASTE TRANSCRIPT OR DESCRIPTION HERE...",
    processing: "PROCESSING...",
    analyze: "ANALYZE",
    error: "ERROR",
    credibilityScore: "CREDIBILITY SCORE",
    warningsDetected: "WARNINGS DETECTED",
    identifiedSupplements: "IDENTIFIED SUPPLEMENTS",

    // PostModal
    postTitle: "POST STACK",
    stackTitle: "STACK TITLE",
    stackTitlePlaceholder: "NAME YOUR STACK...",
    description: "DESCRIPTION (OPTIONAL)",
    descriptionPlaceholder: "SHARE YOUR EXPERIENCE...",
    currentSupplements: "CURRENT SUPPLEMENTS",
    noSupplements: "NO SUPPLEMENTS ADDED YET",
    cancel: "CANCEL",
    publish: "PUBLISH",

    // Common
    min: "MIN",
  },
};

// Hook to use translations
export function useTranslation(language: Language) {
  return translations[language];
}
```

---

## Task 2: 修改 page.tsx 支持多语言

**修改 `src/app/page.tsx`：**

```typescript
// 在文件顶部添加
import { useTranslation } from "@/lib/i18n";

// 在组件内
const [language, setLanguage] = useState<'zh' | 'en'>('zh');
const t = useTranslation(language);

// 更新Header按钮
<button
  onClick={() => setShowAnalyzer(!showAnalyzer)}
  className="retro-button px-4 py-2 text-sm font-mono"
>
  📹 {t.importVideo}
</button>
<button
  onClick={() => setShowPostModal(true)}
  className="retro-button px-4 py-2 text-sm font-mono"
>
  💾 {t.postStack}
</button>
<button
  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
  className="retro-button px-4 py-2 text-sm font-mono"
>
  🌐 {t.langSwitch}
</button>

// 更新标题
<h1 className="text-2xl font-black text-retro-black uppercase tracking-wider font-mono flex items-center gap-2">
  {t.appTitle}
  <RotatingPointer />
</h1>
<p className="text-xs text-retro-black font-mono">
  [{t.appSubtitle}]
</p>

// Modal标题
<h3 className="font-black text-xl font-mono uppercase flex items-center gap-2">
  <RotatingPointer />
  {t.importVideo}
</h3>
```

**传递language prop给子组件：**

```typescript
<SupplementDrawer supplements={library} language={language} />
<Sundial schedule={schedule} language={language} />
<ConflictPanel schedule={schedule} language={language} />
<CommunityWall language={language} />
<VideoAnalyzer onAnalysisComplete={...} language={language} />
<PostModal isOpen={showPostModal} onClose={...} currentStack={...} language={language} />
```

---

## Task 3: 更新所有组件支持多语言

### SupplementDrawer

```typescript
import { useTranslation, type Language } from "@/lib/i18n";

interface SupplementDrawerProps {
  supplements: Supplement[];
  language: Language;
}

export default function SupplementDrawer({ supplements, language }: SupplementDrawerProps) {
  const t = useTranslation(language);

  // 更新所有文本
  <h2 className="font-black text-lg uppercase font-mono text-retro-black">{t.supplementLibrary}</h2>

  <input placeholder={t.search} ... />

  <p className="text-xs font-bold font-mono mb-2 text-retro-black">
    [{t.filter}]
  </p>

  // 筛选选项
  const filterLabels: Record<string, string> = {
    vitamins: t.vitamins,
    minerals: t.minerals,
    amino_acids: t.aminoAcids,
    others: t.others,
  };

  <span className="uppercase">{filterLabels[key]}</span>
```

### ConflictPanel

```typescript
import { useTranslation, type Language } from "@/lib/i18n";

export function ConflictPanel({ schedule, language }: { schedule: ScheduleSlot[]; language: Language }) {
  const t = useTranslation(language);

  <h2 className="font-black text-lg uppercase font-mono">{t.conflictMonitor}</h2>

  <span className="text-sm font-bold font-mono">{t.critical}</span>
  <span className="text-sm font-bold font-mono">{t.high}</span>
  <span className="text-sm font-bold font-mono">{t.medium}</span>

  <span>⚡</span> {t.autoOptimize}

  <div className="text-center font-mono text-retro-black animate-pulse py-10">{t.scanning}</div>

  <div className="text-center font-mono text-retro-green py-10 border-2 border-dashed border-retro-green bg-retro-green/5">
    {t.allSystemsStable}
  </div>

  <div className="text-center text-gray-400 mt-10 font-mono text-xs">
    [{t.waitingForInput}]
  </div>

  <span className="text-xs font-mono bg-white px-1 border border-retro-black text-retro-black">⏱ {conflict.timeGapRequired}{t.min}</span>
```

### Sundial

```typescript
export function Sundial({ schedule, language }: { schedule: ScheduleSlot[]; language: Language }) {
  const t = useTranslation(language);

  <h2 className="font-black text-xl font-mono uppercase tracking-widest flex items-center justify-center gap-3">
    <RotatingPointer />
    {t.hourTimeline}
    <RotatingPointer />
  </h2>

  <p className="text-xs mt-1 font-mono text-retro-yellow/80">
    [{t.dragDropPrompt}]
  </p>

  <text ... fill="var(--retro-yellow)">
    {t.dragHere.split(' ')[0]}
  </text>
  <text ... fill="var(--retro-yellow)">
    {t.dragHere.split(' ')[1]}
  </text>
```

### CommunityWall

```typescript
export default function CommunityWall({ language }: { language: Language }) {
  const t = useTranslation(language);

  <h2 className="font-black text-2xl font-mono uppercase text-retro-black">
    {t.communityWall}
  </h2>

  <p className="text-sm font-mono text-retro-green font-bold">
    [{t.communitySubtitle}]
  </p>

  <button className="retro-button px-6 py-3 font-mono font-bold text-retro-black">
    📝 {t.postMyStack}
  </button>

  <span className={`font-bold ${post.conflicts === 0 ? 'text-retro-green' : 'text-red-500'}`}>
    {post.conflicts === 0 ? '✓' : '⚠'} {post.conflicts} {t.conflicts}
  </span>

  <button ... className="flex-1 retro-button py-2 text-xs font-mono font-bold text-retro-black">
    🔱 {t.fork}
  </button>

  <button className="flex-1 border-2 border-retro-green bg-white py-2 text-xs font-mono font-bold hover:bg-retro-green hover:text-white text-retro-black transition-colors">
    💬 {t.comment}
  </button>

  <button className="retro-button px-8 py-3 font-mono font-bold text-retro-black">
    {t.loadMore} <span className="cursor-3d ml-2">▼</span>
  </button>
```

### VideoAnalyzer

```typescript
export default function VideoAnalyzer({ onAnalysisComplete, language }: { onAnalysisComplete: ...; language: Language }) {
  const t = useTranslation(language);

  <h2 className="text-xl font-bold text-retro-black font-mono uppercase">{t.analysisUnit}</h2>
  <p className="text-xs text-retro-black/70 font-mono">{t.insertData}</p>

  <textarea placeholder={t.pasteTranscript} ... />

  {loading ? (
    <>
      <span className="animate-spin">⚙️</span>
      {t.processing}
    </>
  ) : (
    <>
      <span>🛡️</span>
      {t.analyze}
    </>
  )}

  <p className="font-bold flex items-center gap-2">
    <span>⚠️</span> {t.error}: {error.toUpperCase()}
  </p>

  <span className="text-sm font-bold font-mono text-retro-black">{t.credibilityScore}</span>

  <h4 className="text-sm font-black text-retro-black font-mono flex items-center gap-2 uppercase">
    <span>⚠️</span> {t.warningsDetected}
  </h4>

  <h3 className="font-black text-retro-black font-mono mb-3 flex items-center gap-2 uppercase">
    <span>✅</span> {t.identifiedSupplements} ({lastResult.supplements.length})
  </h3>
```

### PostModal

```typescript
export default function PostModal({ isOpen, onClose, currentStack, language }: { ...; language: Language }) {
  const t = useTranslation(language);

  <h2 className="font-black text-xl font-mono uppercase">
    <span className="cursor-3d mr-2">📝</span>
    {t.postTitle}
  </h2>

  <label className="block font-bold text-sm font-mono mb-2 text-retro-black">
    {t.stackTitle}
  </label>
  <input placeholder={t.stackTitlePlaceholder} ... />

  <label className="block font-bold text-sm font-mono mb-2 text-retro-black">
    {t.description}
  </label>
  <textarea placeholder={t.descriptionPlaceholder} ... />

  <label className="block font-bold text-sm font-mono mb-2 text-retro-black">
    {t.currentSupplements}
  </label>

  <p className="text-sm font-mono text-retro-gray">
    {t.noSupplements}
  </p>

  <button ... className="flex-1 border-2 border-retro-black bg-white py-3 font-mono font-bold hover:bg-gray-100 text-retro-black">
    {t.cancel}
  </button>
  <button className="flex-1 retro-button py-3 font-mono font-bold text-retro-black">
    🚀 {t.publish}
  </button>
```

---

## ✅ 验收标准

完成后：

- [ ] 所有UI文字都有中英文对应
- [ ] 点击语言切换按钮，所有文字立即切换
- [ ] 英文保持大写（符合游戏机风格）
- [ ] 中文保持原样
- [ ] 没有遗漏的硬编码英文

---

**Cursor，按照这个实现完整的多语言系统！** 🌐
