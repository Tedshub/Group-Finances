// resources/js/Components/Dashboard/SummaryCards.jsx
import React from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function SummaryCards({ summary }) {
  const isSaldoPositive = (summary?.saldo?.raw ?? 0) >= 0;

  const cardData = [
    {
      title: summary?.saldo?.label || "Saldo Saat Ini",
      amount: summary?.saldo?.formatted || "Rp 0",
      change: `${summary?.saldo?.transaksi_count || 0} transaksi`,
      isPositive: isSaldoPositive,
      icon: <Wallet size={20} className="text-black stroke-[2.5]" />,
      iconBg: isSaldoPositive ? '#7c98ff' : '#FDBB4E',
      badgeBg: isSaldoPositive ? '#c5ffbc' : '#FF6B7A',
    },
    {
      title: summary?.pemasukan?.label || "Total Pemasukan",
      amount: summary?.pemasukan?.formatted || "Rp 0",
      change: `${summary?.pemasukan?.transaksi_count || 0} transaksi`,
      isPositive: true,
      icon: <TrendingUp size={20} className="text-black stroke-[2.5]" />,
      iconBg: '#c5ffbc',
      badgeBg: '#c5ffbc',
    },
    {
      title: summary?.pengeluaran?.label || "Total Pengeluaran",
      amount: summary?.pengeluaran?.formatted || "Rp 0",
      change: `${summary?.pengeluaran?.transaksi_count || 0} transaksi`,
      isPositive: false,
      icon: <TrendingDown size={20} className="text-black stroke-[2.5]" />,
      iconBg: '#FF6B7A',
      badgeBg: '#FF6B7A',
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
      {cardData.map((item, idx) => (
        <div
          key={idx}
          className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
        >
          {/* Top row: Icon chip & Badge */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000]"
              style={{ background: item.iconBg }}
            >
              {item.icon}
            </div>

            <span
              className="inline-flex items-center text-xs font-black px-2.5 py-1 rounded-full border-2 border-black text-black shadow-[1.5px_1.5px_0px_0px_#000]"
              style={{ background: item.badgeBg }}
            >
              {item.change}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs font-black text-black/60 uppercase tracking-wider mb-1">
            {item.title}
          </h3>

          {/* Amount */}
          <p className="text-2xl lg:text-3xl font-black text-black tracking-tight">
            {item.amount}
          </p>
        </div>
      ))}
    </section>
  );
}
