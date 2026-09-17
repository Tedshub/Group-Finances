// resources/js/Components/GroupChat/ReplyPreview.jsx
export default function ReplyPreview({ replyTo, onCancel }) {
    return (
        <div className="mb-2 p-3 bg-blue-50 rounded-full flex items-start justify-between border border-blue-200">
            <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-medium mb-1">
                    Membalas {replyTo.user?.name}
                </p>
                <p className="text-sm text-gray-800 truncate">{replyTo.message}</p>
            </div>
            <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 ml-2 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
