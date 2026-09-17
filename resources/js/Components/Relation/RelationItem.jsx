// resources/js/Components/Relation/RelationItem.jsx
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

  const handleStartEdit = (rel) => {
    setEditingId(rel.id);
    editForm.setData({
      nama: rel.nama,
      deskripsi: rel.deskripsi || '',
      kode: rel.kode,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    editForm.reset();
  };

  return (
    <div className={`p-4 md:p-5 transition-colors ${!isEditing ? 'hover:bg-[#C8F5C8]/30' : ''}`}>
      {isEditing ? (
        <form onSubmit={(e) => handleEdit(e, relation.id)} className="space-y-4">
          {/* Field Nama */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
              Nama Hubungan *
            </label>
            <input
              type="text"
              value={editForm.data.nama}
              onChange={(e) => editForm.setData('nama', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] text-sm"
              placeholder="Masukkan nama hubungan"
              required
            />
            {editForm.errors.nama && (
              <p className="mt-1 text-xs font-bold text-red-600">{editForm.errors.nama}</p>
            )}
          </div>

          {/* Field Deskripsi */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
              Deskripsi
            </label>
            <textarea
              value={editForm.data.deskripsi}
              onChange={(e) => editForm.setData('deskripsi', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] resize-none text-sm"
              placeholder="Masukkan deskripsi hubungan (opsional)"
              rows={2}
            />
            {editForm.errors.deskripsi && (
              <p className="mt-1 text-xs font-bold text-red-600">{editForm.errors.deskripsi}</p>
            )}
          </div>

          {/* Field Kode */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
              Kode Hubungan *
            </label>
            <input
              type="text"
              value={editForm.data.kode}
              onChange={(e) => editForm.setData('kode', e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-mono font-black text-black focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] text-sm"
              placeholder="Masukkan kode hubungan"
              required
              maxLength={10}
            />
            <p className="mt-1 text-xs font-bold text-black/60">
              Kode digunakan untuk mengundang anggota lain (otomatis kapital).
            </p>
            {editForm.errors.kode && (
              <p className="mt-1 text-xs font-bold text-red-600">{editForm.errors.kode}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              disabled={editForm.processing}
              className="px-5 py-2.5 bg-[#7c98ff] hover:bg-[#6a88fc] disabled:opacity-50 text-black rounded-full border-2 border-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={editForm.processing}
              className="px-5 py-2.5 bg-white hover:bg-gray-100 disabled:opacity-50 text-black rounded-full border-2 border-black font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Relation Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <h3
                className="text-lg md:text-xl font-serif font-black text-black tracking-wide"
                style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
              >
                {relation.nama}
              </h3>
              {relation.is_owner ? (
                <span className="inline-flex items-center gap-1 bg-[#FDBB4E] border-2 border-black px-2.5 py-0.5 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">
                  <Crown className="w-3.5 h-3.5 text-black stroke-[3]" />
                  Owner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-white border-2 border-black px-2.5 py-0.5 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">
                  Anggota
                </span>
              )}
            </div>

            {/* Deskripsi */}
            {relation.deskripsi && (
              <p className="text-black/80 font-semibold text-sm mb-3 leading-relaxed">
                {relation.deskripsi}
              </p>
            )}

            {/* Stats Pills */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs mb-3">
              <button
                onClick={() => handleShowMembers(relation)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#c5ffbc] hover:bg-[#a8f59d] text-black border-2 border-black font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer relative"
              >
                <Users className="w-3.5 h-3.5 stroke-[3]" />
                <span>{relation.member_count} Anggota</span>

                {relation.is_owner && relation.pending_requests_count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6B7A] text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                    {relation.pending_requests_count > 9 ? '9+' : relation.pending_requests_count}
                  </span>
                )}
              </button>

              <div className="inline-flex items-center gap-1.5 bg-white border-2 border-black rounded-full px-3 py-1 font-bold text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{relation.created_at}</span>
              </div>
            </div>

            {/* Kode */}
            <div className="flex items-center gap-2">
              <span className="font-mono bg-[#7c98ff]/30 border-2 border-black px-3 py-1 rounded-full text-xs sm:text-sm font-black text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                {relation.kode}
              </span>
              <button
                onClick={() => handleCopy(relation.kode)}
                className="p-1.5 hover:bg-yellow-200 rounded-full border-2 border-black bg-white shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Salin kode undangan"
              >
                {copied === relation.kode ? (
                  <Check className="w-4 h-4 text-green-700 stroke-[3]" />
                ) : (
                  <Copy className="w-4 h-4 text-black stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:ml-4 flex-shrink-0">
            {relation.is_owner ? (
              <>
                <button
                  onClick={() => handleStartEdit(relation)}
                  className="px-4 py-2 bg-white hover:bg-yellow-200 text-black rounded-full border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(relation)}
                  className="px-4 py-2 bg-[#FF6B7A] hover:bg-red-400 text-black rounded-full border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Hapus</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLeaveConfirm(relation)}
                className="px-4 py-2 bg-[#FF6B7A] hover:bg-red-400 text-black rounded-full border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
              >
                <UserMinus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
