import type { Product } from "@/types/product";
import type { Language } from "./i18n";

/**
 * 品牌名中英文映射表
 */
const BRAND_TRANSLATIONS: Record<string, string> = {
  // 中国品牌
  "汤臣倍健": "By-Health",
  "养生堂": "Yangshengtang",
  "善存": "Centrum",
  "钙尔奇": "Caltrate",
  "21金维他": "21-Jinvita",
  "康恩贝": "Conba",
  "修正": "Xiuzheng",
  "金奥力": "Kingdomway",
  "康宝莱": "Herbalife",
  "安利": "Amway",
  "完美": "Perfect",
  "无限极": "Infinitus",
  "纽崔莱": "Nutrilite",
  "日常食材": "Daily Food",
  "健康饮品": "Healthy Beverage",

  // 国际品牌（保持原文）
  "Swisse": "Swisse",
  "Nature Made": "Nature Made",
  "GNC": "GNC",
  "Blackmores": "Blackmores",
  "Centrum": "Centrum",
  "NOW Foods": "NOW Foods",
  "Optimum Nutrition": "Optimum Nutrition",
  "Puritan's Pride": "Puritan's Pride",
  "Jarrow Formulas": "Jarrow Formulas",
  "Solgar": "Solgar",
  "Life Extension": "Life Extension",
  "Doctor's Best": "Doctor's Best",
  "California Gold Nutrition": "California Gold Nutrition",
  "Nordic Naturals": "Nordic Naturals",
  "Garden of Life": "Garden of Life",
  "Thorne": "Thorne",
  "MegaFood": "MegaFood",
  "Rainbow Light": "Rainbow Light",
  "Nature's Bounty": "Nature's Bounty",
  "Muscletech": "Muscletech",
  "Fancl": "Fancl",
  "Jamieson": "Jamieson",
};

/**
 * 产品类别关键词翻译表
 */
const PRODUCT_KEYWORDS: Record<string, string> = {
  // 剂型
  "软胶囊": "Softgel",
  "片剂": "Tablet",
  "胶囊": "Capsule",
  "粉剂": "Powder",
  "液体": "Liquid",
  "咀嚼片": "Chewable",
  "泡腾片": "Effervescent",
  "滴剂": "Drops",

  // 产品类型
  "复合维生素": "Multivitamin",
  "男士": "Men's",
  "女士": "Women's",
  "儿童": "Kids",
  "孕妇": "Prenatal",
  "老年": "Senior",

  // 营养素
  "钙": "Calcium",
  "维生素": "Vitamin",
  "鱼油": "Fish Oil",
  "深海鱼油": "Omega-3 Fish Oil",
  "蛋白粉": "Protein Powder",
  "蛋白质粉": "Protein Powder",
  "乳清蛋白": "Whey Protein",
  "益生菌": "Probiotic",
  "叶酸": "Folic Acid",
  "铁": "Iron",
  "锌": "Zinc",
  "镁": "Magnesium",
  "硒": "Selenium",
  "辅酶": "Coenzyme",
  "Q10": "Q10",
  "葡萄糖胺": "Glucosamine",
  "软骨素": "Chondroitin",
  "胶原蛋白": "Collagen",
  "螺旋藻": "Spirulina",
  "大豆异黄酮": "Soy Isoflavones",
  "蔓越莓": "Cranberry",
  "叶黄素": "Lutein",
  "虾青素": "Astaxanthin",
  "番茄红素": "Lycopene",
  "姜黄素": "Curcumin",
  "白藜芦醇": "Resveratrol",
  "氨糖": "Glucosamine",
  "补铁片": "Iron Supplement",
  "血红素铁": "Heme Iron",
  "液体钙": "Liquid Calcium",
  "碳酸钙": "Calcium Carbonate",
  "柠檬酸钙": "Calcium Citrate",
  "钙镁片": "Calcium Magnesium",
  "钙镁锌片": "Calcium Magnesium Zinc",
  "锌硒片": "Zinc Selenium",
  "葡萄糖酸锌": "Zinc Gluconate",
  "天然维生素E": "Natural Vitamin E",
  "奶蓟草": "Milk Thistle",
  "葡萄籽": "Grape Seed",

  // 食材类
  "牛肉": "Beef",
  "猪肝": "Pork Liver",
  "鸡肝": "Chicken Liver",
  "牛肝": "Beef Liver",
  "牛奶": "Milk",
  "酸奶": "Yogurt",
  "豆腐": "Tofu",
  "奶酪": "Cheese",
  "羽衣甘蓝": "Kale",
  "菠菜": "Spinach",
  "三文鱼": "Salmon",
  "鸡蛋": "Eggs",

  // 饮品类
  "浓缩咖啡": "Espresso",
  "红茶": "Black Tea",
  "乌龙茶": "Oolong Tea",
  "绿茶": "Green Tea",
  "抹茶": "Matcha",
  "黑咖啡": "Black Coffee",
  "鲜榨橙汁": "Fresh Orange Juice",
  "豆浆": "Soy Milk",
};

