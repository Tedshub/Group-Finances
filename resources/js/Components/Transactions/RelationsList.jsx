// resources/js/Components/Transactions/RelationsList.jsx

import React from "react";

export default function RelationsList({ relations, onSelect }) {
  const colors = ["#10b981", "#6366f1", "#8b5cf6", "#f59e0b"];

  if (relations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 border border-black">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak Ada Hubungan Keuangan</h3>
          <p className="mt-1 text-sm text-gray-500">Anda belum memiliki hubungan keuangan. Buat hubungan baru untuk mulai mengelola keuangan bersama.</p>
          <div className="mt-6">
            <a
              href={route('relations.create')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#C8F5C8] hover:bg-[#b8e5b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8F5C8] border border-black"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Hubungan Baru
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 border border-black">
      <h2 className="text-xl font-semibold mb-4">Pilih Hubungan Keuangan</h2>
      <p className="text-gray-600 mb-6">Silakan pilih salah satu hubungan keuangan untuk melihat dan mengelola transaksi</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relations.map((relation, index) => {
          const colorIndex = index % colors.length;
          const currentColor = colors[colorIndex];

          return (
            <div
              key={relation.id}
              onClick={() => onSelect(relation.id)}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              style={{
                backgroundColor: `${currentColor}15`,
                borderColor: currentColor,
                borderWidth: '1.5px'
              }}
            >
              <div className="flex items-center mb-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: currentColor }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    {relation.nama}
                  </h3>
                  <p className="text-sm" style={{ color: `${currentColor}CC` }}>
                    Kode: {relation.kode}
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-end mt-3">
                <button
                  className="font-medium text-sm hover:underline transition-all"
                  style={{ color: currentColor }}
                >
                  Pilih →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
