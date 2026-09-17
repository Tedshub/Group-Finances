// resources/js/Pages/BudgetingPage.jsx
import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
  Wallet, Plus, Trash2, X, Check, AlertTriangle,
  TrendingUp, ShieldCheck, Flame, ChevronLeft, ChevronRight
} from "lucide-react";
import Sidebar from "@/Layouts/Sidebar";
import NavbarIn from "@/Layouts/NavbarIn";
import GroupSelectorBar from "@/Components/Relation/GroupSelectorBar";

/* ─── helpers ────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n || 0);

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

/* ─── Budget Status Meter ────────────────────────────── */
function BudgetMeter({ pct, status }) {
  const bar = status === "overbudget"
    ? "bg-red-500" : status === "warning"
    ? "bg-orange-400" : "bg-green-500";
  return (
    <div className="w-full h-2.5 bg-gray-200 rounded-full border border-black overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

/* ─── Budget Card ────────────────────────────────────── */
function BudgetCard({ budget, onDelete, isOwner }) {
  const pct = budget.usage_percent ?? 0;
  const status = budget.budget_status ?? "safe";

  const statusConfig = {
    safe:       { badge: "Aman",      cls: "bg-green-100 text-green-800 border-green-400",   icon: ShieldCheck, barCls: "text-green-700" },
    warning:    { badge: "Waspada",   cls: "bg-orange-100 text-orange-800 border-orange-400", icon: AlertTriangle, barCls: "text-orange-700" },
    overbudget: { badge: "Melebihi!", cls: "bg-red-100 text-red-800 border-red-400",         icon: Flame, barCls: "text-red-700" },
  };

  const cfg = statusConfig[status] || statusConfig.safe;
  const StatusIcon = cfg.icon;

  return (
    <div className={`bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all ${status === "overbudget" ? "border-red-400" : status === "warning" ? "border-orange-400" : ""}`}>
      <div className="p-4">
        {/* Category header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]"
                 style={{ background: budget.category?.color || "#6B7280" }}>
              <span className="text-white text-xs font-black">{(budget.category?.name || "?")[0].toUpperCase()}</span>
            </div>
            <div>
              <div className="font-black text-sm text-black">{budget.category?.name || "Kategori"}</div>
              <div className={`text-[10px] font-black px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${cfg.cls}`}>
                <StatusIcon size={10} className="stroke-[2.5]" /> {cfg.badge}
              </div>
            </div>
          </div>
          {isOwner && (
            <button onClick={() => onDelete(budget)}
              className="p-1.5 rounded-full border-2 border-black bg-white hover:bg-red-100 shadow-[1px_1px_0px_0px_#000] active:shadow-none transition-all">
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Amounts */}
        <div className="mb-2">
          <div className="flex justify-between items-end mb-1">
            <div>
              <div className="text-[10px] font-bold text-black/50">Terpakai</div>
              <div className={`font-black text-lg ${cfg.barCls}`}>{fmt(budget.realisasi_amount ?? 0)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-black/50">Anggaran</div>
              <div className="font-black text-lg text-black">{fmt(budget.amount)}</div>
            </div>
          </div>
          <BudgetMeter pct={pct} status={status} />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs font-black ${cfg.barCls}`}>{pct.toFixed(1)}%</span>
            <span className="text-xs font-bold text-black/50">
              {budget.sisa_budget >= 0 ? `Sisa ${fmt(budget.sisa_budget)}` : `Lebih ${fmt(Math.abs(budget.sisa_budget))}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ show, title, onClose, children }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_#000] w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#C8F5C8] rounded-t-3xl">
          <h3 className="font-black text-black text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full border-2 border-black bg-white hover:bg-red-100 shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[2px_2px_0px_0px_#000]";

/* ─── Main Page ───────────────────────────────────────── */
export default function BudgetingPage({
  auth, relation, relations = [], budgets = [], availableCategories = [],
  period, summary, isOwner
}) {
  const { props } = usePage();
  const flash = props.flash || {};
  const allRelations = relations.length > 0 ? relations : (props.userRelations || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  React.useEffect(() => {
    if (flash.success) showToast(flash.success);
    if (flash.error) showToast(flash.error, "error");
  }, [flash.success, flash.error]);

  const goToPeriod = (dir) => {
    let m = period.month + dir;
    let y = period.year;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    router.get(route("budgeting.index", relation.id), { month: m, year: y }, { preserveState: true });
  };

  const addForm = useForm({
    category_id: "", amount: "",
    month: period.month, year: period.year,
  });

  const handleAdd = (e) => {
    e.preventDefault();
    addForm.post(route("budgeting.store", relation.id), {
      onSuccess: () => { addForm.reset(); setShowAddModal(false); },
    });
  };

  const handleDelete = () => {
    router.delete(route("budgeting.destroy", [relation.id, deleteTarget.id]), {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const overBudgetCount = budgets.filter(b => b.budget_status === "overbudget").length;
  const warningCount = budgets.filter(b => b.budget_status === "warning").length;

  return (
    <>
      <Head title={`Penganggaran - ${relation.nama}`} />
      <div className="min-h-screen h-screen flex flex-col bg-[#C8F5C8]">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-w-0 px-4 sm:px-6 py-6 lg:px-10 lg:py-8">

            {/* Toast */}
            {toast && (
              <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] font-black text-sm ${toast.type === "error" ? "bg-red-200" : "bg-green-200"}`}>
                {toast.type === "error" ? <AlertTriangle size={16} /> : <Check size={16} />} {toast.msg}
              </div>
            )}

            {/* Group Selector Bar */}
            <GroupSelectorBar
              relations={allRelations}
              currentRelation={relation}
              routeBase="budgeting.index"
            />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B7A] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                    <Wallet size={16} className="text-white stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black text-black/60 uppercase tracking-widest">{relation.nama}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-serif font-black text-black leading-tight"
                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}>
                  Penganggaran
                </h1>
                <p className="text-black/70 text-sm mt-1 font-bold">Pantau anggaran vs realisasi pengeluaran grup</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={availableCategories.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-black bg-[#FF6B7A] hover:bg-red-400 text-black font-black text-sm shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} className="stroke-[3]" /> Tambah Anggaran
                </button>
              )}
            </div>

            {/* Period Selector */}
            <div className="flex items-center justify-between mb-5 bg-white border-2 border-black rounded-2xl p-3 shadow-[3px_3px_0px_0px_#000]">
              <button onClick={() => goToPeriod(-1)}
                className="p-2 rounded-full border-2 border-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="font-black text-xl text-black">
                {MONTHS[period.month - 1]} {period.year}
              </h2>
              <button onClick={() => goToPeriod(1)}
                className="p-2 rounded-full border-2 border-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Anggaran", value: fmt(summary.total_budget), cls: "border-l-4 border-l-blue-400" },
                { label: "Total Terpakai", value: fmt(summary.total_realisasi), cls: "border-l-4 border-l-orange-400" },
                { label: "Sisa Anggaran", value: fmt(summary.total_sisa), cls: `border-l-4 ${summary.total_sisa >= 0 ? "border-l-green-400" : "border-l-red-400"}` },
                { label: "Pemakaian", value: `${summary.usage_percent?.toFixed(1) || 0}%`, cls: "border-l-4 border-l-purple-400" },
              ].map((s, i) => (
                <div key={i} className={`bg-white border-2 border-black rounded-2xl p-3 shadow-[3px_3px_0px_0px_#000] ${s.cls}`}>
                  <div className="text-[11px] font-bold text-black/50">{s.label}</div>
                  <div className="font-black text-base text-black mt-0.5 leading-tight">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Alert banners */}
            {overBudgetCount > 0 && (
              <div className="mb-4 flex items-center gap-3 bg-red-100 border-2 border-red-400 rounded-2xl px-4 py-3 shadow-[3px_3px_0px_0px_#EF4444]">
                <Flame size={20} className="text-red-600 flex-shrink-0" />
                <p className="font-black text-sm text-red-800">
                  {overBudgetCount} kategori melebihi anggaran bulan ini!
                </p>
              </div>
            )}
            {warningCount > 0 && (
              <div className="mb-4 flex items-center gap-3 bg-orange-100 border-2 border-orange-400 rounded-2xl px-4 py-3 shadow-[3px_3px_0px_0px_#F97316]">
                <AlertTriangle size={20} className="text-orange-600 flex-shrink-0" />
                <p className="font-black text-sm text-orange-800">
                  {warningCount} kategori hampir melebihi anggaran (&gt;70%)
                </p>
              </div>
            )}

            {/* Overall progress */}
            {budgets.length > 0 && (
              <div className="mb-6 bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-black flex items-center gap-2">
                    <TrendingUp size={16} /> Total Pemakaian Anggaran
                  </span>
                  <span className={`font-black text-sm ${summary.usage_percent >= 100 ? "text-red-600" : summary.usage_percent >= 70 ? "text-orange-600" : "text-green-600"}`}>
                    {summary.usage_percent?.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full border border-black overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${summary.usage_percent >= 100 ? "bg-red-500" : summary.usage_percent >= 70 ? "bg-orange-400" : "bg-green-500"}`}
                    style={{ width: `${Math.min(100, summary.usage_percent || 0)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Budget Cards Grid */}
            {budgets.length === 0 ? (
              <div className="text-center py-16 bg-white/60 border-2 border-black border-dashed rounded-3xl">
                <Wallet size={48} className="mx-auto mb-4 text-black/30 stroke-[1.5]" />
                <p className="font-black text-black/50 text-lg">Belum ada anggaran di periode ini</p>
                {isOwner && <p className="font-bold text-black/40 text-sm mt-1">Klik "Tambah Anggaran" untuk mulai mengalokasikan budget</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {budgets.map(b => (
                  <BudgetCard key={b.id} budget={b} onDelete={setDeleteTarget} isOwner={isOwner} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Add Budget Modal */}
      <Modal show={showAddModal} title="💳 Tambah Anggaran" onClose={() => { setShowAddModal(false); addForm.reset(); }}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-black mb-1">Kategori *</label>
            <select className={inputCls} value={addForm.data.category_id} onChange={e => addForm.setData("category_id", e.target.value)}>
              <option value="">Pilih kategori…</option>
              {availableCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {addForm.errors.category_id && <p className="text-red-600 text-xs font-bold mt-1">{addForm.errors.category_id}</p>}
          </div>
          <div>
            <label className="block text-xs font-black text-black mb-1">Plafon Anggaran (Rp) *</label>
            <input className={inputCls} type="number" min={0} value={addForm.data.amount} onChange={e => addForm.setData("amount", e.target.value)} placeholder="2500000" />
            {addForm.errors.amount && <p className="text-red-600 text-xs font-bold mt-1">{addForm.errors.amount}</p>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-black text-black mb-1">Bulan *</label>
              <select className={inputCls} value={addForm.data.month} onChange={e => addForm.setData("month", parseInt(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-black text-black mb-1">Tahun *</label>
              <input className={inputCls} type="number" min={2020} max={2099} value={addForm.data.year} onChange={e => addForm.setData("year", parseInt(e.target.value))} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowAddModal(false); addForm.reset(); }}
              className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-white hover:bg-gray-100 font-black text-sm shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
              Batal
            </button>
            <button type="submit" disabled={addForm.processing}
              className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-[#FF6B7A] hover:bg-red-400 font-black text-sm shadow-[3px_3px_0px_0px_#000] active:shadow-none transition-all disabled:opacity-60">
              {addForm.processing ? "Menyimpan…" : "Simpan Anggaran"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal show={!!deleteTarget} title="🗑️ Hapus Anggaran?" onClose={() => setDeleteTarget(null)}>
        <p className="text-sm font-bold text-black/70 mb-6">
          Hapus anggaran untuk kategori <strong>"{deleteTarget?.category?.name}"</strong>?
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)}
            className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-white hover:bg-gray-100 font-black text-sm shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
            Batal
          </button>
          <button onClick={handleDelete}
            className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-red-400 hover:bg-red-500 font-black text-sm shadow-[3px_3px_0px_0px_#000] active:shadow-none transition-all">
            Ya, Hapus
          </button>
        </div>
      </Modal>
    </>
  );
}
