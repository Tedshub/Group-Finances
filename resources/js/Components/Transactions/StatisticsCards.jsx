// resources/js/Components/Transactions/StatisticsCards.jsx

import React from "react";

export default function StatisticsCards({ statistik }) {
  if (!statistik) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Pemasukan */}
      <div className="bg-[#C8F5C8] rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-green-600 border-2 border-black flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <span className="text-sm font-black text-black uppercase tracking-wide">Total Pemasukan</span>
        </div>
        <div className="text-2xl font-black text-black">{statistik.total_pemasukan}</div>
        <div className="text-xs font-bold text-black/60 mt-1">{statistik.jumlah_pemasukan} transaksi</div>
      </div>

      {/* Total Pengeluaran */}
      <div className="bg-red-200 rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-black flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <span className="text-sm font-black text-black uppercase tracking-wide">Total Pengeluaran</span>
        </div>
        <div className="text-2xl font-black text-black">{statistik.total_pengeluaran}</div>
        <div className="text-xs font-bold text-black/60 mt-1">{statistik.jumlah_pengeluaran} transaksi</div>
      </div>

      {/* Saldo */}
      <div className={`${statistik.saldo_raw >= 0 ? 'bg-[#7c98ff]' : 'bg-yellow-200'} rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000]`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-full ${statistik.saldo_raw >= 0 ? 'bg-blue-700' : 'bg-yellow-600'} border-2 border-black flex items-center justify-center`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-black text-black uppercase tracking-wide">Saldo</span>
        </div>
        <div className="text-2xl font-black text-black">{statistik.saldo}</div>
        <div className="text-xs font-bold text-black/60 mt-1">{statistik.jumlah_transaksi} total transaksi</div>
      </div>
    </div>
  );
}
