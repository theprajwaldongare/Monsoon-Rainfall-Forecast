import React, { useState, useEffect, useRef } from "react";
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { getForecastData } from "../data/mockData";
import { TrendingDown, Zap } from "lucide-react";

// ── Earthy palette ──────────────────
const C_RAW  = "#c2714f";   // terracotta
const C_AI   = "#2dd4bf";   // muted teal
const C_OBS  = "#a18c5a";   // warm sand

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(17,22,20,0.96)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(16px)",
        borderRadius: 12,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      <p style={{ fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: "#94a3b8", textTransform: "capitalize" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "#e2e8f0", marginLeft: "auto" }}>{p.value} mm</span>
        </div>
      ))}
    </div>
  );
};

export default function ForecastComparison({ regime }) {
  const [data, setData] = useState([]);
  const [animKey, setAnimKey] = useState(0);
  const [view, setView] = useState("area");
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    setData(getForecastData(regime));
    setAnimKey((k) => k + 1);
  }, [regime]);

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e) => {
    if (!dragging.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    setSliderPos((x / rect.width) * 100);
  };
  const onMouseUp = () => { dragging.current = false; };

  const lastRaw = data[data.length - 1]?.raw || 1;
  const lastCor = data[data.length - 1]?.corrected || 1;
  const improvement = Math.round(((lastRaw - lastCor) / lastRaw) * 100);

  const avgRawBias  = data.length ? Math.round(data.reduce((a, d) => a + (d.raw - d.observed), 0) / data.length) : 0;
  const avgAiBias   = data.length ? Math.round(data.reduce((a, d) => a + (d.corrected - d.observed), 0) / data.length) : 0;

  return (
    <div className="glass rounded-2xl p-6 fade-slide-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={16} style={{ color: "#2dd4bf" }} />
            Forecast Comparison
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>Raw NWP vs. AI Bias-Corrected (mm, 0–72 h)</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Improvement badge */}
          <span style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 11, fontWeight: 600,
            padding: "5px 12px", borderRadius: 999,
            background: "rgba(110,231,183,0.08)",
            color: "#6ee7b7",
            border: "1px solid rgba(110,231,183,0.18)",
          }}>
            <TrendingDown size={12} />
            {improvement}% bias reduction
          </span>

          {/* View toggle */}
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, overflow: "hidden" }}>
            {["area", "split"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  background: view === v ? "rgba(45,212,191,0.12)" : "transparent",
                  color: view === v ? "#2dd4bf" : "#64748b",
                  border: "none",
                  outline: "none",
                  transition: "background 0.18s ease, color 0.18s ease",
                }}
              >
                {v === "area" ? "Overlay" : "Split Slider"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      {view === "area" ? (
        <ResponsiveContainer width="100%" height={280} key={animKey}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gRaw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C_RAW} stopOpacity={0.28} />
                <stop offset="95%" stopColor={C_RAW} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C_AI} stopOpacity={0.25} />
                <stop offset="95%" stopColor={C_AI} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gObs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C_OBS} stopOpacity={0.18} />
                <stop offset="95%" stopColor={C_OBS} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} unit=" mm" />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#64748b" }}
              formatter={(v) =>
                v === "raw" ? "Raw NWP" :
                v === "corrected" ? "AI Corrected" : "Observed"
              }
            />
            <Area type="monotone" dataKey="raw" stroke={C_RAW} strokeWidth={2}
              fill="url(#gRaw)" dot={false} activeDot={{ r: 5, fill: C_RAW }} />
            <Area type="monotone" dataKey="corrected" stroke={C_AI} strokeWidth={2.5}
              fill="url(#gAI)" dot={false} activeDot={{ r: 5, fill: C_AI }} />
            <Area type="monotone" dataKey="observed" stroke={C_OBS} strokeWidth={1.5}
              fill="url(#gObs)" dot={false} strokeDasharray="5 3"
              activeDot={{ r: 5, fill: C_OBS }} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div
          ref={sliderRef}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 14,
            height: 280,
            cursor: "col-resize",
            userSelect: "none",
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Raw side */}
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            justifyContent: "flex-end", padding: 16,
            background: `rgba(194,113,79,0.06)`,
          }}>
            <p style={{ textAlign: "right", fontSize: 11, color: C_RAW, fontWeight: 600, marginBottom: 8 }}>Raw NWP</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 190 }}>
              {data.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{
                    width: "100%", borderRadius: "3px 3px 0 0",
                    height: `${(d.raw / 230) * 100}%`,
                    background: C_RAW, opacity: 0.55, transition: "height 0.7s ease",
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* AI side (clipped) */}
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            justifyContent: "flex-end", padding: 16,
            background: `rgba(45,212,191,0.06)`,
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          }}>
            <p style={{ fontSize: 11, color: C_AI, fontWeight: 600, marginBottom: 8 }}>AI Bias-Corrected</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 190 }}>
              {data.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{
                    width: "100%", borderRadius: "3px 3px 0 0",
                    height: `${(d.corrected / 230) * 100}%`,
                    background: C_AI, opacity: 0.65, transition: "height 0.7s ease",
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Divider handle */}
          <div
            style={{
              position: "absolute", top: 0, bottom: 0,
              left: `${sliderPos}%`, transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}
            onMouseDown={onMouseDown}
          >
            <div style={{ width: 1, height: "100%", background: "rgba(255,255,255,0.2)" }} />
            <div style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)", cursor: "col-resize",
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M4 7H1M10 7h3M4 4L1 7l3 3M10 4l3 3-3 3" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
        {[
          { label: "Avg Raw Bias", value: `+${avgRawBias} mm`, color: C_RAW },
          { label: "Avg AI Error", value: `+${avgAiBias} mm`, color: C_AI },
          { label: "Lead Time", value: "0–72 h", color: C_OBS },
        ].map((s) => (
          <div key={s.label} style={{
            borderRadius: 12, padding: "12px 14px", textAlign: "center",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#475569" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
