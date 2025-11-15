import React from 'react';
import { Crown, Users, Calendar, Copy, Check, Edit, Trash2, UserMinus } from 'lucide-react';

export default function RelationItem({
  relation,
  index,
  totalRelations,
  editingId,
  editForm,
  setEditingId,
  handleEdit,
  handleShowMembers,
  handleCopy,
  copied,
  startEdit,
  setShowDeleteConfirm,
  setShowLeaveConfirm
}) {
  const isEditing = editingId === relation.id;

  return (
    <div
      className={`p-3 md:p-4 transition-colors ${
        index !== totalRelations - 1 ? 'border-b border-black' : ''
      } ${!isEditing ? 'hover:bg-gray-50' : ''}`}
    >
      {isEditing ? (
        <form onSubmit={(e) => handleEdit(e, relation.id)} className="space-y-3">
          <input
            type="text"
            value={editForm.data.nama}
            onChange={(e) => editForm.setData('nama', e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Nama Hubungan"
            required
          />
          <textarea
            value={editForm.data.deskripsi}
            onChange={(e) => editForm.setData('deskripsi', e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
            placeholder="Deskripsi"
            rows={2}
          />
          <input
            type="text"
            value={editForm.data.kode}
            onChange={(e) => editForm.setData('kode', e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-black rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="Kode"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={editForm.processing}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full border border-black font-medium transition-all shadow-lg text-sm touch-manipulation"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full border border-black font-medium transition-all text-sm touch-manipulation"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base md:text-lg font-serif font-normal text-black" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                {relation.nama}
              </h3>
              {relation.is_owner ? (
                <span className="inline-flex items-center gap-1 bg-yellow-300 border border-black px-2 py-0.5 rounded-full text-xs font-bold">
                  <Crown className="w-3 h-3" />
                  Owner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-200 border border-black px-2 py-0.5 rounded-full text-xs font-medium">
                  Anggota
                </span>
              )}
            </div>
            {relation.deskripsi && (
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{relation.deskripsi}</p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
              <div className="relative">
                <button
                  onClick={() => handleShowMembers(relation)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 hover:opacity-90 transition-colors touch-manipulation"
                  style={{ backgroundColor: "#c5ffbc", border: "1px solid black", color: "black" }}
                >
                  <Users className="w-3 h-3 pointer-events-none" />
                  <span className="font-bold">{relation.users_count} anggota</span>
                </button>

                {/* Badge Notifikasi - Hanya tampil jika owner dan ada pending requests */}
                {relation.is_owner && relation.pending_requests_count > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 border-2 border-white rounded-full text-white text-[10px] font-bold px-1 animate-pulse">
                    {relation.pending_requests_count > 9 ? '9+' : relation.pending_requests_count}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-black rounded-full px-3 py-1">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">{relation.join_at}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-blue-100 border border-black px-3 py-1 rounded-full text-sm font-bold">
                {relation.kode}
              </span>
              <button
                onClick={() => handleCopy(relation.kode)}
                className="p-1.5 hover:bg-gray-100 rounded-full border border-black transition-colors touch-manipulation"
                title="Salin kode"
              >
                {copied === relation.kode ? (
                  <Check className="w-4 h-4 text-green-600 pointer-events-none" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-700 pointer-events-none" />
                )}
              </button>
            </div>
          </div>
          <div className="flex gap-2 md:ml-4">
            {relation.is_owner ? (
              <>
                <button
                  onClick={() => startEdit(relation)}
                  className="px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full border border-black transition-all flex items-center gap-1.5 font-medium shadow-lg text-sm touch-manipulation"
                >
                  <Edit className="w-3.5 h-3.5 pointer-events-none" />
                  <span className="hidden md:inline">Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(relation)}
                  className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full border border-black transition-all flex items-center gap-1.5 font-medium shadow-lg text-sm touch-manipulation"
                >
                  <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                  <span className="hidden md:inline">Hapus</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLeaveConfirm(relation)}
                className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full border border-black transition-all flex items-center gap-1.5 font-medium shadow-lg text-sm touch-manipulation"
              >
                <UserMinus className="w-3.5 h-3.5 pointer-events-none" />
                <span className="hidden md:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
