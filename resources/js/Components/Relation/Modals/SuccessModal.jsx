import React from 'react';
import { Check } from 'lucide-react';

export default function SuccessModal({ show, onClose, title, message }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg md:rounded-2xl border border-black max-w-md w-full p-4 md:p-6 shadow-2xl">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 border border-black rounded-full mx-auto mb-4">
          <Check className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2 text-center" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          {title}
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed text-sm text-center">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full border border-black font-bold transition-all shadow-lg text-sm touch-manipulation"
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );
}
