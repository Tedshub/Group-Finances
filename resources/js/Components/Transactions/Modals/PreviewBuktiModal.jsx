// resources/js/Components/Transactions/Modals/PreviewBuktiModal.jsx

import React from "react";
import { X, Download, FileText, AlertCircle } from "lucide-react";

export default function PreviewBuktiModal({ show, onClose, transaction }) {
  if (!show || !transaction || !transaction.bukti_preview_url) return null;

  const isPDF = transaction.bukti_type?.includes('pdf');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border-2 border-black shadow-[6px_6px_0px_0px_#000] text-black">
        {/* Header */}
        <div className="bg-white border-b-2 border-black px-5 py-4 flex justify-between items-center z-10">
          <div>
            <h3
              className="text-xl sm:text-2xl font-serif font-black text-black leading-tight"
              style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
            >
              Preview Bukti Transaksi
            </h3>
            <p className="text-xs font-bold text-black/60 mt-0.5">
              {transaction.formatted_jumlah} • {transaction.waktu_transaksi}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex-shrink-0"
            title="Tutup"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 md:p-6 bg-yellow-50/30 flex items-center justify-center">
          {isPDF ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] max-w-md w-full">
              <div className="w-16 h-16 bg-red-100 border-2 border-black rounded-2xl flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#000]">
                <FileText className="w-8 h-8 text-red-600 stroke-[2.5]" />
              </div>
              <p className="text-black font-black text-lg mb-1">Dokumen PDF</p>
              <p className="text-xs font-bold text-black/60 mb-5">
                Pratinjau PDF tidak didukung langsung di dalam jendela ini. Silakan unduh dokumen untuk melihatnya.
              </p>
              <a
                href={transaction.bukti_download_url}
                download
                className="px-6 py-2.5 bg-[#7c98ff] hover:bg-[#6a88fc] text-black font-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-2 transition-all text-xs sm:text-sm"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Unduh PDF</span>
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full min-h-[300px]">
              <img
                src={transaction.bukti_preview_url}
                alt="Bukti Transaksi"
                className="max-w-full max-h-[65vh] object-contain rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] bg-white"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className="hidden flex-col items-center justify-center text-center p-8 bg-red-100 border-2 border-black rounded-2xl"
              >
                <AlertCircle className="w-10 h-10 mb-2 text-red-600 stroke-[2.5]" />
                <p className="font-black text-black text-sm">Gagal memuat pratinjau gambar</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t-2 border-black px-5 py-3.5 flex justify-between items-center gap-3">
          <div className="text-xs font-bold text-black/70 truncate">
            {transaction.bukti_size && (
              <span>Ukuran file: {transaction.bukti_size}</span>
            )}
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white hover:bg-gray-100 text-black rounded-full border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Tutup
            </button>
            {!isPDF && transaction.bukti_download_url && (
              <a
                href={transaction.bukti_download_url}
                download
                className="px-5 py-2 bg-[#c5ffbc] hover:bg-green-300 text-black rounded-full border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Unduh</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
