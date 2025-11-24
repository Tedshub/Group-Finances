import React from 'react';
import { Check, X } from 'lucide-react';

export default function SuccessToast({ show, message, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 md:right-6 z-50 bg-white border border-black rounded-lg shadow-lg p-3 min-w-[280px] animate-slide-in">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-blue-100 border border-black rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-black" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-black text-sm mb-0.5">Berhasil</h4>
          <p className="text-xs text-gray-700">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
