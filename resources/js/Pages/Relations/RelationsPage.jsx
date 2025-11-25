import React, { useState, useEffect, useMemo } from "react";
import { Head, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import Sidebar from "../../Layouts/Sidebar";
import NavbarIn from "../../Layouts/NavbarIn";
import RelationTabs from "../../Components/Relation/RelationTabs";
import RelationList from "../../Components/Relation/RelationList";
import CreateRelationModal from "../../Components/Relation/Modals/CreateRelationModal";
import RelationJoinForm from "../../Components/Relation/RelationJoinForm";
import PendingRequestsList from "../../Components/Relation/PendingRequestsList";
import ConfirmationModal from "../../Components/Relation/Modals/ConfirmationModal";
import SuccessModal from "../../Components/Relation/Modals/SuccessModal";
import MembersModal from "../../Components/Relation/Modals/MembersModal";
import SuccessToast from "../../Components/Relation/SuccessToast";
import ErrorAlert from "../../Components/Relation/ErrorAlert";
import RelationSearch from "../../Components/Relation/RelationSearch";

export default function RelationsPage({
  auth,
  ownedRelations,
  joinedRelations,
  myPendingRequests,
  incomingRequests,
  flash
}) {
  const { props } = usePage();

  // Tab state
  const [activeTab, setActiveTab] = useState('list');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(null);
  const [showJoinSuccessModal, setShowJoinSuccessModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showLeaveSuccessModal, setShowLeaveSuccessModal] = useState(false);

  // UI states
  const [copied, setCopied] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [leftRelation, setLeftRelation] = useState(null);

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

  // Combine owned and joined relations
  const relations = useMemo(() => {
    const combined = {
      data: [
        ...(ownedRelations?.data || []),
        ...(joinedRelations?.data || [])
      ],
      links: ownedRelations?.links || {},
      meta: ownedRelations?.meta || {}
    };

    // Add is_owner property to each relation
    combined.data = combined.data.map(relation => ({
      ...relation,
      is_owner: ownedRelations?.data?.some(r => r.id === relation.id) || false
    }));

    return combined;
  }, [ownedRelations, joinedRelations]);

  // Filter relations based on search term
  const filteredRelations = useMemo(() => {
    if (!searchTerm) return relations;

    const filteredRelationsObj = { ...relations };
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
      sessionStorage.setItem('relationsPageRefreshed', 'true');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    return () => {
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
      } else if (currentFlash.success.includes('Permintaan bergabung') || currentFlash.success.includes('Request join')) {
        setSuccessMessage(currentFlash.success);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      } else if (currentFlash.success.includes('Relation berhasil diupdate')) {
        setShowEditSuccessModal(true);
      } else if (currentFlash.success.includes('keluar dari') || currentFlash.success.includes('left')) {
        // Handle success leave message
        const match = currentFlash.success.match(/keluar dari '(.+?)'/i) ||
                     currentFlash.success.match(/left '(.+?)'/i);
        if (match) {
          setLeftRelation({ nama: match[1] });
          setShowLeaveSuccessModal(true);
        } else {
          setSuccessMessage(currentFlash.success);
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 5000);
        }
      } else {
        setSuccessMessage(currentFlash.success);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }
    }
  }, [props.flash, flash]);

  // Handlers
