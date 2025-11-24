// resources/js/Pages/Relations/RelationsPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Head, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from "../../Layouts/Sidebar";
import NavbarIn from "../../Layouts/NavbarIn";
import RelationTabs from "../../Components/Relation/RelationTabs";
import RelationList from "../../Components/Relation/RelationList";
import RelationCreateForm from "../../Components/Relation/RelationCreateForm";
import RelationJoinForm from "../../Components/Relation/RelationJoinForm";
import PendingRequestsList from "../../Components/Relation/PendingRequestsList";
import ConfirmationModal from "../../Components/Relation/Modals/ConfirmationModal";
import SuccessModal from "../../Components/Relation/Modals/SuccessModal";
import MembersModal from "../../Components/Relation/Modals/MembersModal";
import SuccessToast from "../../Components/Relation/SuccessToast";
import ErrorAlert from "../../Components/Relation/ErrorAlert";
import RelationSearch from "../../Components/Relation/RelationSearch";

export default function RelationsPage({ auth, relations, flash }) {
  const { props } = usePage();

  // Tab state
  const [activeTab, setActiveTab] = useState('list');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(null);
  const [showJoinSuccessModal, setShowJoinSuccessModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  // UI states
  const [copied, setCopied] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Join form states
  const [joinKode, setJoinKode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [joinedRelation, setJoinedRelation] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinSuccessMessage, setJoinSuccessMessage] = useState('');

  // Members modal states
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [relationMembers, setRelationMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState('');

  // Forms
  const createForm = useForm({
    nama: '',
    deskripsi: '',
    kode: '',
  });

  const editForm = useForm({
    nama: '',
    deskripsi: '',
    kode: '',
  });

  // Filter relations based on search term
  const filteredRelations = useMemo(() => {
    // Jika tidak ada searchTerm, kembalikan relations asli
    if (!searchTerm) return relations;

    // Buat salinan objek relations
    const filteredRelationsObj = { ...relations };

    // Filter data array di dalam relations
    filteredRelationsObj.data = relations.data.filter(relation =>
      relation.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relation.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (relation.deskripsi && relation.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filteredRelationsObj;
  }, [relations, searchTerm]);

  // Auto-refresh halaman satu kali saat pertama kali dibuka
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('relationsPageRefreshed');

    if (!hasRefreshed) {
      // Set flag bahwa halaman sudah di-refresh
      sessionStorage.setItem('relationsPageRefreshed', 'true');

      // Reload halaman setelah delay singkat
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    // Cleanup: hapus flag saat component unmount (user meninggalkan halaman)
    return () => {
      // Hapus flag saat user navigasi ke halaman lain
      const handleBeforeUnload = () => {
        sessionStorage.removeItem('relationsPageRefreshed');
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Setup axios
  useEffect(() => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
      axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }
  }, []);

  // Handle flash messages
  useEffect(() => {
    const currentFlash = props.flash || flash;

    if (currentFlash?.success) {
      if (currentFlash.success.includes('Berhasil bergabung')) {
        const match = currentFlash.success.match(/Berhasil bergabung ke '(.+?)'/);
        if (match) {
          setJoinedRelation({ nama: match[1] });
          setShowJoinSuccessModal(true);
        }
      } else if (currentFlash.success.includes('Permintaan bergabung')) {
        // Join request sent successfully
        setSuccessMessage(currentFlash.success);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      } else if (currentFlash.success.includes('Relation berhasil diupdate')) {
        setShowEditSuccessModal(true);
      } else {
        setSuccessMessage(currentFlash.success);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }
    }
  }, [props.flash, flash]);

  // Handlers
  const handleCreate = (e) => {
    e.preventDefault();
    createForm.post(route('relations.store'), {
      onSuccess: () => {
        createForm.reset();
        setActiveTab('list');
        // Hapus flag refresh agar halaman bisa di-refresh lagi setelah action
        sessionStorage.removeItem('relationsPageRefreshed');
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setJoinError('');
    setSearchResult(null);
    setJoinSuccess(false);
    setJoinSuccessMessage('');

    try {
      const response = await axios.post(route('relations.search'), {
        kode: joinKode
      });

      if (response.data.found) {
        setSearchResult(response.data);
      } else {
        setJoinError('Relation tidak ditemukan');
      }
    } catch (err) {
      console.error('Search error:', err);
      if (err.response) {
        setJoinError(err.response.data.error || 'Relation tidak ditemukan');
      } else if (err.request) {
        setJoinError('Tidak dapat terhubung ke server');
      } else {
        setJoinError('Terjadi kesalahan');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleJoin = () => {
    router.post(route('relations.join'), { kode: joinKode }, {
      onSuccess: (page) => {
        // Set success state and message
        setJoinSuccess(true);
        setJoinSuccessMessage(page.props.flash.success || 'Permintaan bergabung berhasil dikirim');

        // Reset form but stay on join tab
        setJoinKode('');
        setSearchResult(null);

        // Hapus flag refresh agar halaman bisa di-refresh lagi setelah action
        sessionStorage.removeItem('relationsPageRefreshed');
      },
      onError: (errors) => {
        setJoinError(errors.kode || 'Terjadi kesalahan saat mengirim permintaan');
      }
    });
  };

  const handleCopy = (kode) => {
    navigator.clipboard.writeText(kode);
    setCopied(kode);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = (relation) => {
    router.delete(route('relations.destroy', relation.id), {
      onSuccess: () => {
        setShowDeleteConfirm(null);
        // Hapus flag refresh agar halaman bisa di-refresh lagi setelah action
        sessionStorage.removeItem('relationsPageRefreshed');
      }
    });
  };

  const handleLeave = (relation) => {
    router.delete(route('relations.leave', relation.id), {
      onSuccess: () => {
        setShowLeaveConfirm(null);
        // Hapus flag refresh agar halaman bisa di-refresh lagi setelah action
        sessionStorage.removeItem('relationsPageRefreshed');
      }
    });
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
        // Hapus flag refresh agar halaman bisa di-refresh lagi setelah action
        sessionStorage.removeItem('relationsPageRefreshed');
      }
    });
  };

  const handleCloseJoinModal = () => {
    setShowJoinSuccessModal(false);
    // Hapus flag sebelum reload
    sessionStorage.removeItem('relationsPageRefreshed');
    router.reload();
  };

  const handleCloseEditModal = () => {
    setShowEditSuccessModal(false);
    // Hapus flag sebelum reload
    sessionStorage.removeItem('relationsPageRefreshed');
    router.reload();
  };

  const handleShowMembers = async (relation) => {
    setSelectedRelation(relation);
    setLoadingMembers(true);
    setRelationMembers([]);
    setMembersError('');
    setShowMembersModal(true);

    try {
      const response = await axios.get(route('relations.members', relation.id));

      if (response.data.users && Array.isArray(response.data.users)) {
        setRelationMembers(response.data.users);
      } else {
        setMembersError('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      if (err.response) {
        setMembersError(err.response.data.error || 'Terjadi kesalahan saat mengambil data anggota');
      } else {
        setMembersError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoadingMembers(false);
    }
  };

  // Callback untuk refresh members setelah kick
  const handleMemberKicked = async (relationId) => {
    console.log('Refreshing members for relation:', relationId);

    setLoadingMembers(true);
    setMembersError('');

    try {
      const response = await axios.get(route('relations.members', relationId));

      if (response.data.users && Array.isArray(response.data.users)) {
        setRelationMembers(response.data.users);
        console.log('Members refreshed successfully:', response.data.users);

        // Tampilkan toast success
        setSuccessMessage('Member berhasil dikeluarkan');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setMembersError('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error refreshing members:', err);
      if (err.response) {
        setMembersError(err.response.data.error || 'Terjadi kesalahan saat mengambil data anggota');
      } else {
        setMembersError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleReloadPage = () => {
    // Hapus flag sebelum reload manual
    sessionStorage.removeItem('relationsPageRefreshed');
    window.location.reload();
  };

  // Callback untuk refresh members setelah request handled (approve/reject)
  const handleRequestHandled = async (relationId) => {
    console.log('Refreshing members for relation after request handled:', relationId);

    setLoadingMembers(true);
    setMembersError('');

    try {
      const response = await axios.get(route('relations.members', relationId));

      if (response.data.users && Array.isArray(response.data.users)) {
        setRelationMembers(response.data.users);
        console.log('Members refreshed successfully:', response.data.users);

        // Tampilkan toast success
        setSuccessMessage('Permintaan berhasil diproses');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setMembersError('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error refreshing members:', err);
      if (err.response) {
        setMembersError(err.response.data.error || 'Terjadi kesalahan saat mengambil data anggota');
      } else {
        setMembersError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoadingMembers(false);
    }
  };

  return (
    <>
      <Head title="Hubungan - Couple's Finances" />
      <div className="min-h-screen h-screen flex flex-col bg-white text-gray-900">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-black mb-1">
                Hubungan Keuangan
              </h1>
              <p className="text-gray-600 text-sm">Kelola hubungan keuangan dengan pasangan atau keluarga</p>
            </div>

            {/* Success Toast */}
            <SuccessToast
              show={showSuccessToast}
              message={successMessage}
              onClose={() => setShowSuccessToast(false)}
            />

            {/* Error Alert */}
            <ErrorAlert message={flash?.error} />

            {/* Tabs */}
            <RelationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content - List */}
            {activeTab === 'list' && (
              <>
                {/* Search Bar */}
                <div className="mb-6">
                  <RelationSearch
                    onSearch={setSearchTerm}
                    placeholder="Cari hubungan keuangan berdasarkan nama, kode, atau deskripsi..."
                  />
                </div>

                {/* Relations List */}
                <RelationList
                  relations={filteredRelations} // Gunakan filtered relations
                  editingId={editingId}
                  editForm={editForm}
                  setEditingId={setEditingId}
                  handleEdit={handleEdit}
                  handleShowMembers={handleShowMembers}
                  handleCopy={handleCopy}
                  copied={copied}
                  startEdit={startEdit}
                  setShowDeleteConfirm={setShowDeleteConfirm}
                  setShowLeaveConfirm={setShowLeaveConfirm}
                  setActiveTab={setActiveTab}
                  searchTerm={searchTerm} // Pass searchTerm untuk menampilkan pesan jika tidak ada hasil
                />
              </>
            )}

            {/* Content - Create */}
            {activeTab === 'create' && (
              <RelationCreateForm
                createForm={createForm}
                handleCreate={handleCreate}
                setActiveTab={setActiveTab}
              />
            )}

            {/* Content - Join */}
            {activeTab === 'join' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Join Form - Left Side */}
                <RelationJoinForm
                  joinKode={joinKode}
                  setJoinKode={setJoinKode}
                  searching={searching}
                  joinError={joinError}
                  searchResult={searchResult}
                  handleSearch={handleSearch}
                  handleJoin={handleJoin}
                  handleReloadPage={handleReloadPage}
                  joinSuccess={joinSuccess}
                  joinSuccessMessage={joinSuccessMessage}
                />

                 {/* Pending Requests List - Right Side */}
                <PendingRequestsList />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => handleDelete(showDeleteConfirm)}
        title="Hapus Hubungan?"
        message={
          <>
            Yakin ingin menghapus <strong>"{showDeleteConfirm?.nama}"</strong>? Tindakan ini tidak dapat dibatalkan!
          </>
        }
        confirmText="Ya, Hapus"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />

      <ConfirmationModal
        show={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(null)}
        onConfirm={() => handleLeave(showLeaveConfirm)}
        title="Keluar dari Hubungan?"
        message={
          <>
            Yakin ingin keluar dari <strong>"{showLeaveConfirm?.nama}"</strong>? Anda perlu kode untuk bergabung kembali.
          </>
        }
        confirmText="Ya, Keluar"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />

      <SuccessModal
        show={showJoinSuccessModal && joinedRelation}
        onClose={handleCloseJoinModal}
        title="Berhasil Bergabung!"
        message={
          <>
            Anda berhasil bergabung dengan hubungan <strong>"{joinedRelation?.nama}"</strong>
          </>
        }
      />

      <SuccessModal
        show={showEditSuccessModal}
        onClose={handleCloseEditModal}
        title="Hubungan Berhasil Diperbarui!"
        message="Perubahan pada hubungan keuangan telah disimpan"
      />

      <MembersModal
        show={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        selectedRelation={selectedRelation}
        relationMembers={relationMembers}
        loadingMembers={loadingMembers}
        membersError={membersError}
        currentUserId={auth.user.id}
        isOwner={selectedRelation?.is_owner}
        onMemberKicked={handleMemberKicked}
        onRequestHandled={handleRequestHandled}
      />

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

        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </>
  );
}

