// resources/js/Components/GroupChat/Sidebar.jsx
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';

export default function Sidebar({ relations, currentRelation, showSidebar, setShowSidebar, isDesktopPopup = false }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < 900);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleRelationClick = (relation) => {
        router.get(route('chat.index', relation.id));
        if (!isDesktopPopup) setShowSidebar(false);
    };

    const sidebarClasses = isDesktopPopup
        ? (currentRelation ? 'hidden' : 'w-full h-full flex flex-col bg-white')
        : `${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-72 h-full flex flex-col bg-white border-r-2 border-black shadow-[4px_0px_0px_0px_#000] lg:shadow-none transition-transform duration-300 ease-in-out`;

    return (
        <>
            <div className={sidebarClasses}>
                {/* Header */}
                <div className="px-4 py-3.5 flex items-center justify-between flex-shrink-0 bg-[#c5ffbc] border-b-2 border-black">
                    <h3 className="font-black text-black flex items-center gap-2 text-sm tracking-wide">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-black bg-[#7c98ff] shadow-[1.5px_1.5px_0px_0px_#000]">
                            <Users size={15} className="text-black stroke-[2.5]" />
                        </span>
                        Grup Keuangan
                    </h3>
                    {!isDesktopPopup && (
                        <button
                            onClick={() => setShowSidebar(false)}
                            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-full border-2 border-black bg-white hover:bg-[#FF6B7A] text-black transition-all shadow-[1px_1px_0px_0px_#000]"
                        >
                            <X size={14} className="stroke-[3]" />
                        </button>
                    )}
                </div>

                {/* Relation List */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 bg-[#fbfcf8]">
                    {relations.length > 0 ? (
                        relations.map((relation) => {
                            const isActive = currentRelation?.id === relation.id;
                            return (
                                <button
                                    key={relation.id}
                                    onClick={() => handleRelationClick(relation)}
                                    className={`w-full p-3 text-left rounded-2xl transition-all flex items-center border-2 ${
                                        isActive
                                            ? 'bg-[#7c98ff] text-black font-black border-black shadow-[3px_3px_0px_0px_#000]'
                                            : 'bg-white text-black font-bold border-black/20 hover:border-black hover:bg-[#C8F5C8]/40 hover:shadow-[2px_2px_0px_0px_#000]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div
                                                className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black font-black flex-shrink-0 text-sm shadow-[1.5px_1.5px_0px_0px_#000]"
                                                style={{
                                                    background: isActive ? '#ffffff' : '#c5ffbc',
                                                }}
                                            >
                                                {relation.nama.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-black truncate max-w-[140px] text-sm text-black">
                                                    {relation.nama}
                                                </h4>
                                                <p className="text-[11px] font-bold text-black/60 truncate max-w-[140px]">
                                                    {relation.deskripsi || "Grup Keuangan"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Unread badge */}
                                        {relation.unread_count > 0 && (
                                            <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black bg-[#FF6B7A] text-white border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000]">
                                                {relation.unread_count > 99 ? '99+' : relation.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_0px_#000]">
                                <Users size={20} className="text-black" />
                            </div>
                            <p className="text-xs font-black text-black">Belum ada grup</p>
                            <p className="text-[11px] font-bold text-black/60 mt-1">
                                Tambahkan hubungan di menu Hubungan
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile overlay */}
            {!isDesktopPopup && showSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-20 lg:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}
        </>
    );
}
