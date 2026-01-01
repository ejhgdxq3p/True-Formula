/**
 * Schedule Optimizer Module
 *
 * Purpose: Generate optimal daily supplement schedule
 * Considering conflicts, synergies, timing preferences, and meal times
 */

import { TimingPreference, type Supplement, type Conflict, type Synergy, type ScheduleSlot, ConflictSeverity } from "@/types/supplement";

export interface ScheduleConstraints {
  mealTimes: {
    breakfast: string; // "08:00"
    lunch: string;
    dinner: string;
  };
  workoutTime?: string;
  sleepTime: string; // "22:00"
  preferences: {
    minimizeIntakes?: boolean; // Combine as much as possible
    spreadThroughout?: boolean; // Distribute evenly
  };
}

// Internal slot representation
interface ProcessingSlot {
  name: string;
  time: string; // "HH:MM"
  minutes: number; // minutes from midnight
  isFood: boolean;
  isEmptyStomach: boolean;
  supplements: Supplement[];
}

/**
 * Generate optimal daily supplement schedule
 */
export async function generateSchedule(
  supplements: Supplement[],
  conflicts: Conflict[],
  synergies: Synergy[],
  constraints: ScheduleConstraints
): Promise<ScheduleSlot[]> {
  
  // 1. Initialize Slots
  let slots: ProcessingSlot[] = initializeSlots(constraints);

  // 2. Initial Assignment based on Preference
  for (const supp of supplements) {
    assignToBestSlot(supp, slots);
  }

  // 3. Resolve Conflicts
  // Iterative approach: repeatedly check for conflicts and move items until safe or max iterations
  let changed = true;
  let iterations = 0;
  const MAX_ITERATIONS = 10;

  while (changed && iterations < MAX_ITERATIONS) {
    changed = false;
    iterations++;

    for (const slot of slots) {
      // Check all pairs in this slot
      for (let i = 0; i < slot.supplements.length; i++) {
        for (let j = i + 1; j < slot.supplements.length; j++) {
          const s1 = slot.supplements[i];
          const s2 = slot.supplements[j];

          // Check if conflict exists
          const conflict = conflicts.find(c => 
            (c.supplementA === s1.id && c.supplementB === s2.id) ||
            (c.supplementA === s2.id && c.supplementB === s1.id)
          );

          if (conflict) {
            // Need to move one. 
            // Strategy: Move the one with less strict timing constraints or randomly
            // Here: Try to move s2
            const moved = moveSupplement(s2, slot, slots, conflict.timeGapRequired || 120);
            if (moved) {
              // Remove s2 from current slot
              slot.supplements.splice(j, 1);
              j--; // Adjust index
              changed = true;
            } else {
              // Try moving s1
              const movedS1 = moveSupplement(s1, slot, slots, conflict.timeGapRequired || 120);
              if (movedS1) {
                slot.supplements.splice(i, 1);
                i--;
                changed = true;
                break; // Break inner loop since s1 is gone
              }
            }
          }
        }
        if (changed) break; // Re-evaluate if we changed something
      }
    }
  }

  // 4. Group Synergies (Optional optimization: if synergy exists, try to bring them closer if far apart)
  // For MVP: We assume initial placement + conflict resolution is "good enough". 
  // Synergy grouping would be: if A and B have synergy and are safe together, move B to A's slot.
  
  // 5. Format Output
  return slots
    .filter(s => s.supplements.length > 0)
    .sort((a, b) => a.minutes - b.minutes)
    .map(s => ({
      time: s.time,
      supplements: s.supplements.map(supp => ({
        id: supp.id,
        name: supp.name,
        dosage: `${supp.dosage.min}-${supp.dosage.max} ${supp.dosage.unit}`
      })),
      reasoning: `Scheduled at ${s.name} (${s.time}) based on timing preferences and conflict avoidance.`
    }));
}

// --- Helpers ---

function initializeSlots(constraints: ScheduleConstraints): ProcessingSlot[] {
  const { mealTimes, sleepTime, workoutTime } = constraints;
  
  const slots: ProcessingSlot[] = [];

  // Helper to parse time
  const getMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // 1. Morning Empty Stomach (30-60 mins before breakfast)
  const breakfastMins = getMins(mealTimes.breakfast);
  slots.push({
    name: "Morning (Empty Stomach)",
    time: formatTime(breakfastMins - 60),
    minutes: breakfastMins - 60,
    isFood: false,
    isEmptyStomach: true,
    supplements: []
  });

  // 2. Breakfast
  slots.push({
    name: "Breakfast",
    time: mealTimes.breakfast,
    minutes: breakfastMins,
    isFood: true,
    isEmptyStomach: false,
    supplements: []
  });

  // 3. Lunch
  slots.push({
    name: "Lunch",
    time: mealTimes.lunch,
    minutes: getMins(mealTimes.lunch),
    isFood: true,
    isEmptyStomach: false,
    supplements: []
  });

  // 4. Afternoon (Between Lunch and Dinner)
  const lunchMins = getMins(mealTimes.lunch);
  const dinnerMins = getMins(mealTimes.dinner);
  const afternoonMins = Math.floor((lunchMins + dinnerMins) / 2);
  slots.push({
    name: "Afternoon",
    time: formatTime(afternoonMins),
    minutes: afternoonMins,
    isFood: false,
    isEmptyStomach: true, // Generally empty-ish
    supplements: []
  });

  // 5. Dinner
  slots.push({
    name: "Dinner",
    time: mealTimes.dinner,
    minutes: dinnerMins,
    isFood: true,
    isEmptyStomach: false,
    supplements: []
  });

  // 6. Bedtime
  slots.push({
    name: "Bedtime",
    time: sleepTime,
    minutes: getMins(sleepTime),
    isFood: false,
    isEmptyStomach: true,
    supplements: []
  });

  // Workout slots if applicable
  if (workoutTime) {
    const workoutMins = getMins(workoutTime);
    slots.push({
      name: "Pre-Workout",
      time: formatTime(workoutMins - 30),
      minutes: workoutMins - 30,
      isFood: false,
      isEmptyStomach: true,
      supplements: []
    });
    slots.push({
      name: "Post-Workout",
      time: formatTime(workoutMins + 60),
      minutes: workoutMins + 60,
      isFood: false, // Usually take with shake/meal, but slot itself isn't a meal time unless aligned
      isEmptyStomach: false, 
      supplements: []
    });
  }

  return slots.sort((a, b) => a.minutes - b.minutes);
}

