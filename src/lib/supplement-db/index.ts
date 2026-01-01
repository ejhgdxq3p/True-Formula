import { prisma } from "../prisma";
import type { Supplement, Conflict, Synergy } from "../../types/supplement";
import Fuse from "fuse.js";
import { SupplementCategory, TimingPreference, ConflictType, ConflictSeverity } from "../../types/supplement";

/**
 * Find supplement by name (fuzzy matching)
 */
export async function findSupplement(query: string): Promise<Supplement | null> {
  // 1. Get all supplements (for MVP this is fine, for production use full-text search engine)
  const allSupplements = await prisma.supplement.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true
        }
      }
    }
  });

  // 2. Setup Fuse.js
  const options = {
    keys: ["name", "commonNames", "slug"],
    threshold: 0.3, // Lower is stricter
    includeScore: true
  };

  const fuse = new Fuse(allSupplements, options);
  const result = fuse.search(query);

  if (result.length > 0) {
    const item = result[0].item;
    return mapPrismaSupplementToType(item);
  }

  return null;
}

/**
 * Map Prisma Supplement result to our internal Supplement type
 */
function mapPrismaSupplementToType(item: any): Supplement {
  return {
    id: item.id,
    name: item.name,
    commonNames: JSON.parse(item.commonNames || "[]"),
    category: item.category as SupplementCategory,
    activeIngredients: item.ingredients.map((rel: any) => ({
      name: rel.ingredient.name,
      chemicalFormula: rel.ingredient.chemicalFormula || undefined,
      mechanisms: JSON.parse(rel.ingredient.mechanisms || "[]")
    })),
    optimalTiming: item.optimalTiming as TimingPreference,
    dosage: JSON.parse(item.dosage || "{}"),
    bioavailability: item.bioavailability ? JSON.parse(item.bioavailability) : { emptyStomach: 0.5, withFood: 0.5 }
  };
}

/**
 * Detect conflicts between supplements
 */
export async function detectConflicts(supplementIds: string[]): Promise<Conflict[]> {
  if (supplementIds.length < 2) return [];

  const conflicts = await prisma.conflict.findMany({
    where: {
      OR: [
        {
          supplementAId: { in: supplementIds },
          supplementBId: { in: supplementIds }
        },
        // We might store them strictly ordered A < B, but good to check both directions if not enforced
        {
          supplementAId: { in: supplementIds },
          supplementBId: { in: supplementIds }
        }
      ]
    }
  });

  // Filter out where A and B are the same (shouldn't happen in DB but logic check)
  // and ensure both IDs are in the input list
  const validConflicts = conflicts.filter(c => 
    supplementIds.includes(c.supplementAId) && 
    supplementIds.includes(c.supplementBId) &&
    c.supplementAId !== c.supplementBId
  );

  return validConflicts.map(c => ({
    id: c.id,
    supplementA: c.supplementAId,
    supplementB: c.supplementBId,
    type: c.conflictType as ConflictType,
    severity: c.severity as ConflictSeverity,
    explanation: c.explanation,
    pharmacologicalMechanism: c.mechanismDescription,
    timeGapRequired: c.timeGapMinutes || undefined,
    citations: c.citations ? JSON.parse(c.citations) : []
  }));
}

/**
 * Find beneficial combinations (Synergies)
 */
export async function findSynergies(supplementIds: string[]): Promise<Synergy[]> {
  if (supplementIds.length < 2) return [];

  // Find synergies where ALL required supplements are present in the input list
  // Prisma doesn't have a direct "contains all" for many-to-many easily without raw query or post-filtering
  
  // 1. Find all synergies that involve ANY of the input supplements
  const possibleSynergies = await prisma.synergy.findMany({
    include: {
      supplements: true
    },
    where: {
      supplements: {
        some: {
          supplementId: { in: supplementIds }
        }
      }
    }
  });

  // 2. Filter to keep only those where ALL associated supplements are in our list
  const activeSynergies = possibleSynergies.filter(syn => {
    const requiredIds = syn.supplements.map(s => s.supplementId);
    return requiredIds.every(id => supplementIds.includes(id)) && requiredIds.length > 1;
  });

  return activeSynergies.map(s => ({
    id: s.id,
    supplements: s.supplements.map(rel => rel.supplementId),
    benefit: s.benefit,
    mechanism: s.mechanism,
    optimalRatio: s.optimalRatio ? JSON.parse(s.optimalRatio) : undefined
  }));
}

