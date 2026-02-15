
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NetworkData, NetworkNode, NetworkLink } from '../types';
import { Activity, Radio } from 'lucide-react';

interface NetworkMapProps {
  data: NetworkData;
}

const NetworkMap: React.FC<NetworkMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Glow Effect Filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const simulation = d3.forceSimulation<NetworkNode>(JSON.parse(JSON.stringify(data.nodes)))
      .force("link", d3.forceLink<NetworkNode, NetworkLink>(JSON.parse(JSON.stringify(data.links))).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    const link = svg.append("g")
      .attr("stroke", "#1e1b4b")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(simulation.force<d3.ForceLink<NetworkNode, NetworkLink>>("link")!.links())
      .join("line")
      .attr("stroke-width", 1.5);

    const nodeContainer = svg.append("g")
      .selectAll("g")
      .data(simulation.nodes())
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
      )
      .on("click", (event, d) => setSelectedNode(d));

    nodeContainer.append("circle")
      .attr("r", 10)
      .attr("fill", d => {
        if (d.status === 'compromised') return '#ef4444';
        if (d.status === 'offline') return '#334155';
        return '#6366f1';
      })
      .style("filter", "url(#glow)");

    nodeContainer.append("text")
      .text(d => d.id)
      .attr("x", 16)
      .attr("y", 4)
      .attr("font-family", "Space Grotesk, monospace")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "#6366f1")
      .attr("opacity", 0.7)
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      nodeContainer.attr("transform", d => `translate(${d.x},${d.y})`);
    });

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

    const resizeObserver = new ResizeObserver(() => {
        if (!containerRef.current) return;
        const newW = containerRef.current.clientWidth;
        const newH = containerRef.current.clientHeight;
        svg.attr("viewBox", `0 0 ${newW} ${newH}`);
        simulation.force("center", d3.forceCenter(newW / 2, newH / 2));
        simulation.alpha(0.3).restart();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      simulation.stop();
      resizeObserver.disconnect();
    };
  }, [data]);

  return (
    <div className="relative flex flex-col h-full bg-black border border-white/5 rounded-xl overflow-hidden shadow-2xl shadow-crt">
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center px-5 py-3 bg-zinc-900/80 border-b border-white/5 pointer-events-none">
            <Radio className="w-4 h-4 text-indigo-500 mr-3 animate-ping" />
            <span className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">Active Recon // Topology_Vault</span>
        </div>
        
        <div ref={containerRef} className="flex-1 w-full h-full min-h-[400px] bg-slate-950/20">
            <svg ref={svgRef} className="w-full h-full" />
        </div>

        {selectedNode && (
            <div className="absolute bottom-6 right-6 p-5 bg-black/90 border border-indigo-500/30 rounded-2xl text-[11px] font-mono backdrop-blur-xl w-60 shadow-3xl animate-in slide-up">
                <div className="text-indigo-400 font-black mb-3 border-b border-indigo-500/20 pb-2 flex justify-between">
                  <span>{selectedNode.id}</span>
                  <span className="opacity-40">TARGET</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">IP_ADDR:</span> 
                    <span className="text-slate-200">{selectedNode.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">STATUS:</span> 
                    <span className={selectedNode.status === 'compromised' ? 'text-red-500 font-bold' : selectedNode.status === 'active' ? 'text-green-500' : 'text-slate-500'}>
                        {selectedNode.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">LATENCY:</span> 
                    <span className="text-indigo-500">12ms</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="mt-4 w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 font-black rounded-lg transition-all"
                >
                  DISMISS
                </button>
            </div>
        )}
    </div>
  );
};

export default NetworkMap;