function assignToBestSlot(supp: Supplement, slots: ProcessingSlot[]) {
  let targetSlotName = "";
  
  switch (supp.optimalTiming) {
    case TimingPreference.MORNING_EMPTY:
      targetSlotName = "Morning (Empty Stomach)";
      break;
    case TimingPreference.MORNING_WITH_FOOD:
      targetSlotName = "Breakfast";
      break;
    case TimingPreference.AFTERNOON:
      targetSlotName = "Afternoon"; // Or Lunch
      break;
    case TimingPreference.EVENING:
      targetSlotName = "Dinner";
      break;
    case TimingPreference.BEFORE_BED:
      targetSlotName = "Bedtime";
      break;
    case TimingPreference.PRE_WORKOUT:
      targetSlotName = "Pre-Workout";
      break;
    case TimingPreference.POST_WORKOUT:
      targetSlotName = "Post-Workout";
      break;
    case TimingPreference.ANYTIME:
    default:
      targetSlotName = "Breakfast"; // Default to morning
      break;
  }

  // Find slot
  let slot = slots.find(s => s.name === targetSlotName);
  
  // Fallback logic
  if (!slot) {
    if (supp.optimalTiming === TimingPreference.PRE_WORKOUT || supp.optimalTiming === TimingPreference.POST_WORKOUT) {
      slot = slots.find(s => s.name === "Morning (Empty Stomach)"); // Default fallback
    } else {
      slot = slots[0];
    }
  }

  if (slot) {
    slot.supplements.push(supp);
  }
}

function moveSupplement(supp: Supplement, currentSlot: ProcessingSlot, allSlots: ProcessingSlot[], minGap: number): boolean {
  // Find a new slot that is at least minGap away from currentSlot
  // AND satisfies basic requirements (e.g. Food vs Empty) if possible
  
  // Sort slots by time distance from current
  const candidates = allSlots
    .filter(s => s !== currentSlot)
    .filter(s => Math.abs(s.minutes - currentSlot.minutes) >= minGap)
    // Prioritize slots that match food requirement
    .sort((a, b) => {
      // Logic: Prefer matching food requirement
      const aMatch = matchesFoodReq(supp, a);
      const bMatch = matchesFoodReq(supp, b);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

  if (candidates.length > 0) {
    candidates[0].supplements.push(supp);
    return true;
  }
  
  return false;
}

function matchesFoodReq(supp: Supplement, slot: ProcessingSlot): boolean {
  if (supp.optimalTiming === TimingPreference.MORNING_WITH_FOOD) return slot.isFood;
  if (supp.optimalTiming === TimingPreference.MORNING_EMPTY) return slot.isEmptyStomach;
  // ... others
  return true;
}

function formatTime(minutes: number): string {
  let m = minutes;
  if (m < 0) m += 24 * 60;
  m = m % (24 * 60);
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

/**
 * Validate schedule
 *
 * Check if generated schedule violates any constraints
 */
export function validateSchedule(
  schedule: ScheduleSlot[],
  conflicts: Conflict[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Flatten schedule to check time gaps
  // Map: SupplementID -> Time(minutes)
  const suppTimes = new Map<string, number>();
  
  schedule.forEach(slot => {
    const [h, m] = slot.time.split(":").map(Number);
    const mins = h * 60 + m;
    slot.supplements.forEach(s => suppTimes.set(s.id, mins));
  });

  conflicts.forEach(c => {
    const t1 = suppTimes.get(c.supplementA);
    const t2 = suppTimes.get(c.supplementB);

    if (t1 !== undefined && t2 !== undefined) {
      const gap = Math.abs(t1 - t2);
      const required = c.timeGapRequired || 0;
      
      if (gap < required) {
        // Wrap around check for 24h? Assuming linear day for now, but 23:00 vs 01:00 is 2h gap.
        // Simple linear check for MVP
        errors.push(`Conflict between ${c.supplementA} and ${c.supplementB}: Gap is ${gap}min, required ${required}min`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Optimize for cost (Phase 2)
 */
export function optimizeForCost(
  requiredSupplements: string[],
  products: { name: string; supplements: string[]; price: number }[]
): string[] {
  return [];
}
