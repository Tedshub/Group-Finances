// resources/js/Components/GroupChat/ScrollToBottomButton.jsx
import { ArrowDown } from 'lucide-react';

export default function ScrollToBottomButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="absolute bottom-24 right-6 w-10 h-10 flex items-center justify-center rounded-full border-2 border-black bg-[#7c98ff] shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-colors cursor-pointer"
            title="Ke pesan terbaru"
        >
            <ArrowDown size={18} className="text-black stroke-[3]" />
        </button>
    );
}
