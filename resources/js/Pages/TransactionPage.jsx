// resources/js/Pages/TransactionPage.jsx

import React, { useState, useEffect } from "react";
import { Head, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from "@/Layouts/Sidebar";
import NavbarIn from "@/Layouts/NavbarIn";
import TransactionTable from "@/Components/Transactions/TransactionTable";
import StatisticsCards from "@/Components/Transactions/StatisticsCards";
import SearchAndFilter from "@/Components/Transactions/SearchAndFilter";
import RelationSelector from "@/Components/Transactions/RelationSelector";
import RelationsList from "@/Components/Transactions/RelationsList";
import SuccessToast from "@/Components/Transactions/SuccessToast";
import AddTransactionModal from "@/Components/Transactions/Modals/AddTransactionModal";
import EditTransactionModal from "@/Components/Transactions/Modals/EditTransactionModal";
import TransactionDetailModal from "@/Components/Transactions/Modals/TransactionDetailModal";
import DeleteConfirmationModal from "@/Components/Transactions/Modals/DeleteConfirmationModal";
import PreviewBuktiModal from "@/Components/Transactions/Modals/PreviewBuktiModal";

export default function TransactionPage({
  auth,
  relations,
  currentRelation,
  pemasukan,
  pengeluaran,
  statistik,
  search,
  flash,
  current_user_id
}) {
  const { props } = usePage();

  // States
  const [selectedRelationId, setSelectedRelationId] = useState(currentRelation?.id || '');
  const [searchTerm, setSearchTerm] = useState(search || '');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewBukti, setPreviewBukti] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTransaction, setDetailTransaction] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTransaction, setPreviewTransaction] = useState(null);

  const currentUserId = current_user_id || auth?.user?.id;

  // Form for add transaction
  const addForm = useForm({
    jenis: 'pemasukan',
    jumlah: '',
    catatan: '',
    bukti: null,
    waktu_transaksi: '',
  });

  // Form for edit transaction
  const editForm = useForm({
    jenis: '',
    jumlah: '',
    catatan: '',
    bukti: null,
    waktu_transaksi: '',
    remove_bukti: false,
  });

  useEffect(() => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
      axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const currentFlash = props.flash || flash;
    if (currentFlash?.success) {
      setSuccessMessage(currentFlash.success);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
  }, [props.flash, flash]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} | ${hours}.${minutes} WIB`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRelationChange = (e) => {
    const relationId = e.target.value;
    if (relationId) {
      router.get(route('transactions.index', relationId), { search: searchTerm });
    }
  };

  const handleRelationSelect = (relationId) => {
    if (relationId) {
      router.get(route('transactions.index', relationId), { search: searchTerm });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedRelationId) {
      router.get(route('transactions.index', selectedRelationId), { search: searchTerm }, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  const handleDateFilterChange = (filter) => setDateFilter(filter);

  const handleDownload = () => {
    if (!selectedRelationId) return;
    console.log('Download transactions with filter:', dateFilter);
  };

  const handlePreviewBukti = (transaction) => {
    setPreviewTransaction(transaction);
    setShowPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewTransaction(null);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!selectedRelationId) return;
    addForm.post(route('transactions.store', selectedRelationId), {
      onSuccess: () => { addForm.reset(); setShowAddModal(false); setPreviewBukti(null); },
      onError: (errors) => console.error('Add transaction errors:', errors),
    });
  };

  const handleEditTransaction = (e) => {
    e.preventDefault();
    if (!editingTransaction || !selectedRelationId) return;
    if (editingTransaction.user_id !== currentUserId) {
      setSuccessMessage('Anda tidak memiliki izin untuk mengedit transaksi ini.');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
      setShowEditModal(false);
      return;
    }
    editForm.put(route('transactions.update', [selectedRelationId, editingTransaction.id]), {
      onSuccess: () => { editForm.reset(); setShowEditModal(false); setEditingTransaction(null); setPreviewBukti(null); },
      onError: (errors) => console.error('Edit transaction errors:', errors),
    });
  };

  const handleDelete = (transaction) => {
    if (!selectedRelationId) return;
    if (transaction.user_id !== currentUserId) {
      setSuccessMessage('Anda tidak memiliki izin untuk menghapus transaksi ini.');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
      setShowDeleteConfirm(null);
      return;
    }
    router.delete(route('transactions.destroy', [selectedRelationId, transaction.id]), {
      onSuccess: () => setShowDeleteConfirm(null),
      onError: (errors) => console.error('Delete transaction errors:', errors),
    });
  };

  const startEdit = (transaction) => {
    if (transaction.user_id !== currentUserId) {
      setSuccessMessage('Anda tidak memiliki izin untuk mengedit transaksi ini.');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
      return;
    }
    setEditingTransaction(transaction);
    editForm.setData({
      jenis: transaction.jenis,
      jumlah: transaction.jumlah,
      catatan: transaction.catatan || '',
      bukti: null,
      waktu_transaksi: new Date(transaction.waktu_transaksi).toISOString().slice(0, 16),
      remove_bukti: false,
    });
    setPreviewBukti(null);
    setShowEditModal(true);
  };

  const showTransactionDetail = (transaction) => {
    setDetailTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleFileChange = (e, form) => {
    const file = e.target.files[0];
    if (file) {
      form.setData('bukti', file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewBukti(reader.result);
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreviewBukti(file.name);
      }
    }
  };

  const handleCloseAddModal = () => { setShowAddModal(false); addForm.reset(); setPreviewBukti(null); };
  const handleCloseEditModal = () => { setShowEditModal(false); setEditingTransaction(null); editForm.reset(); setPreviewBukti(null); };
  const handleCloseDetailModal = () => { setShowDetailModal(false); setDetailTransaction(null); };

  const relationsData = relations?.data ? relations.data : (Array.isArray(relations) ? relations : []);

  return (
    <>
      <Head title="Transaksi - Group Finances" />
      <div className="min-h-screen h-screen flex flex-col bg-[#FFFDF0]">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-w-0 px-4 sm:px-6 py-6 lg:px-10 lg:py-8">

            {/* Page Header */}
            <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1
                  className="text-3xl lg:text-4xl font-serif font-black text-black leading-tight"
                  style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                >
                  Transaksi Keuangan
                </h1>
                <p className="text-black/70 text-sm mt-1 font-bold">
                  Kelola pemasukan & pengeluaran dalam hubungan keuangan
                </p>
              </div>
            </div>

            {/* Success Toast */}
            <SuccessToast
              show={showSuccessToast}
              message={successMessage}
              onClose={() => setShowSuccessToast(false)}
            />

            {/* Error Alert */}
            {flash?.error && (
              <div className="mb-4 p-4 bg-red-100 border-2 border-black rounded-2xl text-black shadow-[4px_4px_0px_0px_#000]">
                <div className="flex items-center gap-2 font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {flash.error}
                </div>
              </div>
            )}

            {/* Main Content */}
            {selectedRelationId && currentRelation ? (
              <>
                {/* Relation Selector & Statistics */}
                <RelationSelector
                  relations={relationsData}
                  selectedRelationId={selectedRelationId}
                  onChange={handleRelationChange}
                  onAddTransaction={() => setShowAddModal(true)}
                />

                <StatisticsCards statistik={statistik} />

                <SearchAndFilter
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  dateFilter={dateFilter}
                  onDateFilterChange={handleDateFilterChange}
                  onSearch={handleSearch}
                  onDownload={handleDownload}
                />

                <TransactionTable
                  title="Pemasukan"
                  type="pemasukan"
                  data={pemasukan}
                  isMobile={isMobile}
                  onShowDetail={showTransactionDetail}
                  onEdit={startEdit}
                  onDelete={(transaction) => setShowDeleteConfirm(transaction)}
                  onPreviewBukti={handlePreviewBukti}
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                  searchTerm={searchTerm}
                  selectedRelationId={selectedRelationId}
                  currentUserId={currentUserId}
                />

                <TransactionTable
                  title="Pengeluaran"
                  type="pengeluaran"
                  data={pengeluaran}
                  isMobile={isMobile}
                  onShowDetail={showTransactionDetail}
                  onEdit={startEdit}
                  onDelete={(transaction) => setShowDeleteConfirm(transaction)}
                  onPreviewBukti={handlePreviewBukti}
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                  searchTerm={searchTerm}
                  selectedRelationId={selectedRelationId}
                  currentUserId={currentUserId}
                />
              </>
            ) : (
              <RelationsList
                relations={relationsData}
                onSelect={handleRelationSelect}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <AddTransactionModal
        show={showAddModal}
        onClose={handleCloseAddModal}
        form={addForm}
        onSubmit={handleAddTransaction}
        previewBukti={previewBukti}
        onFileChange={(e) => handleFileChange(e, addForm)}
      />
      <EditTransactionModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        form={editForm}
        onSubmit={handleEditTransaction}
        transaction={editingTransaction}
        previewBukti={previewBukti}
        onFileChange={(e) => handleFileChange(e, editForm)}
        onPreviewExistingBukti={handlePreviewBukti}
      />
      <TransactionDetailModal
        show={showDetailModal}
        onClose={handleCloseDetailModal}
        transaction={detailTransaction}
        onEdit={startEdit}
        onDelete={(transaction) => setShowDeleteConfirm(transaction)}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        currentUserId={currentUserId}
      />
      <DeleteConfirmationModal
        show={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        transaction={showDeleteConfirm}
      />
      <PreviewBuktiModal
        show={showPreviewModal}
        onClose={handleClosePreviewModal}
        transaction={previewTransaction}
      />
    </>
  );
}
