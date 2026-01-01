import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectConflicts, findSynergies } from "@/lib/supplement-db";
import { buildConflictGraph } from "@/lib/conflict-engine";
import { generateSchedule } from "@/lib/schedule-optimizer";
import type { Supplement } from "@/types/supplement";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supplementIds, constraints } = body;

    if (!supplementIds || !Array.isArray(supplementIds) || supplementIds.length === 0) {
      return NextResponse.json(
        { error: "supplementIds array is required" },
        { status: 400 }
      );
    }

    // 1. Fetch supplement data from DB
    // We need full Supplement objects for the optimizer
    const supplementsRaw = await prisma.supplement.findMany({
      where: {
        id: { in: supplementIds }
      },
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    });

    // Map to our Type
    // Note: duplicated mapping logic, ideal to move to helper in supplement-db
    const supplements: Supplement[] = supplementsRaw.map((item: any) => ({
      id: item.id,
      name: item.name,
      commonNames: JSON.parse(item.commonNames || "[]"),
      category: item.category as any,
      activeIngredients: item.ingredients.map((rel: any) => ({
        name: rel.ingredient.name,
        chemicalFormula: rel.ingredient.chemicalFormula || undefined,
        mechanisms: JSON.parse(rel.ingredient.mechanisms || "[]")
      })),
      optimalTiming: item.optimalTiming as any,
      dosage: JSON.parse(item.dosage || "{}"),
      bioavailability: item.bioavailability ? JSON.parse(item.bioavailability) : { emptyStomach: 0.5, withFood: 0.5 }
    }));

    // 2. Detect conflicts
    const conflicts = await detectConflicts(supplementIds);

    // 3. Find synergies
    const synergies = await findSynergies(supplementIds);

    // 4. Generate optimal schedule
    // Default constraints if not provided
    const scheduleConstraints = constraints || {
      mealTimes: {
        breakfast: "08:00",
        lunch: "12:00",
        dinner: "19:00"
      },
      sleepTime: "23:00",
      preferences: {}
    };

    const schedule = await generateSchedule(supplements, conflicts, synergies, scheduleConstraints);

    // 5. Build graph data for visualization
    const graphData = await buildConflictGraph(supplements, conflicts, synergies);

    return NextResponse.json({
      success: true,
      data: {
        schedule,
        conflicts,
        synergies,
        graphData
      }
    });

  } catch (error) {
    console.error("Schedule API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate schedule" },
      { status: 500 }
    );
  }
}
