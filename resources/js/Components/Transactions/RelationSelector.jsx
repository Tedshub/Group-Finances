// resources/js/Components/Transactions/RelationSelector.jsx

import React from "react";

export default function RelationSelector({
  relations,
  selectedRelationId,
  onChange,
  onAddTransaction
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 border border-black">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Hubungan Keuangan
          </label>
          <select
            value={selectedRelationId}
            onChange={onChange}
            className="w-full md:w-96 px-4 py-2
                       border border-black rounded-lg
                       focus:ring-1 focus:ring-[#15803d]
                       focus:border-[#C8F5C8]"
            style={{ backgroundColor: '#ffff' }}
          >
            <option value="">-- Pilih Hubungan --</option>
            {relations.map((relation) => (
              <option key={relation.id} value={relation.id}>
                {relation.nama}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onAddTransaction}
          className="w-full md:w-auto px-6 py-2 bg-[#C8F5C8] text-black rounded-lg hover:bg-[#b8e5b8] transition-colors flex items-center justify-center gap-2 border border-black"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Transaksi
        </button>
      </div>
    </div>
  );
}
