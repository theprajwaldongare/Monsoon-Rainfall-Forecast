import React, { useState, useMemo, Component } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "/india-districts-v2.topo.json";

// ── Category → fill color (earthy palette) ──────────────────
const CATEGORY_FILL = {
  "Extremely Heavy": { fill: "#c2714f", stroke: "#8b4e35", label: "#e0956e" },
  "Very Heavy":      { fill: "#d97706", stroke: "#9a5504", label: "#fbbf24" },
  "Heavy":           { fill: "#a18c5a", stroke: "#7a6a42", label: "#c8b47a" },
  "Moderate":        { fill: "#1aab9d", stroke: "#0e7a70", label: "#2dd4bf" },
  "Light":           { fill: "#4cd5a4", stroke: "#29a07a", label: "#6ee7b7" },
  default:           { fill: "#1c2a26", stroke: "#263833", label: "#475569" },
};

const PRIORITY = [
  "Extremely Heavy", "Very Heavy", "Heavy", "Moderate", "Light"
];

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: '#f87171', background: '#111614', borderRadius: 12 }}>
          <h3 style={{ margin: '0 0 10px' }}>Map failed to load</h3>
          <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function MapInner({ districtData }) {
  const [tooltip, setTooltip] = useState(null);
  const [position, setPosition] = useState({ coordinates: [79.5, 22.5], zoom: 1 });

  // Build a lookup: "DistrictName|StateName" -> district data entry
  const districtCategoryMap = useMemo(() => {
    const map = {};
    (districtData || []).forEach(d => {
      // Key by district+state to handle duplicate district names across states
      const key = `${d.district}|${d.state}`;
      map[key] = d;
    });
    return map;
  }, [districtData]);

  // Also build a lookup by just district name for fuzzy matching
  const districtByName = useMemo(() => {
    const map = {};
    (districtData || []).forEach(d => {
      map[d.district.toLowerCase()] = d;
    });
    return map;
  }, [districtData]);

  const handleMove = (e) => {
    if (tooltip) setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }));
  };

  // Find the matching mock data for a given GeoJSON district feature
  const findDistrictData = (geo) => {
    const distName = geo.properties.NAME_2 || "";
    const stateName = geo.properties.NAME_1 || "";
    
    // Try exact key match first
    const exactKey = `${distName}|${stateName}`;
    if (districtCategoryMap[exactKey]) return districtCategoryMap[exactKey];
    
    // Fuzzy match by district name
    const lowerDist = distName.toLowerCase();
    if (districtByName[lowerDist]) return districtByName[lowerDist];
    
    return null;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 280,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow: "hidden",
      }}
      onMouseMove={handleMove}
    >
      <div style={{
        position: "absolute", top: 10, left: 10, zIndex: 10, display: "flex", flexDirection: "column",
        gap: 4, background: "rgba(17,22,20,0.82)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8, padding: "6px 10px",
      }}>
        {PRIORITY.map(cat => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: CATEGORY_FILL[cat].fill, flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: "#94a3b8", whiteSpace: "nowrap" }}>{cat}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 10, fontSize: 9, color: "#334155" }}>
        scroll to zoom · drag to pan
      </div>

      <ComposableMap projection="geoMercator" projectionConfig={{ center: [79.5, 22.5], scale: 1050 }} style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={setPosition} minZoom={0.8} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              if (!geographies || geographies.length === 0) return null;
              return geographies.map((geo) => {
                const distName = geo.properties.NAME_2 || "Unknown";
                const stateName = geo.properties.NAME_1 || "";
                const data = findDistrictData(geo);
                const category = data?.category;
                const cfg = CATEGORY_FILL[category] || CATEGORY_FILL.default;
                const isHovered = tooltip && tooltip.distName === distName && tooltip.stateName === stateName;
                const currentFill = isHovered ? (category ? cfg.label : "#2a3d38") : cfg.fill;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => setTooltip({
                      distName,
                      stateName,
                      category,
                      rainfall: data?.corrected,
                      raw: data?.raw,
                      bias: data?.bias,
                      abbr: data?.abbr,
                      x: e.clientX,
                      y: e.clientY
                    })}
                    onMouseLeave={() => setTooltip(null)}
                    fill={currentFill}
                    stroke={cfg.stroke}
                    strokeWidth={isHovered ? 0.7 : 0.35}
                    style={{
                      default: { outline: "none", transition: "all 0.2s ease" },
                      hover: { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div style={{
          position: "fixed", left: tooltip.x + 12, top: tooltip.y - 10, zIndex: 9999,
          background: "rgba(17,22,20,0.96)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "8px 12px", pointerEvents: "none", minWidth: 160, maxWidth: 240,
          backdropFilter: "blur(12px)",
        }}>
          <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
            {tooltip.distName}
          </p>
          <p style={{ margin: "0 0 6px", fontSize: 10, color: "#64748b" }}>
            {tooltip.stateName} {tooltip.abbr ? `[${tooltip.abbr}]` : ""}
          </p>
          {tooltip.category ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_FILL[tooltip.category]?.fill }} />
                <span style={{ fontSize: 10, color: CATEGORY_FILL[tooltip.category]?.label || "#94a3b8", fontWeight: 600 }}>
                  {tooltip.category}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", gap: 12 }}>
                <span>AI Corrected</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#2dd4bf", fontWeight: 600 }}>{tooltip.rainfall} mm</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b", gap: 12, marginTop: 2 }}>
                <span>Raw NWP</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{tooltip.raw} mm</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b", gap: 12, marginTop: 2 }}>
                <span>Bias</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#c2714f" }}>-{tooltip.bias} mm</span>
              </div>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: 10, color: "#475569" }}>No forecast data</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function IndiaMap({ districtData }) {
  return (
    <ErrorBoundary>
      <MapInner districtData={districtData} />
    </ErrorBoundary>
  );
}
