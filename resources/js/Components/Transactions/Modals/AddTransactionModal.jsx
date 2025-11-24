// resources/js/Components/Transactions/Modals/AddTransactionModal.jsx

import React, { useState, useEffect } from "react";

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
    // Format: YYYY-MM-DDTHH:mm
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

      // Simulasi lazy loading
      const loadTimezone = async () => {
        try {
          // Delay untuk efek loading
          await new Promise(resolve => setTimeout(resolve, 500));

          const localTime = getLocalDateTime();
          setCurrentDateTime(localTime);

          // Set waktu default ke form hanya jika belum ada nilai atau masih default
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
      // Reset loading state saat modal ditutup
      setIsLoading(false);
    }
  }, [show]);

  // Update max datetime setiap detik untuk akurasi
  useEffect(() => {
    if (show && !isLoading) {
      const interval = setInterval(() => {
        setCurrentDateTime(getLocalDateTime());
      }, 60000); // Update setiap menit

      return () => clearInterval(interval);
    }
  }, [show, isLoading]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-black">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center border-b border-black">
          <h3 className="text-xl font-semibold">Tambah Transaksi Baru</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Memuat data timezone...</p>
            <p className="text-gray-400 text-sm mt-2">Menyesuaikan dengan Asia/Jakarta (WIB)</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6">
            {/* Jenis Transaksi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Transaksi <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="pemasukan"
                    checked={form.data.jenis === 'pemasukan'}
                    onChange={(e) => form.setData('jenis', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-green-600 font-medium">Pemasukan</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="pengeluaran"
                    checked={form.data.jenis === 'pengeluaran'}
                    onChange={(e) => form.setData('jenis', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-red-600 font-medium">Pengeluaran</span>
                </label>
              </div>
              {form.errors.jenis && (
                <p className="text-red-500 text-sm mt-1">{form.errors.jenis}</p>
              )}
            </div>

            {/* Jumlah */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                <input
                  type="number"
                  value={form.data.jumlah}
                  onChange={(e) => form.setData('jumlah', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent border border-black"
                />
              </div>
              {form.errors.jumlah && (
                <p className="text-red-500 text-sm mt-1">{form.errors.jumlah}</p>
              )}
            </div>

            {/* Waktu Transaksi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Transaksi <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.data.waktu_transaksi}
                onChange={(e) => form.setData('waktu_transaksi', e.target.value)}
                max={currentDateTime}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent border border-black"
              />
              <p className="text-xs text-gray-500 mt-1">Timezone: Asia/Jakarta (WIB)</p>
              {form.errors.waktu_transaksi && (
                <p className="text-red-500 text-sm mt-1">{form.errors.waktu_transaksi}</p>
              )}
            </div>

            {/* Catatan */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                value={form.data.catatan}
                onChange={(e) => form.setData('catatan', e.target.value)}
                placeholder="Deskripsi transaksi..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent border border-black"
              />
              {form.errors.catatan && (
                <p className="text-red-500 text-sm mt-1">{form.errors.catatan}</p>
              )}
            </div>

            {/* Bukti */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bukti Transaksi
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={onFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent border border-black"
              />
              <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, PDF (Max 5MB)</p>
              {form.errors.bukti && (
                <p className="text-red-500 text-sm mt-1">{form.errors.bukti}</p>
              )}
              {previewBukti && (
                <div className="mt-2">
                  {previewBukti.endsWith('.pdf') ? (
                    <div className="text-sm text-gray-600">File PDF dipilih</div>
                  ) : (
                    <img src={previewBukti} alt="Preview" className="max-h-40 rounded border border-black" />
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 border border-black"
                disabled={form.processing}
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#C8F5C8] text-black rounded-lg hover:bg-[#b8e5b8] disabled:bg-gray-400 border border-black"
                disabled={form.processing}
              >
                {form.processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
