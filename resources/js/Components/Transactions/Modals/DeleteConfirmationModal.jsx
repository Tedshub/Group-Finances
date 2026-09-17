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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 md:p-6 border-2 border-black shadow-[6px_6px_0px_0px_#000] text-black">
        <h3
          className="text-xl sm:text-2xl font-serif font-black text-black mb-2 leading-tight"
          style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
        >
          Hapus Transaksi?
        </h3>
        <p className="text-black/80 font-bold mb-6 leading-relaxed text-sm">
          Yakin ingin menghapus transaksi sebesar <span className="bg-yellow-200 px-1.5 py-0.5 border border-black rounded font-black">{transaction.formatted_jumlah}</span>? Tindakan ini tidak dapat dibatalkan!
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(transaction)}
            className="flex-1 px-5 py-2.5 bg-red-300 hover:bg-red-400 text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
