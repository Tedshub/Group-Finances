// resources/js/Components/GroupChat/MessageInput.jsx
import ReplyPreview from './ReplyPreview';
import FilePreview from './FilePreview';
import { Paperclip, Send } from 'lucide-react';

export default function MessageInput({
    newMessage,
    setNewMessage,
    selectedFile,
    setSelectedFile,
    replyTo,
    setReplyTo,
    handleSendMessage,
    isLoading,
    fileInputRef,
    isInputFocused,
    setIsInputFocused
}) {
    const hasContent = !isLoading && (newMessage.trim() || selectedFile);

    return (
        <div className="p-2 sm:p-3 md:p-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex-shrink-0 bg-white border-t-2 border-black z-10">
            {/* Reply Preview */}
            {replyTo && (
                <ReplyPreview
                    replyTo={replyTo}
                    onCancel={() => setReplyTo(null)}
                />
            )}

            {/* File Preview */}
            {selectedFile && (
                <FilePreview
                    file={selectedFile}
                    onCancel={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                />
            )}

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size <= 20 * 1024 * 1024) {
                        setSelectedFile(file);
                    } else {
                        alert('File terlalu besar! Maksimal 20MB');
                    }
                }}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx,.zip"
            />

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
                {/* Attach button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0 cursor-pointer"
                    title="Upload file lampiran"
                >
                    <Paperclip size={16} className="sm:w-[18px] sm:h-[18px] stroke-[2.5]" />
                </button>

                {/* Textarea container */}
                <div className="flex-1 relative">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Tulis pesan..."
                        rows="1"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 resize-none text-xs sm:text-sm font-semibold text-black placeholder:text-black/40 border-2 border-black rounded-2xl bg-white shadow-[2px_2px_0px_0px_#000] focus:shadow-[3px_3px_0px_0px_#000] focus:outline-none transition-all"
                        style={{
                            minHeight: '38px',
                            maxHeight: '100px',
                        }}
                    />
                </div>

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!hasContent}
                    className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-black flex-shrink-0 transition-all ${
                        hasContent
                            ? 'bg-[#7c98ff] hover:bg-[#6a88fc] text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer'
                            : 'bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    title="Kirim Pesan"
                >
                    <Send size={16} className="sm:w-[18px] sm:h-[18px] stroke-[2.5]" />
                </button>
            </form>
        </div>
    );
}
