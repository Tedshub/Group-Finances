// resources/js/Components/Transactions/Modals/DeleteConfirmationModal.jsx

import React from "react";

export default function DeleteConfirmationModal({
  show,
  onClose,
  onConfirm,
  transaction
}) {
  if (!show || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 border border-black">
        <h3 className="text-xl font-semibold mb-4">Hapus Transaksi?</h3>
        <p className="text-gray-600 mb-6">
          Yakin ingin menghapus transaksi <strong>{transaction.formatted_jumlah}</strong>?
          Tindakan ini tidak dapat dibatalkan!
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 border border-black"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(transaction)}
            className="flex-1 px-4 py-2 bg-[#C8F5C8] text-black rounded-lg hover:bg-[#b8e5b8] border border-black"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
