import React from 'react';
import { Users, Plus, Search } from 'lucide-react';
import RelationItem from './RelationItem';

export default function RelationList({
  relations,
  editingId,
  editForm,
  setEditingId,
  handleEdit,
  handleShowMembers,
  handleCopy,
  copied,
  startEdit,
  setShowDeleteConfirm,
  setShowLeaveConfirm,
  setActiveTab,
  searchTerm = ''
}) {
  const hasRelations = relations.data && relations.data.length > 0;

  // Empty state when searching
  if (!hasRelations) {
    if (searchTerm) {
      return (
        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-black bg-yellow-200 flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]">
              <Search className="w-8 h-8 text-black stroke-[2.5]" />
            </div>
            <h3
              className="text-xl md:text-2xl font-serif font-black text-black mb-2"
              style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
            >
              Tidak ada hasil untuk "{searchTerm}"
            </h3>
            <p className="text-black/70 font-bold text-sm mb-5">
              Coba gunakan kata kunci nama atau kode yang berbeda
            </p>
            <button
              onClick={() => setActiveTab('create')}
              className="inline-flex items-center gap-2 bg-[#7c98ff] hover:bg-[#6a88fc] text-black px-6 py-2.5 rounded-full font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Buat Hubungan Baru
            </button>
          </div>
        </div>
      );
    }

    // Default empty state
    return (
      <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-black bg-[#c5ffbc] flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]">
            <Users className="w-8 h-8 text-black stroke-[2.5]" />
          </div>
          <h3
            className="text-xl md:text-2xl font-serif font-black text-black mb-2"
            style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
          >
            Belum Ada Hubungan Keuangan
          </h3>
          <p className="text-black/70 font-bold text-sm mb-5">
            Mulai kelola keuangan bersama dengan membuat atau bergabung ke hubungan baru
          </p>
          <button
            onClick={() => setActiveTab('create')}
            className="inline-flex items-center gap-2 bg-[#7c98ff] hover:bg-[#6a88fc] text-black px-6 py-2.5 rounded-full font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Buat Hubungan Pertama
          </button>
        </div>
      </div>
    );
  }

  // Relations list
  return (
    <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
      {searchTerm && (
        <div className="px-5 py-3 bg-[#c5ffbc] border-b-2 border-black">
          <p className="text-sm font-black text-black">
            Menampilkan {relations.data.length} hasil pencarian untuk "{searchTerm}"
          </p>
        </div>
      )}
      <div className="divide-y-2 divide-black">
        {relations.data.map((relation, index) => (
          <RelationItem
            key={relation.id}
            relation={relation}
            index={index}
            totalRelations={relations.data.length}
            editingId={editingId}
            editForm={editForm}
            setEditingId={setEditingId}
            handleEdit={handleEdit}
            handleShowMembers={handleShowMembers}
            handleCopy={handleCopy}
            copied={copied}
            startEdit={startEdit}
            setShowDeleteConfirm={setShowDeleteConfirm}
            setShowLeaveConfirm={setShowLeaveConfirm}
          />
        ))}
      </div>
    </div>
  );
}
