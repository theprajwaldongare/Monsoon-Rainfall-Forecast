import React, { useState, useMemo, useEffect } from "react";
import { getDistrictData } from "../data/mockData";
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  MapPin, Table2
} from "lucide-react";
import IndiaMap from "./IndiaMap";

// ── Earthy category palette ──
const categoryColors = {
  "Extremely Heavy": { bg: "rgba(194,113,79,0.12)",  text: "#e0956e", dot: "#c2714f" },
  "Very Heavy":      { bg: "rgba(217,119,6,0.12)",   text: "#fbbf24", dot: "#d97706" },
  "Heavy":           { bg: "rgba(161,140,90,0.12)",  text: "#c8b47a", dot: "#a18c5a" },
  "Moderate":        { bg: "rgba(45,212,191,0.10)",  text: "#2dd4bf", dot: "#1aab9d" },
  "Light":           { bg: "rgba(110,231,183,0.08)", text: "#6ee7b7", dot: "#4cd5a4" },
};

function SortIcon({ field, sort }) {
  if (sort.field !== field) return <ChevronsUpDown size={12} style={{ color: "#475569" }} />;
  return sort.dir === "asc"
    ? <ChevronUp size={12} style={{ color: "#2dd4bf" }} />
    : <ChevronDown size={12} style={{ color: "#2dd4bf" }} />;
}



export default function DistrictTable({ regime }) {
  const [sort, setSort] = useState({ field: "corrected", dir: "desc" });
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const raw = getDistrictData(regime);
  const PER_PAGE = 6;

  useEffect(() => { setPage(0); setAnimKey((k) => k + 1); }, [regime]);

  const toggleSort = (field) => {
    setSort((s) => ({
      field,
      dir: s.field === field ? (s.dir === "asc" ? "desc" : "asc") : "desc",
    }));
    setPage(0);
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return raw.filter(
      (d) => d.district.toLowerCase().includes(q) || d.state.toLowerCase().includes(q)
    );
  }, [raw, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const v = typeof a[sort.field] === "string"
        ? a[sort.field].localeCompare(b[sort.field])
        : a[sort.field] - b[sort.field];
      return sort.dir === "asc" ? v : -v;
    });
  }, [filtered, sort]);

  const pages = Math.ceil(sorted.length / PER_PAGE);
  const pageData = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const cols = [
    { key: "district", label: "District" },
    { key: "state", label: "State" },
    { key: "raw", label: "Raw NWP (mm)" },
    { key: "corrected", label: "AI Corrected (mm)" },
    { key: "bias", label: "Bias (mm)" },
    { key: "category", label: "Category" },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
            <Table2 size={16} style={{ color: "#2dd4bf" }} />
            District-Level Rainfall
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>24-hour accumulated forecast · click headers to sort</p>
        </div>
        <input
          style={{
            fontSize: 13,
            padding: "8px 14px",
            borderRadius: 12,
            color: "#cbd5e1",
            outline: "none",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            width: 200,
          }}
          placeholder="Search district / state…"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(0); }}
        />
      </div>

      {/* Map + Table grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <IndiaMap districtData={raw} />
        </div>

        {/* Table */}
        <div className="lg:col-span-2 overflow-x-auto rounded-xl" key={animKey}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {cols.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: sort.field === col.key ? "#94a3b8" : "#64748b",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {col.label}
                      <SortIcon field={col.key} sort={sort} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, i) => {
                const cat = categoryColors[row.category] || categoryColors["Light"];
                return (
                  <tr
                    key={`${regime}-${row.district}`}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      animation: `fadeSlideIn 0.35s ease ${i * 50}ms both`,
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 500, color: "#e2e8f0", whiteSpace: "nowrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={11} style={{ color: "#475569", flexShrink: 0 }} />
                        {row.district}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#64748b", whiteSpace: "nowrap" }}>{row.state}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#e0956e" }}>{row.raw}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#2dd4bf" }}>{row.corrected}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", color: "#a18c5a" }}>+{row.bias}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        background: cat.bg,
                        color: cat.text,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.dot, flexShrink: 0 }} />
                        {row.category}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
              <span style={{ fontSize: 11, color: "#475569" }}>
                {sorted.length} districts · Page {page + 1} / {pages}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: pages }).map((_, p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: 28, height: 28,
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      border: "none",
                      outline: "none",
                      background: page === p ? "rgba(45,212,191,0.16)" : "rgba(255,255,255,0.04)",
                      color: page === p ? "#2dd4bf" : "#64748b",
                      transition: "background 0.15s ease, color 0.15s ease",
                    }}
                  >
                    {p + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
