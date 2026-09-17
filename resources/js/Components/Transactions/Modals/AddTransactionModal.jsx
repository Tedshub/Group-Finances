// resources/js/Components/Transactions/Modals/AddTransactionModal.jsx

import React, { useState, useEffect } from "react";
import { X, ArrowDownRight, ArrowUpRight, UploadCloud, Calendar, FileText } from "lucide-react";

export default function AddTransactionModal({
  show,
  onClose,
  form,
  onSubmit,
  previewBukti,
  onFileChange
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Fungsi untuk mendapatkan waktu lokal dalam format datetime-local
  const getLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Lazy loading untuk mendapatkan waktu lokal sesuai timezone
  useEffect(() => {
    if (show) {
      setIsLoading(true);

      const loadTimezone = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const localTime = getLocalDateTime();
          setCurrentDateTime(localTime);

          if (!form.data.waktu_transaksi || form.data.waktu_transaksi === new Date().toISOString().slice(0, 16)) {
            form.setData('waktu_transaksi', localTime);
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Error loading timezone:', error);
          setIsLoading(false);
        }
      };

      loadTimezone();
    } else {
      setIsLoading(false);
    }
  }, [show]);

  useEffect(() => {
    if (show && !isLoading) {
      const interval = setInterval(() => {
        setCurrentDateTime(getLocalDateTime());
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [show, isLoading]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border-2 border-black shadow-[6px_6px_0px_0px_#000] text-black">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-black px-5 py-4 flex justify-between items-center z-10">
          <div>
            <h3
              className="text-xl sm:text-2xl font-serif font-black text-black leading-tight"
              style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
            >
              Tambah Transaksi Baru
            </h3>
            <p className="text-xs font-bold text-black/60 mt-0.5">
              Catat pemasukan atau pengeluaran keuangan Anda
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex-shrink-0"
            disabled={isLoading}
            title="Tutup modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[350px]">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-black border-t-transparent mb-4"></div>
            <p className="text-black text-base font-black">Memuat formulir transaksi...</p>
            <p className="text-black/60 text-xs font-bold mt-1">Menyesuaikan waktu lokal (WIB)</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-5 md:p-6 space-y-4">
            {/* Jenis Transaksi */}
            <div>
              <label className="block text-xs uppercase tracking-wide font-black text-black mb-1.5">
                Jenis Transaksi <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Pemasukan */}
                <button
                  type="button"
                  onClick={() => form.setData('jenis', 'pemasukan')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-black font-black text-sm transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                    form.data.jenis === 'pemasukan'
                      ? 'bg-[#C8F5C8] text-black shadow-[3px_3px_0px_0px_#000]'
                      : 'bg-white text-black/60 hover:bg-gray-50'
                  }`}
                >
                  <ArrowDownRight className={`w-5 h-5 stroke-[3] ${form.data.jenis === 'pemasukan' ? 'text-black' : 'text-green-600'}`} />
                  <span>Pemasukan</span>
                </button>

                {/* Pengeluaran */}
                <button
                  type="button"
                  onClick={() => form.setData('jenis', 'pengeluaran')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-black font-black text-sm transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                    form.data.jenis === 'pengeluaran'
                      ? 'bg-red-200 text-black shadow-[3px_3px_0px_0px_#000]'
                      : 'bg-white text-black/60 hover:bg-gray-50'
                  }`}
                >
                  <ArrowUpRight className={`w-5 h-5 stroke-[3] ${form.data.jenis === 'pengeluaran' ? 'text-black' : 'text-red-600'}`} />
                  <span>Pengeluaran</span>
                </button>
              </div>
              {form.errors.jenis && (
                <p className="text-red-600 font-bold text-xs mt-1">{form.errors.jenis}</p>
              )}
            </div>

            {/* Jumlah */}
            <div>
              <label className="block text-xs uppercase tracking-wide font-black text-black mb-1.5">
                Jumlah Nominal <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-black text-sm text-black">Rp</span>
                <input
                  type="number"
                  value={form.data.jumlah}
                  onChange={(e) => form.setData('jumlah', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-black rounded-xl font-black text-black placeholder:text-black/40 bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] transition-all text-base"
                  required
                />
              </div>
              {form.errors.jumlah && (
                <p className="text-red-600 font-bold text-xs mt-1">{form.errors.jumlah}</p>
              )}
            </div>

            {/* Waktu Transaksi */}
            <div>
              <label className="block text-xs uppercase tracking-wide font-black text-black mb-1.5">
                Waktu Transaksi <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={form.data.waktu_transaksi}
                  onChange={(e) => form.setData('waktu_transaksi', e.target.value)}
                  max={currentDateTime}
                  className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-bold text-black bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] transition-all text-sm"
                  required
                />
              </div>
              <p className="text-[11px] font-bold text-black/60 mt-1">Zona waktu: Asia/Jakarta (WIB)</p>
              {form.errors.waktu_transaksi && (
                <p className="text-red-600 font-bold text-xs mt-1">{form.errors.waktu_transaksi}</p>
              )}
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-xs uppercase tracking-wide font-black text-black mb-1.5">
                Catatan Transaksi
              </label>
              <textarea
                value={form.data.catatan}
                onChange={(e) => form.setData('catatan', e.target.value)}
                placeholder="Contoh: Belanja bulanan, gaji, bayar listrik..."
                rows="3"
                className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/40 bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] transition-all resize-none text-sm"
              />
              {form.errors.catatan && (
                <p className="text-red-600 font-bold text-xs mt-1">{form.errors.catatan}</p>
              )}
            </div>

            {/* Bukti Transaksi */}
            <div>
              <label className="block text-xs uppercase tracking-wide font-black text-black mb-1.5">
                Bukti Transaksi (Opsional)
              </label>
              <div className="border-2 border-dashed border-black rounded-xl p-4 bg-yellow-50/50 hover:bg-yellow-50 transition-colors">
                <input
                  type="file"
                  id="add-bukti-file"
                  accept="image/*,.pdf"
                  onChange={onFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="add-bukti-file"
                  className="flex flex-col items-center justify-center cursor-pointer py-2"
                >
                  <UploadCloud className="w-8 h-8 text-black mb-1.5 stroke-[2.5]" />
                  <span className="text-xs font-black text-black">Klik untuk upload bukti file</span>
                  <span className="text-[11px] font-bold text-black/60 mt-0.5">JPG, PNG, atau PDF (Maks. 5MB)</span>
                </label>
              </div>

              {form.errors.bukti && (
                <p className="text-red-600 font-bold text-xs mt-1">{form.errors.bukti}</p>
              )}

              {previewBukti && (
                <div className="mt-3 p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]">
                  <p className="text-xs font-black text-black mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 stroke-[2.5]" />
                    Pratinjau File:
                  </p>
                  {typeof previewBukti === 'string' && previewBukti.endsWith('.pdf') ? (
                    <div className="p-2 bg-red-100 border border-black rounded-lg text-xs font-bold text-black">
                      Dokumen PDF dipilih
                    </div>
                  ) : (
                    <img
                      src={previewBukti}
                      alt="Preview Bukti"
                      className="max-h-48 rounded-lg border-2 border-black object-contain mx-auto"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3 border-t-2 border-black">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                disabled={form.processing}
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2.5 bg-[#7c98ff] hover:bg-[#6a88fc] text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
                disabled={form.processing}
              >
                {form.processing ? 'Menyimpan...' : 'Simpan Transaksi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
