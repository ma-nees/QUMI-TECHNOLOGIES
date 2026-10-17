import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  ORG_NODES,
  ORG_CONNECTORS,
  OrgNodeData,
  CANVAS,
  LEVEL_STYLES,
  CONNECTOR_STYLES,
  getOrgStats,
  getRelatedConnectors,
  getRelatedNodeIds,
} from "@/data/organization-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Crown,
  Cpu,
  Workflow,
  Settings2,
  TrendingUp,
  ClipboardList,
  Palette,
  Code2,
  ShieldCheck,
  Cloud,
  BrainCircuit,
  Building2,
  Users as LucideUsers,
  Landmark,
  Headset,
  Handshake,
  Megaphone,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  X,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Compass,
  GitFork,
  LayoutGrid,
  MoveHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Zap,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Crown,
  Cpu,
  Workflow,
  Settings2,
  TrendingUp,
  ClipboardList,
  Palette,
  Code2,
  ShieldCheck,
  Cloud,
  BrainCircuit,
  Building2,
  Users: LucideUsers,
  Landmark,
  Headset,
  Handshake,
  Megaphone,
};

function renderNodeIcon(iconName: string, size = 14, className = "") {
  const IconComponent = ICON_MAP[iconName] || Briefcase;
  return <IconComponent size={size} className={className} />;
}

// Quick Jump anchor definitions for mobile & desktop canvas navigation
const QUICK_JUMP_TARGETS = [
  { id: "director", label: "CEO / Executive", x: 490, icon: Crown, color: "#0047AB" },
  { id: "cte", label: "CTO / Tech Teams", x: 250, icon: Cpu, color: "#007FFF" },
  { id: "pm", label: "Agile Delivery Hub", x: 490, icon: Workflow, color: "#F28C28" },
  { id: "secretary", label: "COO / Operations", x: 670, icon: Settings2, color: "#475569" },
  { id: "growth", label: "CGO / Growth", x: 890, icon: TrendingUp, color: "#D946EF" },
];

