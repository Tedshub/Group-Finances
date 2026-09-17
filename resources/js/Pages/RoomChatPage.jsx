// resources/js/Pages/RoomChatPage.jsx
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePage } from '@inertiajs/react';

// Import komponen
import Sidebar from '@/Components/GroupChat/Sidebar';
import ChatHeader from '@/Components/GroupChat/ChatHeader';
import MessageList from '@/Components/GroupChat/MessageList';
import MessageInput from '@/Components/GroupChat/MessageInput';
import EmptyState from '@/Components/GroupChat/EmptyState';
import NewMessageAlert from '@/Components/GroupChat/NewMessageAlert';
import ScrollToBottomButton from '@/Components/GroupChat/ScrollToBottomButton';

export default function RoomChatPage({ auth, relations, currentRelation, initialMessages }) {
    const { url } = usePage();
    const [messages, setMessages] = useState(initialMessages?.data || []);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true); // Default true untuk show sidebar pertama kali
    const [relationsWithUnread, setRelationsWithUnread] = useState(relations);
    const [newMessageAlert, setNewMessageAlert] = useState(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [channel, setChannel] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isDesktopPopup, setIsDesktopPopup] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Deteksi mobile
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 900;
            setIsMobile(mobile);

            // Jika mobile dan ada current relation, tutup sidebar
            if (mobile && currentRelation) {
                setShowSidebar(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, [currentRelation]);

    // Deteksi apakah dalam mode popup desktop
    useEffect(() => {
        const checkIfPopup = () => {
            // Cek apakah halaman dimuat dalam iframe
            const inIframe = window.self !== window.top;
            setIsDesktopPopup(inIframe);

            // Jika desktop popup dan tidak ada relation terpilih, show sidebar
            if (inIframe && !currentRelation) {
                setShowSidebar(true);
            }
        };

        checkIfPopup();
        window.addEventListener('resize', checkIfPopup);

        return () => {
            window.removeEventListener('resize', checkIfPopup);
        };
    }, [currentRelation]);

    // Listener status koneksi WebSocket (Reverb / Echo)
    useEffect(() => {
        const pusher = window.Echo?.connector?.pusher;
        if (!pusher) return;

        if (pusher.connection.state === 'connected') {
            setIsConnected(true);
        }

        const handleConnected = () => setIsConnected(true);
        const handleDisconnected = () => setIsConnected(false);

        pusher.connection.bind('connected', handleConnected);
        pusher.connection.bind('disconnected', handleDisconnected);
        pusher.connection.bind('unavailable', handleDisconnected);
        pusher.connection.bind('failed', handleDisconnected);

        return () => {
            pusher.connection.unbind('connected', handleConnected);
            pusher.connection.unbind('disconnected', handleDisconnected);
            pusher.connection.unbind('unavailable', handleDisconnected);
            pusher.connection.unbind('failed', handleDisconnected);
        };
    }, []);

    // Auto scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Check if user is at bottom of chat
    const checkIfAtBottom = useCallback(() => {
        if (!messagesContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const atBottom = scrollHeight - scrollTop <= clientHeight + 50;

        setIsAtBottom(atBottom);
        setShowScrollToBottom(!atBottom);
    }, []);

    // Update relations list function
    const updateRelationsList = useCallback(async () => {
        try {
            const response = await fetch(route('chat.relations'));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setRelationsWithUnread(data.relations);
            }
        } catch (error) {
            console.error('Error updating relations list:', error);
        }
    }, []);

    // Mark messages as read function
    const markMessagesAsRead = useCallback(async () => {
        if (!currentRelation) return;

        try {
            await fetch(route('chat.mark-all-read', currentRelation.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            updateRelationsList();
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }, [currentRelation, updateRelationsList]);

    // Handle send message
    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();

        if (!newMessage.trim() && !selectedFile) return;
        if (!currentRelation) return;

        setIsLoading(true);

        const currentReplyTo = replyTo;

        const formData = new FormData();
        formData.append('relation_id', currentRelation.id);
        formData.append('message', newMessage);

        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        if (currentReplyTo) {
            formData.append('reply_to_message_id', currentReplyTo.id);
        }

        try {
            const response = await fetch(route('chat.send'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                const messageToAdd = currentReplyTo
                    ? { ...data.message, replied_to_message_details: currentReplyTo }
                    : data.message;

                setMessages(prev => [...prev, messageToAdd]);
                setNewMessage('');
                setSelectedFile(null);
                setReplyTo(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                updateRelationsList();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    }, [newMessage, selectedFile, replyTo, currentRelation, updateRelationsList]);

    // Handle delete message
    const handleDeleteMessage = useCallback(async (messageId) => {
        if (!confirm('Hapus pesan ini?')) return;

        try {
            await router.delete(route('chat.message.delete', messageId), {
                onSuccess: () => {
                    setMessages(prev => prev.filter(m => m.id !== messageId));
                }
            });
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }, []);

    // Handle reaction
    const handleReaction = useCallback(async (messageId, emoji) => {
        try {
            const response = await fetch(route('chat.reaction.toggle', messageId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ emoji }),
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId
                        ? { ...msg, reactions: data.reactions }
                        : msg
                ));
            }
        } catch (error) {
            console.error('Error toggling reaction:', error);
        }

        setShowEmojiPicker(null);
    }, []);

    // Setup Echo channel for real-time updates
    useEffect(() => {
        if (currentRelation) {
            const channelName = `chat.${currentRelation.id}`;
            const newChannel = window.Echo.private(channelName);

            newChannel.listen('.MessageSent', (e) => {
                if (e.message.user_id !== auth.user.id) {
                    setMessages(prev => [...prev, e.message]);

                    if (!isAtBottom) {
                        setNewMessageAlert({
                            user: e.message.user.name,
                            message: e.message.message || 'mengirim file'
                        });
                        setTimeout(() => setNewMessageAlert(null), 5000);
                    }
                    updateRelationsList();
                }
            });

            newChannel.listen('.MessageDeleted', (e) => {
                setMessages(prev => prev.filter(msg => msg.id !== e.messageId));
            });

            newChannel.listen('.MessageReacted', (e) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === e.messageId
                        ? { ...msg, reactions: e.reactions }
                        : msg
                ));
            });

            setChannel(newChannel);

            return () => {
                newChannel.stopListening('.MessageSent');
                newChannel.stopListening('.MessageDeleted');
                newChannel.stopListening('.MessageReacted');
                window.Echo.leave(channelName);
            };
        }
    }, [currentRelation, auth.user.id, isAtBottom, updateRelationsList]);

    // Mark messages as read when component mounts or relation changes
    useEffect(() => {
        if (currentRelation) {
            markMessagesAsRead();
        }
    }, [currentRelation, markMessagesAsRead]);

    // Check if at bottom when messages change
    useEffect(() => {
        checkIfAtBottom();
    }, [messages, checkIfAtBottom]);

    // Scroll to bottom when messages change and at bottom
    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [messages, isAtBottom, scrollToBottom]);

    return (
        <>
            <Head title={`Chat - ${currentRelation?.nama || 'Group Chat'}`} />
            <div className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] flex flex-col text-black overflow-hidden" style={{ background: '#C8F5C8' }}>
                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Sidebar - untuk desktop popup, sidebar muncul sebagai view utama jika tidak ada relation */}
                    <Sidebar
                        relations={relationsWithUnread}
                        currentRelation={currentRelation}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                        isDesktopPopup={isDesktopPopup}
                    />

                    {/* Main Content Area */}
                    <main className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${
                        isDesktopPopup && !currentRelation ? 'hidden' : ''
                    }`}>
                        {/* Header */}
                        {currentRelation && (
                            <ChatHeader
                                currentRelation={currentRelation}
                                isConnected={isConnected}
                                setShowSidebar={setShowSidebar}
                                isDesktopPopup={isDesktopPopup}
                            />
                        )}

                        <div className="flex-1 flex min-h-0">
                            {/* Chat Area */}
                            {currentRelation ? (
                                <div className="flex-1 flex flex-col min-w-0">
                                    {/* New Message Alert */}
                                    {newMessageAlert && (
                                        <NewMessageAlert
                                            alert={newMessageAlert}
                                            onView={() => {
                                                scrollToBottom();
                                                setNewMessageAlert(null);
                                            }}
                                        />
                                    )}

                                    {/* Messages */}
                                    <MessageList
                                        messages={messages}
                                        auth={auth}
                                        messagesContainerRef={messagesContainerRef}
                                        messagesEndRef={messagesEndRef}
                                        showEmojiPicker={showEmojiPicker}
                                        setShowEmojiPicker={setShowEmojiPicker}
                                        handleReaction={handleReaction}
                                        handleDeleteMessage={handleDeleteMessage}
                                        setReplyTo={setReplyTo}
                                        checkIfAtBottom={checkIfAtBottom}
                                    />

                                    {/* Scroll to bottom button */}
                                    {showScrollToBottom && (
                                        <ScrollToBottomButton onClick={scrollToBottom} />
                                    )}

                                    {/* Input Area */}
                                    <MessageInput
                                        newMessage={newMessage}
                                        setNewMessage={setNewMessage}
                                        selectedFile={selectedFile}
                                        setSelectedFile={setSelectedFile}
                                        replyTo={replyTo}
                                        setReplyTo={setReplyTo}
                                        handleSendMessage={handleSendMessage}
                                        isLoading={isLoading}
                                        fileInputRef={fileInputRef}
                                        isInputFocused={isInputFocused}
                                        setIsInputFocused={setIsInputFocused}
                                    />
                                </div>
                            ) : (
                                !isDesktopPopup && (
                                    <EmptyState setShowSidebar={setShowSidebar} />
                                )
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
// okee
