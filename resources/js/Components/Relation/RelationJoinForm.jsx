// resources/js/Components/Relation/RelationJoinForm.jsx
import React from 'react';
import { AlertCircle, RefreshCw, Clock, CheckCircle, Search, Send } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-2xl border-2 border-black p-5 md:p-7 shadow-[4px_4px_0px_0px_#000]">
        <h2
          className="text-xl md:text-2xl font-serif font-black text-black mb-5"
          style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
        >
          Gabung Hubungan dengan Kode
        </h2>

        <form onSubmit={handleSearch} className="mb-6">
          <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
            Masukkan Kode Hubungan
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={joinKode}
              onChange={(e) => setJoinKode(e.target.value.toUpperCase())}
              placeholder="Contoh: KODE123"
              className="flex-1 px-4 py-3 border-2 border-black rounded-xl focus:shadow-[3px_3px_0px_0px_#000] focus:outline-none transition-all font-mono font-black text-black placeholder:text-black/35 text-sm"
              required
            />
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-[#7c98ff] hover:bg-[#6a88fc] text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 touch-manipulation cursor-pointer flex items-center justify-center gap-2"
            >
              <Search size={16} className="stroke-[3]" />
              <span>{searching ? 'Mencari...' : 'Cari Grup'}</span>
            </button>
          </div>
        </form>

        {/* Success Notification */}
        {joinSuccess && (
          <div className="mb-6 p-4 bg-[#c5ffbc] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex-1">
                <p className="text-black font-black text-base mb-1">Permintaan Berhasil Terkirim!</p>
                <p className="text-black/80 font-bold text-sm mb-2">{joinSuccessMessage}</p>
                <div className="bg-white border-2 border-black rounded-xl p-3">
                  <p className="text-black text-xs font-semibold leading-relaxed">
                    Permintaan Anda sedang menunggu konfirmasi dari owner grup. Anda dapat memantau statusnya pada panel <strong>"Permintaan Bergabung"</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {joinError && (
          <div className="mb-6 p-4 bg-[#FF6B7A]/20 border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex-1">
                <p className="text-black font-black text-sm mb-1">Hubungan Tidak Ditemukan</p>
                <p className="text-black/80 font-bold text-xs">{joinError}</p>
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-3 mb-3">
              <p className="text-black font-bold text-xs mb-2">
                Periksa kembali kode undangan Anda atau muat ulang halaman.
              </p>
              <button
                onClick={handleReloadPage}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-yellow-200 text-black rounded-full border-2 border-black font-black shadow-[1.5px_1.5px_0px_0px_#000] text-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Refresh Halaman</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Result */}
        {searchResult && !joinSuccess && (
          <div className="mb-6 p-5 bg-[#C8F5C8]/40 border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000]">
            <h3
              className="font-serif font-black text-black text-lg md:text-xl mb-1.5"
              style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
            >
              {searchResult.relation.nama}
            </h3>
            {searchResult.relation.deskripsi && (
              <p className="text-black/80 mb-3 font-semibold text-sm leading-relaxed">
                {searchResult.relation.deskripsi}
              </p>
            )}
            <div className="space-y-1 mb-4 text-black font-bold text-xs sm:text-sm">
              <p>Dibuat oleh: <span className="font-black">{searchResult.relation.creator.name}</span></p>
              <p>Jumlah Anggota: <span className="font-black">{searchResult.relation.users_count} orang</span></p>
            </div>

            {searchResult.is_owner ? (
              <div className="p-3 bg-yellow-200 border-2 border-black rounded-xl">
                <p className="text-black font-black text-xs sm:text-sm">
                  Anda adalah pemilik (owner) dari hubungan ini
                </p>
              </div>
            ) : searchResult.already_joined ? (
              <div className="p-3 bg-yellow-200 border-2 border-black rounded-xl">
                <p className="text-black font-black text-xs sm:text-sm">Anda sudah menjadi anggota di hubungan ini</p>
              </div>
            ) : searchResult.has_pending_request ? (
              <div className="p-3 bg-[#FDBB4E] border-2 border-black rounded-xl flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
                <div>
                  <p className="text-black font-black text-sm mb-0.5">Permintaan Sedang Diproses</p>
                  <p className="text-black text-xs font-bold">
                    Anda sudah mengirim permintaan. Menunggu persetujuan dari owner.
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleJoin}
                className="w-full px-6 py-3 bg-[#7c98ff] hover:bg-[#6a88fc] text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} className="stroke-[2.5]" />
                <span>Kirim Permintaan Bergabung</span>
              </button>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-yellow-50 border-2 border-black rounded-xl p-3.5 shadow-[1.5px_1.5px_0px_0px_#000]">
          <p className="text-black text-xs font-bold leading-relaxed">
            💡 <strong>Petunjuk:</strong> Minta kode grup 6-10 karakter dari owner hubungan. Setelah Anda mengirim permintaan, owner akan menerima notifikasi untuk menyetujui.
          </p>
        </div>
      </div>
    </div>
  );
}