/**
 * 完整产品名称翻译映射（精确匹配）
 */
const PRODUCT_NAME_MAP: Record<string, string> = {
  "汤臣倍健 液体钙软胶囊": "By-Health Liquid Calcium Softgel",
  "汤臣倍健 深海鱼油软胶囊": "By-Health Omega-3 Fish Oil",
  "汤臣倍健 补铁片": "By-Health Iron Supplement",
  "汤臣倍健 锌硒片": "By-Health Zinc Selenium",
  "汤臣倍健 天然维生素E": "By-Health Natural Vitamin E",
  "Swisse 男士复合维生素": "Swisse Men's Multivitamin",
  "Swisse 血红素铁": "Swisse Heme Iron",
  "Swisse 柠檬酸钙": "Swisse Calcium Citrate",
  "Nature Made 维生素D3 2000IU": "Nature Made Vitamin D3 2000IU",
  "Nature Made 铁片": "Nature Made Iron Tablet",
  "GNC Triple Strength 鱼油1500mg": "GNC Triple Strength Fish Oil 1500mg",
  "GNC 钙镁锌片": "GNC Calcium Magnesium Zinc",
  "修正 钙镁片": "Xiuzheng Calcium Magnesium",
  "纽崔莱 蛋白质粉": "Nutrilite Protein Powder",
  "钙尔奇 碳酸钙D3片": "Caltrate Calcium Carbonate D3",
  "Nature's Bounty 葡萄糖酸锌": "Nature's Bounty Zinc Gluconate",
  "Puritan's Pride 维生素E 1000IU": "Puritan's Pride Vitamin E 1000IU",
  "Nordic Naturals Ultimate Omega": "Nordic Naturals Ultimate Omega",
  "善存 复合维生素": "Centrum Multivitamin",
  "B族维生素": "B-Complex Vitamins",
  "维生素C": "Vitamin C",
  "维生素D3": "Vitamin D3",
  "乳清蛋白": "Whey Protein",
  "肌酸": "Creatine",
  "谷氨酰胺": "Glutamine",
  "综合维生素": "Multivitamin",
};

/**
 * 智能翻译产品名称
 * 策略：先精确匹配，再品牌+关键词翻译
 */
export function translateProductName(product: Product, language: Language): string {
  if (language === 'zh') {
    return product.name; // 中文直接返回原名
  }

  // 英文翻译逻辑
  const { name, brand } = product;

  // 1. 尝试精确匹配
  if (PRODUCT_NAME_MAP[name]) {
    return PRODUCT_NAME_MAP[name];
  }

  // 2. 获取品牌英文名
  const brandEn = BRAND_TRANSLATIONS[brand] || brand;

  // 3. 提取产品类别部分（去除品牌名）
  let productType = name.replace(brand, "").trim();

  // 4. 翻译关键词
  Object.entries(PRODUCT_KEYWORDS).forEach(([zh, en]) => {
    productType = productType.replace(new RegExp(zh, 'g'), en);
  });

  // 5. 清理多余空格
  productType = productType.replace(/\s+/g, ' ').trim();

  // 6. 组合结果
  if (productType && brandEn !== productType) {
    return `${brandEn} ${productType}`.trim();
  }
  return brandEn;
}

/**
 * 获取产品显示名称（根据语言）
 */
export function getProductDisplayName(product: Product, language: Language): string {
  return translateProductName(product, language);
}

/**
 * 批量翻译产品列表
 */
export function translateProducts<T extends Product>(products: T[], language: Language): (T & { displayName?: string })[] {
  if (language === 'zh') return products;

  return products.map(product => ({
    ...product,
    // 添加临时的英文名称字段用于显示
    displayName: translateProductName(product, language),
  }));
}

/**
 * 翻译品牌名称
 */
export function translateBrand(brand: string, language: Language): string {
  if (language === 'zh') return brand;
  return BRAND_TRANSLATIONS[brand] || brand;
}

/**
 * 翻译营养素名称
 */
export function translateNutrientName(nutrientName: string, language: Language): string {
  if (language === 'zh') return nutrientName;
  
  // 尝试从关键词映射中找到翻译
  for (const [zh, en] of Object.entries(PRODUCT_KEYWORDS)) {
    if (nutrientName.includes(zh)) {
      return nutrientName.replace(zh, en);
    }
  }
  
  return nutrientName;
}

/**
 * 翻译剂量文本
 */
export function translateDosage(dosage: string, language: Language): string {
  if (language === 'zh') return dosage;
  
  return dosage
    .replace('每次', '')
    .replace('每天', 'daily')
    .replace('粒', ' capsule(s)')
    .replace('片', ' tablet(s)')
    .replace('勺', ' scoop')
    .replace('瓶', ' bottle')
    .replace('个', '')
    .replace('适量', 'as needed')
    .trim();
}
