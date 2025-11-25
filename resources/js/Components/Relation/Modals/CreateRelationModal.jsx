import React from 'react';
import { X } from 'lucide-react';

export default function CreateRelationModal({ show, onClose, createForm, handleCreate }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-xl md:rounded-2xl border border-black p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-serif font-normal text-black" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Buat Hubungan Baru
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nama Hubungan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={createForm.data.nama}
              onChange={(e) => createForm.setData('nama', e.target.value)}
              placeholder="Contoh: Keluarga Bahagia"
              className="w-full px-4 py-2.5 border border-black rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            />
            {createForm.errors.nama && (
              <p className="mt-1 text-xs text-red-600 font-medium">{createForm.errors.nama}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
            <textarea
              value={createForm.data.deskripsi}
              onChange={(e) => createForm.setData('deskripsi', e.target.value)}
              placeholder="Jelaskan tujuan hubungan ini..."
              rows={3}
              className="w-full px-4 py-2.5 border border-black rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Kode (Opsional)
            </label>
            <input
              type="text"
              value={createForm.data.kode || ''}
              onChange={(e) => createForm.setData('kode', e.target.value.toUpperCase())}
              placeholder="Kosongkan untuk auto-generate"
              className="w-full px-4 py-2.5 border border-black rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
            />
            <p className="mt-1 text-xs text-gray-600">Hanya huruf dan angka</p>
          </div>

          <div className="bg-blue-50 border border-black rounded-lg md:rounded-xl p-4">
            <p className="text-gray-700 font-medium text-sm">
              Anda akan menjadi owner dan bisa mengundang anggota lain dengan kode
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={createForm.processing}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full border border-black font-bold transition-all disabled:opacity-50 shadow-lg text-sm touch-manipulation"
            >
              {createForm.processing ? 'Membuat...' : 'Buat Hubungan'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-full border border-black font-bold transition-all text-sm touch-manipulation"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
