// resources/js/Components/GroupChat/MessageActions.jsx
export default function MessageActions({ message, onReact, onReply, onDelete }) {
    return (
        <div className="flex items-center gap-2 mt-0.5 px-2">
            <button
                type="button"
                onClick={onReact}
                className="text-[11px] font-black text-black/60 hover:text-black transition-colors cursor-pointer py-0.5 px-1 hover:underline"
            >
                React
            </button>
            <span className="text-black/30 text-[10px]">•</span>
            <button
                type="button"
                onClick={onReply}
                className="text-[11px] font-black text-black/60 hover:text-black transition-colors cursor-pointer py-0.5 px-1 hover:underline"
            >
                Reply
            </button>
            {message.can_delete && (
                <>
                    <span className="text-black/30 text-[10px]">•</span>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="text-[11px] font-black text-red-600 hover:text-red-800 transition-colors cursor-pointer py-0.5 px-1 hover:underline"
                    >
                        Hapus
                    </button>
                </>
            )}
        </div>
    );
}
