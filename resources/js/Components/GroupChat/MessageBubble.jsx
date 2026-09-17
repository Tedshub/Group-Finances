// resources/js/Components/GroupChat/MessageBubble.jsx
export default function MessageBubble({ message, isOwnMessage, replyToMessage }) {
    const formatDate = (date) => {
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Hari ini ' + messageDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Kemarin ' + messageDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else {
            return messageDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        }
    };

    return (
        <div className="w-fit max-w-full">
            {/* Reply Context */}
            {message.reply_to_message_id && replyToMessage && (
                <div
                    className={`rounded-t-xl p-2 px-3 text-xs border-2 border-black border-b-0 ${
                        isOwnMessage ? 'bg-white/20 text-black' : 'bg-yellow-200 text-black'
                    }`}
                >
                    <p className="font-black">
                        Membalas {replyToMessage.user?.name}
                    </p>
                    <p className="truncate opacity-80">{replyToMessage.message}</p>
                </div>
            )}

            {/* Message Bubble */}
            <div
                className={`p-3.5 px-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] ${
                    isOwnMessage
                        ? 'bg-[#7c98ff] text-white rounded-2xl rounded-tr-none'
                        : 'bg-white text-black rounded-2xl rounded-tl-none'
                }`}
            >
                {/* File Attachment */}
                {message.has_bukti && (
                    <div className="mb-2">
                        {message.type === 'image' ? (
                            <img
                                src={route('chat.file.display', message.id)}
                                alt="Attachment"
                                className="rounded-xl border-2 border-black max-w-sm cursor-pointer hover:opacity-95 transition-opacity shadow-[2px_2px_0px_0px_#000]"
                                onClick={() => window.open(route('chat.file.download', message.id))}
                            />
                        ) : (
                            <a
                                href={route('chat.file.download', message.id)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 border-black font-bold text-xs shadow-[1.5px_1.5px_0px_0px_#000] ${
                                    isOwnMessage ? 'bg-white text-black' : 'bg-[#c5ffbc] text-black'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="truncate">{message.file_name}</span>
                            </a>
                        )}
                    </div>
                )}

                {/* Message Text */}
                {message.message && (
                    <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-relaxed">
                        {message.message}
                    </p>
                )}

                {/* Timestamp */}
                <p
                    className={`text-[10px] font-bold mt-1.5 text-right ${
                        isOwnMessage ? 'text-white/80' : 'text-black/60'
                    }`}
                >
                    {formatDate(message.created_at)}
                </p>
            </div>
        </div>
    );
}
