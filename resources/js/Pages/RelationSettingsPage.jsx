// resources/js/Pages/RelationSettingsPage.jsx
import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
  ArrowLeft, Users, Shield, Copy, Check, RefreshCw,
  AlertTriangle, Settings, Bell, Lock, UserCheck
} from "lucide-react";
import Sidebar from "@/Layouts/Sidebar";
import NavbarIn from "@/Layouts/NavbarIn";

export default function RelationSettingsPage({ relation, members = [] }) {
  const { flash, auth } = usePage().props;
  const [copied, setCopied] = useState(false);

  // ── Info Form ─────────────────────────────────────────────
  const infoForm = useForm({
    nama: relation.nama || "",
    deskripsi: relation.deskripsi || "",
  });

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    infoForm.patch(route("settings.relation.update", relation.id), {
      preserveScroll: true,
    });
  };

  // ── Preferences Form ──────────────────────────────────────
  const preferencesForm = useForm({
    member_can_add_category: !!relation.settings?.member_can_add_category,
    member_can_add_budget: !!relation.settings?.member_can_add_budget,
    notification_new_trx: !!relation.settings?.notification_new_trx,
    notification_budget_warn: !!relation.settings?.notification_budget_warn,
  });

  const handlePrefSubmit = (e) => {
    e.preventDefault();
    preferencesForm.patch(route("settings.relation.preferences", relation.id), {
      preserveScroll: true,
    });
  };

  // ── Regenerate Code ───────────────────────────────────────
  const [regenerating, setRegenerating] = useState(false);
  const handleRegenerateCode = () => {
    if (!confirm("Apakah Anda yakin ingin membuat kode undangan baru? Kode lama tidak akan bisa digunakan lagi.")) {
      return;
    }
    setRegenerating(true);
    router.post(
      route("settings.relation.regenerate-code", relation.id),
      {},
      {
        preserveScroll: true,
        onFinish: () => setRegenerating(false),
      }
    );
  };

  const copyCode = () => {
    navigator.clipboard.writeText(relation.kode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex flex-col font-sans text-black">
      <Head title={`Pengaturan ${relation.nama} - Group Finances`} />
      <NavbarIn auth={auth} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {/* Breadcrumb & Back */}
          <div className="mb-6">
            <button
              onClick={() => router.visit(route("settings.index"))}
              className="inline-flex items-center gap-1.5 text-xs font-black text-gray-700 hover:text-black mb-2"
            >
              <ArrowLeft size={14} className="stroke-[3]" />
              <span>Kembali ke Pengaturan</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black">Pengaturan Grup: {relation.nama}</h1>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
                  Kelola identitas grup, kode undangan, serta izin hak akses anggota
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 bg-[#FDBB4E] border-2 border-black rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000]">
                👑 Owner Control
              </span>
            </div>
          </div>

          {/* Flash Messages */}
          {flash?.success && (
            <div className="mb-6 p-4 bg-[#C8F5C8] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center gap-3">
              <Check size={20} className="stroke-[3] text-green-800 flex-shrink-0" />
              <p className="font-bold text-sm text-green-950">{flash.success}</p>
            </div>
          )}
          {flash?.error && (
            <div className="mb-6 p-4 bg-[#FFD1D5] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center gap-3">
              <AlertTriangle size={20} className="stroke-[2.5] text-red-700 flex-shrink-0" />
              <p className="font-bold text-sm text-red-950">{flash.error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* ── 1. KODE UNDANGAN ─────────────────────────── */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6">
              <h2 className="text-lg font-black mb-1">Kode Undangan Grup</h2>
              <p className="text-xs font-semibold text-gray-600 mb-4">
                Bagikan kode ini kepada calon anggota agar mereka dapat mengajukan permohonan bergabung
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-black bg-[#FFFDF0] shadow-[3px_3px_0px_0px_#000]">
                  <span className="font-mono font-black text-lg tracking-wider select-all">
                    {relation.kode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Salin Kode"
                  >
                    {copied ? <Check size={18} className="text-green-600 stroke-[3]" /> : <Copy size={18} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  disabled={regenerating}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-black bg-white hover:bg-gray-50 font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={14} className={`stroke-[2.5] ${regenerating ? "animate-spin" : ""}`} />
                  <span>{regenerating ? "Memperbarui..." : "Buat Kode Baru"}</span>
                </button>
              </div>
            </div>

            {/* ── 2. INFORMASI GRUP ─────────────────────────── */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6">
              <h2 className="text-lg font-black mb-1">Informasi Dasar</h2>
              <p className="text-xs font-semibold text-gray-600 mb-5">
                Ubah nama grup dan deskripsi tujuan kelompok
              </p>

              <form onSubmit={handleInfoSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                    Nama Grup Relasi
                  </label>
                  <input
                    type="text"
                    value={infoForm.data.nama}
                    onChange={(e) => infoForm.setData("nama", e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_#000] transition-all"
                  />
                  {infoForm.errors.nama && (
                    <p className="text-xs font-bold text-red-600 mt-1">{infoForm.errors.nama}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    value={infoForm.data.deskripsi}
                    onChange={(e) => infoForm.setData("deskripsi", e.target.value)}
                    placeholder="Contoh: Pengelolaan keuangan rumah tangga keluarga bersama"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_#000] transition-all"
                  />
                  {infoForm.errors.deskripsi && (
                    <p className="text-xs font-bold text-red-600 mt-1">{infoForm.errors.deskripsi}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={infoForm.processing}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border-2 border-black bg-[#C8F5C8] hover:bg-[#a8f0a8] font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    <Check size={14} className="stroke-[3]" />
                    <span>{infoForm.processing ? "Menyimpan..." : "Simpan Perubahan Info"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ── 3. HAK AKSES & KEBIJAKAN GRUP ────────────── */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6">
              <h2 className="text-lg font-black mb-1">Hak Akses Anggota & Notifikasi</h2>
              <p className="text-xs font-semibold text-gray-600 mb-5">
                Atur kewenangan anggota biasa dan notifikasi aktivitas keuangan grup
              </p>

              <form onSubmit={handlePrefSubmit} className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-black bg-[#FFFDF0] shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-yellow-50">
                    <input
                      type="checkbox"
                      checked={preferencesForm.data.member_can_add_category}
                      onChange={(e) =>
                        preferencesForm.setData("member_can_add_category", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-2 border-black accent-[#7C98FF]"
                    />
                    <div className="flex-1">
                      <p className="font-black text-sm">Izinkan Anggota Menambah Kategori</p>
                      <p className="text-xs font-semibold text-gray-600">
                        Anggota non-owner dapat membuat kategori transaksi kustom untuk grup ini
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-black bg-[#FFFDF0] shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-yellow-50">
                    <input
                      type="checkbox"
                      checked={preferencesForm.data.member_can_add_budget}
                      onChange={(e) =>
                        preferencesForm.setData("member_can_add_budget", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-2 border-black accent-[#7C98FF]"
                    />
                    <div className="flex-1">
                      <p className="font-black text-sm">Izinkan Anggota Menambah & Mengubah Anggaran</p>
                      <p className="text-xs font-semibold text-gray-600">
                        Anggota biasa dapat menetapkan target batas anggaran kategori bulanan
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-black bg-[#FFFDF0] shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-yellow-50">
                    <input
                      type="checkbox"
                      checked={preferencesForm.data.notification_new_trx}
                      onChange={(e) =>
                        preferencesForm.setData("notification_new_trx", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-2 border-black accent-[#7C98FF]"
                    />
                    <div className="flex-1">
                      <p className="font-black text-sm">Notifikasi Transaksi Baru</p>
                      <p className="text-xs font-semibold text-gray-600">
                        Kirim notifikasi kepada seluruh anggota saat ada transaksi baru dicatat
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-black bg-[#FFFDF0] shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-yellow-50">
                    <input
                      type="checkbox"
                      checked={preferencesForm.data.notification_budget_warn}
                      onChange={(e) =>
                        preferencesForm.setData("notification_budget_warn", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-2 border-black accent-[#7C98FF]"
                    />
                    <div className="flex-1">
                      <p className="font-black text-sm">Peringatan Anggaran Menipis</p>
                      <p className="text-xs font-semibold text-gray-600">
                        Peringatkan jika realisasi pengeluaran mendekati atau melampaui 80% batas anggaran
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={preferencesForm.processing}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border-2 border-black bg-[#7C98FF] hover:bg-[#6b8bf5] font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    <Check size={14} className="stroke-[3]" />
                    <span>{preferencesForm.processing ? "Menyimpan..." : "Simpan Kebijakan"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ── 4. DAFTAR ANGGOTA ─────────────────────────── */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black">Anggota Grup ({members.length})</h2>
                <button
                  onClick={() => router.visit(`/relations/${relation.id}/members`)}
                  className="text-xs font-black text-[#4F46E5] hover:underline"
                >
                  Kelola Detail Anggota &rarr;
                </button>
              </div>

              <div className="divide-y-2 divide-black/10">
                {members.map((member) => (
                  <div key={member.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border-2 border-black bg-[#C8F5C8] flex items-center justify-center font-black text-sm">
                        {member.name ? member.name.charAt(0).toUpperCase() : "M"}
                      </div>
                      <div>
                        <p className="font-black text-sm">{member.name}</p>
                        <p className="text-xs font-semibold text-gray-500">{member.email}</p>
                      </div>
                    </div>

                    <div>
                      {member.is_owner ? (
                        <span className="px-2.5 py-0.5 rounded-full border border-black bg-[#FDBB4E] font-black text-[10px]">
                          Owner
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full border border-black bg-gray-100 font-bold text-[10px] text-gray-600">
                          Anggota
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
