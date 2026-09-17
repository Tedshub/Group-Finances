// resources/js/Components/Transactions/RelationSelector.jsx

import React from "react";

export default function RelationSelector({
  relations,
  selectedRelationId,
  onChange,
  onAddTransaction
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">
            Pilih Hubungan Keuangan
          </label>
          <select
            value={selectedRelationId}
            onChange={onChange}
            className="w-full md:w-96 px-4 py-2.5 border-2 border-black rounded-xl font-bold text-black bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] transition-all"
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
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7c98ff] hover:bg-[#6a88fc] text-black font-black rounded-full border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Transaksi
        </button>
      </div>
    </div>
  );
}
