// resources/js/Pages/SavingsPage.jsx
import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
  PiggyBank, Plus, Target, TrendingUp, Users, Lock,
  Calendar, Trash2, Edit2, ChevronRight, X, Check,
  Clock, AlertTriangle, Star, Wallet
} from "lucide-react";
import Sidebar from "@/Layouts/Sidebar";
import NavbarIn from "@/Layouts/NavbarIn";
import GroupSelectorBar from "@/Components/Relation/GroupSelectorBar";

/* ─── helpers ─────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n || 0);

const fmtDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const daysLabel = (days) => {
  if (days === null || days === undefined) return null;
  if (days < 0) return { text: `Terlambat ${Math.abs(days)} hari`, cls: "bg-red-100 text-red-700 border-red-400" };
  if (days === 0) return { text: "Berakhir hari ini!", cls: "bg-orange-100 text-orange-700 border-orange-400" };
  return { text: `${days} hari lagi`, cls: "bg-blue-100 text-blue-700 border-blue-400" };
};

const statusBadge = { active: { text: "Aktif", cls: "bg-green-100 text-green-800 border-green-400" }, completed: { text: "Tercapai ✓", cls: "bg-purple-100 text-purple-800 border-purple-400" }, cancelled: { text: "Dibatalkan", cls: "bg-gray-100 text-gray-600 border-gray-300" } };

const icons = ["piggy-bank", "star", "home", "car", "heart", "zap", "gift", "globe", "book", "coffee", "music", "camera"];
const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"];

/* ─── Sub-components ──────────────────────────────────── */
function ProgressBar({ percent, status }) {
  const bg = status === "completed" ? "bg-purple-500" : status === "cancelled" ? "bg-gray-400" : percent >= 90 ? "bg-green-500" : percent >= 50 ? "bg-blue-500" : "bg-yellow-500";
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full border border-black overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${bg}`}
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </div>
  );
}

function GoalCard({ goal, onContribute, onEdit, onDelete, isOwner }) {
  const [showContribs, setShowContribs] = useState(false);
  const dl = daysLabel(goal.days_remaining);
  const badge = statusBadge[goal.status] || statusBadge.active;
  const isActive = goal.status === "active";

  return (
    <div
      className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
      style={{ borderLeft: `6px solid ${goal.color || "#10B981"}` }}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]"
               style={{ background: goal.color || "#10B981" }}>
            <PiggyBank size={22} className="text-white stroke-[2]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-black text-base text-black leading-tight">{goal.title}</h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${badge.cls}`}>
                {badge.text}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full border ${goal.scope === "group" ? "bg-blue-50 text-blue-700 border-blue-300" : "bg-yellow-50 text-yellow-700 border-yellow-300"}`}>
                {goal.scope === "group" ? <><Users size={10} /> Bersama</> : <><Lock size={10} /> Pribadi</>}
              </span>
              {dl && (
                <span className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full border ${dl.cls}`}>
                  <Calendar size={10} /> {dl.text}
                </span>
              )}
            </div>
          </div>
        </div>

        {goal.description && (
          <p className="text-xs text-black/60 mt-2 font-medium leading-relaxed">{goal.description}</p>
        )}
      </div>

      {/* Progress */}
      <div className="px-4 pb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-black text-black">{fmt(goal.current_amount)}</span>
          <span className="text-xs font-bold text-black/50">dari {fmt(goal.target_amount)}</span>
        </div>
        <ProgressBar percent={goal.progress_percent} status={goal.status} />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs font-black" style={{ color: goal.color || "#10B981" }}>
            {goal.progress_percent}%
          </span>
          <span className="text-xs font-bold text-black/50">
            Sisa {fmt(goal.remaining_amount)}
          </span>
        </div>
      </div>

      {/* Recent Contributions */}
      {goal.recent_contributions?.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowContribs(!showContribs)}
            className="flex items-center gap-1 text-[11px] font-black text-black/60 hover:text-black transition-colors"
          >
            <TrendingUp size={12} />
            {goal.recent_contributions.length} setoran terakhir
            <ChevronRight size={12} className={`transition-transform ${showContribs ? "rotate-90" : ""}`} />
          </button>
          {showContribs && (
            <div className="mt-2 space-y-1">
              {goal.recent_contributions.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-200">
                  <span className="font-bold text-black/70">{c.user_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-green-700">{fmt(c.amount)}</span>
                    <span className="text-black/40">{fmtDate(c.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t-2 border-black bg-gray-50 flex items-center gap-2">
        {isActive && (
          <button
            onClick={() => onContribute(goal)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-green-400 hover:bg-green-500 border-2 border-black rounded-full font-black text-xs text-black shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Plus size={14} className="stroke-[3]" /> Setor Dana
          </button>
        )}
        {(isOwner || isActive) && (
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-full border-2 border-black bg-white hover:bg-yellow-100 shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all"
          >
            <Edit2 size={14} />
          </button>
        )}
        {isOwner && (
          <button
            onClick={() => onDelete(goal)}
            className="p-1.5 rounded-full border-2 border-black bg-white hover:bg-red-100 shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
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

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-black text-black mb-1">{label}</label>
      {children}
      {error && <p className="text-red-600 text-xs font-bold mt-1">{error}</p>}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[2px_2px_0px_0px_#000]";

/* ─── Main Page ───────────────────────────────────────── */
export default function SavingsPage({ auth, relation, relations = [], groupGoals = [], personalGoals = [], isOwner }) {
  const { props } = usePage();
  const flash = props.flash || {};
  const allRelations = relations.length > 0 ? relations : (props.userRelations || []);

  const [tab, setTab] = useState("group");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [targetGoal, setTargetGoal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  React.useEffect(() => {
    if (flash.success) showToast(flash.success);
    if (flash.error) showToast(flash.error, "error");
  }, [flash.success, flash.error]);

  /* Add Goal Form */
  const addForm = useForm({
    title: "", description: "", target_amount: "", deadline: "",
    icon: "piggy-bank", color: "#10B981", scope: "group",
  });

  const handleAddGoal = (e) => {
    e.preventDefault();
    addForm.post(route("savings.store", relation.id), {
      onSuccess: () => { addForm.reset(); setShowAddModal(false); },
    });
  };

  /* Contribute Form */
  const contributeForm = useForm({ amount: "", note: "", date: new Date().toISOString().split("T")[0] });

  const openContribute = (goal) => { setTargetGoal(goal); setShowContributeModal(true); };
  const handleContribute = (e) => {
    e.preventDefault();
    contributeForm.post(route("savings.contribute", [relation.id, targetGoal.id]), {
      onSuccess: () => { contributeForm.reset(); setShowContributeModal(false); setTargetGoal(null); },
    });
  };

  /* Edit Form */
  const editForm = useForm({ title: "", description: "", target_amount: "", deadline: "", icon: "", color: "", status: "" });

  const openEdit = (goal) => {
    setTargetGoal(goal);
    editForm.setData({
      title: goal.title, description: goal.description || "",
      target_amount: goal.target_amount, deadline: goal.deadline || "",
      icon: goal.icon, color: goal.color, status: goal.status,
    });
    setShowEditModal(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    editForm.put(route("savings.update", [relation.id, targetGoal.id]), {
      onSuccess: () => { editForm.reset(); setShowEditModal(false); setTargetGoal(null); },
    });
  };

  /* Delete */
  const handleDelete = () => {
    router.delete(route("savings.destroy", [relation.id, showDeleteConfirm.id]), {
      onSuccess: () => setShowDeleteConfirm(null),
    });
  };

  const displayGoals = tab === "group" ? groupGoals : personalGoals;

  /* Stats */
  const allGoals = [...groupGoals, ...personalGoals];
  const totalTarget = allGoals.reduce((s, g) => s + g.target_amount, 0);
  const totalCollected = allGoals.reduce((s, g) => s + g.current_amount, 0);
  const activeCount = allGoals.filter(g => g.status === "active").length;
  const completedCount = allGoals.filter(g => g.status === "completed").length;

  return (
    <>
      <Head title={`Tabungan - ${relation.nama}`} />
      <div className="min-h-screen h-screen flex flex-col bg-[#C8F5C8]">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-w-0 px-4 sm:px-6 py-6 lg:px-10 lg:py-8">

            {/* Toast */}
            {toast && (
              <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] font-black text-sm animate-bounce ${toast.type === "error" ? "bg-red-200" : "bg-green-200"}`}>
                {toast.type === "error" ? <AlertTriangle size={16} /> : <Check size={16} />}
                {toast.msg}
              </div>
            )}

            {/* Group Selector Bar */}
            <GroupSelectorBar
              relations={allRelations}
              currentRelation={relation}
              routeBase="savings.index"
            />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                    <PiggyBank size={16} className="stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black text-black/60 uppercase tracking-widest">{relation.nama}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-serif font-black text-black leading-tight"
                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}>
                  Dana Tabungan
                </h1>
                <p className="text-black/70 text-sm mt-1 font-bold">Kumpulkan dana bersama untuk target impian</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-black bg-yellow-400 hover:bg-yellow-500 text-black font-black text-sm shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Plus size={18} className="stroke-[3]" /> Buat Target Baru
              </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Target", value: fmt(totalTarget), icon: Target, color: "#7c98ff" },
                { label: "Terkumpul", value: fmt(totalCollected), icon: Wallet, color: "#10B981" },
                { label: "Aktif", value: activeCount, icon: Clock, color: "#F59E0B" },
                { label: "Tercapai", value: completedCount, icon: Star, color: "#8B5CF6" },
              ].map((s, i) => (
                <div key={i} className="bg-white border-2 border-black rounded-2xl p-3 shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]"
                       style={{ background: s.color }}>
                    <s.icon size={16} className="text-white stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="font-black text-base text-black leading-none">{s.value}</div>
                    <div className="text-[11px] font-bold text-black/60">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {[
                { key: "group", label: "Tabungan Bersama", count: groupGoals.length, icon: Users },
                { key: "personal", label: "Tabungan Pribadi", count: personalGoals.length, icon: Lock },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black font-black text-sm transition-all ${tab === t.key ? "bg-black text-white shadow-[3px_3px_0px_0px_#555]" : "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000]"}`}
                >
                  <t.icon size={14} className="stroke-[2.5]" />
                  {t.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${tab === t.key ? "bg-white text-black border-white" : "bg-black text-white border-black"}`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Goals Grid */}
            {displayGoals.length === 0 ? (
              <div className="text-center py-16 bg-white/60 border-2 border-black border-dashed rounded-3xl">
                <PiggyBank size={48} className="mx-auto mb-4 text-black/30 stroke-[1.5]" />
                <p className="font-black text-black/50 text-lg">Belum ada target tabungan</p>
                <p className="font-bold text-black/40 text-sm mt-1">Klik "Buat Target Baru" untuk memulai</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayGoals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onContribute={openContribute}
                    onEdit={openEdit}
                    onDelete={setShowDeleteConfirm}
                    isOwner={isOwner}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Add Goal Modal */}
      <Modal show={showAddModal} title="🐷 Buat Target Tabungan" onClose={() => { setShowAddModal(false); addForm.reset(); }}>
        <form onSubmit={handleAddGoal} className="space-y-4">
          <FormField label="Nama Target *" error={addForm.errors.title}>
            <input className={inputCls} value={addForm.data.title} onChange={e => addForm.setData("title", e.target.value)} placeholder="Liburan Bersama, Kas Darurat…" />
          </FormField>
          <FormField label="Deskripsi" error={addForm.errors.description}>
            <textarea className={inputCls} rows={2} value={addForm.data.description} onChange={e => addForm.setData("description", e.target.value)} placeholder="Deskripsi singkat…" />
          </FormField>
          <FormField label="Target Dana (Rp) *" error={addForm.errors.target_amount}>
            <input className={inputCls} type="number" min={1000} value={addForm.data.target_amount} onChange={e => addForm.setData("target_amount", e.target.value)} placeholder="5000000" />
          </FormField>
          <FormField label="Deadline" error={addForm.errors.deadline}>
            <input className={inputCls} type="date" min={new Date().toISOString().split("T")[0]} value={addForm.data.deadline} onChange={e => addForm.setData("deadline", e.target.value)} />
          </FormField>
          <FormField label="Jenis" error={addForm.errors.scope}>
            <div className="flex gap-2">
              {[{ v: "group", l: "Tabungan Bersama", icon: Users }, { v: "personal", l: "Pribadi", icon: Lock }].map(s => (
                <button type="button" key={s.v}
                  onClick={() => addForm.setData("scope", s.v)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-black font-black text-xs transition-all shadow-[2px_2px_0px_0px_#000] active:shadow-none ${addForm.data.scope === s.v ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                >
                  <s.icon size={13} className="stroke-[2.5]" /> {s.l}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label="Warna Badge">
            <div className="flex gap-2 flex-wrap">
              {colors.map(c => (
                <button type="button" key={c} onClick={() => addForm.setData("color", c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${addForm.data.color === c ? "border-black scale-125 shadow-[2px_2px_0px_0px_#000]" : "border-gray-300"}`}
                  style={{ background: c }} />
              ))}
            </div>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowAddModal(false); addForm.reset(); }}
              className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-white hover:bg-gray-100 font-black text-sm shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
              Batal
            </button>
            <button type="submit" disabled={addForm.processing}
              className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-yellow-400 hover:bg-yellow-500 font-black text-sm shadow-[3px_3px_0px_0px_#000] active:shadow-none transition-all disabled:opacity-60">
              {addForm.processing ? "Menyimpan…" : "Buat Target"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Contribute Modal */}
      <Modal show={showContributeModal} title={`💰 Setor ke: ${targetGoal?.title}`} onClose={() => { setShowContributeModal(false); contributeForm.reset(); }}>
        <form onSubmit={handleContribute} className="space-y-4">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-3">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-black/70">Sudah terkumpul:</span>
              <span className="font-black text-green-700">{fmt(targetGoal?.current_amount)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="font-bold text-black/70">Sisa target:</span>
              <span className="font-black text-blue-700">{fmt(targetGoal?.remaining_amount)}</span>
            </div>
          </div>
          <FormField label="Jumlah Setoran (Rp) *" error={contributeForm.errors.amount}>
            <input className={inputCls} type="number" min={100} value={contributeForm.data.amount} onChange={e => contributeForm.setData("amount", e.target.value)} placeholder="500000" />
          </FormField>
          <FormField label="Tanggal Setoran *" error={contributeForm.errors.date}>
            <input className={inputCls} type="date" max={new Date().toISOString().split("T")[0]} value={contributeForm.data.date} onChange={e => contributeForm.setData("date", e.target.value)} />
          </FormField>
          <FormField label="Catatan" error={contributeForm.errors.note}>
            <input className={inputCls} value={contributeForm.data.note} onChange={e => contributeForm.setData("note", e.target.value)} placeholder="Catatan setoran (opsional)" />
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowContributeModal(false); contributeForm.reset(); }}
              className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-white hover:bg-gray-100 font-black text-sm shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
              Batal
            </button>
            <button type="submit" disabled={contributeForm.processing}
              className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-green-400 hover:bg-green-500 font-black text-sm shadow-[3px_3px_0px_0px_#000] active:shadow-none transition-all disabled:opacity-60">
              {contributeForm.processing ? "Menyimpan…" : "Setor Dana"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} title="✏️ Edit Target Tabungan" onClose={() => { setShowEditModal(false); editForm.reset(); }}>
        <form onSubmit={handleEdit} className="space-y-4">
          <FormField label="Nama Target *" error={editForm.errors.title}>
            <input className={inputCls} value={editForm.data.title} onChange={e => editForm.setData("title", e.target.value)} />
          </FormField>
          <FormField label="Deskripsi" error={editForm.errors.description}>
            <textarea className={inputCls} rows={2} value={editForm.data.description} onChange={e => editForm.setData("description", e.target.value)} />
          </FormField>
          <FormField label="Target Dana (Rp) *" error={editForm.errors.target_amount}>
            <input className={inputCls} type="number" min={1000} value={editForm.data.target_amount} onChange={e => editForm.setData("target_amount", e.target.value)} />
          </FormField>
          <FormField label="Deadline" error={editForm.errors.deadline}>
            <input className={inputCls} type="date" value={editForm.data.deadline} onChange={e => editForm.setData("deadline", e.target.value)} />
          </FormField>
          {isOwner && (
            <FormField label="Status" error={editForm.errors.status}>
              <select className={inputCls} value={editForm.data.status} onChange={e => editForm.setData("status", e.target.value)}>
                <option value="active">Aktif</option>
                <option value="cancelled">Batalkan</option>
              </select>
            </FormField>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowEditModal(false); editForm.reset(); }}
              className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-white hover:bg-gray-100 font-black text-sm shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
              Batal
            </button>
            <button type="submit" disabled={editForm.processing}
              className="flex-1 py-2.5 rounded-2xl border-2 border-black bg-blue-400 hover:bg-blue-500 font-black text-sm shadow-[3px_3px_0px_0px_#000] active:shadow-none transition-all disabled:opacity-60">
              {editForm.processing ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal show={!!showDeleteConfirm} title="🗑️ Hapus Target Tabungan?" onClose={() => setShowDeleteConfirm(null)}>
        <p className="text-sm font-bold text-black/70 mb-6">
          Menghapus <strong>"{showDeleteConfirm?.title}"</strong> akan menghapus semua riwayat setoran. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setShowDeleteConfirm(null)}
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
