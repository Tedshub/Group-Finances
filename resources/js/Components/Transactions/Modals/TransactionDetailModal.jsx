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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-black">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center border-b border-black">
          <h3 className="text-xl font-semibold">Detail Transaksi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Jenis Transaksi */}
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Jenis Transaksi</div>
            <div className={`font-medium ${transaction.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
            </div>
          </div>

          {/* Tanggal */}
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Tanggal</div>
            <div className="font-medium">{formatDate(transaction.waktu_transaksi)}</div>
          </div>

          {/* Jumlah */}
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Jumlah</div>
            <div className={`font-medium text-lg ${transaction.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(transaction.jumlah)}
            </div>
          </div>

          {/* Catatan */}
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Catatan</div>
            <div className="font-medium">{transaction.catatan || '-'}</div>
          </div>

          {/* Bukti */}
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Bukti</div>
            {transaction.bukti_url ? (
              <a
                href={transaction.bukti_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700"
              >
                Lihat Bukti
              </a>
            ) : (
              <div>-</div>
            )}
          </div>

          {/* User */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">User</div>
            <div className="font-medium">
              {transaction.user ? transaction.user.name : transaction.user_name || '-'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {transaction.can_edit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(transaction);
                }}
                className="flex-1 px-4 py-2 bg-[#C8F5C8] text-black rounded-lg hover:bg-[#b8e5b8] border border-black"
              >
                Edit
              </button>
            )}
            {transaction.can_delete && (
              <button
                onClick={() => {
                  onClose();
                  onDelete(transaction);
                }}
                className="flex-1 px-4 py-2 bg-[#C8F5C8] text-black rounded-lg hover:bg-[#b8e5b8] border border-black"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
