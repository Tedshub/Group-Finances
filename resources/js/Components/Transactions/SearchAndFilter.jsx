// resources/js/Components/Transactions/SearchAndFilter.jsx

import React from "react";

export default function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  dateFilter,
  onDateFilterChange,
  onSearch,
  onDownload
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <form onSubmit={onSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari transaksi..."
              className="w-full pl-4 pr-24 py-2.5 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/40 bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] transition-all"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 py-2 bg-[#C8F5C8] text-black font-black rounded-r-xl border-l-2 border-black hover:bg-[#b8e5b8] transition-colors"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Date Filter Pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'Semua' },
            { value: '7days', label: '7 Hari' },
            { value: '1month', label: '1 Bulan' },
            { value: '1year', label: '1 Tahun' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onDateFilterChange(value)}
              className={`px-3 py-2 rounded-full border-2 border-black text-xs font-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                dateFilter === value
                  ? 'bg-[#C8F5C8] text-black'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Download Button */}
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Unduh
        </button>
      </div>
    </div>
  );
}
