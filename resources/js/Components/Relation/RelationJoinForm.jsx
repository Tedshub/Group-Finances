import React from 'react';
import { AlertCircle, RefreshCw, Clock, CheckCircle } from 'lucide-react';

export default function RelationJoinForm({
  joinKode,
  setJoinKode,
  searching,
  joinError,
  searchResult,
  handleSearch,
  handleJoin,
  handleReloadPage,
  joinSuccess,
  joinSuccessMessage
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl md:rounded-2xl border border-black p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-serif font-normal text-black mb-6" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          Gabung dengan Kode
        </h2>

        <form onSubmit={handleSearch} className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Masukkan Kode Hubungan
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinKode}
              onChange={(e) => setJoinKode(e.target.value.toUpperCase())}
              placeholder="Contoh: ABC123"
              className="flex-1 px-4 py-2.5 border border-black rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
              required
            />
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full border border-black font-bold transition-all disabled:opacity-50 shadow-lg text-sm touch-manipulation"
            >
              {searching ? 'Mencari...' : 'Cari'}
            </button>
          </div>
        </form>

        {/* Success Notification */}
        {joinSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg md:rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 font-bold text-base mb-2">Permintaan Terkirim!</p>
                <p className="text-gray-700 text-sm mb-3">{joinSuccessMessage}</p>
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Permintaan Anda sedang menunggu persetujuan dari owner. Anda dapat melihat status permintaan di bagian <strong>"Permintaan Bergabung Saya"</strong> di bawah.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {joinError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg md:rounded-xl">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 font-bold text-sm mb-1">Hubungan tidak ditemukan</p>
                <p className="text-gray-700 text-sm">{joinError}</p>
              </div>
            </div>

            <div className="bg-white border border-red-300 rounded-lg p-3 mb-3">
              <p className="text-gray-700 text-sm mb-2">
                <strong>Mungkin Anda perlu merefresh halaman dan mengulangi pencarian lagi</strong>
              </p>
              <p className="text-gray-600 text-xs mb-3">
                Silakan klik tombol di bawah ini untuk memuat ulang halaman
              </p>
              <button
                onClick={handleReloadPage}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full border border-black font-bold transition-all shadow-lg text-sm touch-manipulation"
              >
                <RefreshCw className="w-4 h-4 pointer-events-none" />
                Refresh Halaman
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3">
              <p className="text-gray-700 text-xs">
                <strong>Jika masih gagal</strong>, pastikan kode yang Anda masukkan sudah sesuai
              </p>
            </div>
          </div>
        )}

        {/* Search Result - Only show if not successful join */}
        {searchResult && !joinSuccess && (
          <div className="mb-6 p-5 bg-blue-50 border border-black rounded-lg md:rounded-2xl">
            <h3 className="font-serif font-normal text-black text-lg md:text-xl mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              {searchResult.relation.nama}
            </h3>
            {searchResult.relation.deskripsi && (
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">{searchResult.relation.deskripsi}</p>
            )}
            <div className="space-y-1 mb-4 text-gray-700 text-sm">
              <p className="font-medium">Dibuat oleh: {searchResult.relation.creator.name}</p>
              <p className="font-medium">Anggota: {searchResult.relation.users_count} orang</p>
            </div>

            {searchResult.already_joined ? (
              <div className="p-3 bg-yellow-100 border border-black rounded-lg md:rounded-xl">
                <p className="text-gray-700 font-bold text-sm">Anda sudah bergabung di hubungan ini</p>
              </div>
            ) : searchResult.has_pending_request ? (
              <div className="p-3 bg-orange-100 border border-black rounded-lg md:rounded-xl flex items-start gap-2">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-bold text-sm mb-1">Permintaan Sedang Diproses</p>
                  <p className="text-gray-700 text-sm">
                    Anda sudah mengirim permintaan bergabung. Menunggu persetujuan dari owner.
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleJoin}
                className="w-full px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full border border-black font-bold transition-all shadow-lg text-sm touch-manipulation"
              >
                Kirim Permintaan Bergabung
              </button>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gray-100 border border-black rounded-lg md:rounded-xl p-4">
          <p className="text-gray-700 text-sm">
            <strong>Tips:</strong> Minta kode dari teman atau keluarga yang sudah membuat hubungan keuangan. Permintaan bergabung Anda akan menunggu persetujuan dari owner.
          </p>
        </div>
      </div>
    </div>
  );
}
