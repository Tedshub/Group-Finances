// resources/js/Components/GroupChat/MessageList.jsx
import MessageItem from './MessageItem';
import EmptyMessages from './EmptyMessages';

export default function MessageList({
    messages,
    auth,
    messagesContainerRef,
    messagesEndRef,
    showEmojiPicker,
    setShowEmojiPicker,
    handleReaction,
    handleDeleteMessage,
    setReplyTo,
    checkIfAtBottom
}) {
    return (
        <div
            ref={messagesContainerRef}
            onScroll={checkIfAtBottom}
            className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-3"
            style={{ background: '#C8F5C8' }}
        >
            {messages.length > 0 ? (
                messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        auth={auth}
                        showEmojiPicker={showEmojiPicker}
                        setShowEmojiPicker={setShowEmojiPicker}
                        handleReaction={handleReaction}
                        handleDeleteMessage={handleDeleteMessage}
                        setReplyTo={setReplyTo}
                        messages={messages}
                    />
                ))
            ) : (
                <EmptyMessages />
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}
