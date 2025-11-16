// resources/js/Components/Transactions/StatisticsCards.jsx

import React from "react";

export default function StatisticsCards({ statistik }) {
  if (!statistik) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Pemasukan */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200 border border-black">
        <div className="text-sm text-green-600 mb-1">Total Pemasukan</div>
        <div className="text-2xl font-bold text-green-700">{statistik.total_pemasukan}</div>
        <div className="text-xs text-green-600 mt-1">{statistik.jumlah_pemasukan} transaksi</div>
      </div>

      {/* Total Pengeluaran */}
      <div className="bg-red-50 rounded-lg p-4 border border-red-200 border border-black">
        <div className="text-sm text-red-600 mb-1">Total Pengeluaran</div>
        <div className="text-2xl font-bold text-red-700">{statistik.total_pengeluaran}</div>
        <div className="text-xs text-red-600 mt-1">{statistik.jumlah_pengeluaran} transaksi</div>
      </div>

      {/* Saldo */}
      <div className={`${statistik.saldo_raw >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} rounded-lg p-4 border border-black`}>
        <div className={`text-sm ${statistik.saldo_raw >= 0 ? 'text-blue-600' : 'text-orange-600'} mb-1`}>Saldo</div>
        <div className={`text-2xl font-bold ${statistik.saldo_raw >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{statistik.saldo}</div>
        <div className={`text-xs ${statistik.saldo_raw >= 0 ? 'text-blue-600' : 'text-orange-600'} mt-1`}>{statistik.jumlah_transaksi} total transaksi</div>
      </div>
    </div>
  );
}