export function OrgJourneyMap() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  // View Modes: 'tree' (Mobile-First Hierarchy Flow), 'canvas' (Panoramic SVG Diagram), 'directory' (Searchable Grid)
  const [viewMode, setViewMode] = useState<"tree" | "canvas" | "directory">("tree");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "leadership" | "tech" | "ops" | "growth">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [canvasZoom, setCanvasZoom] = useState<number>(1.0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set default view based on screen size on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // On wide screens (>= 1024px), Canvas Map is visually panoramic and engaging
      // On smaller/mobile screens (< 1024px), Hierarchy Tree is instantly clear and touch-friendly
      if (window.innerWidth >= 1024) {
        setViewMode("canvas");
      } else {
        setViewMode("tree");
      }
    }
  }, []);

  // Center scroll horizontally on CEO/PM for mobile view when Canvas Map is active
  const centerCanvasOnMountOrToggle = useCallback(() => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const scrollCenter = (el.scrollWidth - el.clientWidth) / 2;
      if (scrollCenter > 0) {
        el.scrollTo({ left: scrollCenter, behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    if (viewMode === "canvas") {
      const timer = setTimeout(centerCanvasOnMountOrToggle, 60);
      return () => clearTimeout(timer);
    }
  }, [viewMode, centerCanvasOnMountOrToggle, canvasZoom]);

  // Jump smoothly to a specific department / executive in Canvas mode
  const handleQuickJump = useCallback((xCoord: number, nodeId: string) => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const targetRatio = xCoord / CANVAS.width;
      const targetScrollLeft = targetRatio * el.scrollWidth - el.clientWidth / 2;
      el.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: "smooth" });
      setSelectedNodeId(nodeId);
    }
  }, []);

  // Active node for details dialog
  const activeNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return ORG_NODES.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Current focal node (selected or hovered) for SVG route highlighting
  const focalNodeId = hoveredNodeId || selectedNodeId;

  // Active connectors connected to focal node
  const activeConnectorIds = useMemo(() => {
    if (!focalNodeId) return new Set<string>();
    const related = getRelatedConnectors(focalNodeId);
    return new Set(related.map((c) => c.id));
  }, [focalNodeId]);

  // Nodes related to focal node
  const activeNeighborNodeIds = useMemo(() => {
    if (!focalNodeId) return new Set<string>();
    const neighbors = getRelatedNodeIds(focalNodeId);
    return new Set([focalNodeId, ...neighbors]);
  }, [focalNodeId]);

  const stats = useMemo(() => getOrgStats(), []);

  // Filtered nodes for Directory view with live search
  const filteredDirectoryNodes = useMemo(() => {
    let list = ORG_NODES;

    // Filter by Category
    if (categoryFilter === "leadership") {
      list = list.filter((n) => n.level <= 2);
    } else if (categoryFilter === "tech") {
      list = list.filter(
        (n) => n.id === "cte" || ["projects", "design", "engineering", "quality", "infrastructure", "data"].includes(n.id)
      );
    } else if (categoryFilter === "ops") {
      list = list.filter(
        (n) => n.id === "secretary" || ["admin", "hr", "finance", "support"].includes(n.id)
      );
    } else if (categoryFilter === "growth") {
      list = list.filter((n) => n.id === "growth" || ["sales", "marketing"].includes(n.id));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.shortTitle.toLowerCase().includes(q) ||
          n.tagline.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          (n.tools && n.tools.some((t) => t.toLowerCase().includes(q))) ||
          (n.exampleRoles && n.exampleRoles.some((r) => r.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [categoryFilter, searchQuery]);

  const handleNodeClick = useCallback((id: string) => {
    setSelectedNodeId(id);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedNodeId(id);
      }
    },
    []
  );

  // Grouped nodes for the Mobile Hierarchy Tree View
  const treeModel = useMemo(() => {
    const ceo = ORG_NODES.find((n) => n.id === "director")!;
    const cto = ORG_NODES.find((n) => n.id === "cte")!;
    const pm = ORG_NODES.find((n) => n.id === "pm")!;
    const coo = ORG_NODES.find((n) => n.id === "secretary")!;
    const cgo = ORG_NODES.find((n) => n.id === "growth")!;

    const ctoTeams = (cto.oversees || [])
      .map((id) => ORG_NODES.find((n) => n.id === id))
      .filter(Boolean) as OrgNodeData[];

    const cooTeams = (coo.oversees || [])
      .map((id) => ORG_NODES.find((n) => n.id === id))
      .filter(Boolean) as OrgNodeData[];

    const cgoTeams = (cgo.oversees || [])
      .map((id) => ORG_NODES.find((n) => n.id === id))
      .filter(Boolean) as OrgNodeData[];

    return { ceo, cto, pm, coo, cgo, ctoTeams, cooTeams, cgoTeams };
  }, []);

  return (
    <section
      id="organization-journey"
      aria-labelledby="org-journey-title"
      className="container-site py-4 sm:py-6 md:py-8"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
          <Layers size={13} />
          <span>Organizational Architecture</span>
        </div>
        <h2
          id="org-journey-title"
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground"
        >
          Company Organization & Delivery Map
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed px-2">
          Interactive map of our executive governance, cross-functional agile delivery orchestration, and specialized engineering departments.
        </p>

        {/* Live Structure Stats Strip */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/80 bg-surface/80 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#0047AB]" />
            <span className="text-foreground font-bold">{stats.leadershipRoles}</span>
            <span className="text-muted-foreground">Executive Leaders</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/80 bg-surface/80 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            <span className="text-foreground font-bold">{stats.teams}</span>
            <span className="text-muted-foreground">Departments</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/80 bg-surface/80 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#F28C28]" />
            <span className="text-foreground font-bold">{stats.illustrativePositions}+</span>
            <span className="text-muted-foreground">Positions</span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-md shadow-sm overflow-hidden text-foreground p-3 sm:p-5 md:p-6">
        {/* Subtle Texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-surface pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.22] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#D6CEC0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Controls Bar: View Mode Switcher, Legend, and Quick-Jump Controls */}
        <div className="relative z-20 space-y-2.5 pb-2.5 mb-2.5 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            {/* View Mode Segmented Controls */}
            <div className="flex items-center rounded-xl border border-border/80 bg-background/80 p-1 shadow-2xs w-full sm:w-auto">
              {/* Option 1: Mobile-First Hierarchy Flow */}
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={cn(
                  "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                  viewMode === "tree"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Switch to Mobile-First Hierarchy Tree"
              >
                <GitBranch size={13} />
                <span>Hierarchy Flow</span>
              </button>

              {/* Option 2: Full Panoramic Canvas Map */}
              <button
                type="button"
                onClick={() => setViewMode("canvas")}
                className={cn(
                  "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                  viewMode === "canvas"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Switch to Interactive Visual Tree Map"
              >
                <GitFork size={13} />
                <span>Canvas Map</span>
              </button>

              {/* Option 3: Role Directory */}
              <button
                type="button"
                onClick={() => setViewMode("directory")}
                className={cn(
                  "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                  viewMode === "directory"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Switch to Directory Grid View"
              >
                <LayoutGrid size={13} />
                <span>Directory</span>
              </button>
            </div>

            {/* Right Side: Legend & Selection Reset */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 text-xs">
              <div className="flex items-center gap-2.5 sm:gap-3.5 text-[11px] sm:text-xs text-muted-foreground">
                {/* Reporting Line */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-0.5 bg-[#94A3B8] rounded-full inline-block" />
                  <span>Reporting Line</span>
                </div>

                {/* Agile Delivery Collaboration Line */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-0.5 border-b-2 border-dashed border-[#F28C28] inline-block"
                    style={{ strokeDasharray: "4 2" }}
                  />
                  <span className="text-[#F28C28] font-medium">Agile Delivery</span>
                </div>
              </div>

              {selectedNodeId && (
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-background/90 hover:bg-background border border-border text-foreground transition-colors cursor-pointer ml-1"
                >
                  <X size={11} />
                  <span>Clear Highlight</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick-Jump Anchors & Zoom Controls (Shown in Canvas Mode) */}
          {viewMode === "canvas" && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 text-xs">
              {/* Quick Jump Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                <span className="text-[11px] text-muted-foreground shrink-0 font-medium flex items-center gap-1">
                  <Compass size={12} className="text-primary" />
                  <span>Jump to:</span>
                </span>
                {QUICK_JUMP_TARGETS.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => handleQuickJump(target.x, target.id)}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1 shrink-0",
                      selectedNodeId === target.id
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-2xs"
                        : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                    )}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: target.color }}
                    />
                    <span>{target.label}</span>
                  </button>
                ))}
              </div>

              {/* Canvas Zoom Controls (Crucial for mobile phone readability) */}
              <div className="flex items-center gap-1 self-end sm:self-auto shrink-0 bg-background/80 rounded-lg border border-border/80 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setCanvasZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom Out Map"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-[10px] font-mono font-bold px-1.5 text-foreground select-none">
                  {Math.round(canvasZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setCanvasZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title="Zoom In"
                  aria-label="Zoom In Map"
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCanvasZoom(1.0);
                    centerCanvasOnMountOrToggle();
                  }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-0.5 border-l border-border/60"
                  title="Reset Zoom & Center"
                  aria-label="Reset Map Zoom"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            VIEW MODE 1: Mobile-First Hierarchy Flow (Clean Vertical Tree)
            Perfect readability and touch control on phone screens!
           ═══════════════════════════════════════════════════════════════ */}
        {viewMode === "tree" && (
          <div className="relative z-10 space-y-4 pt-1 max-w-4xl mx-auto">
            {/* TIER 1: Executive Office (CEO) */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNodeClick(treeModel.ceo.id)}
                  onKeyDown={(e) => handleKeyDown(e, treeModel.ceo.id)}
                  className={cn(
                    "group relative p-3 sm:p-4 rounded-2xl border bg-surface transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
                    selectedNodeId === treeModel.ceo.id
                      ? "border-[#0047AB] ring-2 ring-[#0047AB]/20 bg-[#0047AB]/5"
                      : "border-border hover:border-[#0047AB]/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-white font-bold flex items-center justify-center font-mono text-base shadow-sm shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${treeModel.ceo.gradient[0]}, ${treeModel.ceo.gradient[1]})`,
                        }}
                      >
                        {renderNodeIcon(treeModel.ceo.icon, 18)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase font-bold text-[#0047AB] bg-[#0047AB]/10 px-2 py-0.2 rounded-full">
                            Executive Governance
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-foreground">
                          {treeModel.ceo.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          "{treeModel.ceo.tagline}"
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary shrink-0 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>Details</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Vertical Branch Connector Pipe */}
              <div className="flex flex-col items-center my-1">
                <div className="w-0.5 h-6 bg-[#94A3B8]/70" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background -my-1 z-10 animate-pulse" />
                <div className="w-0.5 h-6 bg-[#94A3B8]/70" />
              </div>
            </div>

            {/* TIER 2 & 3: Strategic Leadership & Specialized Departments */}
            <div className="space-y-4">
              {/* 1. Engineering & Technology Wing (CTO) */}
              <div className="rounded-2xl border border-border/80 bg-background/50 p-3 sm:p-4 space-y-3">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNodeClick(treeModel.cto.id)}
                  onKeyDown={(e) => handleKeyDown(e, treeModel.cto.id)}
                  className={cn(
                    "p-3 rounded-xl border bg-surface flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs hover:shadow-xs",
                    selectedNodeId === treeModel.cto.id
                      ? "border-[#007FFF] ring-2 ring-[#007FFF]/20 bg-[#007FFF]/5"
                      : "border-border hover:border-[#007FFF]/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-mono font-bold shrink-0 shadow-2xs"
                      style={{
                        background: `linear-gradient(135deg, ${treeModel.cto.gradient[0]}, ${treeModel.cto.gradient[1]})`,
                      }}
                    >
                      {renderNodeIcon(treeModel.cto.icon, 16)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase font-bold text-[#007FFF] bg-[#007FFF]/10 px-1.5 py-0.2 rounded">
                          Engineering Leadership
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                          6 Teams
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {treeModel.cto.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {treeModel.cto.tagline}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-primary font-semibold shrink-0">View &rarr;</span>
                </div>

                {/* CTO's Departments Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-2 border-l-2 border-[#007FFF]/30">
                  {treeModel.ctoTeams.map((team) => (
                    <div
                      key={team.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNodeClick(team.id)}
                      onKeyDown={(e) => handleKeyDown(e, team.id)}
                      className={cn(
                        "p-2.5 rounded-xl border bg-surface/90 hover:bg-surface flex flex-col justify-between gap-1.5 cursor-pointer transition-all shadow-2xs hover:shadow-xs",
                        selectedNodeId === team.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-6 h-6 rounded-md text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0"
                            style={{ backgroundColor: team.color }}
                          >
                            {team.initials}
                          </span>
                          <h5 className="text-xs font-bold text-foreground truncate">
                            {team.title}
                          </h5>
                        </div>
                        {team.illustrativeCount && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 font-bold text-primary shrink-0">
                            {team.illustrativeCount} roles
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {team.tagline}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-[#F28C28] font-medium">
                        <span className="flex items-center gap-1">
                          <Zap size={10} />
                          <span>Agile Delivery Sync</span>
                        </span>
                        <span className="text-muted-foreground font-sans">Details &rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Agile Project Delivery Hub (PM) - Full Cross-Functional Highlight */}
              <div className="rounded-2xl border-2 border-dashed border-[#F28C28]/40 bg-background/50 p-3 sm:p-4 space-y-2">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNodeClick(treeModel.pm.id)}
                  onKeyDown={(e) => handleKeyDown(e, treeModel.pm.id)}
                  className={cn(
                    "p-3 rounded-xl border bg-surface flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs hover:shadow-xs",
                    selectedNodeId === treeModel.pm.id
                      ? "border-[#F28C28] ring-2 ring-[#F28C28]/20 bg-[#F28C28]/5"
                      : "border-border hover:border-[#F28C28]/60"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-mono font-bold shrink-0 shadow-2xs"
                      style={{
                        background: `linear-gradient(135deg, ${treeModel.pm.gradient[0]}, ${treeModel.pm.gradient[1]})`,
                      }}
                    >
                      {renderNodeIcon(treeModel.pm.icon, 16)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase font-bold text-[#F28C28] bg-[#F28C28]/15 px-1.5 py-0.2 rounded">
                          Cross-Functional Orchestration
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                          3 PMs & Scrum Masters
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {treeModel.pm.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {treeModel.pm.tagline}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[#F28C28] font-semibold shrink-0">View &rarr;</span>
                </div>
                <div className="px-2 py-1 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Workflow size={12} className="text-[#F28C28] shrink-0" />
                  <span>
                    Orchestrates sprint cycles, client deliverables, and milestones across all 6 Engineering teams.
                  </span>
                </div>
              </div>

              {/* 3. Operations & Business Enablement (COO) */}
              <div className="rounded-2xl border border-border/80 bg-background/50 p-3 sm:p-4 space-y-3">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNodeClick(treeModel.coo.id)}
                  onKeyDown={(e) => handleKeyDown(e, treeModel.coo.id)}
                  className={cn(
                    "p-3 rounded-xl border bg-surface flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs hover:shadow-xs",
                    selectedNodeId === treeModel.coo.id
                      ? "border-[#475569] ring-2 ring-[#475569]/20 bg-[#475569]/5"
                      : "border-border hover:border-[#475569]/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-mono font-bold shrink-0 shadow-2xs"
                      style={{
                        background: `linear-gradient(135deg, ${treeModel.coo.gradient[0]}, ${treeModel.coo.gradient[1]})`,
                      }}
                    >
                      {renderNodeIcon(treeModel.coo.icon, 16)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase font-bold text-[#475569] bg-[#475569]/10 px-1.5 py-0.2 rounded">
                          Operations Leadership
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                          4 Teams
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {treeModel.coo.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {treeModel.coo.tagline}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-primary font-semibold shrink-0">View &rarr;</span>
                </div>

                {/* COO's Teams Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pl-2 border-l-2 border-[#475569]/30">
                  {treeModel.cooTeams.map((team) => (
                    <div
                      key={team.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNodeClick(team.id)}
                      onKeyDown={(e) => handleKeyDown(e, team.id)}
                      className={cn(
                        "p-2.5 rounded-xl border bg-surface/90 hover:bg-surface flex flex-col justify-between gap-1.5 cursor-pointer transition-all shadow-2xs hover:shadow-xs",
                        selectedNodeId === team.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-6 h-6 rounded-md text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0"
                            style={{ backgroundColor: team.color }}
                          >
                            {team.initials}
                          </span>
                          <h5 className="text-xs font-bold text-foreground truncate">
                            {team.title}
                          </h5>
                        </div>
                        {team.illustrativeCount && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 font-bold text-primary shrink-0">
                            {team.illustrativeCount} roles
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {team.tagline}
                      </p>
                      <span className="text-[10px] text-primary font-medium pt-1 border-t border-border/40 text-right">
                        Details &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Strategic Growth & Commercial (CGO) */}
              <div className="rounded-2xl border border-border/80 bg-background/50 p-3 sm:p-4 space-y-3">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNodeClick(treeModel.cgo.id)}
                  onKeyDown={(e) => handleKeyDown(e, treeModel.cgo.id)}
                  className={cn(
                    "p-3 rounded-xl border bg-surface flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs hover:shadow-xs",
                    selectedNodeId === treeModel.cgo.id
                      ? "border-[#D946EF] ring-2 ring-[#D946EF]/20 bg-[#D946EF]/5"
                      : "border-border hover:border-[#D946EF]/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-mono font-bold shrink-0 shadow-2xs"
                      style={{
                        background: `linear-gradient(135deg, ${treeModel.cgo.gradient[0]}, ${treeModel.cgo.gradient[1]})`,
                      }}
                    >
                      {renderNodeIcon(treeModel.cgo.icon, 16)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase font-bold text-[#D946EF] bg-[#D946EF]/10 px-1.5 py-0.2 rounded">
                          Growth & Commercial
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                          2 Teams
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {treeModel.cgo.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {treeModel.cgo.tagline}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-primary font-semibold shrink-0">View &rarr;</span>
                </div>

                {/* CGO's Teams Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2 border-l-2 border-[#D946EF]/30">
                  {treeModel.cgoTeams.map((team) => (
                    <div
                      key={team.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNodeClick(team.id)}
                      onKeyDown={(e) => handleKeyDown(e, team.id)}
                      className={cn(
                        "p-2.5 rounded-xl border bg-surface/90 hover:bg-surface flex flex-col justify-between gap-1.5 cursor-pointer transition-all shadow-2xs hover:shadow-xs",
                        selectedNodeId === team.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-6 h-6 rounded-md text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0"
                            style={{ backgroundColor: team.color }}
                          >
                            {team.initials}
                          </span>
                          <h5 className="text-xs font-bold text-foreground truncate">
                            {team.title}
                          </h5>
                        </div>
                        {team.illustrativeCount && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 font-bold text-primary shrink-0">
                            {team.illustrativeCount} roles
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {team.tagline}
                      </p>
                      <span className="text-[10px] text-primary font-medium pt-1 border-t border-border/40 text-right">
                        Details &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            VIEW MODE 2: Panoramic Canvas Map (Interactive 2D SVG)
            Supports dynamic zoom levels and smooth touch panning!
           ═══════════════════════════════════════════════════════════════ */}
        {viewMode === "canvas" && (
          <div className="relative z-10 w-full select-none pt-1">
            {/* Mobile Touch Hint */}
            <div className="md:hidden flex items-center justify-between gap-1.5 py-1 px-2.5 mb-1 text-[11px] text-muted-foreground font-medium bg-primary/5 rounded-lg border border-primary/10">
              <span className="flex items-center gap-1.5">
                <MoveHorizontal size={13} className="text-primary animate-pulse" />
                <span>Swipe to pan. Tap any node for details.</span>
              </span>
              <span className="text-primary font-mono text-[10px]">
                {Math.round(canvasZoom * 100)}% zoom
              </span>
            </div>

            {/* Scrollable Container with Zoom Multiplier */}
            <div
              ref={scrollContainerRef}
              className="relative w-full overflow-x-auto overflow-y-hidden rounded-xl border border-border/60 bg-white/40 dark:bg-black/20 p-2 sm:p-4 touch-pan-x scrollbar-none"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div
                style={{
                  width: `${Math.round(Math.max(760, 980 * canvasZoom))}px`,
                  minWidth: `${Math.round(Math.max(760, 980 * canvasZoom))}px`,
                  transition: "width 0.2s ease-out",
                }}
                className="mx-auto aspect-[980/340]"
              >
                <svg
                  viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-full overflow-visible"
                  role="region"
                  aria-label="Interactive Organization Structure Map with 17 IT Roles and Connectors"
                >
                  <defs>
                    {/* Dynamic Gradients for Nodes */}
                    {ORG_NODES.map((n) => (
                      <linearGradient
                        key={`grad-${n.id}`}
                        id={`grad-${n.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={n.gradient[0]} />
                        <stop offset="100%" stopColor={n.gradient[1]} />
                      </linearGradient>
                    ))}

                    {/* Dynamic Glow Filters for Nodes */}
                    {ORG_NODES.map((n) => (
                      <filter
                        key={`glow-${n.id}`}
                        id={`glow-${n.id}`}
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="2"
                          stdDeviation={LEVEL_STYLES[n.level].glowBlur / 2}
                          floodColor={n.glow}
                          floodOpacity="0.45"
                        />
                      </filter>
                    ))}

                    {/* Signal Packet Glow Filter */}
                    <filter id="signal-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* A. Connector Paths (Rendered behind nodes) */}
                  <g id="org-connectors-group" className="pointer-events-none">
                    {ORG_CONNECTORS.map((connector) => {
                      const isReporting = connector.type === "reporting";
                      const isHighlighted = activeConnectorIds.has(connector.id);
                      const hasFocalNode = !!focalNodeId;

                      let strokeColor = isReporting
                        ? CONNECTOR_STYLES.reporting.stroke
                        : CONNECTOR_STYLES.collaboration.stroke;
                      let strokeWidth = isReporting
                        ? CONNECTOR_STYLES.reporting.width
                        : CONNECTOR_STYLES.collaboration.width;
                      let strokeDasharray = isReporting ? "none" : "4 4";
                      let opacity = hasFocalNode
                        ? isHighlighted
                          ? 1
                          : 0.12
                        : isReporting
                        ? CONNECTOR_STYLES.reporting.opacity
                        : CONNECTOR_STYLES.collaboration.opacity;

                      if (isHighlighted) {
                        strokeWidth = isReporting ? 2.4 : 2.2;
                        strokeColor = isReporting ? "#0047AB" : "#F28C28";
                      }

                      return (
                        <g
                          key={connector.id}
                          data-journey-route={connector.id}
                          data-journey-route-type={connector.type}
                        >
                          {/* Background Halo when active */}
                          {isHighlighted && (
                            <path
                              d={connector.path}
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth={strokeWidth + 4}
                              strokeOpacity={0.25}
                              strokeLinecap="round"
                            />
                          )}

                          {/* Main Connector Wire */}
                          <path
                            d={connector.path}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeLinecap="round"
                            opacity={opacity}
                            className="transition-all duration-200"
                          >
                            {/* Flowing animated dash for collaboration wires */}
                            {!isReporting && (
                              <animate
                                attributeName="stroke-dashoffset"
                                from="16"
                                to="0"
                                dur="1.4s"
                                repeatCount="indefinite"
                                className="motion-reduce:hidden"
                              />
                            )}
                          </path>

                          {/* Active Signal Photon (Travels along highlighted routes) */}
                          {isHighlighted && (
                            <circle
                              r="3.5"
                              fill={isReporting ? "#0047AB" : "#F28C28"}
                              filter="url(#signal-glow)"
                              data-journey-signal={connector.id}
                              className="motion-reduce:hidden"
                            >
                              <animateMotion
                                path={connector.path}
                                dur="2.2s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* B. Interactive Organization Nodes */}
                  <g id="org-nodes-group">
                    {ORG_NODES.map((node) => {
                      const isSelected = selectedNodeId === node.id;
                      const isHovered = hoveredNodeId === node.id;
                      const isNeighbor = activeNeighborNodeIds.has(node.id);
                      const isDimmed = !!focalNodeId && !isNeighbor;

                      const style = LEVEL_STYLES[node.level];
                      const pillWidth = style.width;
                      const pillHeight = style.height;
                      const rx = style.radius;

                      return (
                        <g
                          key={node.id}
                          id={`node-${node.id}`}
                          data-journey-node={node.id}
                          transform={`translate(${node.coordinates.x}, ${node.coordinates.y})`}
                          className="cursor-pointer transition-all duration-150 outline-none"
                          role="button"
                          tabIndex={0}
                          aria-label={`${node.title}: ${node.countLabel || node.tagline || 'Leadership position'}`}
                          aria-expanded={isSelected}
                          onMouseEnter={() => setHoveredNodeId(node.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                          onClick={() => handleNodeClick(node.id)}
                          onKeyDown={(e) => handleKeyDown(e, node.id)}
                        >
                          <title>{`${node.title} — ${node.tagline || ''}`}</title>

                          {/* Active / Hover Ring */}
                          {(isSelected || isHovered) && (
                            <rect
                              x={-pillWidth / 2 - 3}
                              y={-pillHeight / 2 - 3}
                              width={pillWidth + 6}
                              height={pillHeight + 6}
                              rx={rx + 2}
                              fill="none"
                              stroke={node.color}
                              strokeWidth={isSelected ? 2 : 1.5}
                              strokeDasharray={isSelected ? "none" : "3 2"}
                              className="animate-pulse motion-reduce:animate-none"
                            />
                          )}

                          {/* Main Node Card Pill */}
                          <rect
                            x={-pillWidth / 2}
                            y={-pillHeight / 2}
                            width={pillWidth}
                            height={pillHeight}
                            rx={rx}
                            fill={isSelected || isHovered ? "#FFFFFF" : "#FFFFFF"}
                            stroke={isSelected ? node.color : isHovered ? node.color : "rgba(214, 206, 192, 0.95)"}
                            strokeWidth={isSelected ? 2 : 1.2}
                            filter={isSelected || isHovered ? `url(#glow-${node.id})` : undefined}
                            opacity={isDimmed ? 0.35 : 1}
                            className="shadow-xs transition-all duration-150"
                          />

                          {/* Internal Content by Level */}
                          {node.level === 1 && (
                            // Level 1: CEO / Executive Pill (Width 130 x Height 38)
                            <g className="pointer-events-none">
                              <circle
                                cx={-pillWidth / 2 + 18}
                                cy="0"
                                r="11"
                                fill={`url(#grad-${node.id})`}
                                opacity={isDimmed ? 0.4 : 1}
                              />
                              <text
                                x={-pillWidth / 2 + 18}
                                y="0"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="#FFFFFF"
                                fontSize="7.5px"
                                fontWeight="bold"
                                className="select-none font-mono"
                              >
                                {node.initials}
                              </text>

                              <g transform={`translate(${-pillWidth / 2 + 35}, 0)`}>
                                <text
                                  y="-3"
                                  fill="#0B1F3A"
                                  fontSize="8.5px"
                                  fontWeight="bold"
                                  className="select-none font-sans"
                                >
                                  Managing Director
                                </text>
                                <text
                                  y="7"
                                  fill="#0047AB"
                                  fontSize="7.5px"
                                  fontWeight="bold"
                                  className="select-none font-sans"
                                >
                                  Chief Executive (CEO)
                                </text>
                              </g>
                            </g>
                          )}

                          {node.level === 2 && (
                            // Level 2: Executive & Delivery Track (Width 120 x Height 38)
                            <g className="pointer-events-none">
                              <circle
                                cx={-pillWidth / 2 + 17}
                                cy="0"
                                r="10.5"
                                fill={`url(#grad-${node.id})`}
                                opacity={isDimmed ? 0.4 : 1}
                              />
                              <text
                                x={-pillWidth / 2 + 17}
                                y="0"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="#FFFFFF"
                                fontSize="7px"
                                fontWeight="bold"
                                className="select-none font-mono"
                              >
                                {node.initials}
                              </text>

                              <g transform={`translate(${-pillWidth / 2 + 34}, 0)`}>
                                <text
                                  y="-3"
                                  fill="#0B1F3A"
                                  fontSize="8px"
                                  fontWeight="bold"
                                  className="select-none font-sans"
                                >
                                  {node.shortTitle}
                                </text>
                                <text
                                  y="7"
                                  fill={node.color}
                                  fontSize="7.5px"
                                  fontWeight="bold"
                                  className="select-none font-sans"
                                >
                                  {node.countLabel ? "3 Positions" : node.initials}
                                </text>
                              </g>
                            </g>
                          )}

                          {node.level === 3 && (
                            // Level 3: Department Team Card (Width 72 x Height 44)
                            <g className="pointer-events-none text-center">
                              {/* Top Initials Badge */}
                              <rect
                                x={-pillWidth / 2 + 4}
                                y={-pillHeight / 2 + 4}
                                width={pillWidth - 8}
                                height="14"
                                rx="4"
                                fill={node.color}
                                opacity={isDimmed ? 0.4 : 0.95}
                              />
                              <text
                                x="0"
                                y={-pillHeight / 2 + 11.5}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="#FFFFFF"
                                fontSize="7.5px"
                                fontWeight="bold"
                                className="select-none font-mono tracking-wider"
                              >
                                {node.initials}
                              </text>

                              {/* Title & Count */}
                              <text
                                x="0"
                                y="4"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="#0B1F3A"
                                fontSize="7.5px"
                                fontWeight="bold"
                                className="select-none font-sans"
                              >
                                {node.shortTitle}
                              </text>

                              {node.illustrativeCount ? (
                                <text
                                  x="0"
                                  y="14"
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fill={node.color}
                                  fontSize="6.8px"
                                  fontWeight="bold"
                                  className="select-none font-mono"
                                >
                                  {node.illustrativeCount} roles
                                </text>
                              ) : null}
                            </g>
                          )}

                          {/* Click Hit-Area Overlay */}
                          <rect
                            x={-pillWidth / 2}
                            y={-pillHeight / 2}
                            width={pillWidth}
                            height={pillHeight}
                            rx={rx}
                            fill="transparent"
                            className="cursor-pointer"
                          />
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            VIEW MODE 3: Directory View (Search, Filters & Clean Mobile Cards)
            No awkward text truncation! Full titles and responsive grid!
           ═══════════════════════════════════════════════════════════════ */}
        {viewMode === "directory" && (
          <div className="space-y-3.5 pt-1">
            {/* Search Input & Category Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Category Filter Pills (Horizontal scroll on mobile) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {[
                  { id: "all", label: "All Roles (17)" },
                  { id: "leadership", label: "Leadership (5)" },
                  { id: "tech", label: "Engineering (7)" },
                  { id: "ops", label: "Operations (5)" },
                  { id: "growth", label: "Growth & Sales (3)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategoryFilter(tab.id as any)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer shrink-0",
                      categoryFilter === tab.id
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles, tools, teams..."
                  className="w-full pl-8 pr-7 py-1 text-xs rounded-lg border border-border bg-background/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Results Status */}
            <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-between px-1">
              <span>
                Showing {filteredDirectoryNodes.length} of {ORG_NODES.length} organizational positions
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Responsive Card Grid (1 column on phones to prevent title truncation, 2 on tablet, 4 on desktop) */}
            {filteredDirectoryNodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {filteredDirectoryNodes.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleNodeClick(node.id)}
                    className="w-full text-left p-3 rounded-xl border border-border bg-surface hover:border-primary/50 shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 active:scale-[0.99] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg text-white font-bold flex items-center justify-center font-mono text-xs shrink-0 shadow-xs"
                        style={{
                          background: `linear-gradient(135deg, ${node.gradient[0]}, ${node.gradient[1]})`,
                        }}
                      >
                        {renderNodeIcon(node.icon, 16)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground">
                            {node.title}
                          </h4>
                          {node.illustrativeCount && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 font-bold text-primary shrink-0">
                              {node.illustrativeCount} roles
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {node.tagline}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-primary font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                      &rarr;
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 rounded-xl border border-dashed border-border/80 bg-background/40">
                <p className="text-xs text-muted-foreground">
                  No roles match "<span className="font-semibold text-foreground">{searchQuery}</span>"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                  }}
                  className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footnote Notice */}
        <div className="mt-4 pt-2.5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-primary shrink-0" />
            <span>Configurable illustrative organization model for modern IT engineering & services.</span>
          </div>
          <span className="text-[11px] font-mono">Headcounts and hierarchy easily adapted in organization-data.ts</span>
        </div>
      </div>

      {/* Accessible Details Dialog / Slide-Over Modal */}
      <Dialog open={!!activeNode} onOpenChange={(open) => !open && setSelectedNodeId(null)}>
        {activeNode && (
          <DialogContent className="w-[94vw] sm:max-w-xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 rounded-2xl border border-border bg-surface text-foreground shadow-2xl">
            <DialogHeader className="text-left space-y-2.5 pb-3 border-b border-border/70">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl text-white font-bold flex items-center justify-center font-mono text-base shadow-md shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${activeNode.gradient[0]}, ${activeNode.gradient[1]})`,
                    }}
                  >
                    {renderNodeIcon(activeNode.icon, 20)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      {activeNode.roleType.toUpperCase()} · TIER {activeNode.level}
                    </span>
                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {activeNode.title}
                    </DialogTitle>
                    {activeNode.tagline && (
                      <p className="text-xs font-medium text-primary mt-0.5">"{activeNode.tagline}"</p>
                    )}
                  </div>
                </div>

                {activeNode.countLabel && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary shrink-0">
                    {activeNode.countLabel}
                  </span>
                )}
              </div>

              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {activeNode.departmentOverview}
              </DialogDescription>
            </DialogHeader>

            {/* Modal Body */}
            <div className="space-y-4 pt-2 text-xs sm:text-sm">
              {/* Tech Stack & Tools */}
              {activeNode.tools && activeNode.tools.length > 0 && (
                <div>
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1.5">
                    <Wrench size={13} className="text-primary" />
                    <span>Primary Tools & Technologies</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 rounded-md border border-border/80 bg-muted/50 font-mono text-xs font-medium text-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider font-mono mb-1 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-primary" />
                  <span>Role Scope</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed">{activeNode.summary}</p>
              </div>

              {/* Responsibilities Checklist */}
              <div>
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Key Responsibilities</span>
                </h4>
                <ul className="space-y-1.5">
                  {activeNode.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-muted-foreground leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organizational Hierarchy & Coordination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Reports To */}
                {activeNode.reportsTo && (
                  <div className="rounded-xl border border-border/70 bg-background/40 p-2.5">
                    <h5 className="font-bold text-foreground text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1 text-primary">
                      <GitBranch size={12} />
                      <span>Reports Directly To</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {activeNode.reportsTo.map((id) => {
                        const target = ORG_NODES.find((n) => n.id === id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedNodeId(id)}
                            className="px-2 py-0.5 rounded-md bg-surface border border-border text-xs font-medium hover:border-primary transition-colors cursor-pointer"
                          >
                            {target?.title} &rarr;
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Oversees */}
                {activeNode.oversees && (
                  <div className="rounded-xl border border-border/70 bg-background/40 p-2.5">
                    <h5 className="font-bold text-foreground text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1 text-primary">
                      <Layers size={12} />
                      <span>Directly Oversees</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {activeNode.oversees.map((id) => {
                        const target = ORG_NODES.find((n) => n.id === id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedNodeId(id)}
                            className="px-2 py-0.5 rounded-md bg-surface border border-border text-xs font-medium hover:border-primary transition-colors cursor-pointer"
                          >
                            {target?.shortTitle} &rarr;
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Coordination / Collaboration */}
                {(activeNode.coordinatesWith || activeNode.collaboratesWith) && (
                  <div className="rounded-xl border border-border/70 bg-background/40 p-2.5 sm:col-span-2">
                    <h5 className="font-bold text-foreground text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1 text-[#F28C28]">
                      <Compass size={12} />
                      <span>Project Collaboration & Delivery Alignment</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {[...(activeNode.coordinatesWith || []), ...(activeNode.collaboratesWith || [])].map((id) => {
                        const target = ORG_NODES.find((n) => n.id === id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedNodeId(id)}
                            className="px-2 py-0.5 rounded-md bg-surface border border-border text-xs font-medium hover:border-[#F28C28] transition-colors cursor-pointer"
                          >
                            {target?.shortTitle}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Example Roles (if applicable) */}
              {activeNode.exampleRoles && (
                <div className="pt-1">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider font-mono mb-1.5">
                    Representative Positions in this Department
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.exampleRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 rounded-md border border-border bg-background/60 text-xs text-foreground font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Disclaimer */}
              <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>*Configurable sample IT company organization model</span>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  Close details
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
