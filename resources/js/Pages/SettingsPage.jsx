// resources/js/Pages/SettingsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
  Settings, User, Lock, Users, Bell, Shield, Camera,
  Check, AlertTriangle, ArrowRight, ExternalLink, RefreshCw, Key,
  Trash2, X, AlertCircle
} from "lucide-react";
import Sidebar from "@/Layouts/Sidebar";
import NavbarIn from "@/Layouts/NavbarIn";

export default function SettingsPage({ user, relations = [] }) {
  const { flash, auth } = usePage().props;
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user?.avatar]);

  // ── Profile Form ──────────────────────────────────────────
  const profileForm = useForm({
    name: user?.name || "",
    email: user?.email || "",
    avatar: null,
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      profileForm.setData("avatar", file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    profileForm.post(route("settings.profile.update"), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        profileForm.reset("avatar");
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  // ── Password Form ─────────────────────────────────────────
  const passwordForm = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    passwordForm.patch(route("settings.password.update"), {
      preserveScroll: true,
      onSuccess: () => passwordForm.reset(),
    });
  };

  // ── Delete Account Form ───────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const passwordInputRef = useRef(null);
  const deleteForm = useForm({
    password: "",
  });

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    deleteForm.delete(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => setShowDeleteModal(false),
      onError: () => {
        if (passwordInputRef.current) passwordInputRef.current.focus();
      },
      onFinish: () => deleteForm.reset(),
    });
  };

  const tabs = [
    { id: "profile", label: "Profil Akun", icon: User },
    { id: "security", label: "Keamanan & Password", icon: Lock },
    { id: "relations", label: "Grup Relasi", icon: Users },
    { id: "danger", label: "Hapus Akun", icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex flex-col font-sans text-black">
      <Head title="Pengaturan - Group Finances" />
      <NavbarIn auth={auth} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#E2E8F0] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]">
                  <Settings size={20} className="stroke-[2.5]" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Pengaturan Akun & Profil</h1>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
                Kelola informasi akun, foto profil, keamanan login, dan privasi data
              </p>
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

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-black pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === "danger";
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-black text-xs sm:text-sm transition-all ${
                    isActive
                      ? isDanger
                        ? "bg-[#FF6B7A] text-white border-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5"
                        : "bg-[#7C98FF] border-black text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5"
                      : isDanger
                        ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100 shadow-[1px_1px_0px_0px_#000]"
                        : "bg-white border-black text-gray-700 hover:bg-gray-100 shadow-[1px_1px_0px_0px_#000]"
                  }`}
                >
                  <Icon size={16} className="stroke-[2.5]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── TAB 1: PROFIL AKUN & FOTO ──────────────────────── */}
          {activeTab === "profile" && (
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8">
              <h2 className="text-xl font-black mb-1">Informasi Profil & Foto</h2>
              <p className="text-xs font-semibold text-gray-600 mb-6">
                Perbarui nama profil, email, dan unggah foto profil akun Anda
              </p>

              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
                {/* Foto Profil Uploader */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                    Foto Profil
                  </label>
                  <div className="flex items-center gap-5">
                    {/* Preview Box */}
                    <div className="relative w-20 h-20 rounded-2xl border-2 border-black bg-[#C8F5C8] shadow-[3px_3px_0px_0px_#000] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt={user?.name || "Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-black">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black bg-white hover:bg-yellow-100 text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all">
                        <Camera size={15} className="stroke-[2.5]" />
                        <span>Pilih Foto Baru</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                      <p className="text-[11px] font-semibold text-gray-500">
                        Format: JPG, PNG, WEBP. Maks 2MB. Disimpan di folder privat yang aman.
                      </p>
                      {profileForm.errors.avatar && (
                        <p className="text-xs font-bold text-red-600">
                          {profileForm.errors.avatar}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={profileForm.data.name}
                    onChange={(e) => profileForm.setData("name", e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_#000] focus:shadow-[3px_3px_0px_0px_#000] transition-all"
                  />
                  {profileForm.errors.name && (
                    <p className="text-xs font-bold text-red-600 mt-1">
                      {profileForm.errors.name}
                    </p>
                  )}
                </div>

                {/* Alamat Email */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.data.email}
                    onChange={(e) => profileForm.setData("email", e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_#000] focus:shadow-[3px_3px_0px_0px_#000] transition-all"
                  />
                  {profileForm.errors.email && (
                    <p className="text-xs font-bold text-red-600 mt-1">
                      {profileForm.errors.email}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileForm.processing}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-black bg-[#C8F5C8] hover:bg-[#a8f0a8] font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    <Check size={16} className="stroke-[3]" />
                    <span>{profileForm.processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB 2: KEAMANAN & PASSWORD ───────────────────── */}
          {activeTab === "security" && (
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8">
              <h2 className="text-xl font-black mb-1">Ganti Password</h2>
              <p className="text-xs font-semibold text-gray-600 mb-6">
                Pastikan akun Anda menggunakan kombinasi password yang kuat dan aman
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    value={passwordForm.data.current_password}
                    onChange={(e) => passwordForm.setData("current_password", e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_#000] transition-all"
                  />
                  {passwordForm.errors.current_password && (
                    <p className="text-xs font-bold text-red-600 mt-1">
                      {passwordForm.errors.current_password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                    Password Baru (Min. 8 Karakter)
                  </label>
                  <input
                    type="password"
                    value={passwordForm.data.password}
                    onChange={(e) => passwordForm.setData("password", e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_#000] transition-all"
                  />
                  {passwordForm.errors.password && (
                    <p className="text-xs font-bold text-red-600 mt-1">
                      {passwordForm.errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordForm.data.password_confirmation}
                    onChange={(e) => passwordForm.setData("password_confirmation", e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_#000] transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordForm.processing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-black bg-[#FFD1D5] hover:bg-[#ffb5bc] font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    <Key size={16} className="stroke-[2.5]" />
                    <span>{passwordForm.processing ? "Memperbarui..." : "Perbarui Password"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB 3: GRUP RELASI ───────────────────────────── */}
          {activeTab === "relations" && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-black">Daftar Grup Keuangan</h2>
                    <p className="text-xs font-semibold text-gray-600 mt-1">
                      Kelola grup relasi yang Anda miliki atau ikuti
                    </p>
                  </div>
                  <button
                    onClick={() => router.visit(route("relations.index"))}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black bg-[#C8F5C8] hover:bg-[#a8f0a8] font-black text-xs shadow-[2px_2px_0px_0px_#000]"
                  >
                    <span>Buka Hubungan / Kelola Relasi</span>
                    <ArrowRight size={14} className="stroke-[2.5]" />
                  </button>
                </div>

                {relations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <Users size={36} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-bold text-sm text-gray-600">Anda belum tergabung dalam grup manapun</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relations.map((rel) => (
                      <div
                        key={rel.id}
                        className="p-4 rounded-xl border-2 border-black bg-[#FFFDF0] shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-black text-base">{rel.nama}</h3>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-black ${
                                rel.is_owner
                                  ? "bg-[#FDBB4E] text-black"
                                  : "bg-blue-100 text-blue-900"
                              }`}
                            >
                              {rel.is_owner ? "Pemilik (Owner)" : "Anggota"}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-gray-600 mb-1">
                            Kode Undangan: <code className="bg-white px-1.5 py-0.5 border border-black rounded text-black font-black">{rel.kode}</code>
                          </p>
                          <p className="text-xs font-semibold text-gray-500">
                            {rel.member_count} Anggota
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-between gap-2">
                          <button
                            onClick={() => router.visit(`/relations/${rel.id}/transactions`)}
                            className="text-xs font-black text-[#4F46E5] hover:underline flex items-center gap-1"
                          >
                            <span>Lihat Transaksi</span>
                            <ExternalLink size={12} />
                          </button>

                          {rel.is_owner && (
                            <button
                              onClick={() => router.visit(route("settings.relation.show", rel.id))}
                              className="px-3 py-1.5 rounded-lg border-2 border-black bg-[#7C98FF] hover:bg-[#6885f8] text-black font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            >
                              Pengaturan Grup
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 4: HAPUS AKUN (ZONA BAHAYA) ──────────────── */}
          {activeTab === "danger" && (
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl border-2 border-black bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]">
                  <AlertTriangle size={24} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-red-600">Zona Bahaya: Hapus Akun</h2>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1 leading-relaxed">
                    Setelah akun Anda dihapus, seluruh data profil, keanggotaan relasi grup, dan data terkait akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-red-300 bg-red-50 mb-6">
                <p className="text-xs font-bold text-red-900 leading-relaxed">
                  ⚠️ Perhatian: Sebelum menghapus akun, pastikan Anda telah mengunduh atau mengekspor riwayat transaksi keuangan yang diperlukan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-black bg-[#FF6B7A] hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Trash2 size={16} className="stroke-[2.5]" />
                <span>Hapus Akun Saya Secara Permanen</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL KONFIRMASI HAPUS AKUN ──────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_#000] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#FFD1D5]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="stroke-[3] text-red-700" />
                <h3 className="font-black text-black text-base">Konfirmasi Hapus Akun</h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  deleteForm.reset();
                  deleteForm.clearErrors();
                }}
                className="p-1 rounded-full border border-black bg-white hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleDeleteAccount} className="p-6 space-y-4">
              <p className="text-xs font-bold text-gray-700 leading-relaxed">
                Apakah Anda benar-benar yakin ingin menghapus akun Anda? Masukkan kata sandi saat ini untuk memverifikasi identitas Anda.
              </p>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                  Kata Sandi Akun
                </label>
                <input
                  ref={passwordInputRef}
                  type="password"
                  value={deleteForm.data.password}
                  onChange={(e) => deleteForm.setData("password", e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_#000] transition-all"
                />
                {deleteForm.errors.password && (
                  <p className="text-xs font-bold text-red-600 mt-1">
                    {deleteForm.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    deleteForm.reset();
                    deleteForm.clearErrors();
                  }}
                  className="px-4 py-2 rounded-xl border-2 border-black bg-gray-100 hover:bg-gray-200 text-xs font-black shadow-[2px_2px_0px_0px_#000]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={deleteForm.processing}
                  className="px-4 py-2 rounded-xl border-2 border-black bg-[#FF6B7A] hover:bg-red-600 text-white text-xs font-black shadow-[2px_2px_0px_0px_#000] disabled:opacity-50"
                >
                  {deleteForm.processing ? "Menghapus..." : "Ya, Hapus Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
