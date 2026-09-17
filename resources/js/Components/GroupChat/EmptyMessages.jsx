// resources/js/Components/GroupChat/EmptyMessages.jsx
import { MessageCircle } from 'lucide-react';

export default function EmptyMessages() {
    return (
        <div className="flex items-center justify-center h-full p-6">
            <div className="bg-white border-2 border-black rounded-2xl p-6 text-center max-w-xs w-full shadow-[4px_4px_0px_0px_#000]">
                <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center rounded-full border-2 border-black bg-[#c5ffbc] shadow-[2px_2px_0px_0px_#000]">
                    <MessageCircle size={24} className="text-black stroke-[2.5]" />
                </div>
                <p className="font-black text-base text-black">Belum ada pesan</p>
                <p className="text-xs font-bold text-black/60 mt-1 leading-relaxed">
                    Mulai obrolan keuangan pertama di grup ini!
                </p>
            </div>
        </div>
    );
}
