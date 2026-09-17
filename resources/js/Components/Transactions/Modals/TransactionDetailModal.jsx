// resources/js/Components/Transactions/Modals/TransactionDetailModal.jsx

import React from "react";
import { X, ArrowDownRight, ArrowUpRight, Calendar, User, FileText, Download, Edit, Trash2, AlertCircle } from "lucide-react";

export default function TransactionDetailModal({
  show,
  onClose,
  transaction,
  onEdit,
  onDelete,
  formatDate,
  formatCurrency,
  currentUserId
}) {
  if (!show || !transaction) return null;

  const isOwner = transaction.user_id === currentUserId;
  const canEdit = transaction.can_edit && isOwner;
  const canDelete = transaction.can_delete && isOwner;

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-black shadow-[6px_6px_0px_0px_#000] text-black">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-black px-5 py-4 flex justify-between items-center z-10">
          <div>
            <h3
              className="text-xl sm:text-2xl font-serif font-black text-black leading-tight"
              style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
            >
              Detail Transaksi
            </h3>
            <p className="text-xs font-bold text-black/60 mt-0.5">
              Informasi lengkap transaksi keuangan
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex-shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 space-y-4">
          {/* Status Banner / Jumlah Card */}
          <div className={`p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] ${
            transaction.jenis === 'pemasukan' ? 'bg-[#C8F5C8]' : 'bg-red-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border-2 border-black bg-white text-xs font-black text-black shadow-[1px_1px_0px_0px_#000]">
                {transaction.jenis === 'pemasukan' ? (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-green-600 stroke-[3]" />
                    <span>Pemasukan</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-red-600 stroke-[3]" />
                    <span>Pengeluaran</span>
                  </>
                )}
              </span>

              <span className="text-[11px] font-bold text-black/70">
                {transaction.waktu_transaksi_human || ''}
              </span>
            </div>

            <div className="text-3xl font-black text-black tracking-tight mt-2">
              {formatCurrency(transaction.jumlah)}
            </div>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tanggal & Waktu */}
            <div className="p-3.5 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-1.5 text-xs font-black text-black/60 uppercase tracking-wide mb-1">
                <Calendar className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Waktu Transaksi</span>
              </div>
              <div className="font-black text-black text-sm">
                {formatDate(transaction.waktu_transaksi)}
              </div>
            </div>

            {/* Dibuat Oleh */}
            <div className="p-3.5 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-1.5 text-xs font-black text-black/60 uppercase tracking-wide mb-1">
                <User className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Dibuat Oleh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-black text-sm truncate">
                  {transaction.user?.name || transaction.user_name || '-'}
                </span>
                {isOwner && (
                  <span className="text-[10px] font-black bg-blue-100 border border-black text-black px-1.5 py-0.2 rounded-full shadow-[1px_1px_0px_0px_#000]">
                    Anda
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div className="p-3.5 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <div className="text-xs font-black text-black/60 uppercase tracking-wide mb-1">
              Catatan
            </div>
            <p className="font-bold text-black text-sm whitespace-pre-wrap leading-relaxed">
              {transaction.catatan || <span className="text-black/40 italic font-medium">Tidak ada catatan</span>}
            </p>
          </div>

          {/* Bukti Transaksi */}
          {transaction.has_bukti && (transaction.bukti_preview_url || transaction.bukti_url) && (
            <div className="p-3.5 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-black uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  <span>Bukti Transaksi</span>
                </div>
                {transaction.bukti_size && (
                  <span className="text-[11px] font-bold text-black/60">
                    {formatFileSize(transaction.bukti_size)}
                  </span>
                )}
              </div>

              {/* Preview Area */}
              <div className="rounded-xl border-2 border-black overflow-hidden bg-gray-50 mb-3">
                {transaction.bukti_type?.startsWith('image/') ? (
                  <img
                    src={transaction.bukti_preview_url || transaction.bukti_url}
                    alt="Bukti Transaksi"
                    className="w-full h-auto max-h-80 object-contain mx-auto"
                    loading="lazy"
                  />
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-red-100 border-2 border-black rounded-xl flex items-center justify-center mb-2 shadow-[2px_2px_0px_0px_#000]">
                      <FileText className="w-6 h-6 text-red-600 stroke-[2.5]" />
                    </div>
                    <span className="font-black text-sm text-black">Dokumen PDF</span>
                    <span className="text-xs font-bold text-black/60 mt-0.5">{transaction.bukti_name || 'bukti_transaksi.pdf'}</span>
                  </div>
                )}
              </div>

              {/* Download link */}
              {transaction.bukti_download_url && (
                <a
                  href={transaction.bukti_download_url}
                  download
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-yellow-100 hover:bg-yellow-200 text-black font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Unduh File Bukti</span>
                </a>
              )}
            </div>
          )}

          {/* Action Buttons - HANYA untuk owner */}
          {(canEdit || canDelete) ? (
            <div className="flex gap-3 pt-3 border-t-2 border-black">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(transaction);
                  }}
                  className="flex-1 px-5 py-2.5 bg-[#7c98ff] hover:bg-[#6a88fc] text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit className="w-4 h-4 stroke-[2.5]" />
                  <span>Edit</span>
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDelete(transaction);
                  }}
                  className="flex-1 px-5 py-2.5 bg-red-200 hover:bg-red-300 text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          ) : (
            !isOwner && (
              <div className="p-3 bg-yellow-100 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-start gap-2 text-xs font-bold text-black">
                <AlertCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
                <span>Hanya pembuat transaksi yang dapat mengedit atau menghapus transaksi ini.</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
