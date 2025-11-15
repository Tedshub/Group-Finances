// resources/js/Components/Relation/Modals/ConfirmationModal.jsx
import React from 'react';

export default function ConfirmationModal({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  confirmButtonClass = "bg-red-500 hover:bg-red-600"
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg md:rounded-2xl border border-black max-w-md w-full p-4 md:p-6 shadow-2xl">
        <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          {title}
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed text-sm">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 px-5 py-2.5 text-white rounded-full border border-black font-bold transition-all shadow-lg text-sm touch-manipulation ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-full border border-black font-bold transition-all text-sm touch-manipulation"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
