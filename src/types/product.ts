import { Conflict, Synergy } from "./supplement";

export type TimingPreference = "MORNING_EMPTY_STOMACH" | "MORNING_WITH_FOOD" | "BEFORE_BED" | "ANYTIME" | "POST_WORKOUT" | "EVENING" | "AFTERNOON" | "PRE_WORKOUT" | "MORNING";

/**
 * 产品模型 - 用户实际购买的商品
 */
export interface Product {
  id: string;
  name: string;              // "Nature Made 维生素D3软胶囊"
  brand: string;             // "Nature Made"
  category: ProductCategory; // 品类
  imageUrl?: string;

  // 包含的营养素成分
  ingredients: NutrientContent[];

  // 服用建议
  dosagePerServing: string;  // "每次1粒"
  servingsPerDay: number;    // 1
  optimalTiming: TimingPreference;

  // 购买信息
  price?: number;
  buyLink?: string;

  // 用户反馈
  rating?: number;
  reviewCount?: number;
}

export interface NutrientContent {
  nutrient: Nutrient;        // 营养素对象
  amount: number;            // 含量
  unit: string;              // "mg" / "IU" / "mcg"
  percentDV?: number;        // 每日推荐摄入量百分比
}

export enum ProductCategory {
  MULTIVITAMIN = "MULTIVITAMIN",        // 综合维生素
  SINGLE_VITAMIN = "SINGLE_VITAMIN",    // 单一维生素
  MINERAL = "MINERAL",                  // 矿物质
  OMEGA = "OMEGA",                      // Omega-3/6/9
  PROTEIN = "PROTEIN",                  // 蛋白粉
  PROBIOTIC = "PROBIOTIC",              // 益生菌
  HERBAL = "HERBAL",                    // 草本/植物提取
  SPORTS = "SPORTS",                    // 运动营养
  BEAUTY = "BEAUTY",                    // 美容保健
  JOINT = "JOINT",                      // 关节骨骼
  IMMUNITY = "IMMUNITY",                // 免疫力
  SLEEP = "SLEEP",                      // 助眠
  ENERGY = "ENERGY",                    // 能量/抗疲劳

  // 日常食材
  FOOD_MEAT = "FOOD_MEAT",              // 肉类
  FOOD_EGG = "FOOD_EGG",                // 蛋类
  FOOD_VEGETABLE = "FOOD_VEGETABLE",    // 蔬菜
  FOOD_ORGAN = "FOOD_ORGAN",            // 内脏

  // 健康饮品
  BEVERAGE_TEA = "BEVERAGE_TEA",        // 茶类
  BEVERAGE_SOY = "BEVERAGE_SOY",        // 豆制品饮料
  BEVERAGE_JUICE = "BEVERAGE_JUICE",    // 果汁
  BEVERAGE_OTHER = "BEVERAGE_OTHER",    // 其他饮品
}

/**
 * 营养素 - 产品的成分（后台用于冲突检测）
 */
export interface Nutrient {
  id: string;
  name: string;              // "维生素D3 (胆钙化醇)"
  commonName: string;        // "维生素D"
  category: NutrientCategory;
  aliases: string[];         // ["Vitamin D", "Cholecalciferol", "VD3"]
}

export enum NutrientCategory {
  // 维生素
  VITAMIN_FAT_SOLUBLE = "VITAMIN_FAT_SOLUBLE",    // 脂溶性维生素 (A,D,E,K)
  VITAMIN_WATER_SOLUBLE = "VITAMIN_WATER_SOLUBLE",// 水溶性维生素 (B,C)

  // 矿物质
  MACRO_MINERAL = "MACRO_MINERAL",                // 常量矿物质 (钙镁钾钠)
  TRACE_MINERAL = "TRACE_MINERAL",                // 微量矿物质 (铁锌硒铬)

  // 氨基酸
  ESSENTIAL_AMINO = "ESSENTIAL_AMINO",            // 必需氨基酸
  BCAA = "BCAA",                                  // 支链氨基酸

  // 脂肪酸
  OMEGA_3 = "OMEGA_3",                            // EPA/DHA
  OMEGA_6 = "OMEGA_6",

  // 其他
  PROBIOTIC_STRAIN = "PROBIOTIC_STRAIN",          // 益生菌菌株
  HERBAL_EXTRACT = "HERBAL_EXTRACT",              // 草本提取物
  ANTIOXIDANT = "ANTIOXIDANT",                    // 抗氧化剂
  COENZYME = "COENZYME",                          // 辅酶 (CoQ10等)
}

/**
 * MyListCollection - 用户的多个产品清单集合
 */
export interface MyListCollection {
  id: string;
  name: string;              // "我的增肌方案"
  description?: string;
  products: MyListProduct[];
  createdAt: Date;
  updatedAt: Date;
  isFork: boolean;           // 是否是 fork 别人的
  originalAuthor?: string;   // 如果是 fork，原作者名
  conflictCount?: number;    // 冲突数量（缓存）
}

export interface MyListProduct {
  productId: string;
  product: Product;
  addedAt: Date;
  notes?: string;  // 用户备注
}

/**
 * 日晷 - 用户的实际排程（以此为单位分享）
 */
export interface Sundial {
  id: string;
  userId?: string;
  name: string;              // "我的增肌方案"
  description?: string;

  // 产品在时间线上的分布
  timeSlots: SundialSlot[];

  // 检测结果
  conflicts: Conflict[];
  synergies: Synergy[];

  // AI毒舌点评
  aiRoast?: string;

  // 元数据
  optimizedAt: Date;         // 最后一次AI优化时间
  isPublic: boolean;         // 是否公开到社区
  forkCount: number;
  likeCount: number;
  
  // Community props (optional if not from DB)
  author?: string;
  createdAt?: string;
}

export interface SundialSlot {
  time: string;              // "08:00"
  products: {
    productId: string;
    product: Product;
    dosage: string;          // "按推荐量"
  }[];
  reasoning: string;         // "早餐时段，脂溶性维生素吸收最佳"
  productCount?: number; // for simple display
}

/**
 * 博主分析结果
 */
export interface InfluencerAnalysis {
  id: string;
  sourceUrl?: string;
  sourceText: string;
  analyzedAt: Date;

  // AI识别出的产品推荐
  recommendedProducts: {
    productName: string;
    brand?: string;
    dosage?: string;
    timing?: string;
    reasoning?: string;
    confidence: number;      // 0-1，识别置信度

    // 匹配到数据库的产品（可能为空）
    matchedProduct?: Product;
  }[];

  credibilityScore: number;
  warnings: string[];
}
