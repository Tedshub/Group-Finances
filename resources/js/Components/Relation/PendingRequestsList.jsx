import React, { useState } from 'react';
import { X, Calendar, AlertCircle, Loader2, RefreshCw, Crown, User } from 'lucide-react';
import { router } from '@inertiajs/react';
import ConfirmationModal from './Modals/ConfirmationModal';

export default function PendingRequestsList({ myPendingRequests = [], incomingRequests = [] }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('outgoing'); // 'outgoing' or 'incoming'

  // Show cancel confirmation modal
  const handleShowCancelModal = (request) => {
    setSelectedRequest(request);
    setShowCancelModal(true);
  };

  // Close cancel modal
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedRequest(null);
  };

  // Handle cancel request dengan Inertia
  const handleCancelRequest = () => {
    if (!selectedRequest) return;

    setCancellingId(selectedRequest.id);
    setShowCancelModal(false);

    router.delete(
      route('relations.join-requests.cancel', selectedRequest.id),
      {
        preserveScroll: true,
        onSuccess: (page) => {
          // Update state dengan data baru dari response
          setSelectedRequest(null);
          // Tampilkan pesan sukses
          if (page.props.flash?.success) {
            // Bisa ditambahkan toast notification di sini
          }
        },
        onError: (errors) => {
          console.error('Error cancelling request:', errors);
        },
        onFinish: () => {
          setCancellingId(null);
        }
      }
    );
  };

  // Render outgoing requests
  const renderOutgoingRequests = () => {
    if (!myPendingRequests || myPendingRequests.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Tidak ada permintaan yang pending</p>
        </div>
      );
    }

    return (
      <div className="space-y-0">
        {myPendingRequests.map((request, index) => (
          <div
            key={request.id}
            className={`p-3 md:p-4 transition-colors hover:bg-gray-50 ${
              index !== myPendingRequests.length - 1 ? 'border-b border-black' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header: Nama Relation + Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-base font-serif font-normal text-black truncate" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    {request.relation.nama}
                  </h4>
                  <span className="flex-shrink-0 inline-flex items-center gap-1 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-full text-xs font-medium text-yellow-800">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                    Pending
                  </span>
                </div>

                {/* Owner Information */}
                {request.relation.owner && (
                  <div className="mb-2 flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-2.5 py-1.5">
                    <div className="w-6 h-6 bg-purple-500 border border-black rounded-full flex items-center justify-center flex-shrink-0">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-purple-900 font-medium truncate">
                        {request.relation.owner.name}
                      </p>
                      {request.relation.owner.email && (
                        <p className="text-xs text-purple-700 truncate">
                          {request.relation.owner.email}
                        </p>
                      )}
                    </div>
                    <span className="flex-shrink-0 text-xs font-bold text-purple-700 bg-purple-100 border border-purple-300 px-1.5 py-0.5 rounded-full">
                      Owner
                    </span>
                  </div>
                )}

                {/* Pesan User */}
                {request.pesan && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2 italic">
                    "{request.pesan}"
                  </p>
                )}

                {/* Timestamp */}
                <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">{request.created_at_human}</span>
                  </div>
                </div>

                {/* Kode Relation */}
                <div className="mt-2">
                  <span className="font-mono bg-blue-100 border border-black px-2 py-0.5 rounded-full text-xs font-bold">
                    {request.relation.kode}
                  </span>
                </div>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => handleShowCancelModal(request)}
                disabled={cancellingId === request.id}
                className="flex-shrink-0 p-1.5 hover:bg-red-100 rounded-full border border-black transition-colors touch-manipulation group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Batalkan permintaan"
              >
                {cancellingId === request.id ? (
                  <Loader2 className="w-4 h-4 text-gray-700 animate-spin pointer-events-none" />
                ) : (
                  <X className="w-4 h-4 text-gray-700 group-hover:text-red-600 pointer-events-none transition-colors" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render incoming requests
  const renderIncomingRequests = () => {
    if (!incomingRequests || incomingRequests.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Tidak ada permintaan masuk yang pending</p>
        </div>
      );
    }

    return (
      <div className="space-y-0">
        {incomingRequests.map((request, index) => (
          <div
            key={request.id}
            className={`p-3 md:p-4 transition-colors hover:bg-gray-50 ${
              index !== incomingRequests.length - 1 ? 'border-b border-black' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header: Nama Relation + Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-base font-serif font-normal text-black truncate" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    {request.relation.nama}
                  </h4>
                  <span className="flex-shrink-0 inline-flex items-center gap-1 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-full text-xs font-medium text-yellow-800">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                    Pending
                  </span>
                </div>

                {/* User Information */}
                {request.user && (
                  <div className="mb-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">
                    <div className="w-6 h-6 bg-blue-500 border border-black rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-900 font-medium truncate">
                        {request.user.name}
                      </p>
                      {request.user.email && (
                        <p className="text-xs text-blue-700 truncate">
                          {request.user.email}
                        </p>
                      )}
                    </div>
                    <span className="flex-shrink-0 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-300 px-1.5 py-0.5 rounded-full">
                      Member
                    </span>
                  </div>
                )}

                {/* Pesan User */}
                {request.pesan && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2 italic">
                    "{request.pesan}"
                  </p>
                )}

                {/* Timestamp */}
                <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">{request.created_at_human}</span>
                  </div>
                </div>

                {/* Kode Relation */}
                <div className="mt-2">
                  <span className="font-mono bg-blue-100 border border-black px-2 py-0.5 rounded-full text-xs font-bold">
                    {request.relation.kode}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleApproveRequest(request)}
                  disabled={cancellingId === request.id}
                  className="flex-shrink-0 p-1.5 hover:bg-green-100 rounded-full border border-black transition-colors touch-manipulation group disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Setujui permintaan"
                >
                  {cancellingId === request.id ? (
                    <Loader2 className="w-4 h-4 text-gray-700 animate-spin pointer-events-none" />
                  ) : (
                    <svg className="w-4 h-4 text-gray-700 group-hover:text-green-600 pointer-events-none transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleRejectRequest(request)}
                  disabled={cancellingId === request.id}
                  className="flex-shrink-0 p-1.5 hover:bg-red-100 rounded-full border border-black transition-colors touch-manipulation group disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Tolak permintaan"
                >
                  {cancellingId === request.id ? (
                    <Loader2 className="w-4 h-4 text-gray-700 animate-spin pointer-events-none" />
                  ) : (
                    <X className="w-4 h-4 text-gray-700 group-hover:text-red-600 pointer-events-none transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Handle approve request
  const handleApproveRequest = (request) => {
    setCancellingId(request.id);

    router.post(
      route('relations.join-requests.approve', request.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          // Data akan otomatis diperbarui oleh Inertia
        },
        onError: (errors) => {
          console.error('Error approving request:', errors);
        },
        onFinish: () => {
          setCancellingId(null);
        }
      }
    );
  };

  // Handle reject request
  const handleRejectRequest = (request) => {
    setCancellingId(request.id);

    router.post(
      route('relations.join-requests.reject', request.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          // Data akan otomatis diperbarui oleh Inertia
        },
        onError: (errors) => {
          console.error('Error rejecting request:', errors);
        },
        onFinish: () => {
          setCancellingId(null);
        }
      }
    );
  };

  return (
    <>
      <div className="bg-white border border-black rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-normal text-black" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Permintaan Bergabung
          </h3>
          <button
            onClick={() => router.reload()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Tabs for outgoing/incoming requests */}
        <div className="flex border-b border-black mb-4">
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'outgoing'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Permintaan Saya ({myPendingRequests?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'incoming'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Permintaan Masuk ({incomingRequests?.length || 0})
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'outgoing' ? renderOutgoingRequests() : renderIncomingRequests()}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedRequest && (
        <ConfirmationModal
          show={showCancelModal}
          onClose={handleCloseCancelModal}
          onConfirm={handleCancelRequest}
          title="Batalkan Permintaan?"
          message={
            <>
              Anda yakin ingin membatalkan permintaan bergabung ke <strong>"{selectedRequest.relation.nama}"</strong>?
            </>
          }
          confirmText="Ya, Batalkan"
          cancelText="Batal"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
