import React from 'react';

export default function RelationCreateForm({ createForm, handleCreate, setActiveTab }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl md:rounded-2xl border border-black p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-serif font-normal text-black mb-6" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          Buat Hubungan Baru
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
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
              required
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
              value={createForm.data.kode}
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
              type="submit"
              disabled={createForm.processing}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full border border-black font-bold transition-all disabled:opacity-50 shadow-lg text-sm touch-manipulation"
            >
              {createForm.processing ? 'Membuat...' : 'Buat Hubungan'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-full border border-black font-bold transition-all text-sm touch-manipulation"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
