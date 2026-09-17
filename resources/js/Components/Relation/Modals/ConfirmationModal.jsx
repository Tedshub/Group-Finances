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
  confirmButtonClass = "bg-red-300 hover:bg-red-400 text-black"
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_#000] max-w-md w-full p-5 md:p-6 text-black">
        <h3
          className="text-xl md:text-2xl font-serif font-black text-black mb-2 leading-snug"
          style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
        >
          {title}
        </h3>
        <p className="text-black/80 font-bold mb-6 leading-relaxed text-sm">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-5 py-2.5 rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
