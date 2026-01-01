export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // Header
    appTitle: "真配方",
    appSubtitle: "科学补剂排程 v1.0",
    importVideo: "导入视频",
    save: "保存",
    postStack: "发布方案",
    langSwitch: "EN",

    // SupplementDrawer
    supplementLibrary: "产品库",
    search: "搜索...",
    filter: "筛选",
    brands: "品牌",
    category: "分类",
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
    appTitle: "TRUE FORMULA",
    appSubtitle: "SCIENTIFIC SUPPLEMENT SCHEDULING v1.0",
    importVideo: "IMPORT VIDEO",
    save: "SAVE",
    postStack: "POST STACK",
    langSwitch: "中文",

    // SupplementDrawer
    supplementLibrary: "PRODUCTS",
    search: "SEARCH...",
    filter: "FILTER",
    brands: "BRANDS",
    category: "CATEGORY",
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
