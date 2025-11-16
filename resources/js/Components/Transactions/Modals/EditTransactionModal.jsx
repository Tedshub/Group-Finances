// resources/js/Components/Transactions/Modals/EditTransactionModal.jsx

import React from "react";

export default function EditTransactionModal({
  show,
  onClose,
  form,
  onSubmit,
  transaction,
  previewBukti,
  onFileChange
}) {
  if (!show || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-black">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center border-b border-black">
          <h3 className="text-xl font-semibold">Edit Transaksi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
              max={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent border border-black"
            />
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

            {/* Show existing bukti */}
            {transaction.bukti_url && !form.data.remove_bukti && (
              <div className="mb-2 p-3 bg-gray-50 rounded border border-gray-200 border border-black">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bukti saat ini:</span>
                  <div className="flex gap-2">
                    <a
                      href={transaction.bukti_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-700 text-sm"
                    >
                      Lihat
                    </a>
                    <button
                      type="button"
                      onClick={() => form.setData('remove_bukti', true)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload new file */}
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
            {previewBukti && form.data.bukti && (
              <div className="mt-2">
                {typeof previewBukti === 'string' && previewBukti.includes('.pdf') ? (
                  <div className="text-sm text-gray-600">File PDF baru dipilih</div>
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
              {form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
