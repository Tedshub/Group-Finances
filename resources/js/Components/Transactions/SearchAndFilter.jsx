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
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 border border-black">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <form onSubmit={onSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari transaksi..."
              className="w-full pl-4 pr-20 py-2 border border-black-100 rounded-lg focus:ring-2 focus:ring-[#51c951] focus:border-transparent border border-black"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 py-2 bg-[#C8F5C8] text-black rounded-r-lg hover:bg-[#b8e5b8] transition-colors border border-black"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Date Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => onDateFilterChange('all')}
            className={`px-4 py-2 rounded-lg border border-black ${dateFilter === 'all' ? 'bg-[#C8F5C8] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Semua
          </button>
          <button
            onClick={() => onDateFilterChange('7days')}
            className={`px-4 py-2 rounded-lg border border-black ${dateFilter === '7days' ? 'bg-[#C8F5C8] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            7 Hari
          </button>
          <button
            onClick={() => onDateFilterChange('1month')}
            className={`px-4 py-2 rounded-lg border border-black ${dateFilter === '1month' ? 'bg-[#C8F5C8] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            1 Bulan
          </button>
          <button
            onClick={() => onDateFilterChange('1year')}
            className={`px-4 py-2 rounded-lg border border-black ${dateFilter === '1year' ? 'bg-[#C8F5C8] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            1 Tahun
          </button>
        </div>

        {/* Download Button */}
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-[#C8F5C8] text-black rounded-lg hover:bg-[#b8e5b8] flex items-center gap-2 border border-black"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Unduh
        </button>
      </div>
    </div>
  );
}
