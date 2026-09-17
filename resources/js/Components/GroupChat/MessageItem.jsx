// resources/js/Components/GroupChat/MessageItem.jsx
import MessageBubble from './MessageBubble';
import MessageReactions from './MessageReactions';
import MessageActions from './MessageActions';
import EmojiPicker from './EmojiPicker';

export default function MessageItem({
    message,
    auth,
    showEmojiPicker,
    setShowEmojiPicker,
    handleReaction,
    handleDeleteMessage,
    setReplyTo,
    messages
}) {
    const isOwnMessage = message.user_id === auth.user.id;

    const replyToMessage = message.replied_to_message_details ||
        message.reply_to ||
        (message.reply_to_message_id
            ? messages.find(msg => msg.id === message.reply_to_message_id)
            : null);

    const getUserInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                <div className="flex items-end gap-2">
                    {!isOwnMessage && (
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-black text-xs font-black flex-shrink-0 border-2 border-black bg-[#7c98ff] shadow-[2px_2px_0px_0px_#000]"
                        >
                            {getUserInitials(message.user?.name)}
                        </div>
                    )}
                    <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                        {/* Sender Name */}
                        {!isOwnMessage && (
                            <p className="text-xs font-bold text-black/75 mb-1 px-2">
                                {message.user?.name}
                            </p>
                        )}

                        {/* Message Bubble */}
                        <MessageBubble
                            message={message}
                            isOwnMessage={isOwnMessage}
                            replyToMessage={replyToMessage}
                        />

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                            <MessageReactions
                                reactions={message.reactions}
                                onReactionClick={(emoji) => handleReaction(message.id, emoji)}
                            />
                        )}

                        {/* Message Actions + Floating Emoji Picker */}
                        <div className="relative mt-1">
                            <MessageActions
                                message={message}
                                onReact={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                                onReply={() => setReplyTo(message)}
                                onDelete={() => handleDeleteMessage(message.id)}
                            />

                            {/* Floating Emoji Picker (tidak mempengaruhi ukuran bubble) */}
                            {showEmojiPicker === message.id && (
                                <div className={`absolute z-30 ${isOwnMessage ? 'right-0' : 'left-0'} top-full mt-1.5 animate-fade-in`}>
                                    <EmojiPicker
                                        onEmojiSelect={(emoji) => {
                                            handleReaction(message.id, emoji);
                                            setShowEmojiPicker(null);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
