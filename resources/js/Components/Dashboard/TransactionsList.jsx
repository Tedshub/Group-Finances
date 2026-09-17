// resources/js/Components/Dashboard/TransactionsList.jsx
import React from "react";
import { Link } from "@inertiajs/react";
import { Receipt, ArrowDownRight, ArrowUpRight, ArrowRight, PlusCircle } from "lucide-react";

export default function TransactionsList({ transactions = [] }) {
  return (
    <section className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-[4px_4px_0px_0px_#000] mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-black bg-[#c5ffbc] shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
            <Receipt className="text-black stroke-[2.5]" size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-black">Aktivitas Terkini</h3>
            <p className="text-xs font-bold text-black/60">Riwayat transaksi terbaru dalam grup keuangan Anda</p>
          </div>
        </div>

        <Link
          href="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <span>Lihat Semua</span>
          <ArrowRight size={13} className="stroke-[3]" />
        </Link>
      </div>

      {/* List items */}
      {transactions && transactions.length > 0 ? (
        <ul className="space-y-2.5">
          {transactions.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-2.5 px-3.5 rounded-xl border-2 border-transparent hover:border-black hover:bg-[#C8F5C8]/40 transition-all duration-150"
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                {/* Icon chip */}
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] flex-shrink-0"
                  style={{ background: item.type === "income" ? "#c5ffbc" : "#FF6B7A" }}
                >
                  {item.type === "income" ? (
                    <ArrowDownRight size={18} className="text-black stroke-[3]" />
                  ) : (
                    <ArrowUpRight size={18} className="text-black stroke-[3]" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-black truncate">{item.text}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-black/60 flex-wrap mt-0.5">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="bg-yellow-100 px-1.5 py-0.2 rounded border border-black/40 text-[11px] text-black">
                      {item.relation_name}
                    </span>
                    <span>•</span>
                    <span className="text-[11px] text-black/70">Oleh {item.user_name}</span>
                  </div>
                </div>
              </div>

              {/* Amount Pill */}
              <span
                className="text-xs sm:text-sm font-black px-3 py-1 rounded-full border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] flex-shrink-0"
                style={{
                  background: item.type === "income" ? "#c5ffbc" : "#FF6B7A",
                  color: "#000000",
                }}
              >
                {item.amount}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 bg-yellow-50 border-2 border-black rounded-xl p-5">
          <PlusCircle className="w-10 h-10 mx-auto mb-2 text-black/40 stroke-[2]" />
          <p className="text-black font-black text-sm mb-1">Belum ada transaksi</p>
          <p className="text-black/60 font-bold text-xs mb-4">
            Transaksi yang dicatat di grup Anda akan otomatis tampil di sini
          </p>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7c98ff] hover:bg-[#6a88fc] text-black font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span>Mulai Catat Transaksi</span>
          </Link>
        </div>
      )}
    </section>
  );
}
