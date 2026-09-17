// resources/js/Components/GroupChat/MessageReactions.jsx
export default function MessageReactions({ reactions, onReactionClick }) {
    if (!reactions || reactions.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1 mt-1 px-2">
            {reactions.map((reaction, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => onReactionClick(reaction.emoji)}
                    className="inline-flex items-center gap-1 bg-white hover:bg-yellow-100 active:scale-95 border-2 border-black rounded-full px-2 py-0.5 text-xs font-black text-black shadow-[1.5px_1.5px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title={reaction.users?.map(u => u.name).join(', ')}
                >
                    <span className="text-sm leading-none">{reaction.emoji}</span>
                    <span className="text-[11px] font-black">{reaction.count}</span>
                </button>
            ))}
        </div>
    );
}
