import React, { useEffect, useState } from "react";
import { getAlerts } from "../data/mockData";
import { AlertTriangle, ShieldAlert, Bell, CheckCircle2 } from "lucide-react";

// ── Earthy, grounded alert palette ──────────────────────────
const levelConfig = {
  red: {
    bg: "rgba(194, 113, 79, 0.10)",
    border: "rgba(194, 113, 79, 0.30)",
    bar: "#c2714f",
    badgeBg: "rgba(194,113,79,0.12)",
    badgeText: "#e0956e",
    badgeBorder: "rgba(194,113,79,0.25)",
    label: "EXTREMELY HIGH",
    icon: ShieldAlert,
  },
  orange: {
    bg: "rgba(217, 119, 6, 0.10)",
    border: "rgba(217, 119, 6, 0.28)",
    bar: "#d97706",
    badgeBg: "rgba(217,119,6,0.12)",
    badgeText: "#fbbf24",
    badgeBorder: "rgba(217,119,6,0.25)",
    label: "HIGH RISK",
    icon: AlertTriangle,
  },
  yellow: {
    bg: "rgba(161, 140, 90, 0.09)",
    border: "rgba(161, 140, 90, 0.22)",
    bar: "#a18c5a",
    badgeBg: "rgba(161,140,90,0.12)",
    badgeText: "#c8b47a",
    badgeBorder: "rgba(161,140,90,0.22)",
    label: "MODERATE",
    icon: Bell,
  },
  green: {
    bg: "rgba(110, 231, 183, 0.06)",
    border: "rgba(110, 231, 183, 0.16)",
    bar: "#6ee7b7",
    badgeBg: "rgba(110,231,183,0.08)",
    badgeText: "#6ee7b7",
    badgeBorder: "rgba(110,231,183,0.18)",
    label: "LOW",
    icon: CheckCircle2,
  },
};

function AlertCard({ alert, index }) {
  const cfg = levelConfig[alert.level] || levelConfig.green;
  const Icon = cfg.icon;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), index * 70 + 40);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 14,
        padding: "16px",
        opacity: animated ? 1 : 0,
        transform: animated ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.38s ease, transform 0.38s ease",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,       /* crucial: prevents card from blowing out */
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {/* Icon with subtle pulse on extreme */}
          <span style={{ position: "relative", flexShrink: 0, display: "flex" }}>
            <Icon size={15} style={{ color: cfg.bar }} />
            {alert.level === "red" && (
              <span
                className="animate-ping-slow"
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  background: cfg.bar,
                  opacity: 0.25,
                }}
              />
            )}
          </span>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#e2e8f0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {alert.region}
          </span>
        </div>
        {/* Level badge */}
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.04em",
          padding: "3px 8px",
          borderRadius: 999,
          background: cfg.badgeBg,
          color: cfg.badgeText,
          border: `1px solid ${cfg.badgeBorder}`,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Threshold line */}
      <p style={{
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
        color: "#64748b",
        margin: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {alert.threshold}
      </p>

      {/* Probability meter */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>Exceedance Probability</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>{alert.prob}%</span>
        </div>
        <div style={{
          height: 5,
          borderRadius: 999,
          background: "rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            borderRadius: 999,
            background: cfg.bar,
            width: animated ? `${alert.prob}%` : "0%",
            transition: "width 0.7s cubic-bezier(0.4,0,0.2,1) 0.2s",
            opacity: 0.85,
          }} />
        </div>
      </div>
    </div>
  );
}

export default function AlertsSection({ regime }) {
  const [alerts, setAlerts] = useState([]);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAlerts([]);
    const t = setTimeout(() => {
      setAlerts(getAlerts(regime));
      setAnimKey((k) => k + 1);
    }, 100);
    return () => clearTimeout(t);
  }, [regime]);

  const highCount = alerts.filter((a) => a.level === "red" || a.level === "orange").length;

  return (
    <div className="glass rounded-2xl p-6" style={{ minWidth: 0 }}>
      {/* ── Section header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldAlert size={16} style={{ color: "#c2714f" }} />
            Heavy Rainfall Alerts
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
            Operational threshold exceedance probabilities
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 999,
            background: "rgba(194,113,79,0.10)", color: "#e0956e", border: "1px solid rgba(194,113,79,0.22)",
          }}>
            {highCount} High-Risk Zone{highCount !== 1 ? "s" : ""}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 999,
            background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            {alerts.length} Total
          </span>
        </div>
      </div>

      {/* ── Alert grid — uses CSS custom property for stable auto-fill ── */}
      <div
        key={animKey}
        className="alert-grid"
      >
        {alerts.map((alert, i) => (
          <AlertCard key={`${regime}-${i}`} alert={alert} index={i} />
        ))}
        {alerts.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 0", color: "#475569", fontSize: 13 }}>
            Loading alerts…
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <div style={{
        marginTop: 16,
        paddingTop: 14,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 20px",
      }}>
        {Object.entries(levelConfig).map(([lvl, cfg]) => (
          <div key={lvl} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.bar, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#64748b" }}>{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
