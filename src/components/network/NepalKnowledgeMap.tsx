import { useState, useMemo, useCallback } from "react";
import {
  DISTRICTS,
  PROVINCES,
  CAPITAL_NODES,
  CAPITAL_ROUTES,
} from "@/data/nepal-map-data";
import {
  Broadcast,
  SlidersHorizontal,
  ArrowsClockwise,
} from "@phosphor-icons/react";

export function NepalKnowledgeMap({ embedded = false }: { embedded?: boolean } = {}) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("all");
  const [selectedCapitalId, setSelectedCapitalId] = useState<string | null>(null);
  const [hoveredCapitalId, setHoveredCapitalId] = useState<string | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);

  // Hovered capital object
  const hoveredCapital = useMemo(() => {
    if (!hoveredCapitalId) return null;
    return CAPITAL_NODES.find((c) => c.id === hoveredCapitalId) || null;
  }, [hoveredCapitalId]);

  // Selected capital object
  const selectedCapital = useMemo(() => {
    if (!selectedCapitalId) return null;
    return CAPITAL_NODES.find((c) => c.id === selectedCapitalId) || null;
  }, [selectedCapitalId]);

  // Hovered district object
  const hoveredDistrict = useMemo(() => {
    if (!hoveredDistrictId) return null;
    return DISTRICTS.find((d) => d.id === hoveredDistrictId) || null;
  }, [hoveredDistrictId]);

  // Province color helper
  const getProvinceColor = useCallback((provinceId: string) => {
    const p = PROVINCES.find((item) => item.id === provinceId);
    return p?.color || "#0047AB";
  }, []);

  const handleReset = () => {
    setSelectedProvinceId("all");
    setSelectedCapitalId(null);
  };

  const Wrapper = embedded ? "div" : "section";

  return (
    <Wrapper
      id="knowledge-network"
      aria-labelledby="knowledge-network-title"
      className={embedded ? "w-full max-w-4xl mx-auto" : "container-site py-6 sm:py-8"}
    >
      {/* Refined, compact header */}
      <div className="text-center max-w-xl mx-auto mb-3 sm:mb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-1">
          <span className="w-2 h-2 rounded-full bg-highlight animate-ping" />
          <span>Digital Knowledge Backbone</span>
        </div>
        <h3
          id="knowledge-network-title"
          className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground"
        >
          National Network Hubs
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
          Live sync connecting Federal HQ (Kathmandu) with all 7 Provincial Capitals.
        </p>
      </div>

      {/* Modern, light, website-color map container */}
      <div className="relative rounded-2xl border border-border/80 bg-surface/95 backdrop-blur-md shadow-sm overflow-hidden text-foreground">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-surface pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#D6CEC0 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Controls Bar (Matching site's light aesthetic) */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 border-b border-border/70 bg-surface/85 backdrop-blur-md">
          {/* Province Filter Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {PROVINCES.map((prov) => {
              const isActive = selectedProvinceId === prov.id;
              return (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => {
                    setSelectedProvinceId(prov.id);
                    if (prov.id !== "all") {
                      const cap = CAPITAL_NODES.find((c) => c.provinceId === prov.id);
                      if (cap) setSelectedCapitalId(cap.id);
                    } else {
                      setSelectedCapitalId(null);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                      : "bg-background/80 hover:bg-background text-foreground/80 border border-border/70 hover:border-primary/40"
                  }`}
                >
                  {prov.id !== "all" && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: prov.color }}
                    />
                  )}
                  <span>{prov.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Actions: Live Routes Toggle & Reset */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowRoutes(!showRoutes)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                showRoutes
                  ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                  : "bg-background/80 border-border text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle live data stream lines"
            >
              <SlidersHorizontal size={13} />
              <span>{showRoutes ? "Live Active" : "Lines Muted"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-background/80 hover:bg-background border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Reset view"
            >
              <ArrowsClockwise size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Clean Info Strip when Hovered or Selected */}
        {(hoveredCapital || selectedCapital || hoveredDistrict) && (
          <div className="relative z-10 px-3.5 py-1.5 border-b border-border/50 bg-background/60 backdrop-blur-sm flex items-center justify-between text-xs text-foreground transition-all">
            <div className="flex items-center gap-2 truncate">
              {hoveredCapital ? (
                <>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 animate-ping"
                    style={{ backgroundColor: hoveredCapital.color }}
                  />
                  <span className="font-bold">{hoveredCapital.name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-primary font-medium truncate">{hoveredCapital.role}</span>
                </>
              ) : selectedCapital ? (
                <>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 animate-ping"
                    style={{ backgroundColor: selectedCapital.color }}
                  />
                  <span className="font-bold">{selectedCapital.name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-primary font-medium truncate">{selectedCapital.dataType}</span>
                </>
              ) : hoveredDistrict ? (
                <>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: getProvinceColor(hoveredDistrict.provinceId) }}
                  />
                  <span className="font-bold">{hoveredDistrict.name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{hoveredDistrict.province}</span>
                </>
              ) : null}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0 hidden sm:inline">Click district or hub for details</span>
          </div>
        )}

        {/* Compact, properly framed SVG Stage with zero clipping */}
        <div className="w-full max-h-[420px] sm:max-h-[460px] aspect-[1185/735] relative p-1 sm:p-2 flex items-center justify-center">
          <svg
            viewBox="15 30 1185 735"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full select-none overflow-visible"
            role="region"
            aria-label="Map of Nepal with 8 connected regional capitals and live data routes"
          >
            <defs>
              {/* Subtle packet pulse glow */}
              <filter id="packet-light-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. District Boundaries with Distinct State Colors */}
            <g id="nepal-districts-group" aria-label="District Boundaries">
              {DISTRICTS.map((district) => {
                const isInSelectedProvince =
                  selectedProvinceId === "all" || selectedProvinceId === district.provinceId;
                const isHovered = hoveredDistrictId === district.id;
                const provColor = getProvinceColor(district.provinceId);

                let fill = provColor;
                let fillOpacity = 0.28;
                let stroke = provColor;
                let strokeWidth = 0.85;

                if (selectedProvinceId === "all") {
                  fill = provColor;
                  fillOpacity = isHovered ? 0.55 : 0.26;
                  stroke = isHovered ? "#0B1F3A" : provColor;
                  strokeWidth = isHovered ? 1.6 : 0.9;
                } else if (isInSelectedProvince) {
                  fill = provColor;
                  fillOpacity = isHovered ? 0.6 : 0.42;
                  stroke = isHovered ? "#0B1F3A" : provColor;
                  strokeWidth = isHovered ? 1.8 : 1.2;
                } else {
                  fill = "#F2ECE2";
                  fillOpacity = 0.5;
                  stroke = "#DDD5C7";
                  strokeWidth = 0.5;
                }

                return (
                  <path
                    key={district.id}
                    id={`district-${district.id}`}
                    d={district.pathD}
                    role="button"
                    tabIndex={0}
                    aria-label={`${district.name}, ${district.province}`}
                    fill={fill}
                    fillOpacity={fillOpacity}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150 outline-none hover:brightness-105"
                    onMouseEnter={() => setHoveredDistrictId(district.id)}
                    onMouseLeave={() => setHoveredDistrictId(null)}
                    onClick={() => {
                      const cap = CAPITAL_NODES.find((c) => c.provinceId === district.provinceId);
                      if (cap) setSelectedCapitalId(cap.id);
                    }}
                  >
                    <title>{`${district.name} — ${district.province}`}</title>
                  </path>
                );
              })}
            </g>

            {/* 2. Live Data Routes (Cobalt Blue wire with traveling packets) */}
            {showRoutes && (
              <g id="capital-network-routes" aria-label="Live Data Streams">
                {CAPITAL_ROUTES.map((route) => (
                  <g key={route.id} className="pointer-events-none">
                    {/* Subtle route guide line */}
                    <path
                      d={route.path}
                      fill="none"
                      stroke="rgba(0, 71, 171, 0.14)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Animated flowing data wire in Cobalt Blue */}
                    <path
                      d={route.path}
                      fill="none"
                      stroke="#0047AB"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className="data-stream-wire"
                    />

                    {/* Outward Packet: Tangerine (KTM -> Capital) */}
                    <circle r="3.5" fill="#F28C28" filter="url(#packet-light-glow)">
                      <animateMotion
                        path={route.path}
                        dur={`${route.duration}s`}
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Return Packet: Cobalt Blue (Capital -> KTM) */}
                    <circle r="2.8" fill="#0047AB" filter="url(#packet-light-glow)">
                      <animateMotion
                        path={route.reversePath}
                        dur={`${route.duration + 0.5}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}
              </g>
            )}

            {/* 3. The 8 Capital City Hubs */}
            <g id="capital-nodes-group" aria-label="Capital City Nodes">
              {CAPITAL_NODES.map((cap) => {
                const isSelected = selectedCapitalId === cap.id;
                const isHovered = hoveredCapitalId === cap.id;
                const isFederal = cap.isFederal;

                return (
                  <g
                    key={cap.id}
                    id={`capital-node-${cap.id}`}
                    transform={`translate(${cap.x}, ${cap.y})`}
                    className="cursor-pointer transition-transform duration-150"
                    role="button"
                    tabIndex={0}
                    aria-label={`${cap.name}: ${cap.role}`}
                    onMouseEnter={() => setHoveredCapitalId(cap.id)}
                    onMouseLeave={() => setHoveredCapitalId(null)}
                    onClick={() => {
                      setSelectedCapitalId(isSelected ? null : cap.id);
                      if (!isSelected) setSelectedProvinceId(cap.isFederal ? "all" : cap.provinceId);
                    }}
                  >
                    <title>{`${cap.name} — ${cap.role} (Live Stream: ${cap.dataType})`}</title>

                    {/* Expanding Radar Ping */}
                    <circle
                      r={isFederal ? 18 : 12}
                      fill="none"
                      stroke={isFederal ? "#F28C28" : "#0047AB"}
                      strokeWidth={isFederal ? 2 : 1.3}
                      className="animate-ping opacity-50"
                    />

                    {/* Core Beacon Ring */}
                    <circle
                      r={isFederal ? 7.5 : 5.5}
                      fill={isFederal ? "#F28C28" : "#0047AB"}
                    />

                    {/* Inner Core Center Dot */}
                    <circle
                      r={isFederal ? 3.5 : 2.5}
                      fill="#FFFFFF"
                      stroke={isFederal ? "#0047AB" : "#FFFFFF"}
                      strokeWidth={isFederal ? 1.5 : 1}
                    />

                    {/* Floating City Name Pill Badge */}
                    <g transform={`translate(${isFederal ? -50 : -38}, ${isFederal ? -26 : -20})`}>
                      <rect
                        width={isFederal ? 100 : 76}
                        height={isFederal ? 20 : 16}
                        rx={isFederal ? 10 : 8}
                        fill={isFederal ? "#0047AB" : "#FFFFFF"}
                        stroke={isFederal ? "#FFFFFF" : isSelected ? "#0047AB" : "#0047AB"}
                        strokeWidth={isFederal ? 1.5 : isSelected ? 1.6 : 1.1}
                        className="shadow-xs"
                      />
                      <text
                        x={isFederal ? 50 : 38}
                        y={isFederal ? 13.5 : 11}
                        textAnchor="middle"
                        fill={isFederal ? "#FFFFFF" : "#0047AB"}
                        fontSize={isFederal ? "9px" : "8px"}
                        fontWeight="bold"
                        className="select-none font-sans tracking-wide"
                      >
                        {isFederal ? "★ KATHMANDU" : cap.name.split(" ")[0].toUpperCase()}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Refined Status Footnote */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 border-t border-border/70 bg-surface/80 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync Active: <strong>Kathmandu & 7 Provincial Capitals</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/80">
            <span>Official 2020 Limpiyadhura Boundary</span>
            <span>8 Connected Hubs</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
