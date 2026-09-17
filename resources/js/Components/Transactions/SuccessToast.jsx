// resources/js/Components/Transactions/SuccessToast.jsx

import React from "react";

export default function SuccessToast({ show, message, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="bg-[#C8F5C8] text-black px-5 py-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-black flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-black text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-1 w-5 h-5 flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-red-100 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
