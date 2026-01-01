/**
 * Core type definitions for the Supplement Scheduler
 *
 * TODO for Cursor: Expand these types based on actual data model needs
 */

export interface Supplement {
  id: string;
  name: string;
  commonNames: string[]; // e.g., ["Vitamin C", "Ascorbic Acid"]
  category: SupplementCategory;
  activeIngredients: Ingredient[];
  optimalTiming: TimingPreference;
  dosage: {
    min: number;
    max: number;
    unit: string; // "mg", "IU", "mcg"
  };
  bioavailability: {
    emptyStomach: number; // 0-1
    withFood: number; // 0-1
  };
}

export interface Ingredient {
  name: string;
  chemicalFormula?: string;
  mechanisms: string[]; // e.g., ["Antioxidant", "Cofactor for collagen synthesis"]
}

export enum SupplementCategory {
  VITAMIN = "VITAMIN",
  MINERAL = "MINERAL",
  AMINO_ACID = "AMINO_ACID",
  HERBAL = "HERBAL",
  PROBIOTIC = "PROBIOTIC",
  ENZYME = "ENZYME",
  OTHER = "OTHER",
}

export enum TimingPreference {
  MORNING_EMPTY = "MORNING_EMPTY",
  MORNING_WITH_FOOD = "MORNING_WITH_FOOD",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  BEFORE_BED = "BEFORE_BED",
  PRE_WORKOUT = "PRE_WORKOUT",
  POST_WORKOUT = "POST_WORKOUT",
  ANYTIME = "ANYTIME",
}

export interface Conflict {
  id: string;
  supplementA: string; // supplement ID
  supplementB: string;
  type: ConflictType;
  severity: ConflictSeverity;
  explanation: string;
  pharmacologicalMechanism: string;
  timeGapRequired?: number; // minutes
  citations?: string[]; // research paper links
}

export enum ConflictType {
  ABSORPTION_COMPETITION = "ABSORPTION_COMPETITION", // 吸收竞争
  ENZYME_INHIBITION = "ENZYME_INHIBITION", // 酶抑制
  RECEPTOR_COMPETITION = "RECEPTOR_COMPETITION", // 受体竞争
  PH_INTERFERENCE = "PH_INTERFERENCE", // pH干扰
  ADVERSE_INTERACTION = "ADVERSE_INTERACTION", // 不良反应
}

export enum ConflictSeverity {
  CRITICAL = "CRITICAL", // 严重危险，禁止同时服用
  HIGH = "HIGH", // 高度冲突，需间隔4+小时
  MEDIUM = "MEDIUM", // 中度冲突，需间隔2小时
  LOW = "LOW", // 轻度冲突，建议分开
}

export interface Synergy {
  id: string;
  supplements: string[]; // 2+ supplement IDs
  benefit: string;
  mechanism: string;
  optimalRatio?: Record<string, number>; // e.g., {"calcium": 2, "magnesium": 1}
}

export interface ScheduleSlot {
  time: string; // "08:00", "12:00", etc.
  supplements: {
    id: string;
    name: string;
    dosage: string;
  }[];
  reasoning: string; // Why scheduled at this time
}

// --- Video Analysis Types ---

export interface VideoAnalysisResult {
  supplements: {
    name: string;
    dosage?: string;
    timing?: string;
    reasoning?: string; // Why the video recommends this
  }[];
  warnings: string[]; // Red flags from the video
  credibilityScore: number; // 0-100, based on citations, expertise
}
