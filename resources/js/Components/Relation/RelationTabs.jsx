import React from 'react';
import { Plus, LogIn } from 'lucide-react';

export default function RelationTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      <button
        onClick={() => setActiveTab('list')}
        className={`flex-1 min-w-[100px] px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all border border-black text-sm touch-manipulation ${
          activeTab === 'list'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }`}
      >
        Daftar Hubungan
      </button>
      <button
        onClick={() => setActiveTab('create')}
        className={`flex-1 min-w-[100px] px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all border border-black flex items-center justify-center gap-2 text-sm touch-manipulation ${
          activeTab === 'create'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }`}
      >
        <Plus className="w-4 h-4 pointer-events-none" />
        Buat Baru
      </button>
      <button
        onClick={() => setActiveTab('join')}
        className={`flex-1 min-w-[100px] px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all border border-black flex items-center justify-center gap-2 text-sm touch-manipulation ${
          activeTab === 'join'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }`}
      >
        <LogIn className="w-4 h-4 pointer-events-none" />
        Gabung
      </button>
    </div>
  );
}
