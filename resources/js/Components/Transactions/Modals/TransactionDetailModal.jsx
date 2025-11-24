// resources/js/Components/Transactions/Modals/TransactionDetailModal.jsx

import React from "react";

export default function TransactionDetailModal({
  show,
  onClose,
  transaction,
  onEdit,
  onDelete,
  formatDate,
  formatCurrency
}) {
  if (!show || !transaction) return null;

  // Format file size untuk display
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-black">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center border-b border-black">
          <h3 className="text-xl font-semibold">Detail Transaksi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Jenis Transaksi */}
          <div>
            <div className="text-sm text-gray-500 mb-1.5 font-medium">Jenis Transaksi</div>
            <div className={`font-semibold text-lg ${transaction.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
            </div>
          </div>

          {/* Tanggal & Waktu */}
          <div>
            <div className="text-sm text-gray-500 mb-1.5 font-medium">Tanggal & Waktu</div>
            <div className="font-medium text-gray-900">{formatDate(transaction.waktu_transaksi)}</div>
            {transaction.waktu_transaksi_human && (
              <div className="text-xs text-gray-500 mt-1">{transaction.waktu_transaksi_human}</div>
            )}
          </div>

          {/* Jumlah */}
          <div>
            <div className="text-sm text-gray-500 mb-1.5 font-medium">Jumlah</div>
            <div className={`font-bold text-2xl ${transaction.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(transaction.jumlah)}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <div className="text-sm text-gray-500 mb-1.5 font-medium">Catatan</div>
            <div className="font-medium text-gray-900 whitespace-pre-wrap">
              {transaction.catatan || <span className="text-gray-400 italic">Tidak ada catatan</span>}
            </div>
          </div>

          {/* Bukti Transaksi */}
          <div>
            <div className="text-sm text-gray-500 mb-1.5 font-medium">Bukti Transaksi</div>
            {transaction.has_bukti && (transaction.bukti_preview_url || transaction.bukti_url) ? (
              <div className="space-y-3">
                {/* Preview Area */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  {transaction.bukti_type?.startsWith('image/') ? (
                    // Image Preview
                    <div className="relative group">
                      <img
                        src={transaction.bukti_preview_url || transaction.bukti_url}
                        alt="Bukti Transaksi"
                        className="w-full h-auto max-h-96 object-contain bg-gray-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                    </div>
                  ) : transaction.bukti_type === 'application/pdf' ? (
                    // PDF Preview
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">File PDF</p>
                      <p className="text-sm text-gray-500">Klik tombol di bawah untuk melihat atau mengunduh</p>
                    </div>
                  ) : (
                    // Other File Types
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">File Bukti</p>
                      <p className="text-sm text-gray-500">Klik tombol di bawah untuk mengunduh</p>
                    </div>
                  )}
                </div>

                {/* File Info & Actions */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Bukti Transaksi</div>
                      {transaction.bukti_size && (
                        <div className="text-xs text-gray-500">{formatFileSize(transaction.bukti_size)}</div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Preview Button - Hanya untuk PDF */}
                    {transaction.bukti_type === 'application/pdf' && (
                      <a
                        href={transaction.bukti_preview_url || transaction.bukti_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-1.5"
                        title="Lihat PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Lihat
                      </a>
                    )}

                    {/* Download Button */}
                    <a
                      href={transaction.bukti_download_url || transaction.bukti_url}
                      className="px-3 py-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium flex items-center gap-1.5"
                      title="Unduh File"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Unduh
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 italic">Tidak ada bukti</div>
            )}
          </div>

          {/* Dibuat Oleh */}
          <div>
            <div className="text-sm text-gray-500 mb-1.5 font-medium">Dibuat Oleh</div>
            <div className="flex items-center gap-2">
              <div className="font-medium text-gray-900">
                {transaction.user?.name || transaction.user_name || '-'}
              </div>
            </div>
          </div>

          {/* Dibuat Pada */}
          {transaction.created_at && (
            <div>
              <div className="text-sm text-gray-500 mb-1.5 font-medium">Dibuat Pada</div>
              <div className="text-sm text-gray-600">{transaction.created_at}</div>
            </div>
          )}

          {/* Divider */}
          {(transaction.can_edit || transaction.can_delete) && (
            <div className="border-t border-gray-200 -mx-6 my-4"></div>
          )}

          {/* Action Buttons */}
          {(transaction.can_edit || transaction.can_delete) && (
            <div className="flex gap-3 pt-2">
              {transaction.can_edit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(transaction);
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#C8F5C8] text-black rounded-lg hover:bg-[#b8e5b8] border border-black font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
              {transaction.can_delete && (
                <button
                  onClick={() => {
                    onClose();
                    onDelete(transaction);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
