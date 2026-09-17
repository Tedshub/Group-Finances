import React from 'react';
import { X, Sparkles } from 'lucide-react';

export default function CreateRelationModal({ show, onClose, createForm, handleCreate }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_#000] p-5 md:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up text-black">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-black">
          <div>
            <h2
              className="text-2xl md:text-3xl font-serif font-black text-black leading-tight"
              style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
            >
              Buat Hubungan Baru
            </h2>
            <p className="text-xs font-bold text-black/70 mt-1">
              Bentuk grup hubungan keuangan baru bersama anggota lain
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex-shrink-0"
            title="Tutup modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide font-black text-black mb-1.5">
              Nama Hubungan <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={createForm.data.nama}
              onChange={(e) => createForm.setData('nama', e.target.value)}
              placeholder="Contoh: Keluarga Bahagia / Kas Kosan"
              className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/40 bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] transition-all text-sm"
              required
            />
            {createForm.errors.nama && (
              <p className="mt-1 text-xs text-red-600 font-bold">{createForm.errors.nama}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide font-black text-black mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={createForm.data.deskripsi}
              onChange={(e) => createForm.setData('deskripsi', e.target.value)}
              placeholder="Jelaskan tujuan hubungan ini..."
              rows={3}
              className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/40 bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] transition-all resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide font-black text-black mb-1.5">
              Kode Hubungan (Opsional)
            </label>
            <input
              type="text"
              value={createForm.data.kode || ''}
              onChange={(e) => createForm.setData('kode', e.target.value.toUpperCase())}
              placeholder="Kosongkan untuk auto-generate"
              className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-mono font-bold text-black placeholder:text-black/40 bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] transition-all text-sm uppercase tracking-wider"
            />
            <p className="mt-1 text-[11px] font-bold text-black/60">Hanya huruf dan angka tanpa spasi</p>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-100 border-2 border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_#000] flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
            <p className="text-black font-bold text-xs sm:text-sm leading-relaxed">
              Anda akan otomatis menjadi <span className="bg-yellow-300 px-1 py-0.5 border border-black rounded font-black">Owner</span> dan dapat mengundang anggota lain menggunakan kode hubungan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={createForm.processing}
              className="flex-1 bg-[#7c98ff] hover:bg-[#6a88fc] text-black px-6 py-2.5 rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
            >
              {createForm.processing ? 'Membuat...' : 'Buat Hubungan'}
            </button>
          </div>
        </form>
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
          animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
