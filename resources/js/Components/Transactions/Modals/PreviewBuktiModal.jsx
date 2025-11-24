// resources/js/Components/Transactions/Modals/PreviewBuktiModal.jsx

import React from "react";

export default function PreviewBuktiModal({ show, onClose, transaction }) {
  if (!show || !transaction || !transaction.bukti_preview_url) return null;

  const isPDF = transaction.bukti_type?.includes('pdf');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-black">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center border-b border-black">
          <div>
            <h3 className="text-xl font-semibold">Preview Bukti Transaksi</h3>
            <p className="text-sm text-gray-600 mt-1">
              {transaction.formatted_jumlah} - {transaction.waktu_transaksi}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {isPDF ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <svg className="w-20 h-20 text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 font-medium mb-2 text-lg">File PDF</p>
              <p className="text-sm text-gray-500 mb-6">Preview PDF tidak tersedia di browser</p>
              <a
                href={transaction.bukti_download_url}
                download
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 border border-black inline-flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <img
                src={transaction.bukti_preview_url}
                alt="Bukti Transaksi"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg border border-gray-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className="hidden flex-col items-center justify-center text-gray-500"
                style={{ minHeight: '400px' }}
              >
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Gagal memuat gambar</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center border-t border-black">
          <div className="text-sm text-gray-600">
            {transaction.bukti_size && (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ukuran: {transaction.bukti_size}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 border border-black transition-colors"
            >
              Tutup
            </button>
            {!isPDF && (
              <a
                href={transaction.bukti_download_url}
                download
                className="px-4 py-2 bg-[#C8F5C8] text-black rounded-lg hover:bg-[#b8e5b8] border border-black inline-flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
