// resources/js/Components/GroupChat/EmptyState.jsx
import { MessageSquare } from 'lucide-react';

export default function EmptyState({ setShowSidebar }) {
    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-[#C8F5C8]">
            <div className="bg-white border-2 border-black rounded-3xl p-8 text-center max-w-sm w-full shadow-[6px_6px_0px_0px_#000]">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-full border-2 border-black bg-[#7c98ff] shadow-[2px_2px_0px_0px_#000]">
                    <MessageSquare size={34} className="text-black stroke-[2.5]" />
                </div>

                <h3 className="text-xl font-black text-black mb-2">
                    Pilih Grup Percakapan
                </h3>
                <p className="text-xs font-bold text-black/60 leading-relaxed mb-6">
                    Pilih salah satu grup keuangan dari daftar sidebar untuk melihat dan bertukar pesan secara real-time.
                </p>

                <button
                    onClick={() => setShowSidebar(true)}
                    className="px-8 py-3 rounded-full text-sm font-black text-black bg-[#c5ffbc] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all lg:hidden cursor-pointer"
                >
                    Buka Daftar Grup
                </button>
            </div>
        </div>
    );
}
