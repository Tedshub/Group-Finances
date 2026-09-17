// resources/js/Components/GroupChat/EmojiPicker.jsx
export default function EmojiPicker({ onEmojiSelect }) {
    const emojis = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👏'];

    return (
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 px-2 sm:px-2.5 bg-white rounded-full border-2 border-black shadow-[3px_3px_0px_0px_#000] whitespace-nowrap">
            {emojis.map((emoji) => (
                <button
                    key={emoji}
                    type="button"
                    onClick={() => onEmojiSelect(emoji)}
                    className="text-lg sm:text-xl hover:scale-125 active:scale-95 transition-transform p-1 cursor-pointer flex-shrink-0 leading-none"
                    title={`React ${emoji}`}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
}
