import { Nutrient } from "@/types/product";

/**
 * 全球常见营养素数据库
 */
export const NUTRIENTS_DATABASE: Nutrient[] = [
  // === 脂溶性维生素 ===
  { id: "vit-a", name: "维生素A (视黄醇)", commonName: "维生素A", category: "VITAMIN_FAT_SOLUBLE" as any, aliases: ["Vitamin A", "Retinol", "VA"] },
  { id: "vit-d2", name: "维生素D2 (麦角钙化醇)", commonName: "维生素D", category: "VITAMIN_FAT_SOLUBLE" as any, aliases: ["Vitamin D2", "Ergocalciferol"] },
  { id: "vit-d3", name: "维生素D3 (胆钙化醇)", commonName: "维生素D", category: "VITAMIN_FAT_SOLUBLE" as any, aliases: ["Vitamin D3", "Cholecalciferol", "VD3"] },
  { id: "vit-e", name: "维生素E (生育酚)", commonName: "维生素E", category: "VITAMIN_FAT_SOLUBLE" as any, aliases: ["Vitamin E", "Tocopherol", "VE"] },
  { id: "vit-k1", name: "维生素K1 (叶绿醌)", commonName: "维生素K", category: "VITAMIN_FAT_SOLUBLE" as any, aliases: ["Vitamin K1", "Phylloquinone"] },
  { id: "vit-k2", name: "维生素K2 (甲萘醌)", commonName: "维生素K", category: "VITAMIN_FAT_SOLUBLE" as any, aliases: ["Vitamin K2", "Menaquinone", "MK-7"] },

  // === 水溶性维生素 ===
  { id: "vit-c", name: "维生素C (抗坏血酸)", commonName: "维生素C", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin C", "Ascorbic Acid", "VC"] },
  { id: "vit-b1", name: "维生素B1 (硫胺素)", commonName: "维生素B1", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin B1", "Thiamine", "VB1"] },
  { id: "vit-b2", name: "维生素B2 (核黄素)", commonName: "维生素B2", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin B2", "Riboflavin", "VB2"] },
  { id: "vit-b3", name: "维生素B3 (烟酸)", commonName: "维生素B3", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin B3", "Niacin", "VB3"] },
  { id: "vit-b5", name: "维生素B5 (泛酸)", commonName: "维生素B5", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin B5", "Pantothenic Acid", "VB5"] },
  { id: "vit-b6", name: "维生素B6 (吡哆醇)", commonName: "维生素B6", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin B6", "Pyridoxine", "VB6"] },
  { id: "vit-b7", name: "维生素B7 (生物素)", commonName: "生物素", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin B7", "Biotin", "VB7"] },
  { id: "vit-b9", name: "维生素B9 (叶酸)", commonName: "叶酸", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin B9", "Folic Acid", "Folate"] },
  { id: "vit-b12", name: "维生素B12 (钴胺素)", commonName: "维生素B12", category: "VITAMIN_WATER_SOLUBLE" as any, aliases: ["Vitamin B12", "Cobalamin", "VB12"] },

  // === 常量矿物质 ===
  { id: "calcium", name: "钙", commonName: "钙", category: "MACRO_MINERAL" as any, aliases: ["Calcium", "Ca"] },
  { id: "magnesium", name: "镁", commonName: "镁", category: "MACRO_MINERAL" as any, aliases: ["Magnesium", "Mg"] },
  { id: "potassium", name: "钾", commonName: "钾", category: "MACRO_MINERAL" as any, aliases: ["Potassium", "K"] },
  { id: "sodium", name: "钠", commonName: "钠", category: "MACRO_MINERAL" as any, aliases: ["Sodium", "Na"] },
  { id: "phosphorus", name: "磷", commonName: "磷", category: "MACRO_MINERAL" as any, aliases: ["Phosphorus", "P"] },

  // === 微量矿物质 ===
  { id: "iron", name: "铁", commonName: "铁", category: "TRACE_MINERAL" as any, aliases: ["Iron", "Fe"] },
  { id: "zinc", name: "锌", commonName: "锌", category: "TRACE_MINERAL" as any, aliases: ["Zinc", "Zn"] },
  { id: "copper", name: "铜", commonName: "铜", category: "TRACE_MINERAL" as any, aliases: ["Copper", "Cu"] },
  { id: "selenium", name: "硒", commonName: "硒", category: "TRACE_MINERAL" as any, aliases: ["Selenium", "Se"] },
  { id: "iodine", name: "碘", commonName: "碘", category: "TRACE_MINERAL" as any, aliases: ["Iodine", "I"] },
  { id: "chromium", name: "铬", commonName: "铬", category: "TRACE_MINERAL" as any, aliases: ["Chromium", "Cr"] },
  { id: "manganese", name: "锰", commonName: "锰", category: "TRACE_MINERAL" as any, aliases: ["Manganese", "Mn"] },
  { id: "molybdenum", name: "钼", commonName: "钼", category: "TRACE_MINERAL" as any, aliases: ["Molybdenum", "Mo"] },

  // === 必需氨基酸 ===
  { id: "leucine", name: "亮氨酸", commonName: "亮氨酸", category: "BCAA" as any, aliases: ["Leucine", "L-Leucine"] },
  { id: "isoleucine", name: "异亮氨酸", commonName: "异亮氨酸", category: "BCAA" as any, aliases: ["Isoleucine", "L-Isoleucine"] },
  { id: "valine", name: "缬氨酸", commonName: "缬氨酸", category: "BCAA" as any, aliases: ["Valine", "L-Valine"] },
  { id: "lysine", name: "赖氨酸", commonName: "赖氨酸", category: "ESSENTIAL_AMINO" as any, aliases: ["Lysine", "L-Lysine"] },
  { id: "methionine", name: "蛋氨酸", commonName: "蛋氨酸", category: "ESSENTIAL_AMINO" as any, aliases: ["Methionine", "L-Methionine"] },
  { id: "phenylalanine", name: "苯丙氨酸", commonName: "苯丙氨酸", category: "ESSENTIAL_AMINO" as any, aliases: ["Phenylalanine", "L-Phenylalanine"] },
  { id: "threonine", name: "苏氨酸", commonName: "苏氨酸", category: "ESSENTIAL_AMINO" as any, aliases: ["Threonine", "L-Threonine"] },
  { id: "tryptophan", name: "色氨酸", commonName: "色氨酸", category: "ESSENTIAL_AMINO" as any, aliases: ["Tryptophan", "L-Tryptophan"] },

  // === Omega脂肪酸 ===
  { id: "epa", name: "EPA (二十碳五烯酸)", commonName: "EPA", category: "OMEGA_3" as any, aliases: ["EPA", "Eicosapentaenoic Acid"] },
  { id: "dha", name: "DHA (二十二碳六烯酸)", commonName: "DHA", category: "OMEGA_3" as any, aliases: ["DHA", "Docosahexaenoic Acid"] },
  { id: "ala", name: "ALA (α-亚麻酸)", commonName: "ALA", category: "OMEGA_3" as any, aliases: ["ALA", "Alpha-Linolenic Acid"] },

  // === 辅酶与抗氧化剂 ===
  { id: "coq10", name: "辅酶Q10", commonName: "辅酶Q10", category: "COENZYME" as any, aliases: ["CoQ10", "Ubiquinone"] },
  { id: "glutathione", name: "谷胱甘肽", commonName: "谷胱甘肽", category: "ANTIOXIDANT" as any, aliases: ["Glutathione", "GSH"] },
  { id: "resveratrol", name: "白藜芦醇", commonName: "白藜芦醇", category: "ANTIOXIDANT" as any, aliases: ["Resveratrol"] },
  { id: "astaxanthin", name: "虾青素", commonName: "虾青素", category: "ANTIOXIDANT" as any, aliases: ["Astaxanthin"] },

  // === 草本提取物 ===
  { id: "curcumin", name: "姜黄素", commonName: "姜黄素", category: "HERBAL_EXTRACT" as any, aliases: ["Curcumin", "Turmeric"] },
  { id: "green-tea", name: "绿茶提取物", commonName: "绿茶", category: "HERBAL_EXTRACT" as any, aliases: ["Green Tea Extract", "EGCG"] },
  { id: "ginseng", name: "人参提取物", commonName: "人参", category: "HERBAL_EXTRACT" as any, aliases: ["Ginseng", "Panax Ginseng"] },
  { id: "ashwagandha", name: "南非醉茄", commonName: "南非醉茄", category: "HERBAL_EXTRACT" as any, aliases: ["Ashwagandha"] },
  { id: "rhodiola", name: "红景天", commonName: "红景天", category: "HERBAL_EXTRACT" as any, aliases: ["Rhodiola"] },

  // === 益生菌菌株 ===
  { id: "lacto-acidophilus", name: "嗜酸乳杆菌", commonName: "嗜酸乳杆菌", category: "PROBIOTIC_STRAIN" as any, aliases: ["Lactobacillus Acidophilus"] },
  { id: "bifido-bifidum", name: "双歧杆菌", commonName: "双歧杆菌", category: "PROBIOTIC_STRAIN" as any, aliases: ["Bifidobacterium Bifidum"] },

  // === 其他 (如咖啡因、单宁酸) ===
  {
    id: "caffeine",
    name: "咖啡因",
    commonName: "咖啡因",
    category: "ANTIOXIDANT" as any,
    aliases: ["Caffeine", "咖啡碱"]
  },
  {
    id: "tannin",
    name: "单宁酸/茶多酚",
    commonName: "茶多酚",
    category: "ANTIOXIDANT" as any,
    aliases: ["Tannin", "茶多酚", "EGCG"]
  },
];
