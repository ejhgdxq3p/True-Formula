import type { Language } from "@/lib/i18n";

/**
 * AI 降级文本（当API调用失败时显示）
 */
export const FALLBACK_TEXTS = {
  zh: [
    "正在分析你的补剂组合...",
    "考虑营养素间的相互作用...",
    "优化服用时间分配...",
    "检查剂量安全性...",
    "回顾相关科学研究...",
    "即将完成分析...",
  ],
  en: [
    "Analyzing your supplement combination...",
    "Considering nutrient interactions...",
    "Optimizing timing schedule...",
    "Checking dosage safety...",
    "Reviewing scientific research...",
    "Almost done with analysis...",
  ],
};

/**
 * 获取降级文本数组
 */
export function getFallbackTexts(language: Language): string[] {
  return FALLBACK_TEXTS[language];
}

/**
 * 随机获取一条降级文本
 */
export function getRandomFallbackText(language: Language): string {
  const texts = FALLBACK_TEXTS[language];
  return texts[Math.floor(Math.random() * texts.length)];
}

/**
 * 降级点评生成器
 */
export function generateFallbackCommentary(
  conflicts: number,
  productCount: number,
  language: Language
): string {
  if (language === 'zh') {
    if (conflicts === 0 && productCount <= 5) {
      return "不错嘛，简洁高效的配方。但说实话，这么保守的搭配我闭着眼睛都能设计出来。产品选择合理，时间分配也算靠谱，继续保持吧。";
    } else if (conflicts === 0 && productCount > 5) {
      return "啧啧，居然真的0冲突？看来你在这上面下了功夫。不过产品有点多，钱包还好吗？建议精简一下，很多功能是重复的。";
    } else if (conflicts > 0 && conflicts <= 2) {
      return `有${conflicts}个冲突但还能抢救。建议：别瞎吃，听AI的把时间调开。现在这样吃纯属浪费，冲突的产品会互相抵消吸收率。调整一下时间间隔，至少隔开4小时。`;
    } else {
      return `${conflicts}个冲突？你这是补剂还是化学实验？建议从头来过，让AI帮你重新规划。很多产品放在一起完全是浪费钱，有些甚至可能有副作用。赶紧调整吧。`;
    }
  } else {
    if (conflicts === 0 && productCount <= 5) {
      return "Clean stack. Simple. Boring. But hey, at least you won't poison yourself. Decent product selection and timing, keep it up.";
    } else if (conflicts === 0 && productCount > 5) {
      return "Zero conflicts? Impressive. But that's a lot of pills. Your liver doing okay? Consider cutting down—many of these overlap in function.";
    } else if (conflicts > 0 && conflicts <= 2) {
      return `${conflicts} conflicts detected. Not terrible, but needs work. Let AI fix your timing. Some products are blocking each other's absorption. Space them out by at least 4 hours.`;
    } else {
      return `${conflicts} conflicts. Is this a supplement stack or a chemistry disaster? Start over and let AI rebuild it properly. You're literally wasting money and possibly risking side effects.`;
    }
  }
}
