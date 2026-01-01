/**
 * Conflict Engine Module
 *
 * Purpose: Analyze conflicts and synergies between supplements
 * Generate the "force field graph" data for visualization
 */

import { ConflictSeverity, type Conflict, type Synergy, type Supplement } from "@/types/supplement";

export interface ConflictGraph {
  nodes: {
    id: string;
    name: string;
    category: string;
    group: number; // For D3 coloring
  }[];
  edges: {
    source: string; // supplement ID
    target: string;
    type: "conflict" | "synergy";
    severity?: string; // for conflicts
    benefit?: string; // for synergies
    mechanism: string;
    value: number; // For D3 link strength
  }[];
}

/**
 * Build graph data structure for D3.js visualization
 *
 * This will power the "粒子连线图" (particle force graph)
 */
export async function buildConflictGraph(
  supplements: Supplement[],
  conflicts: Conflict[],
  synergies: Synergy[]
): Promise<ConflictGraph> {
  // 1. Create Nodes
  const nodes = supplements.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    group: getCategoryGroup(s.category)
  }));

  const edges: ConflictGraph["edges"] = [];

  // 2. Create Conflict Edges
  conflicts.forEach(c => {
    // Only add edge if both nodes exist in the current graph
    const sourceId = c.productAId || c.supplementA;
    const targetId = c.productBId || c.supplementB;
    
    if (!sourceId || !targetId) return;

    const sourceExists = supplements.some(s => s.id === sourceId);
    const targetExists = supplements.some(s => s.id === targetId);

    if (sourceExists && targetExists) {
      edges.push({
        source: sourceId,
        target: targetId,
        type: "conflict",
        severity: c.severity,
        mechanism: c.explanation || c.mechanism || c.pharmacologicalMechanism || "Unknown mechanism",
        value: getConflictWeight(c.severity)
      });
    }
  });

  // 3. Create Synergy Edges
  synergies.forEach(s => {
    // Synergies can involve multiple supplements, but D3 force graph works best with pairwise links.
    // We will create a complete graph (clique) for the supplements in a synergy group.
    
    // Filter supplements that are actually in the current list
    const presentSuppIds = s.supplements.filter(id => supplements.some(sup => sup.id === id));

    for (let i = 0; i < presentSuppIds.length; i++) {
      for (let j = i + 1; j < presentSuppIds.length; j++) {
        edges.push({
          source: presentSuppIds[i],
          target: presentSuppIds[j],
          type: "synergy",
          benefit: s.benefit,
          mechanism: s.mechanism,
          value: 2 // Standard weight for synergy
        });
      }
    }
  });

  return { nodes, edges };
}

/**
 * Check if a combination is safe
 *
 * Returns true if no CRITICAL conflicts exist
 */
export function isCombinationSafe(
  supplementIds: string[],
  conflicts: Conflict[]
): boolean {
  // Filter conflicts to only those relevant to the input list
  const activeConflicts = conflicts.filter(c => {
    const sourceId = c.productAId || c.supplementA;
    const targetId = c.productBId || c.supplementB;
    return sourceId && targetId && supplementIds.includes(sourceId) && supplementIds.includes(targetId);
  });

  // Check for any CRITICAL severity
  const hasCritical = activeConflicts.some(c => c.severity === ConflictSeverity.CRITICAL);
  
  return !hasCritical;
}

/**
 * Suggest safe alternatives
 *
 * If a conflict exists, suggest which supplement to swap out
 */
export function suggestAlternatives(
  conflictingSupplement: string,
  existingSupplements: string[]
): string[] {
  // For MVP: Not implemented. 
  // Future: Query DB for supplements with same 'activeIngredients' or 'mechanisms' but different conflicts.
  return [];
}

// --- Helpers ---

function getCategoryGroup(category: string): number {
  switch (category) {
    case "VITAMIN": return 1;
    case "MINERAL": return 2;
    case "AMINO_ACID": return 3;
    case "HERBAL": return 4;
    case "PROBIOTIC": return 5;
    case "ENZYME": return 6;
    default: return 0;
  }
}

function getConflictWeight(severity: ConflictSeverity): number {
  switch (severity) {
    case ConflictSeverity.CRITICAL: return 5;
    case ConflictSeverity.HIGH: return 4;
    case ConflictSeverity.MEDIUM: return 3;
    case ConflictSeverity.LOW: return 1;
    default: return 1;
  }
}
