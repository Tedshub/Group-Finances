// resources/js/Pages/DashboardPage.jsx
import React from "react";
import { Head, Link } from '@inertiajs/react';
import { Plus, Users } from "lucide-react";
import Sidebar from "../Layouts/Sidebar";
import NavbarIn from "../Layouts/NavbarIn";
import SummaryCards from "../Components/Dashboard/SummaryCards";
import ChartsSection from "../Components/Dashboard/ChartsSection";
import TransactionsList from "../Components/Dashboard/TransactionsList";

export default function DashboardPage({
  auth,
  summary,
  areaData = [],
  chartStats = {},
  relationBreakdown = [],
  recentTransactions = []
}) {
  return (
    <>
      <Head title="Dashboard - Group Finances" />
      <div className="min-h-screen h-screen flex flex-col bg-[#C8F5C8]">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-w-0 px-4 sm:px-6 py-6 lg:px-10 lg:py-8">
            {/* Page Header with Quick Actions */}
            <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1
                  className="text-3xl lg:text-4xl font-serif font-black text-black leading-tight"
                  style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                >
                  Laporan Keseluruhan
                </h1>
                <p className="text-black/70 text-sm mt-1 font-bold">
                  Ringkasan & aktivitas keuangan grup Anda secara real-time
                </p>
              </div>

              {/* Quick Action Pills */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  href="/relations"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <Users size={16} className="stroke-[2.5]" />
                  <span>Hubungan Grup</span>
                </Link>
                <Link
                  href="/transactions"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-black bg-[#7c98ff] hover:bg-[#6a88fc] text-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <Plus size={16} className="stroke-[3]" />
                  <span>Catat Transaksi</span>
                </Link>
              </div>
            </div>

            {/* Dashboard Content with actual DB data */}
            <SummaryCards summary={summary} />
            <ChartsSection
              areaData={areaData}
              chartStats={chartStats}
              relationBreakdown={relationBreakdown}
            />
            <TransactionsList transactions={recentTransactions} />
          </main>
        </div>
      </div>
    </>
  );
}
