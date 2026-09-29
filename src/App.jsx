import React, { useState, useEffect } from "react";
import { REGIMES } from "./data/mockData";
import RegimeSelector from "./components/RegimeSelector";
import ForecastComparison from "./components/ForecastComparison";
import AlertsSection from "./components/AlertsSection";
import DistrictTable from "./components/DistrictTable";
import VerificationSection from "./components/VerificationSection";
import {
  CloudRain, Sun, Wind, Mountain,
  Activity, Satellite, Clock, RefreshCw,
  Database, Cpu
} from "lucide-react";

const iconMap = { CloudRain, Sun, Wind, Mountain };

// ── Animated rain drops background ─────────────────────────
function RainBackground({ color }) {
  const drops = Array.from({ length: 24 }, (_, i) => ({
    left: `${(i * 4.2 + Math.sin(i) * 3) % 100}%`,
    delay: `${(i * 0.18) % 2}s`,
    dur: `${1.4 + (i % 5) * 0.3}s`,
    opacity: 0.04 + (i % 4) * 0.015,
    height: 8 + (i % 5) * 4,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {drops.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.left,
            top: "-20px",
            width: 1.5,
            height: d.height,
            borderRadius: 2,
            background: `linear-gradient(to bottom, transparent, ${color})`,
            opacity: d.opacity,
            animation: `rainDrop ${d.dur} linear ${d.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── KPI stat cards across header ───────────────────────────
function KpiCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div
      className="glass rounded-2xl px-5 py-4 flex items-center gap-4 glass-hover"
      style={{ borderColor: `${color}33` }}
    >
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </span>
      <div>
        <p className="text-xl font-bold text-white leading-tight">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
        {sub && <p className="text-xs font-medium mt-0.5" style={{ color }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function App() {
  const [regime, setRegime] = useState("active_monsoon");
  const [time, setTime] = useState(new Date());
  const [transitioning, setTransitioning] = useState(false);

  const currentRegime = REGIMES.find((r) => r.id === regime);
  const Icon = iconMap[currentRegime.icon] || Activity;

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Transition animation on regime change
  const handleRegimeChange = (id) => {
    setTransitioning(true);
    setTimeout(() => {
      setRegime(id);
      setTransitioning(false);
    }, 200);
  };

  const timeStr = time.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const dateStr = time.toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `radial-gradient(ellipse 70% 45% at 50% -10%, ${currentRegime.color}12, transparent), #111614`,
        transition: "background 0.9s ease",
      }}
    >
      <RainBackground color={currentRegime.color} key={regime} />

      {/* ── Topbar ── */}
      <header
        className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: "rgba(17,22,20,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo + title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${currentRegime.color}18`, border: `1px solid ${currentRegime.color}35` }}
          >
            <Icon size={18} style={{ color: currentRegime.color }} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-slate-200 leading-snug truncate max-w-xs sm:max-w-sm">
              Monsoon Rainfall Forecast Dashboard
            </h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">AI Post-Processing · Regime-Aware</p>
          </div>
        </div>

        {/* Centre: status pills */}
        <div className="hidden md:flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: "rgba(45,212,191,0.08)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.18)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#2dd4bf" }} />
            LIVE · IMD GFS T+0
          </span>
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium text-slate-500"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Satellite size={11} />
            INSAT-3DR · MSG-SEVIRI
          </span>
        </div>

        {/* Right: clock + selector */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-mono font-bold text-white">{timeStr} IST</span>
            <span className="text-xs text-slate-500">{dateStr}</span>
          </div>
          <RegimeSelector regime={regime} onChange={handleRegimeChange} />
        </div>
      </header>

      {/* ── Main content ── */}
      <main
        className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(6px)" : "translateY(0)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {/* ── Regime Banner ── */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4"
          style={{
            background: `linear-gradient(135deg, ${currentRegime.color}18, ${currentRegime.color}08)`,
            border: `1px solid ${currentRegime.color}30`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${currentRegime.color}22` }}
            >
              <Icon size={24} style={{ color: currentRegime.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${currentRegime.color}25`, color: currentRegime.color }}
                >
                  ACTIVE REGIME
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{currentRegime.label}</h2>
              <p className="text-sm text-slate-400 mt-0.5 max-w-lg">{currentRegime.description}</p>
            </div>
          </div>

          {/* Quick regime switcher pills */}
          <div className="flex flex-wrap gap-2">
            {REGIMES.map((r) => {
              const RI = iconMap[r.icon] || Activity;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRegimeChange(r.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: r.id === regime ? `${r.color}25` : "rgba(255,255,255,0.05)",
                    color: r.id === regime ? r.color : "#64748b",
                    border: `1px solid ${r.id === regime ? r.color + "50" : "rgba(255,255,255,0.08)"}`,
                    transform: r.id === regime ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <RI size={12} />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard label="Model" value="UNet-MoE" sub="Regime-Gated" color={currentRegime.color} icon={Cpu} />
          <KpiCard label="Base NWP" value="GFS 0.25°" sub="IMD Operational" color="#2dd4bf" icon={Database} />
          <KpiCard label="Latency" value="~4.2 s" sub="GPU Inference" color="#6ee7b7" icon={Activity} />
          <KpiCard label="Valid Time" value="72 h" sub="6-hourly steps" color="#d97706" icon={Clock} />
        </div>

        {/* ── Forecast Comparison ── */}
        <ForecastComparison regime={regime} />

        {/* ── Alerts + Verification side by side on large screens ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <AlertsSection regime={regime} />
          <VerificationSection regime={regime} />
        </div>

        {/* ── District Table ── */}
        <DistrictTable regime={regime} />

        {/* ── Footer ── */}
        <footer className="pt-4 pb-2 flex items-center justify-between flex-wrap gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <RefreshCw size={11} />
            <span>Prototype · Connect IMD / GFS API for live data</span>
          </div>
          <span className="text-xs text-slate-700">Monsoon Rainfall Forecast Dashboard</span>
        </footer>
      </main>
    </div>
  );
}
