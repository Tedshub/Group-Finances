// resources/js/Pages/Transactions/TransactionPage.jsx

import React, { useState, useEffect } from "react";
import { Head, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from "../../Layouts/Sidebar";
import NavbarIn from "../../Layouts/NavbarIn";
import TransactionTable from "../../Components/Transactions/TransactionTable";
import StatisticsCards from "../../Components/Transactions/StatisticsCards";
import SearchAndFilter from "../../Components/Transactions/SearchAndFilter";
import RelationSelector from "../../Components/Transactions/RelationSelector";
import RelationsList from "../../Components/Transactions/RelationsList";
import SuccessToast from "../../Components/Transactions/SuccessToast";
import AddTransactionModal from "../../Components/Transactions/Modals/AddTransactionModal";
import EditTransactionModal from "../../Components/Transactions/Modals/EditTransactionModal";
import TransactionDetailModal from "../../Components/Transactions/Modals/TransactionDetailModal";
import DeleteConfirmationModal from "../../Components/Transactions/Modals/DeleteConfirmationModal";
import PreviewBuktiModal from "../../Components/Transactions/Modals/PreviewBuktiModal";

export default function TransactionPage({ auth, relations, currentRelation, pemasukan, pengeluaran, statistik, search, flash }) {
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

  // NEW: State untuk preview bukti modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTransaction, setPreviewTransaction] = useState(null);

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

  // Setup axios
  useEffect(() => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
      axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }
  }, []);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle flash messages
  useEffect(() => {
    const currentFlash = props.flash || flash;
    if (currentFlash?.success) {
      setSuccessMessage(currentFlash.success);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
  }, [props.flash, flash]);

  // Format date to "DD/MM/YYYY | HH.MM WIB"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} | ${hours}.${minutes} WIB`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle relation change from dropdown
  const handleRelationChange = (e) => {
    const relationId = e.target.value;
    if (relationId) {
      router.get(route('transactions.index', relationId), {
        search: searchTerm,
      });
    }
  };

  // Handle relation selection from list
  const handleRelationSelect = (relationId) => {
    if (relationId) {
      router.get(route('transactions.index', relationId), {
        search: searchTerm,
      });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedRelationId) {
      router.get(route('transactions.index', selectedRelationId), {
        search: searchTerm,
      }, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  // Handle date filter change
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    // TODO: Implement backend filtering
  };

  // Handle download transactions
  const handleDownload = () => {
    if (!selectedRelationId) return;
    // TODO: Implement download functionality
    console.log('Download transactions with filter:', dateFilter);
  };

  // NEW: Handle preview bukti dari tabel
  const handlePreviewBukti = (transaction) => {
    setPreviewTransaction(transaction);
    setShowPreviewModal(true);
  };

  // NEW: Handle close preview modal
  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewTransaction(null);
  };

  // Handle add transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();

    if (!selectedRelationId) return;

    addForm.post(route('transactions.store', selectedRelationId), {
      onSuccess: () => {
        addForm.reset();
        setShowAddModal(false);
        setPreviewBukti(null);
      }
    });
  };

  // Handle edit transaction
  const handleEditTransaction = (e) => {
    e.preventDefault();

    if (!editingTransaction || !selectedRelationId) return;

    editForm.put(route('transactions.update', [selectedRelationId, editingTransaction.id]), {
      onSuccess: () => {
        editForm.reset();
        setShowEditModal(false);
        setEditingTransaction(null);
        setPreviewBukti(null);
      }
    });
  };

  // Handle delete transaction
  const handleDelete = (transaction) => {
    if (!selectedRelationId) return;

    router.delete(route('transactions.destroy', [selectedRelationId, transaction.id]), {
      onSuccess: () => {
        setShowDeleteConfirm(null);
      }
    });
  };

  // Start edit
  const startEdit = (transaction) => {
    setEditingTransaction(transaction);
    editForm.setData({
      jenis: transaction.jenis,
      jumlah: transaction.jumlah,
      catatan: transaction.catatan || '',
      bukti: null,
      waktu_transaksi: new Date(transaction.waktu_transaksi).toISOString().slice(0, 16),
      remove_bukti: false,
    });
    setPreviewBukti(null); // Reset preview untuk file baru
    setShowEditModal(true);
  };

  // Show transaction detail (for mobile)
  const showTransactionDetail = (transaction) => {
    setDetailTransaction(transaction);
    setShowDetailModal(true);
  };

  // Handle file change for add/edit
  const handleFileChange = (e, form) => {
    const file = e.target.files[0];
    if (file) {
      form.setData('bukti', file);

      // Preview untuk file baru
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewBukti(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreviewBukti(file.name); // Untuk PDF, simpan nama file
      }
    }
  };

  // Handle close modals
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    addForm.reset();
    setPreviewBukti(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
    editForm.reset();
    setPreviewBukti(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailTransaction(null);
  };

  // Get relations data - handle both formats
  const relationsData = relations?.data ? relations.data : (Array.isArray(relations) ? relations : []);

  return (
    <>
      <Head title="Transaksi - Couple's Finances" />
      <div className="min-h-screen h-screen flex flex-col bg-white text-gray-900">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-black mb-1">
                Transaksi Keuangan
              </h1>
              <p className="text-gray-600 text-sm">Kelola pemasukan dan pengeluaran dalam hubungan keuangan</p>
            </div>

            {/* Success Toast */}
            <SuccessToast
              show={showSuccessToast}
              message={successMessage}
              onClose={() => setShowSuccessToast(false)}
            />

            {/* Error Alert */}
            {flash?.error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 border border-black">
                {flash.error}
              </div>
            )}

            {/* Only show content if relation is selected */}
            {selectedRelationId && currentRelation ? (
              <>
                {/* Relation Selector & Actions */}
                <RelationSelector
                  relations={relationsData}
                  selectedRelationId={selectedRelationId}
                  onChange={handleRelationChange}
                  onAddTransaction={() => setShowAddModal(true)}
                />

                {/* Statistics Cards */}
                <StatisticsCards statistik={statistik} />

                {/* Search & Filter */}
                <SearchAndFilter
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  dateFilter={dateFilter}
                  onDateFilterChange={handleDateFilterChange}
                  onSearch={handleSearch}
                  onDownload={handleDownload}
                />

                {/* Pemasukan Table */}
                <TransactionTable
                  title="Pemasukan"
                  type="pemasukan"
                  data={pemasukan}
                  isMobile={isMobile}
                  onShowDetail={showTransactionDetail}
                  onEdit={startEdit}
                  onDelete={(transaction) => setShowDeleteConfirm(transaction)}
                  onPreviewBukti={handlePreviewBukti} // Add this prop
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                  searchTerm={searchTerm}
                  selectedRelationId={selectedRelationId}
                />

                {/* Pengeluaran Table */}
                <TransactionTable
                  title="Pengeluaran"
                  type="pengeluaran"
                  data={pengeluaran}
                  isMobile={isMobile}
                  onShowDetail={showTransactionDetail}
                  onEdit={startEdit}
                  onDelete={(transaction) => setShowDeleteConfirm(transaction)}
                  onPreviewBukti={handlePreviewBukti} // Add this prop
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                  searchTerm={searchTerm}
                  selectedRelationId={selectedRelationId}
                />
              </>
            ) : (
              /* Relations List - Show when no relation is selected */
              <RelationsList
                relations={relationsData}
                onSelect={handleRelationSelect}
              />
            )}
          </main>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        show={showAddModal}
        onClose={handleCloseAddModal}
        form={addForm}
        onSubmit={handleAddTransaction}
        previewBukti={previewBukti}
        onFileChange={(e) => handleFileChange(e, addForm)}
      />

      {/* Edit Transaction Modal */}
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

      {/* Transaction Detail Modal (Mobile) */}
      <TransactionDetailModal
        show={showDetailModal}
        onClose={handleCloseDetailModal}
        transaction={detailTransaction}
        onEdit={startEdit}
        onDelete={(transaction) => setShowDeleteConfirm(transaction)}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        transaction={showDeleteConfirm}
      />

      {/* Preview Bukti Modal */}
      <PreviewBuktiModal
        show={showPreviewModal}
        onClose={handleClosePreviewModal}
        transaction={previewTransaction}
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

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
}
