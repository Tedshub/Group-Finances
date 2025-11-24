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
  searchTerm = '' // Tambahkan properti searchTerm dengan default value kosong
}) {
  // Cek apakah ada data relations
  const hasRelations = relations.data && relations.data.length > 0;

  // Tampilkan pesan jika tidak ada hubungan
  if (!hasRelations) {
    // Jika ada searchTerm tapi tidak ada hasil, tampilkan pesan pencarian
    if (searchTerm) {
      return (
        <div className="bg-white rounded-xl md:rounded-2xl border border-black overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <Search className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Tidak ada hasil untuk "{searchTerm}"
            </h3>
            <p className="text-gray-600 text-sm mb-4">Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda</p>
            <button
              onClick={() => setActiveTab('create')}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-all border border-black shadow-lg text-sm touch-manipulation"
            >
              <Plus className="w-4 h-4 pointer-events-none" />
              Buat Hubungan Baru
            </button>
          </div>
        </div>
      );
    }

    // Jika tidak ada searchTerm dan tidak ada hubungan, tampilkan pesan default
    return (
      <div className="bg-white rounded-xl md:rounded-2xl border border-black overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <Users className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Belum ada hubungan keuangan
          </h3>
          <p className="text-gray-600 text-sm mb-4">Mulai dengan membuat hubungan keuangan pertama Anda</p>
          <button
            onClick={() => setActiveTab('create')}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-all border border-black shadow-lg text-sm touch-manipulation"
          >
            <Plus className="w-4 h-4 pointer-events-none" />
            Buat Hubungan Pertama
          </button>
        </div>
      </div>
    );
  }

  // Tampilkan daftar hubungan jika ada data
  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-black overflow-hidden">
      {searchTerm && (
        <div className="px-4 py-3 bg-blue-50 border-b border-black">
          <p className="text-sm text-blue-700">
            Menampilkan {relations.data.length} hasil untuk "{searchTerm}"
          </p>
        </div>
      )}
      <div>
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
