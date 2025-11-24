// resources/js/Components/dashboard/SummaryCards.jsx
import React from "react";

export default function SummaryCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        {
          title: "Saldo Saat Ini",
          amount: "Rp 12,500,000",
          change: "+52.4k",
          isPositive: true,
        },
        {
          title: "Total Pemasukan",
          amount: "Rp 20,000,000",
          change: "+17.4k",
          isPositive: true,
        },
        {
          title: "Total Pengeluaran",
          amount: "Rp 7,500,000",
          change: "-8.2k",
          isPositive: false,
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-2xl shadow-sm border border-black hover:shadow-lg transition-shadow"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">{item.title}</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-black">{item.amount}</p>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              item.isPositive ? "bg-[#c5ffbc] text-black" : "bg-red-100 text-red-700"
            }`}>
              {item.change}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
