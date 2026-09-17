// resources/js/Components/GroupChat/FilePreview.jsx
export default function FilePreview({ file, onCancel }) {
    return (
        <div className="mb-2 p-3 bg-green-50 rounded-full flex items-center justify-between border border-green-200">
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
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