/**
 * Seed initial database
 */
export async function seedDatabase(): Promise<void> {
  const count = await prisma.supplement.count();
  if (count > 0) {
    console.log("Database already seeded");
    return;
  }

  console.log("Seeding database...");

  // --- 1. Ingredients ---
  const ingredientsData = [
    { name: "Cholecalciferol", chemicalFormula: "C27H44O", mechanisms: ["Calcium absorption"] },
    { name: "Ascorbic Acid", chemicalFormula: "C6H8O6", mechanisms: ["Antioxidant", "Collagen synthesis"] },
    { name: "Magnesium Glycinate", chemicalFormula: "C4H8MgN2O4", mechanisms: ["Enzyme cofactor", "Muscle relaxation"] },
    { name: "Calcium Carbonate", chemicalFormula: "CaCO3", mechanisms: ["Bone structure"] },
    { name: "Ferrous Bisglycinate", chemicalFormula: "C4H8FeN2O4", mechanisms: ["Oxygen transport"] },
    { name: "Zinc Picolinate", chemicalFormula: "C12H8N2O4Zn", mechanisms: ["Immune function"] },
    { name: "EPA/DHA", chemicalFormula: "", mechanisms: ["Anti-inflammatory"] },
    { name: "Alpha-Tocopherol", chemicalFormula: "C29H50O2", mechanisms: ["Antioxidant"] }
  ];

  const ingredientMap = new Map();
  for (const ing of ingredientsData) {
    const created = await prisma.ingredient.create({
      data: {
        name: ing.name,
        chemicalFormula: ing.chemicalFormula,
        mechanisms: JSON.stringify(ing.mechanisms)
      }
    });
    ingredientMap.set(ing.name, created.id);
  }

  // --- 2. Supplements ---
  const supplementsData = [
    {
      name: "Vitamin D3",
      slug: "vitamin-d3",
      commonNames: ["Vit D", "Sunshine Vitamin"],
      category: SupplementCategory.VITAMIN,
      optimalTiming: TimingPreference.MORNING_WITH_FOOD,
      dosage: { min: 1000, max: 5000, unit: "IU" },
      ingredient: "Cholecalciferol"
    },
    {
      name: "Vitamin C",
      slug: "vitamin-c",
      commonNames: ["Ascorbic Acid"],
      category: SupplementCategory.VITAMIN,
      optimalTiming: TimingPreference.ANYTIME,
      dosage: { min: 500, max: 2000, unit: "mg" },
      ingredient: "Ascorbic Acid"
    },
    {
      name: "Magnesium",
      slug: "magnesium",
      commonNames: ["Magnesium Glycinate", "Mag"],
      category: SupplementCategory.MINERAL,
      optimalTiming: TimingPreference.BEFORE_BED,
      dosage: { min: 200, max: 400, unit: "mg" },
      ingredient: "Magnesium Glycinate"
    },
    {
      name: "Calcium",
      slug: "calcium",
      commonNames: ["Calcium Carbonate"],
      category: SupplementCategory.MINERAL,
      optimalTiming: TimingPreference.MORNING_WITH_FOOD,
      dosage: { min: 500, max: 1000, unit: "mg" },
      ingredient: "Calcium Carbonate"
    },
    {
      name: "Iron",
      slug: "iron",
      commonNames: ["Ferrous Sulfate", "Gentle Iron"],
      category: SupplementCategory.MINERAL,
      optimalTiming: TimingPreference.MORNING_EMPTY,
      dosage: { min: 18, max: 65, unit: "mg" },
      ingredient: "Ferrous Bisglycinate"
    },
    {
      name: "Zinc",
      slug: "zinc",
      commonNames: ["Zinc Picolinate"],
      category: SupplementCategory.MINERAL,
      optimalTiming: TimingPreference.MORNING_WITH_FOOD,
      dosage: { min: 15, max: 30, unit: "mg" },
      ingredient: "Zinc Picolinate"
    },
    {
      name: "Omega-3",
      slug: "omega-3",
      commonNames: ["Fish Oil", "EPA/DHA"],
      category: SupplementCategory.OTHER,
      optimalTiming: TimingPreference.MORNING_WITH_FOOD,
      dosage: { min: 1000, max: 3000, unit: "mg" },
      ingredient: "EPA/DHA"
    },
    {
      name: "Vitamin E",
      slug: "vitamin-e",
      commonNames: ["Tocopherol"],
      category: SupplementCategory.VITAMIN,
      optimalTiming: TimingPreference.MORNING_WITH_FOOD,
      dosage: { min: 15, max: 30, unit: "mg" },
      ingredient: "Alpha-Tocopherol"
    }
  ];

  const supplementMap = new Map();
  for (const supp of supplementsData) {
    const created = await prisma.supplement.create({
      data: {
        name: supp.name,
        slug: supp.slug,
        commonNames: JSON.stringify(supp.commonNames),
        category: supp.category,
        optimalTiming: supp.optimalTiming,
        dosage: JSON.stringify(supp.dosage),
        ingredients: {
          create: {
            ingredientId: ingredientMap.get(supp.ingredient)
          }
        }
      }
    });
    supplementMap.set(supp.name, created.id);
  }

  // --- 3. Conflicts ---
  const conflictsData = [
    {
      pair: ["Calcium", "Iron"],
      type: ConflictType.ABSORPTION_COMPETITION,
      severity: ConflictSeverity.HIGH,
      explanation: "Calcium significantly inhibits the absorption of non-heme iron.",
      mechanism: "Competitive binding at DMT1 transporter in the duodenum.",
      timeGap: 120 // 2 hours
    },
    {
      pair: ["Zinc", "Copper"], // Copper not in list but good ex. Zinc -> Calcium/Iron/Magnesium interactions exist too
      // Let's use Zinc + Calcium
      pairAlt: ["Zinc", "Calcium"],
      type: ConflictType.ABSORPTION_COMPETITION,
      severity: ConflictSeverity.MEDIUM,
      explanation: "High doses of calcium can inhibit zinc absorption.",
      mechanism: "Competition for transport channels.",
      timeGap: 120
    },
    {
      pair: ["Magnesium", "Calcium"],
      type: ConflictType.ABSORPTION_COMPETITION,
      severity: ConflictSeverity.MEDIUM,
      explanation: "Large doses of calcium compete with magnesium for absorption.",
      mechanism: "Shared transport pathways.",
      timeGap: 120
    },
    {
      pair: ["Omega-3", "Vitamin E"],
      type: ConflictType.ADVERSE_INTERACTION,
      severity: ConflictSeverity.LOW,
      explanation: "Both have blood-thinning properties. High doses combined may increase bleeding risk.",
      mechanism: "Additive antiplatelet effects.",
      timeGap: 0 // Not a timing issue, but a dosage/combination issue
    }
  ];

  for (const conf of conflictsData) {
    // For the zinc/copper case, if I used alt
    const pair = conf.pairAlt || conf.pair;
    const idA = supplementMap.get(pair[0]);
    const idB = supplementMap.get(pair[1]);
    
    if (idA && idB) {
      await prisma.conflict.create({
        data: {
          supplementAId: idA,
          supplementBId: idB,
          conflictType: conf.type,
          severity: conf.severity,
          explanation: conf.explanation,
          mechanismDescription: conf.mechanism,
          timeGapMinutes: conf.timeGap
        }
      });
    }
  }

  // --- 4. Synergies ---
  const synergiesData = [
    {
      supplements: ["Vitamin D3", "Calcium"],
      benefit: "Enhanced Calcium Absorption",
      mechanism: "Vitamin D promotes intestinal calcium absorption via calbindin synthesis."
    },
    {
      supplements: ["Iron", "Vitamin C"],
      benefit: "Enhanced Iron Absorption",
      mechanism: "Vitamin C reduces ferric iron (Fe3+) to ferrous iron (Fe2+), which is better absorbed."
    },
    {
      supplements: ["Magnesium", "Vitamin D3"],
      benefit: "Vitamin D Activation",
      mechanism: "Magnesium is a cofactor for the enzymes that convert Vitamin D into its active form."
    }
  ];

  for (const syn of synergiesData) {
    const suppIds = syn.supplements.map(name => supplementMap.get(name)).filter(Boolean);
    if (suppIds.length === syn.supplements.length) {
      const synergy = await prisma.synergy.create({
        data: {
          benefit: syn.benefit,
          mechanism: syn.mechanism
        }
      });
      
      for (const suppId of suppIds) {
        await prisma.synergySupplement.create({
          data: {
            synergyId: synergy.id,
            supplementId: suppId
          }
        });
      }
    }
  }

  console.log("Seeding completed!");
}
