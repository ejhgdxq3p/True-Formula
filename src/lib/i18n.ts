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

    // === 新增：MyList 组件 ===
    myList: "我的清单",
    bench: "工作台",
    clickBenchToSelect: "点击工作台选择清单",
    openBench: "打开工作台",
    createNewList: "创建新清单",
    renameList: "重命名",
    deleteList: "删除",
    listName: "清单名称",

    // === 新增：产品展示 ===
    noProducts: "暂无产品",
    emptyState: "空",
    productCount: "个产品",
    addProduct: "加产品",
    removeProduct: "移除",
    safe: "无冲突",

    // === 新增：InfluencerPanel ===
    influencerRecommend: "博主推荐",
    textMode: "文字",
    videoMode: "视频",
    pasteInfluencerText: "粘贴博主推荐文字...",
    pasteVideoUrl: "粘贴视频链接 (YouTube/B站/抖音)...",
    supportedPlatforms: "支持",
    analyzing: "AI分析中...",
    aiAnalyze: "AI分析",
    credibility: "可信度",
    foundProducts: "发现产品",
    notInDatabase: "数据库中未找到",
    adoptSelected: "采用选中产品",
    pasteContentToStart: "粘贴博主内容开始分析",
    analysisFailed: "分析失败",

    // === 新增：Sundial 日晷 ===
    mySundial: "我的日晷",
    lastOptimized: "最后优化",
    aiAnalyzing: "AI 正在分析",
    optimizingSchedule: "检测冲突、优化时间表...",
    viewDetails: "查看详情",
    regenerate: "重新生成",
    addProductsToStart: "加产品开始优化",
    dosage: "用量",
    ingredients: "主要成分",
    timing: "推荐时间",
    more: "更多",
    products: "产品",
    synergies: "协同",

    // === 新增：时间相关 ===
    timingMorning: "早晨",
    timingAfternoon: "下午",
    timingEvening: "傍晚",
    timingPostWorkout: "运动后",
    timingBeforeBed: "睡前",
    timingWithFood: "随餐",
    timingEmptyStomach: "空腹",
    timingAnytime: "任何时间",

    // === 新增：AI 点评/降级文本 ===
    aiCommentaryTitle: "AI 毒舌点评",
    aiRoast: "AI 毒舌点评",
    generating: "生成中...",
    fallback: {
      analyzing: "正在分析你的补剂组合...",
      consideringConflicts: "考虑营养素间的相互作用...",
      optimizingTiming: "优化服用时间分配...",
      checkingDosage: "检查剂量安全性...",
      reviewingResearch: "回顾相关科学研究...",
      almostDone: "即将完成分析...",
    },

    // === 新增：WorkbenchModal ===
    myWorkbench: "我的工作台",
    manageAllLists: "管理你的所有产品清单",
    newList: "新建清单",
    createNewListTitle: "新建产品清单",
    inputListName: "输入清单名称 (如：增肌配方)",
    create: "创建",
    myCreatedLists: "我创建的清单",
    forkedLists: "我 FORK 的清单",
    noLists: "还没有清单，点击右上角新建",
    items: "产品",
    select: "选择",
    me: "我",

    // === 新增：SundialDetailModal ===
    by: "作者",
    productList: "产品清单",
    forkThisSundial: "FORK 这个日晷",
    likes: "点赞",
    slots: "个时间点",

    // === 新增：CommunityWall Mock数据 ===
    mockAuthor1: "健身达人小王",
    mockTitle1: "增肌补剂日晷",
    mockDesc1: "适合健身人群",
    mockAuthor2: "养生达人李姐",
    mockTitle2: "女性抗氧化日晷",
    mockDesc2: "皮肤变好",
    mockAuthor3: "熬夜冠军张三",
    mockTitle3: "护肝提神日晷",
    mockDesc3: "打工人必备",
    forkSundialAlert: "已复制日晷到你的工作台！",
    forks: "复刻",
    capsule: "粒",
    capsules: "粒",

    // === 新增：ProductLibraryModal ===
    productLibrary: "产品库",
    add: "ADD",

    // === 新增：错误和提示 ===
    errorOccurred: "发生错误",
    tryAgain: "重试",
    loading: "加载中...",
    success: "成功",
    failed: "失败",
    confirm: "确认",
    unknownError: "未知错误",

    // === 新增：API错误消息 ===
    aiCommentaryUnavailable: "AI点评暂时不可用，请检查API配置。",
    aiServiceUnavailable: "AI排程服务暂时不可用，已为您生成基础排程。",

    // === 新增：Meta 标签 ===
    metaTitle: "真配方 True Formula - AI智能补剂排程",
    metaDescription: "科学补剂排程系统 - AI分析、冲突检测、智能优化",

    // === 新增：产品类别翻译 ===
    categories: {
      vitamin: "维生素类",
      mineral: "矿物质类",
      aminoAcid: "氨基酸类",
      omega: "Omega脂肪酸",
      probiotic: "益生菌类",
      herbal: "草本提取物",
      multivitamin: "复合维生素",
      protein: "蛋白质",
      other: "其他",
    },
  },
  en: {
    // Header
    appTitle: "True Formula",
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

    // === 新增：MyList 组件 ===
    myList: "MY LIST",
    bench: "BENCH",
    clickBenchToSelect: "CLICK BENCH TO SELECT LIST",
    openBench: "OPEN BENCH",
    createNewList: "CREATE NEW LIST",
    renameList: "RENAME",
    deleteList: "DELETE",
    listName: "LIST NAME",

    // === 新增：产品展示 ===
    noProducts: "EMPTY",
    emptyState: "EMPTY",
    productCount: "PRODUCTS",
    addProduct: "ADD",
    removeProduct: "REMOVE",
    safe: "SAFE",

    // === 新增：InfluencerPanel ===
    influencerRecommend: "INFLUENCER",
    textMode: "TEXT",
    videoMode: "VIDEO",
    pasteInfluencerText: "PASTE CONTENT...",
    pasteVideoUrl: "PASTE VIDEO URL...",
    supportedPlatforms: "SUPPORTED",
    analyzing: "ANALYZING...",
    aiAnalyze: "AI ANALYZE",
    credibility: "CREDIBILITY",
    foundProducts: "FOUND PRODUCTS",
    notInDatabase: "NOT IN DATABASE",
    adoptSelected: "ADOPT SELECTED",
    pasteContentToStart: "PASTE CONTENT TO START",
    analysisFailed: "Analysis failed",

    // === 新增：Sundial 日晷 ===
    mySundial: "MY SUNDIAL",
    lastOptimized: "LAST OPTIMIZED",
    aiAnalyzing: "AI ANALYZING",
    optimizingSchedule: "Optimizing schedule...",
    viewDetails: "VIEW DETAILS",
    regenerate: "REGENERATE",
    addProductsToStart: "ADD PRODUCTS TO START",
    dosage: "DOSAGE",
    ingredients: "INGREDIENTS",
    timing: "TIMING",
    more: "more",
    products: "PRODUCTS",
    synergies: "SYNERGIES",

    // === 新增：时间相关 ===
    timingMorning: "Morning",
    timingAfternoon: "Afternoon",
    timingEvening: "Evening",
    timingPostWorkout: "Post-Workout",
    timingBeforeBed: "Before Bed",
    timingWithFood: "With Food",
    timingEmptyStomach: "Empty Stomach",
    timingAnytime: "Anytime",

    // === 新增：AI 点评/降级文本 ===
    aiCommentaryTitle: "AI PROFESSIONAL COMMENTARY",
    aiRoast: "AI ROAST",
    generating: "GENERATING...",
    fallback: {
      analyzing: "Analyzing your supplement combination...",
      consideringConflicts: "Considering nutrient interactions...",
      optimizingTiming: "Optimizing timing schedule...",
      checkingDosage: "Checking dosage safety...",
      reviewingResearch: "Reviewing scientific research...",
      almostDone: "Almost done with analysis...",
    },

    // === 新增：WorkbenchModal ===
    myWorkbench: "MY WORKBENCH",
    manageAllLists: "MANAGE ALL LISTS",
    newList: "NEW",
    createNewListTitle: "CREATE NEW LIST",
    inputListName: "Name...",
    create: "CREATE",
    myCreatedLists: "MY LISTS",
    forkedLists: "FORKED LISTS",
    noLists: "NO LISTS",
    items: "ITEMS",
    select: "SELECT",
    me: "Me",

    // === 新增：SundialDetailModal ===
    by: "BY",
    productList: "PRODUCT LIST",
    forkThisSundial: "FORK THIS SUNDIAL",
    likes: "LIKES",
    slots: "SLOTS",

    // === 新增：CommunityWall Mock数据 ===
    mockAuthor1: "Fitness Expert Wang",
    mockTitle1: "Muscle Gain Stack",
    mockDesc1: "For fitness enthusiasts",
    mockAuthor2: "Wellness Expert Li",
    mockTitle2: "Women's Antioxidant Stack",
    mockDesc2: "Better skin",
    mockAuthor3: "Night Owl Zhang",
    mockTitle3: "Liver Support Stack",
    mockDesc3: "For office workers",
    forkSundialAlert: "Sundial copied to your workbench!",
    forks: "Forks",
    capsule: "capsule",
    capsules: "capsules",

    // === 新增：ProductLibraryModal ===
    productLibrary: "PRODUCT LIBRARY",
    add: "ADD",

    // === 新增：错误和提示 ===
    errorOccurred: "ERROR OCCURRED",
    tryAgain: "TRY AGAIN",
    loading: "LOADING...",
    success: "SUCCESS",
    failed: "FAILED",
    confirm: "CONFIRM",
    unknownError: "Unknown error",

    // === 新增：API错误消息 ===
    aiCommentaryUnavailable: "AI commentary unavailable. Please check API configuration.",
    aiServiceUnavailable: "AI service unavailable. Basic schedule generated.",

    // === 新增：Meta 标签 ===
    metaTitle: "True Formula - AI-Powered Supplement Scheduling",
    metaDescription: "Scientific supplement scheduling system - AI analysis, conflict detection, smart optimization",

    // === 新增：产品类别翻译 ===
    categories: {
      vitamin: "VITAMINS",
      mineral: "MINERALS",
      aminoAcid: "AMINO ACIDS",
      omega: "OMEGA FATTY ACIDS",
      probiotic: "PROBIOTICS",
      herbal: "HERBAL EXTRACTS",
      multivitamin: "MULTIVITAMINS",
      protein: "PROTEIN",
      other: "OTHERS",
    },
  },
};

// Type for translation object
export type TranslationKeys = typeof translations.zh;

// Hook to use translations
export function useTranslation(language: Language): TranslationKeys {
  return translations[language];
}

// Get translation by key path (for nested keys like 'fallback.analyzing')
export function getNestedTranslation(language: Language, keyPath: string): string {
  const keys = keyPath.split('.');
  let result: any = translations[language];
  for (const key of keys) {
    result = result?.[key];
  }
  return result || keyPath;
}
