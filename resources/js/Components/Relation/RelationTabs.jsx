import React from 'react';
import { LogIn, List } from 'lucide-react';

export default function RelationTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2.5 mb-6 overflow-x-auto pb-1">
      <button
        onClick={() => setActiveTab('list')}
        className={`flex-1 min-w-[140px] px-4 md:px-6 py-2.5 md:py-3 rounded-full font-black transition-all border-2 border-black text-xs sm:text-sm touch-manipulation flex items-center justify-center gap-2 cursor-pointer ${
          activeTab === 'list'
            ? 'bg-[#7c98ff] text-black shadow-[2px_2px_0px_0px_#000]'
            : 'bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
        }`}
      >
        <List size={16} className="stroke-[3]" />
        <span>Daftar Hubungan</span>
      </button>
      <button
        onClick={() => setActiveTab('join')}
        className={`flex-1 min-w-[140px] px-4 md:px-6 py-2.5 md:py-3 rounded-full font-black transition-all border-2 border-black flex items-center justify-center gap-2 text-xs sm:text-sm touch-manipulation cursor-pointer ${
          activeTab === 'join'
            ? 'bg-[#7c98ff] text-black shadow-[2px_2px_0px_0px_#000]'
            : 'bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
        }`}
      >
        <LogIn size={16} className="stroke-[3]" />
        <span>Gabung Hubungan</span>
      </button>
    </div>
  );
}
