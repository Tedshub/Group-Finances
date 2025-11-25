// resources/js/Pages/DashboardPage.jsx
import React from "react";
import { Head } from '@inertiajs/react';
import Sidebar from "../Layouts/Sidebar";
import NavbarIn from "../Layouts/NavbarIn";
import SummaryCards from "../Components/Dashboard/SummaryCards";
import ChartsSection from "../Components/Dashboard/ChartsSection";
import TransactionsList from "../Components/Dashboard/TransactionsList";

export default function DashboardPage({ auth }) {
  return (
    <>
      <Head title="Dashboard - Couple's Finances" />
      <div className="min-h-screen h-screen flex flex-col bg-gray-50 text-gray-900">
        <NavbarIn auth={auth} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 min-w-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Laporan Keseluruhan (Contoh Tampilan) </h1>
            </div>
            <SummaryCards />
            <ChartsSection />
            <TransactionsList />
          </main>
        </div>
      </div>
    </>
  );
}
