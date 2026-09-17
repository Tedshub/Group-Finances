// resources/js/Components/GroupChat/ChatHeader.jsx
import { ArrowLeft } from 'lucide-react';

export default function ChatHeader({ currentRelation, isConnected, setShowSidebar, isDesktopPopup = false }) {

    const handleBackClick = () => {
        if (isDesktopPopup) {
            window.location.href = route('chat.index');
        } else {
            setShowSidebar(true);
        }
    };

    return (
        <header className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2.5 sm:gap-3 flex-shrink-0 bg-white border-b-2 border-black z-10">
            {/* Tombol Back */}
            <button
                onClick={handleBackClick}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex-shrink-0"
                title={isDesktopPopup ? "Kembali ke daftar grup" : "Buka menu"}
            >
                <ArrowLeft size={15} className="stroke-[3]" />
            </button>

            {/* Info Grup */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                {/* Avatar */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-black bg-[#7c98ff] flex items-center justify-center text-black font-black flex-shrink-0 text-sm sm:text-base shadow-[1.5px_1.5px_0px_0px_#000]">
                    {currentRelation?.nama?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-black text-black truncate text-xs sm:text-base leading-tight">
                        {currentRelation?.nama}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.2 rounded-full border border-black bg-white text-black shadow-[1px_1px_0px_0px_#000]">
                            {currentRelation?.kode}
                        </span>
                        <div className="flex items-center gap-1 px-2 py-0.2 rounded-full border border-black bg-[#c5ffbc] shadow-[1px_1px_0px_0px_#000]">
                            <div
                                className={`w-2 h-2 rounded-full border border-black ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-400'}`}
                            />
                            <span className="text-[10px] font-black text-black">
                                {isConnected ? 'Online' : 'Connecting...'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
