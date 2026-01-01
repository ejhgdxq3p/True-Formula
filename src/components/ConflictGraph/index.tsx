/**
 * Conflict Graph Component (冲突力场图)
 *
 * Features:
 * - Nodes: supplement pills/particles
 * - Edges: lines showing conflicts (red) and synergies (green)
 * - Click on edge: show pharmacological explanation
 * - Interactive: drag nodes, zoom, pan
 */

"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { ConflictGraph as GraphData } from "@/lib/conflict-engine";

interface ConflictGraphProps {
  data: GraphData | null;
}

export default function ConflictGraph({ data }: ConflictGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEdge, setSelectedEdge] = useState<any>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth || 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height);

    // Simulation
    const nodes = data.nodes.map(d => ({ ...d }));
    const links = data.edges.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Arrow marker for conflicts
    svg.append("defs").selectAll("marker")
      .data(["conflict", "synergy"])
      .enter().append("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30) // Position at edge of node
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => d === "conflict" ? "#ef4444" : "#22c55e")
      .attr("d", "M0,-5L10,0L0,5");

    // Edges
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d.type === "conflict" ? "#ef4444" : "#22c55e")
      .attr("stroke-width", d => Math.sqrt(d.value) * 2)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", d => `url(#arrow-${d.type})`)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedEdge(d);
        event.stopPropagation();
      });

    // Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any);

    // Node circles
    node.append("circle")
      .attr("r", 25)
      .attr("fill", d => getCategoryColor(d.category))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", "shadow-sm filter drop-shadow-md cursor-move");

    // Node labels
    node.append("text")
      .text(d => d.name)
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)");

    // Update positions
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Background click to deselect
    svg.on("click", () => setSelectedEdge(null));

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  const drag = (simulation: any) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  function getCategoryColor(category: string) {
    switch (category) {
      case "VITAMIN": return "#3b82f6"; // blue
      case "MINERAL": return "#f59e0b"; // amber
      case "AMINO_ACID": return "#8b5cf6"; // violet
      case "HERBAL": return "#10b981"; // emerald
      default: return "#6b7280"; // gray
    }
  }

  if (!data || data.nodes.length === 0) {
    return (
      <div className="w-full h-[600px] border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
        No conflict data to display
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] border rounded-lg bg-slate-50 overflow-hidden" ref={containerRef}>
      <svg ref={svgRef} className="w-full h-full block" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg text-xs shadow-sm border border-gray-100">
        <div className="font-bold mb-2 text-gray-700">Categories</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Vitamin</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Mineral</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-violet-500"></div>Amino Acid</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Herbal</div>
        </div>
      </div>

      {/* Tooltip / Modal */}
      {selectedEdge && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 animate-in slide-in-from-bottom-2">
          <h4 className={`font-bold flex items-center gap-2 ${selectedEdge.type === "conflict" ? "text-red-600" : "text-green-600"}`}>
            {selectedEdge.type === "conflict" ? "⚠️ Interaction Detected" : "✨ Synergy Detected"}
          </h4>
          <p className="text-sm text-gray-700 mt-1">
            <strong>Mechanism:</strong> {selectedEdge.mechanism}
          </p>
          {selectedEdge.severity && (
            <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Severity: {selectedEdge.severity}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
