// resources/js/Pages/StatementsPage.jsx
import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
  FileText, TrendingUp, TrendingDown, Download,
  Calendar, ArrowUpRight, ArrowDownRight, Minus,
  Users, BarChart2, PieChart, ChevronDown, Filter
} from "lucide-react";
import Sidebar from "@/Layouts/Sidebar";
import NavbarIn from "@/Layouts/NavbarIn";
import GroupSelectorBar from "@/Components/Relation/GroupSelectorBar";

/* ─── helpers ────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n || 0);

const fmtShort = (n) => {
  const abs = Math.abs(n || 0);
  if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "M";
  if (abs >= 1_000_000)     return (n / 1_000_000).toFixed(1) + "jt";
  if (abs >= 1_000)         return (n / 1_000).toFixed(0) + "rb";
  return String(n);
};

const PRESETS = [
  { key: "today",        label: "Hari Ini" },
  { key: "this_week",    label: "Minggu Ini" },
  { key: "this_month",   label: "Bulan Ini" },
  { key: "last_3_months",label: "3 Bulan Lalu" },
  { key: "this_year",    label: "Tahun Ini" },
  { key: "custom",       label: "Kustom" },
];

/* ─── Mini Bar Chart ─────────────────────────────────── */
function BarChart({ data }) {
  if (!data?.length) return <div className="text-center text-sm text-black/40 py-8 font-bold">Tidak ada data</div>;
  const maxVal = Math.max(...data.map(d => Math.max(d.pemasukan, d.pengeluaran)), 1);
  return (
    <div className="flex items-end gap-2 h-36 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <div className="w-full flex gap-0.5 items-end" style={{ height: "100px" }}>
            <div className="flex-1 bg-green-400 border border-green-600 rounded-t transition-all"
                 style={{ height: `${(d.pemasukan / maxVal) * 100}%`, minHeight: d.pemasukan > 0 ? "2px" : "0" }} />
            <div className="flex-1 bg-red-400 border border-red-600 rounded-t transition-all"
                 style={{ height: `${(d.pengeluaran / maxVal) * 100}%`, minHeight: d.pengeluaran > 0 ? "2px" : "0" }} />
          </div>
          <span className="text-[9px] font-bold text-black/50 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Donut Chart (SVG) ──────────────────────────────── */
function DonutChart({ data }) {
  if (!data?.length) return <div className="text-center text-sm text-black/40 py-8 font-bold">Tidak ada data pengeluaran per kategori</div>;

  const total = data.reduce((s, d) => s + d.total, 0);
  const radius = 60, cx = 80, cy = 80;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = data.slice(0, 8).map((d, i) => {
    const pct = d.total / total;
    const dash = pct * circumference;
    const seg = { ...d, dash, offset, pct };
    offset += dash;
    return seg;
  });

  const palette = ["#EF4444","#F59E0B","#3B82F6","#10B981","#8B5CF6","#EC4899","#06B6D4","#84CC16"];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-36 h-36 flex-shrink-0 -rotate-90">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={22} />
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
            stroke={s.category_color || palette[i % palette.length]}
            strokeWidth={22}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
          />
        ))}
        <circle cx={cx} cy={cy} r={48} fill="white" />
      </svg>
      <div className="flex-1 space-y-1.5 w-full">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0 border border-black"
                 style={{ background: s.category_color || palette[i % palette.length] }} />
            <span className="text-xs font-bold text-black flex-1 truncate">{s.category_name}</span>
            <span className="text-xs font-black text-black">{s.percent?.toFixed(1)}%</span>
            <span className="text-xs font-bold text-black/50 hidden sm:block">{fmt(s.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function StatementsPage({
  auth, relation, relations = [], period, summary, byCategory = [], byMonth = [], byMember = [], isOwner
}) {
  const { props } = usePage();
  const allRelations = relations.length > 0 ? relations : (props.userRelations || []);
  const [activePreset, setActivePreset] = useState(period.preset || "this_month");
  const [customStart, setCustomStart] = useState(period.start_date || "");
  const [customEnd, setCustomEnd] = useState(period.end_date || "");
  const [showCustom, setShowCustom] = useState(period.preset === "custom");
  const [activeView, setActiveView] = useState("chart"); // chart | member

  const applyFilter = (preset, start, end) => {
    const params = { preset };
    if (preset === "custom" && start && end) { params.start_date = start; params.end_date = end; }
    router.get(route("statements.index", relation.id), params, { preserveState: true });
  };

  const handlePreset = (key) => {
    setActivePreset(key);
    setShowCustom(key === "custom");
    if (key !== "custom") applyFilter(key);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) applyFilter("custom", customStart, customEnd);
  };

  const surplus = summary.surplus || 0;
  const surplusPositive = surplus >= 0;

  return (
    <>
      <Head title={`Laporan - ${relation.nama}`} />
      <div className="min-h-screen h-screen flex flex-col bg-[#C8F5C8]">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-w-0 px-4 sm:px-6 py-6 lg:px-10 lg:py-8">

            {/* Group Selector Bar */}
            <GroupSelectorBar
              relations={allRelations}
              currentRelation={relation}
              routeBase="statements.index"
            />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-[#7c98ff] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                    <FileText size={16} className="text-white stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black text-black/60 uppercase tracking-widest">{relation.nama}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-serif font-black text-black leading-tight"
                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}>
                  Laporan Keuangan
                </h1>
                <p className="text-black/70 text-sm mt-1 font-bold">Analisis arus kas dan transparansi keuangan grup</p>
              </div>
              <a
                href={route("statements.export-csv", [relation.id]) + `?preset=${activePreset}${activePreset === "custom" ? `&start_date=${customStart}&end_date=${customEnd}` : ""}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-black bg-black hover:bg-gray-800 text-white font-black text-sm shadow-[3px_3px_0px_0px_#555] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Download size={16} className="stroke-[2.5]" /> Export CSV
              </a>
            </div>

            {/* Filter Preset Tabs */}
            <div className="mb-5 bg-white border-2 border-black rounded-2xl p-3 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={14} className="text-black/50 flex-shrink-0" />
                {PRESETS.map(p => (
                  <button key={p.key} onClick={() => handlePreset(p.key)}
                    className={`px-3 py-1 rounded-full border-2 border-black font-black text-xs transition-all ${activePreset === p.key ? "bg-black text-white shadow-[2px_2px_0px_0px_#555]" : "bg-white text-black hover:bg-gray-100"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
              {showCustom && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                    className="px-3 py-1.5 border-2 border-black rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_#000] focus:outline-none" />
                  <span className="font-black text-xs">s/d</span>
                  <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                    className="px-3 py-1.5 border-2 border-black rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_#000] focus:outline-none" />
                  <button onClick={handleCustomApply}
                    className="px-4 py-1.5 rounded-full border-2 border-black bg-[#7c98ff] hover:bg-blue-400 font-black text-xs shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
                    Terapkan
                  </button>
                </div>
              )}
              <div className="mt-2 text-[11px] font-bold text-black/40">
                Periode: {period.start_date} — {period.end_date}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: "Total Pemasukan", value: fmt(summary.total_pemasukan),
                  icon: TrendingUp, color: "#10B981", textColor: "text-green-700",
                  bg: "bg-green-50", border: "border-green-300"
                },
                {
                  label: "Total Pengeluaran", value: fmt(summary.total_pengeluaran),
                  icon: TrendingDown, color: "#EF4444", textColor: "text-red-700",
                  bg: "bg-red-50", border: "border-red-300"
                },
                {
                  label: surplusPositive ? "Surplus" : "Defisit",
                  value: fmt(Math.abs(surplus)),
                  icon: surplusPositive ? ArrowUpRight : ArrowDownRight,
                  color: surplusPositive ? "#3B82F6" : "#F59E0B",
                  textColor: surplusPositive ? "text-blue-700" : "text-orange-700",
                  bg: surplusPositive ? "bg-blue-50" : "bg-orange-50",
                  border: surplusPositive ? "border-blue-300" : "border-orange-300"
                },
                {
                  label: "Saldo Kumulatif", value: fmt(summary.saldo_kumulatif),
                  icon: Minus, color: "#8B5CF6", textColor: "text-purple-700",
                  bg: "bg-purple-50", border: "border-purple-300"
                },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} border-2 ${s.border} border-opacity-60 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] border-black`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-black/60 mb-1">{s.label}</p>
                      <p className={`font-black text-lg leading-tight ${s.textColor}`}>{s.value}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0"
                         style={{ background: s.color }}>
                      <s.icon size={18} className="text-white stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 mb-4">
              {[
                { key: "chart", label: "Grafik & Kategori", icon: BarChart2 },
                { key: "member", label: "Per Anggota", icon: Users },
              ].map(v => (
                <button key={v.key} onClick={() => setActiveView(v.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black font-black text-sm transition-all ${activeView === v.key ? "bg-black text-white shadow-[3px_3px_0px_0px_#555]" : "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000]"}`}>
                  <v.icon size={14} className="stroke-[2.5]" /> {v.label}
                </button>
              ))}
            </div>

            {activeView === "chart" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Bar Chart */}
                <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 size={18} className="stroke-[2.5]" />
                    <h3 className="font-black text-base text-black">Tren Pemasukan & Pengeluaran</h3>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold">
                      <div className="w-3 h-3 rounded bg-green-400 border border-green-600" /> Pemasukan
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold">
                      <div className="w-3 h-3 rounded bg-red-400 border border-red-600" /> Pengeluaran
                    </span>
                  </div>
                  <BarChart data={byMonth} />
                  {byMonth.length === 0 && (
                    <div className="text-center py-8 text-sm text-black/40 font-bold">Tidak ada data di periode ini</div>
                  )}
                </div>

                {/* Donut Chart */}
                <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart size={18} className="stroke-[2.5]" />
                    <h3 className="font-black text-base text-black">Distribusi Pengeluaran</h3>
                  </div>
                  <DonutChart data={byCategory} />
                </div>
              </div>
            ) : (
              /* Member Breakdown */
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                <div className="px-5 py-4 border-b-2 border-black bg-gray-50 flex items-center gap-2">
                  <Users size={18} className="stroke-[2.5]" />
                  <h3 className="font-black text-base text-black">Kontribusi Per Anggota</h3>
                </div>
                {byMember.length === 0 ? (
                  <div className="text-center py-12 text-sm text-black/40 font-bold">Tidak ada transaksi di periode ini</div>
                ) : (
                  <div className="divide-y-2 divide-black">
                    {byMember.map((m, i) => (
                      <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 rounded-full border-2 border-black bg-[#7c98ff] flex items-center justify-center font-black text-white text-sm flex-shrink-0 shadow-[2px_2px_0px_0px_#000]">
                          {m.user_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-sm text-black">{m.user_name || "Unknown"}</div>
                          <div className="flex gap-3 mt-0.5">
                            <span className="text-[11px] font-bold text-green-700 flex items-center gap-1">
                              <ArrowUpRight size={10} /> {fmt(m.pemasukan)}
                            </span>
                            <span className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                              <ArrowDownRight size={10} /> {fmt(m.pengeluaran)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-black text-sm ${(m.pemasukan - m.pengeluaran) >= 0 ? "text-green-700" : "text-red-700"}`}>
                            {(m.pemasukan - m.pengeluaran) >= 0 ? "+" : ""}{fmt(m.pemasukan - m.pengeluaran)}
                          </div>
                          <div className="text-[10px] font-bold text-black/40">net</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