// Di dalam komponen RelationsPage, update fungsi handleCreate:
const handleCreate = (e) => {
  e.preventDefault();
  createForm.post(route('relations.store'), {
    onSuccess: () => {
      createForm.reset();
      setShowCreateModal(false);
      sessionStorage.removeItem('relationsPageRefreshed');

      // Tambahkan reload halaman setelah berhasil membuat relation
      router.reload();
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
      const response = await axios.post(route('relations.search-by-code'), {
        kode: joinKode
      });

      if (response.data.found) {
        setSearchResult(response.data);
      } else {
        setJoinError(response.data.error || 'Relation tidak ditemukan');
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
        setJoinSuccess(true);
        setJoinSuccessMessage(page.props.flash.success || 'Permintaan bergabung berhasil dikirim');
        setJoinKode('');
        setSearchResult(null);
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
        sessionStorage.removeItem('relationsPageRefreshed');
      }
    });
  };

  // PERBAIKAN UTAMA: Handler untuk keluar dari relation
  const handleLeave = (relation) => {
    router.post(route('relations.leave', relation.id), {}, {
      onSuccess: (page) => {
        // Tutup modal konfirmasi terlebih dahulu
        setShowLeaveConfirm(null);

        // Set relation yang baru saja ditinggalkan untuk modal sukses
        setLeftRelation(relation);

        // Tampilkan modal sukses
        setShowLeaveSuccessModal(true);

        // Hapus flag refresh
        sessionStorage.removeItem('relationsPageRefreshed');
      },
      onError: (errors) => {
        // Tutup modal konfirmasi jika ada error
        setShowLeaveConfirm(null);

        // Tampilkan error message
        const errorMsg = errors.message || 'Terjadi kesalahan saat keluar dari hubungan';
        setSuccessMessage(errorMsg);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
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
        sessionStorage.removeItem('relationsPageRefreshed');
      }
    });
  };

  const handleCloseJoinModal = () => {
    setShowJoinSuccessModal(false);
    sessionStorage.removeItem('relationsPageRefreshed');
    router.reload();
  };

  const handleCloseEditModal = () => {
    setShowEditSuccessModal(false);
    sessionStorage.removeItem('relationsPageRefreshed');
    router.reload();
  };

  // Handler untuk menutup modal sukses keluar dan reload
  const handleCloseLeaveModal = () => {
    setShowLeaveSuccessModal(false);
    setLeftRelation(null);
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
      const response = await axios.get(route('relations.members-data', relation.id));

      if (response.data.members && Array.isArray(response.data.members)) {
        setRelationMembers(response.data.members);
      } else {
        setMembersError('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      if (err.response) {
        setMembersError(err.response.data.message || 'Terjadi kesalahan saat mengambil data anggota');
      } else {
        setMembersError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleMemberKicked = async (relationId) => {
    console.log('Refreshing members for relation:', relationId);

    setLoadingMembers(true);
    setMembersError('');

    try {
      const response = await axios.get(route('relations.members-data', relationId));

      if (response.data.members && Array.isArray(response.data.members)) {
        setRelationMembers(response.data.members);
        console.log('Members refreshed successfully:', response.data.members);

        setSuccessMessage('Member berhasil dikeluarkan');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setMembersError('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error refreshing members:', err);
      if (err.response) {
        setMembersError(err.response.data.message || 'Terjadi kesalahan saat mengambil data anggota');
      } else {
        setMembersError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleReloadPage = () => {
    sessionStorage.removeItem('relationsPageRefreshed');
    window.location.reload();
  };

  const handleRequestHandled = async (relationId) => {
    console.log('Refreshing members for relation after request handled:', relationId);

    setLoadingMembers(true);
    setMembersError('');

    try {
      const response = await axios.get(route('relations.members-data', relationId));

      if (response.data.members && Array.isArray(response.data.members)) {
        setRelationMembers(response.data.members);
        console.log('Members refreshed successfully:', response.data.members);

        setSuccessMessage('Permintaan berhasil diproses');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setMembersError('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error refreshing members:', err);
      if (err.response) {
        setMembersError(err.response.data.message || 'Terjadi kesalahan saat mengambil data anggota');
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
            {/* Header with Button */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-black mb-1">
                Hubungan Keuangan
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-gray-600 text-sm">Kelola hubungan keuangan dengan pasangan atau keluarga</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full border border-black font-bold transition-all shadow-lg text-sm touch-manipulation whitespace-nowrap sm:ml-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Hubungan Baru</span>
                  <span className="sm:hidden">Tambah</span>
                </button>
              </div>
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
                  relations={filteredRelations}
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
                  searchTerm={searchTerm}
                />
              </>
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
                <PendingRequestsList
                  myPendingRequests={myPendingRequests}
                  incomingRequests={incomingRequests}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <CreateRelationModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        createForm={createForm}
        handleCreate={handleCreate}
      />

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

      {/* Modal Sukses Keluar dari Relation */}
      <SuccessModal
        show={showLeaveSuccessModal && leftRelation}
        onClose={handleCloseLeaveModal}
        title="Berhasil Keluar!"
        message={
          <>
            Anda berhasil keluar dari hubungan <strong>"{leftRelation?.nama}"</strong>
          </>
        }
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
