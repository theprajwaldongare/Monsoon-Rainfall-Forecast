import React, { useState, useMemo, Component } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "/india-fixed.geojson";

// ── Category → fill color (earthy palette) ──────────────────
const CATEGORY_FILL = {
  "Extremely Heavy": { fill: "#c2714f", stroke: "#8b4e35", label: "#e0956e" },
  "Very Heavy":      { fill: "#d97706", stroke: "#9a5504", label: "#fbbf24" },
  "Heavy":           { fill: "#a18c5a", stroke: "#7a6a42", label: "#c8b47a" },
  "Moderate":        { fill: "#1aab9d", stroke: "#0e7a70", label: "#2dd4bf" },
  "Light":           { fill: "#4cd5a4", stroke: "#29a07a", label: "#6ee7b7" },
  default:           { fill: "#1c2a26", stroke: "#263833", label: "#475569" },
};

// Map GeoJSON STNAME_SH → mock data state names
const STATE_NAME_MAP = {
  "Andaman & Nicobar":  "Andaman and Nicobar",
  "Andaman & Nicobar Island": "Andaman and Nicobar",
  "Andaman and Nicobar Islands": "Andaman and Nicobar",
  "Arunachal Pradesh":  "Arunachal Pradesh",
  "Assam":              "Assam",
  "Bihar":              "Bihar",
  "Chandigarh":         "Chandigarh",
  "Chhattisgarh":       "Chhattisgarh",
  "Dadra & Nagar Haveli": "Dadra and Nagar Haveli",
  "Daman & Diu":        "Daman and Diu",
  "Dadra and Nagar Haveli and Daman and Diu": "Dadra and Nagar Haveli",
  "Delhi":              "Delhi",
  "Goa":                "Goa",
  "Gujarat":            "Gujarat",
  "Haryana":            "Haryana",
  "Himachal Pradesh":   "Himachal Pradesh",
  "Jammu & Kashmir":    "Jammu and Kashmir",
  "Jammu and Kashmir":  "Jammu and Kashmir",
  "Jharkhand":          "Jharkhand",
  "Karnataka":          "Karnataka",
  "Kerala":             "Kerala",
  "Ladakh":             "Ladakh",
  "Lakshadweep":        "Lakshadweep",
  "Madhya Pradesh":     "Madhya Pradesh",
  "Maharashtra":        "Maharashtra",
  "Manipur":            "Manipur",
  "Meghalaya":          "Meghalaya",
  "Mizoram":            "Mizoram",
  "Nagaland":           "Nagaland",
  "Odisha":             "Odisha",
  "Puducherry":         "Puducherry",
  "Punjab":             "Punjab",
  "Rajasthan":          "Rajasthan",
  "Sikkim":             "Sikkim",
  "Tamil Nadu":         "Tamil Nadu",
  "Telangana":          "Telangana",
  "Tripura":            "Tripura",
  "Uttar Pradesh":      "UP",
  "Uttarakhand":        "Uttarakhand",
  "West Bengal":        "West Bengal",
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

  const stateCategoryMap = useMemo(() => {
    const map = {};
    (districtData || []).forEach(d => {
      const state = d.state;
      const cat = d.category;
      if (!map[state]) {
        map[state] = cat;
      } else {
        const existing = PRIORITY.indexOf(map[state]);
        const incoming = PRIORITY.indexOf(cat);
        if (incoming !== -1 && (existing === -1 || incoming < existing)) {
          map[state] = cat;
        }
      }
    });
    return map;
  }, [districtData]);

  const stateDistrictMap = useMemo(() => {
    const map = {};
    (districtData || []).forEach(d => {
      if (!map[d.state]) map[d.state] = [];
      map[d.state].push(d);
    });
    return map;
  }, [districtData]);

  const handleMove = (e) => {
    if (tooltip) setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }));
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
            {({ geographies, error }) => {
              if (error) {
                console.error("Geographies error:", error);
                return <text x={10} y={100} fill="red">Error loading map data.</text>;
              }
              if (!geographies || geographies.length === 0) {
                return null;
              }
              return geographies.map((geo) => {
                const geoName = geo.properties.STNAME_SH || geo.properties.NAME_1 || geo.properties.name || "Unknown";
                const mockStateName = STATE_NAME_MAP[geoName] || geoName;
                const category = stateCategoryMap[mockStateName];
                const cfg = CATEGORY_FILL[category] || CATEGORY_FILL.default;
                const districts = stateDistrictMap[mockStateName] || [];
                const isHovered = tooltip && tooltip.name === geoName;
                const currentFill = isHovered ? (category ? cfg.label : "#2a3d38") : cfg.fill;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => setTooltip({ name: geoName, category, districts, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                    fill={currentFill}
                    stroke={cfg.stroke}
                    strokeWidth={isHovered ? 0.8 : 0.5}
                    style={{
                      default: { outline: "none", transition: "all 0.3s ease" },
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
          borderRadius: 10, padding: "8px 12px", pointerEvents: "none", minWidth: 140, maxWidth: 220,
          backdropFilter: "blur(12px)",
        }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{tooltip.name}</p>
          {tooltip.category ? (
            <>
              <p style={{ margin: "0 0 6px", fontSize: 10, color: CATEGORY_FILL[tooltip.category]?.label || "#94a3b8" }}>Max intensity: {tooltip.category}</p>
              {tooltip.districts.slice(0, 3).map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 10, color: "#64748b", marginTop: 2 }}>
                  <span>{d.district}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#2dd4bf" }}>{d.corrected} mm</span>
                </div>
              ))}
              {tooltip.districts.length > 3 && (
                <p style={{ fontSize: 9, color: "#475569", marginTop: 3 }}>+{tooltip.districts.length - 3} more districts</p>
              )}
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
