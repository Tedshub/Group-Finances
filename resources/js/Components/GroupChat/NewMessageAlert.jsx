// resources/js/Components/GroupChat/NewMessageAlert.jsx
export default function NewMessageAlert({ alert, onView }) {
    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 flex items-center justify-between">
            <div>
                <p className="font-bold">{alert.user} mengirim pesan baru</p>
                <p className="text-sm">{alert.message}</p>
            </div>
            <button
                onClick={onView}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
            >
                Lihat
            </button>
        </div>
    );
}
