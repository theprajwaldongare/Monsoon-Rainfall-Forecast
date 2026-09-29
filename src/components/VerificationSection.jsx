import React, { useEffect, useState } from "react";
import { getVerificationData } from "../data/mockData";
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Tooltip, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Legend, LineChart, Line, ReferenceLine
} from "recharts";
import { BarChart2, RefreshCw } from "lucide-react";

// ── Earthy chart colors ──────────────────────
const C_RAW  = "#c2714f";   // terracotta  → Raw NWP
const C_AI   = "#2dd4bf";   // muted teal  → AI Corrected
const C_OBS  = "#a18c5a";   // warm sand   → Observed

// ── Custom chart tooltip ─────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(17,22,20,0.96)",
      border: "1px solid rgba(255,255,255,0.10)",
      backdropFilter: "blur(16px)",
      borderRadius: 12,
      padding: "10px 14px",
      fontSize: 12,
      minWidth: 140,
    }}>
      <p style={{ fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: "#94a3b8" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "#e2e8f0", marginLeft: "auto" }}>
            {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Individual metric stat card ───────────────
function StatCard({ label, rawValue, aiValue, unit = "", lowerBetter = false }) {
  const improved = lowerBetter ? aiValue < rawValue : aiValue > rawValue;
  const pct = Math.round(Math.abs(((aiValue - rawValue) / (rawValue || 1)) * 100));

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(12px)",
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minWidth: 0,
    }}>
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {label}
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 999,
          background: improved ? "rgba(110,231,183,0.08)" : "rgba(194,113,79,0.10)",
          color: improved ? "#6ee7b7" : "#e0956e",
          letterSpacing: "0.03em",
        }}>
          {improved ? "▼" : "▲"} {pct}%
        </span>
      </div>

      {/* Values row */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 10, color: "#475569" }}>Raw NWP</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C_RAW, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
            {rawValue}
            <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 2, color: "#64748b" }}>{unit}</span>
          </p>
        </div>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 10, color: "#475569" }}>AI Corrected</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C_AI, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
            {aiValue}
            <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 2, color: "#64748b" }}>{unit}</span>
          </p>
        </div>
      </div>

      {/* Mini comparison bar */}
      <div style={{ display: "flex", gap: 4, height: 4 }}>
        <div style={{
          flex: rawValue,
          borderRadius: 2,
          background: C_RAW,
          opacity: 0.55,
        }} />
        <div style={{
          flex: aiValue,
          borderRadius: 2,
          background: C_AI,
          opacity: 0.7,
        }} />
      </div>
    </div>
  );
}

// ── Tab button ───────────────────────────────
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        background: active ? "rgba(45,212,191,0.12)" : "transparent",
        color: active ? "#2dd4bf" : "#64748b",
        border: "none",
        outline: "none",
        transition: "background 0.18s ease, color 0.18s ease",
        borderRadius: 0,
      }}
    >
      {children}
    </button>
  );
}

export default function VerificationSection({ regime }) {
  const [data, setData] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [chartTab, setChartTab] = useState("radar");

  useEffect(() => {
    setData(null);
    const t = setTimeout(() => {
      setData(getVerificationData(regime));
      setAnimKey((k) => k + 1);
    }, 150);
    return () => clearTimeout(t);
  }, [regime]);

  if (!data) {
    return (
      <div className="glass rounded-2xl" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 192 }}>
        <RefreshCw size={22} style={{ color: "#334155" }} className="animate-spin" />
      </div>
    );
  }

  const radarData = data.scores.map((s) => ({
    metric: s.metric,
    Raw: s.metric === "FAR" ? +(1 - s.raw).toFixed(2) : s.raw,
    AI:  s.metric === "FAR" ? +(1 - s.corrected).toFixed(2) : s.corrected,
    fullMark: 1,
  }));

  const barData = data.scores.map((s) => ({
    metric: s.metric,
    "Raw NWP":      s.raw,
    "AI Corrected": s.corrected,
  }));

  return (
    <div className="glass rounded-2xl" style={{ padding: 24, minWidth: 0 }}>

      {/* ── Section header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart2 size={16} style={{ color: "#2dd4bf" }} />
            Verification & Skill Report
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
            Model accuracy metrics vs. station observations
          </p>
        </div>

        {/* Tab group */}
        <div style={{
          display: "flex",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <TabBtn active={chartTab === "radar"} onClick={() => setChartTab("radar")}>Radar</TabBtn>
          <TabBtn active={chartTab === "bar"}   onClick={() => setChartTab("bar")}>Scores</TabBtn>
          <TabBtn active={chartTab === "rmse"}  onClick={() => setChartTab("rmse")}>RMSE</TabBtn>
        </div>
      </div>

      {/* ── Summary stat cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
        gap: 12,
        marginBottom: 22,
      }}>
        <StatCard
          label="RMSE"
          rawValue={data.summary.rmse_raw}
          aiValue={data.summary.rmse_corrected}
          unit="mm"
          lowerBetter
        />
        <StatCard
          label="Mean Bias"
          rawValue={data.summary.bias_raw}
          aiValue={data.summary.bias_corrected}
          unit="mm"
          lowerBetter
        />
        <StatCard
          label="POD"
          rawValue={data.scores[2].raw}
          aiValue={data.scores[2].corrected}
        />
        <StatCard
          label="CSI"
          rawValue={data.scores[1].raw}
          aiValue={data.scores[1].corrected}
        />
      </div>

      {/* ── Chart area ── */}
      <div key={animKey}>
        {chartTab === "radar" && (
          <ResponsiveContainer width="100%" height={272}>
            <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              />
              <Radar
                name="Raw NWP"
                dataKey="Raw"
                stroke={C_RAW}
                fill={C_RAW}
                fillOpacity={0.14}
                strokeWidth={2}
              />
              <Radar
                name="AI Corrected"
                dataKey="AI"
                stroke={C_AI}
                fill={C_AI}
                fillOpacity={0.18}
                strokeWidth={2.5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {chartTab === "bar" && (
          <>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 1]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                <Bar dataKey="Raw NWP"      fill={C_RAW} opacity={0.72} radius={[5, 5, 0, 0]} />
                <Bar dataKey="AI Corrected" fill={C_AI}  opacity={0.82} radius={[5, 5, 0, 0]} />
                <ReferenceLine
                  y={0.5}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="5 3"
                  label={{ value: "Skill threshold", fill: "#475569", fontSize: 10, position: "insideTopRight" }}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Metric legend */}
            <div style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
              gap: 8,
            }}>
              {data.scores.map((s) => (
                <div key={s.metric} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "8px 12px",
                }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C_AI,
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                    paddingTop: 1,
                    minWidth: 32,
                  }}>
                    {s.metric}
                  </span>
                  <span style={{ fontSize: 11, color: "#64748b", lineHeight: 1.45 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {chartTab === "rmse" && (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.daily} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} unit=" mm" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
              <Line
                type="monotone" dataKey="raw" name="Raw RMSE"
                stroke={C_RAW} strokeWidth={2}
                dot={{ r: 4, fill: C_RAW, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone" dataKey="corrected" name="AI RMSE"
                stroke={C_AI} strokeWidth={2.5}
                dot={{ r: 4, fill: C_AI, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone" dataKey="obs" name="Observed"
                stroke={C_OBS} strokeWidth={1.5}
                strokeDasharray="5 3" dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
