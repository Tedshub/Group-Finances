// resources/js/Pages/Relations/Index.jsx
import React, { useState, useEffect } from "react";
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Sidebar from "../../Layouts/Sidebar";
import NavbarIn from "../../Layouts/NavbarIn";
import { Users, Plus, LogIn, Crown, Calendar, Trash2, Copy, Check, X, Edit, AlertCircle, UserPlus, UserMinus } from 'lucide-react';

export default function RelationsPage({ auth, relations, flash }) {
  const { props } = usePage();
  const [activeTab, setActiveTab] = useState('list');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [copied, setCopied] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateSuccessModal, setShowCreateSuccessModal] = useState(false);
  const [createdRelation, setCreatedRelation] = useState(null);
  const [showJoinSuccessModal, setShowJoinSuccessModal] = useState(false);
  const [joinedRelation, setJoinedRelation] = useState(null);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [editedRelation, setEditedRelation] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [relationMembers, setRelationMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState('');

  // Helper function untuk mendapatkan CSRF token dengan lebih aman
  const getCsrfToken = () => {
    // Coba beberapa cara untuk mendapatkan CSRF token
    let token = '';

    // Cara 1: Dari meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag && metaTag.content) {
      token = metaTag.content;
    }

    // Cara 2: Dari window object (jika ada)
    if (!token && window.csrfToken) {
      token = window.csrfToken;
    }

    // Cara 3: Dari cookie (fallback)
    if (!token) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('XSRF-TOKEN=')) {
          token = cookie.substring('XSRF-TOKEN='.length);
          break;
        }
      }
    }

    return token;
  };

  // Form untuk create
  const createForm = useForm({
    nama: '',
    deskripsi: '',
    kode: '',
  });

  // Form untuk join
  const [joinKode, setJoinKode] = useState('');
  const [joinError, setJoinError] = useState('');

  // Form untuk edit
  const editForm = useForm({
    nama: '',
    deskripsi: '',
    kode: '',
  });

  // Handle flash messages
  useEffect(() => {
    // Check for flash messages on initial load and after navigation
    const currentFlash = props.flash || flash;

    if (currentFlash?.success) {
      // Check if success message is for creating a relation
      if (currentFlash.success.includes('Relation') && currentFlash.success.includes('berhasil dibuat')) {
        // Extract relation name and kode from the success message
        const match = currentFlash.success.match(/Relation (.+?) berhasil dibuat! Kode: (.+)/);
        if (match) {
          setCreatedRelation({
            nama: match[1],
            kode: match[2]
          });
          setShowCreateSuccessModal(true);
        }
      }
      // Check if success message is for joining a relation
      else if (currentFlash.success.includes('Berhasil bergabung')) {
        // Extract relation name from the success message
        const match = currentFlash.success.match(/Berhasil bergabung ke '(.+?)'/);
        if (match) {
          setJoinedRelation({
            nama: match[1]
          });
          setShowJoinSuccessModal(true);
        }
      }
      // Check if success message is for editing a relation
      else if (currentFlash.success.includes('Relation berhasil diupdate')) {
        setShowEditSuccessModal(true);
      }
      // For other success messages
      else {
        setSuccessMessage(currentFlash.success);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }
    }
  }, [props.flash, flash]);

  const handleCreate = (e) => {
    e.preventDefault();
    createForm.post(route('relations.store'), {
      onSuccess: () => {
        createForm.reset();
        setActiveTab('list');

        // The modal will be triggered by useEffect hook when flash message is received
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setJoinError('');
    setSearchResult(null);

    try {
      const response = await fetch(route('relations.search'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(), // Gunakan fungsi helper
          'X-Requested-With': 'XMLHttpRequest', // Tambahkan header ini
        },
        body: JSON.stringify({ kode: joinKode }),
      });

      const data = await response.json();
      if (data.found) {
        setSearchResult(data);
      } else {
        setJoinError('Relation tidak ditemukan');
      }
    } catch (err) {
      console.error('Search error:', err);
      setJoinError('Terjadi kesalahan');
    } finally {
      setSearching(false);
    }
  };

  const handleJoin = () => {
    router.post(route('relations.join'), { kode: joinKode }, {
      onSuccess: () => {
        setJoinKode('');
        setSearchResult(null);
        setActiveTab('list');

        // The modal will be triggered by useEffect hook when flash message is received
      }
    });
  };

  const handleCopy = (kode) => {
    navigator.clipboard.writeText(kode);
    setCopied(kode);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdRelation.kode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleDelete = (relation) => {
    router.delete(route('relations.destroy', relation.id), {
      onSuccess: () => setShowDeleteConfirm(null)
    });
  };

  const handleLeave = (relation) => {
    if (confirm(`Keluar dari "${relation.nama}"?`)) {
      router.delete(route('relations.leave', relation.id));
    }
  };

  const startEdit = (relation) => {
    setEditingId(relation.id);
    editForm.setData({
      nama: relation.nama,
      deskripsi: relation.deskripsi || '',
      kode: relation.kode,
    });
  };

  const handleEdit = (e, relationId) => {
    e.preventDefault();
    editForm.put(route('relations.update', relationId), {
      onSuccess: () => {
        setEditingId(null);
        editForm.reset();

        // The modal will be triggered by useEffect hook when flash message is received
      }
    });
  };

  const handleCloseCreateModal = () => {
    setShowCreateSuccessModal(false);
    router.reload();
  };

  const handleCloseJoinModal = () => {
    setShowJoinSuccessModal(false);
    router.reload();
  };

  const handleCloseEditModal = () => {
    setShowEditSuccessModal(false);
    router.reload();
  };

  const handleShowMembers = async (relation) => {
    setSelectedRelation(relation);
    setLoadingMembers(true);
    setRelationMembers([]);
    setMembersError('');
    setShowMembersModal(true);

    try {
      const response = await fetch(route('relations.members', relation.id), {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(), // Gunakan fungsi helper
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // Tambahkan header ini
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch members');
      }

      const data = await response.json();
      console.log('Members data:', data); // Debug log

      if (data.users && Array.isArray(data.users)) {
        setRelationMembers(data.users);
      } else {
        setMembersError('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setMembersError(err.message || 'Terjadi kesalahan saat mengambil data anggota');
    } finally {
      setLoadingMembers(false);
    }
  };

  return (
    <>
      <Head title="Hubungan - Couple's Finances" />
      <div className="min-h-screen h-screen flex flex-col bg-[#C8F5C8] text-gray-900">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-serif font-normal text-black mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Hubungan Keuangan
              </h1>
              <p className="text-black text-sm">Kelola hubungan keuangan dengan pasangan atau keluarga</p>
            </div>

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="fixed top-20 right-4 md:right-6 z-50 bg-white border rounded-lg shadow-lg p-3 min-w-[280px] animate-slide-in">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-[#c5ffbc] border rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-black text-sm mb-0.5">Berhasil</h4>
                    <p className="text-xs text-black">{successMessage}</p>
                  </div>
                  <button
                    onClick={() => setShowSuccessToast(false)}
                    className="text-black hover:text-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {flash?.error && (
              <div className="mb-4 bg-white border rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-black text-sm">{flash.error}</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 min-w-[100px] px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all border text-sm relative z-10 ${
                  activeTab === 'list'
                    ? 'bg-[#7c98ff] text-white shadow-lg'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                Daftar Hubungan
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 min-w-[100px] px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all border flex items-center justify-center gap-2 text-sm relative z-10 ${
                  activeTab === 'create'
                    ? 'bg-[#7c98ff] text-white shadow-lg'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <Plus className="w-4 h-4" />
                Buat Baru
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 min-w-[100px] px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all border flex items-center justify-center gap-2 text-sm relative z-10 ${
                  activeTab === 'join'
                    ? 'bg-[#7c98ff] text-white shadow-lg'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Gabung
              </button>
            </div>

            {/* Content - List */}
            {activeTab === 'list' && (
              <div className="bg-white rounded-xl md:rounded-2xl border overflow-hidden">
                {relations.data.length === 0 ? (
                  <div className="p-8 md:p-12 text-center">
                    <Users className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      Belum ada hubungan keuangan
                    </h3>
                    <p className="text-black text-sm mb-4">Mulai dengan membuat hubungan keuangan pertama Anda</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="inline-flex items-center gap-2 bg-[#7c98ff] hover:bg-[#6b87ee] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-all border shadow-lg text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Buat Hubungan Pertama
                    </button>
                  </div>
                ) : (
                  <div>
                    {relations.data.map((relation, index) => (
                      <div
                        key={relation.id}
                        className={`p-3 md:p-4 transition-colors ${
                          index !== relations.data.length - 1 ? 'border-b' : ''
                        } ${editingId !== relation.id ? 'hover:bg-gray-50' : ''}`}
                      >
                        {editingId === relation.id ? (
                          // Edit Form
                          <form onSubmit={(e) => handleEdit(e, relation.id)} className="space-y-3">
                            <input
                              type="text"
                              value={editForm.data.nama}
                              onChange={(e) => editForm.setData('nama', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#7c98ff] focus:border text-sm"
                              placeholder="Nama Hubungan"
                              required
                            />
                            <textarea
                              value={editForm.data.deskripsi}
                              onChange={(e) => editForm.setData('deskripsi', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#7c98ff] focus:border resize-none text-sm"
                              placeholder="Deskripsi"
                              rows={2}
                            />
                            <input
                              type="text"
                              value={editForm.data.kode}
                              onChange={(e) => editForm.setData('kode', e.target.value.toUpperCase())}
                              className="w-full px-3 py-2 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#7c98ff] focus:border font-mono text-sm"
                              placeholder="Kode"
                              required
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={editForm.processing}
                                className="px-4 py-2 bg-[#7c98ff] hover:bg-[#6b87ee] text-white rounded-full border font-medium transition-all shadow-lg text-sm"
                              >
                                Simpan
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 bg-white hover:bg-gray-50 text-black rounded-full border font-medium transition-all text-sm"
                              >
                                Batal
                              </button>
                            </div>
                          </form>
                        ) : (
                          // Display Mode
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-base md:text-lg font-serif font-normal text-black" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                                  {relation.nama}
                                </h3>
                                {relation.is_owner && (
                                  <span className="inline-flex items-center gap-1 bg-yellow-300 border px-2 py-0.5 rounded-full text-xs font-bold">
                                    <Crown className="w-3 h-3" />
                                    Owner
                                  </span>
                                )}
                              </div>
                              {relation.deskripsi && (
                                <p className="text-black text-sm mb-3 leading-relaxed">{relation.deskripsi}</p>
                              )}
                              <div className="flex flex-wrap gap-2 text-xs text-black mb-3">
                                <button
                                  onClick={() => handleShowMembers(relation)}
                                  className="flex items-center gap-1.5 bg-white border rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
                                >
                                  <Users className="w-3 h-3" />
                                  <span className="font-medium">{relation.users_count} anggota</span>
                                </button>
                                <div className="flex items-center gap-1.5 bg-white border rounded-full px-3 py-1">
                                  <Calendar className="w-3 h-3" />
                                  <span className="font-medium">{relation.join_at}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono bg-[#c5ffbc] border px-3 py-1 rounded-full text-sm font-bold">
                                  {relation.kode}
                                </span>
                                <button
                                  onClick={() => handleCopy(relation.kode)}
                                  className="p-1.5 hover:bg-gray-100 rounded-full border transition-colors"
                                  title="Salin kode"
                                >
                                  {copied === relation.kode ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-black" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-2 md:ml-4">
                              {relation.is_owner ? (
                                <>
                                  <button
                                    onClick={() => startEdit(relation)}
                                    className="px-3 md:px-4 py-2 bg-[#7c98ff] hover:bg-[#6b87ee] text-white rounded-full border transition-all flex items-center gap-1.5 font-medium shadow-lg text-sm"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span className="hidden md:inline">Edit</span>
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(relation)}
                                    className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full border transition-all flex items-center gap-1.5 font-medium shadow-lg text-sm"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="hidden md:inline">Hapus</span>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleLeave(relation)}
                                  className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full border transition-all flex items-center gap-1.5 font-medium shadow-lg text-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden md:inline">Keluar</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content - Create */}
            {activeTab === 'create' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl md:rounded-2xl border p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-serif font-normal text-black mb-6" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Buat Hubungan Baru
                  </h2>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Nama Hubungan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={createForm.data.nama}
                        onChange={(e) => createForm.setData('nama', e.target.value)}
                        placeholder="Contoh: Keluarga Bahagia"
                        className="w-full px-4 py-2.5 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#7c98ff] focus:border transition-all text-sm"
                        required
                      />
                      {createForm.errors.nama && (
                        <p className="mt-1 text-xs text-red-600 font-medium">{createForm.errors.nama}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Deskripsi</label>
                      <textarea
                        value={createForm.data.deskripsi}
                        onChange={(e) => createForm.setData('deskripsi', e.target.value)}
                        placeholder="Jelaskan tujuan hubungan ini..."
                        rows={3}
                        className="w-full px-4 py-2.5 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#7c98ff] focus:border transition-all resize-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Kode (Opsional)
                      </label>
                      <input
                        type="text"
                        value={createForm.data.kode}
                        onChange={(e) => createForm.setData('kode', e.target.value.toUpperCase())}
                        placeholder="Kosongkan untuk auto-generate"
                        className="w-full px-4 py-2.5 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#7c98ff] focus:border transition-all font-mono text-sm"
                      />
                      <p className="mt-1 text-xs text-black">Hanya huruf dan angka</p>
                    </div>

                    <div className="bg-[#c5ffbc] border rounded-lg md:rounded-xl p-4">
                      <p className="text-black font-medium text-sm">
                        Anda akan menjadi owner dan bisa mengundang anggota lain dengan kode
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={createForm.processing}
                        className="flex-1 bg-[#7c98ff] hover:bg-[#6b87ee] text-white px-6 py-2.5 rounded-full border font-bold transition-all disabled:opacity-50 shadow-lg text-sm"
                      >
                        {createForm.processing ? 'Membuat...' : 'Buat Hubungan'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className="px-6 py-2.5 bg-white hover:bg-gray-50 text-black rounded-full border font-bold transition-all text-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Content - Join */}
            {activeTab === 'join' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl md:rounded-2xl border p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-serif font-normal text-black mb-6" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Gabung dengan Kode
                  </h2>

                  <form onSubmit={handleSearch} className="mb-6">
                    <label className="block text-sm font-bold text-black mb-2">
                      Masukkan Kode Hubungan
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={joinKode}
                        onChange={(e) => setJoinKode(e.target.value.toUpperCase())}
                        placeholder="Contoh: ABC123"
                        className="flex-1 px-4 py-2.5 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#7c98ff] focus:border transition-all font-mono text-sm"
                        required
                      />
                      <button
                        type="submit"
                        disabled={searching}
                        className="px-6 py-2.5 bg-[#7c98ff] hover:bg-[#6b87ee] text-white rounded-full border font-bold transition-all disabled:opacity-50 shadow-lg text-sm"
                      >
                        {searching ? 'Mencari...' : 'Cari'}
                      </button>
                    </div>
                  </form>

                  {joinError && (
                    <div className="mb-6 p-4 bg-red-100 border rounded-lg md:rounded-xl">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <p className="text-black font-medium text-sm">{joinError}</p>
                      </div>
                    </div>
                  )}

                  {searchResult && (
                    <div className="mb-6 p-5 bg-[#c5ffbc] border rounded-lg md:rounded-2xl">
                      <h3 className="font-serif font-normal text-black text-lg md:text-xl mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                        {searchResult.relation.nama}
                      </h3>
                      {searchResult.relation.deskripsi && (
                        <p className="text-black mb-3 leading-relaxed text-sm">{searchResult.relation.deskripsi}</p>
                      )}
                      <div className="space-y-1 mb-4 text-black text-sm">
                        <p className="font-medium">Dibuat oleh: {searchResult.relation.creator.name}</p>
                        <p className="font-medium">Anggota: {searchResult.relation.users_count} orang</p>
                      </div>

                      {searchResult.already_joined ? (
                        <div className="p-3 bg-yellow-100 border rounded-lg md:rounded-xl">
                          <p className="text-black font-bold text-sm">Anda sudah bergabung di hubungan ini</p>
                        </div>
                      ) : (
                        <button
                          onClick={handleJoin}
                          className="w-full px-6 py-2.5 bg-[#7c98ff] hover:bg-[#6b87ee] text-white rounded-full border font-bold transition-all shadow-lg text-sm"
                        >
                          Gabung Sekarang
                        </button>
                      )}
                    </div>
                  )}

                  <div className="bg-gray-100 border rounded-lg md:rounded-xl p-4">
                    <p className="text-black text-sm">
                      <strong>Tips:</strong> Minta kode dari teman atau keluarga yang sudah membuat hubungan keuangan
                    </p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg md:rounded-2xl border max-w-md w-full p-4 md:p-6 shadow-2xl">
            <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Hapus Hubungan?
            </h3>
            <p className="text-black mb-6 leading-relaxed text-sm">
              Yakin ingin menghapus <strong>"{showDeleteConfirm.nama}"</strong>? Tindakan ini tidak dapat dibatalkan!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full border font-bold transition-all shadow-lg text-sm"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-5 py-2.5 bg-white hover:bg-gray-50 text-black rounded-full border font-bold transition-all text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Success Modal */}
      {showCreateSuccessModal && createdRelation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg md:rounded-2xl border max-w-md w-full p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-[#c5ffbc] border rounded-full mx-auto mb-4">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2 text-center" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Hubungan Berhasil Dibuat!
            </h3>
            <p className="text-black mb-4 leading-relaxed text-sm text-center">
              Hubungan <strong>"{createdRelation.nama}"</strong> berhasil dibuat dengan kode:
            </p>
            <div className="bg-gray-100 border rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="font-mono font-bold text-black">{createdRelation.kode}</span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 hover:bg-gray-200 rounded-full border transition-colors"
                title="Salin kode"
              >
                {codeCopied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-black" />
                )}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCloseCreateModal}
                className="flex-1 px-5 py-2.5 bg-[#7c98ff] hover:bg-[#6b87ee] text-white rounded-full border font-bold transition-all shadow-lg text-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Success Modal */}
      {showJoinSuccessModal && joinedRelation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg md:rounded-2xl border max-w-md w-full p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-[#c5ffbc] border rounded-full mx-auto mb-4">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2 text-center" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Berhasil Bergabung!
            </h3>
            <p className="text-black mb-6 leading-relaxed text-sm text-center">
              Anda berhasil bergabung dengan hubungan <strong>"{joinedRelation.nama}"</strong>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseJoinModal}
                className="flex-1 px-5 py-2.5 bg-[#7c98ff] hover:bg-[#6b87ee] text-white rounded-full border font-bold transition-all shadow-lg text-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Success Modal */}
      {showEditSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg md:rounded-2xl border max-w-md w-full p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-[#c5ffbc] border rounded-full mx-auto mb-4">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2 text-center" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Hubungan Berhasil Diperbarui!
            </h3>
            <p className="text-black mb-6 leading-relaxed text-sm text-center">
              Perubahan pada hubungan keuangan telah disimpan
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseEditModal}
                className="flex-1 px-5 py-2.5 bg-[#7c98ff] hover:bg-[#6b87ee] text-white rounded-full border font-bold transition-all shadow-lg text-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && selectedRelation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg md:rounded-2xl border max-w-md w-full max-h-[80vh] p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-serif font-normal text-black" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Anggota {selectedRelation.nama}
              </h3>
              <button
                onClick={() => setShowMembersModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full border transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {loadingMembers ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7c98ff]"></div>
                </div>
              ) : membersError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <p className="text-black text-sm mb-2">Error: {membersError}</p>
                  <p className="text-black text-xs">Silakan coba lagi atau hubungi administrator</p>
                </div>
              ) : relationMembers.length > 0 ? (
                <div className="space-y-3">
                  {relationMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#7c98ff] border rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-black">{member.name}</p>
                          <p className="text-xs text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.is_owner && (
                          <span className="inline-flex items-center gap-1 bg-yellow-300 border px-2 py-0.5 rounded-full text-xs font-bold">
                            <Crown className="w-3 h-3" />
                            Owner
                          </span>
                        )}
                        <p className="text-xs text-gray-500">{member.join_at}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-black">Belum ada anggota</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setShowMembersModal(false)}
                className="w-full px-5 py-2.5 bg-[#7c98ff] hover:bg-[#6b87ee] text-white rounded-full border font-bold transition-all shadow-lg text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
