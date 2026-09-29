import React, { useState, useEffect, useRef } from "react";
import { REGIMES } from "../data/mockData";
import {
  CloudRain, Sun, Wind, Mountain,
  ChevronDown, Activity
} from "lucide-react";

const iconMap = { CloudRain, Sun, Wind, Mountain };

export default function RegimeSelector({ regime, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = REGIMES.find((r) => r.id === regime);
  const Icon = iconMap[current.icon] || Activity;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative z-50">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 px-5 py-3 rounded-2xl glass glass-hover cursor-pointer select-none transition-all duration-300"
        style={{ border: `1px solid ${current.color}55` }}
      >
        <span
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: `${current.color}22` }}
        >
          <Icon size={18} style={{ color: current.color }} />
        </span>
        <span className="flex flex-col items-start">
          <span className="text-xs text-slate-400 leading-none mb-0.5">Weather Regime</span>
          <span className="text-sm font-semibold text-white">{current.label}</span>
        </span>
        <ChevronDown
          size={16}
          className="text-slate-400 ml-2 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full mt-2 right-0 w-80 rounded-2xl overflow-hidden shadow-2xl fade-slide-in"
          style={{
            background: "rgba(10,15,30,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(24px)",
          }}
        >
          {REGIMES.map((r) => {
            const RIcon = iconMap[r.icon] || Activity;
            const active = r.id === regime;
            return (
              <button
                key={r.id}
                onClick={() => { onChange(r.id); setOpen(false); }}
                className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-200 cursor-pointer"
                style={{
                  background: active ? `${r.color}18` : "transparent",
                  borderLeft: active ? `3px solid ${r.color}` : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = `${r.color}10`;
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg mt-0.5 shrink-0"
                  style={{ background: `${r.color}22` }}
                >
                  <RIcon size={15} style={{ color: r.color }} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{r.label}</span>
                  <span className="block text-xs text-slate-400 mt-0.5 leading-snug">{r.description}</span>
                </span>
                {active && (
                  <span className="ml-auto mt-1 w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
