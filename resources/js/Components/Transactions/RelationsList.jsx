// resources/js/Components/Transactions/RelationsList.jsx

import React from "react";

const PALETTE = ["#C8F5C8", "#7c98ff", "#fcd34d", "#f9a8d4"];
const BORDER_COLORS = ["#15803d", "#3b5bdb", "#b45309", "#be185d"];

export default function RelationsList({ relations, onSelect }) {
  if (relations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_#000]">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl border-2 border-black bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3
            className="text-xl font-black text-black mb-2"
            style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
          >
            Tidak Ada Hubungan Keuangan
          </h3>
          <p className="text-sm font-bold text-black/60 mb-6 max-w-sm mx-auto">
            Anda belum memiliki hubungan keuangan. Buat hubungan baru untuk mulai mengelola keuangan bersama.
          </p>
          <a
            href="/relations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-black bg-[#C8F5C8] hover:bg-[#b8e5b8] text-black font-black text-sm shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Buat Hubungan Baru
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
      <h2
        className="text-2xl font-black text-black mb-1"
        style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
      >
        Pilih Hubungan Keuangan
      </h2>
      <p className="text-sm font-bold text-black/60 mb-6">
        Pilih salah satu hubungan keuangan untuk melihat dan mengelola transaksi
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relations.map((relation, index) => {
          const bg = PALETTE[index % PALETTE.length];
          const border = BORDER_COLORS[index % BORDER_COLORS.length];

          return (
            <div
              key={relation.id}
              onClick={() => onSelect(relation.id)}
              className="rounded-2xl border-2 border-black p-5 cursor-pointer shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all"
              style={{ backgroundColor: bg }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center"
                  style={{ backgroundColor: border }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3
                    className="font-black text-black text-base leading-tight"
                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                  >
                    {relation.nama}
                  </h3>
                  <p className="text-xs font-black text-black/60 mt-0.5">Kode: {relation.kode}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-black bg-white text-black font-black text-xs shadow-[2px_2px_0px_0px_#000]">
                  Pilih →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
