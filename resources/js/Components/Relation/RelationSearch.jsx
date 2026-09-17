// resources/js/Components/Relation/RelationSearch.jsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function RelationSearch({
  onSearch,
  placeholder = "Cari hubungan keuangan berdasarkan nama, kode, atau deskripsi...",
  className = ""
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-black stroke-[2.5]" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-11 py-3 border-2 border-black rounded-2xl bg-white text-black font-bold placeholder:text-black/40 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] focus:outline-none transition-all text-sm"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer text-black hover:text-red-500 transition-colors"
            onClick={handleClear}
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
