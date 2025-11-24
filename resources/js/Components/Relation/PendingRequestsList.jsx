import React, { useState } from 'react';
import { X, Calendar, AlertCircle, Loader2, RefreshCw, Crown, User } from 'lucide-react';
import { router } from '@inertiajs/react';
import ConfirmationModal from './Modals/ConfirmationModal';

export default function PendingRequestsList({ myPendingRequests = [] }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
        onSuccess: () => {
          // Refresh halaman setelah berhasil cancel
          router.reload();
          setSelectedRequest(null);
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

  if (!myPendingRequests || myPendingRequests.length === 0) {
    return (
      <div className="bg-white border border-black rounded-2xl p-6">
        <h3 className="text-lg font-serif font-normal text-black mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          Permintaan Bergabung Saya
        </h3>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Tidak ada permintaan yang pending</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-black rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-normal text-black" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Permintaan Bergabung Saya
          </h3>
          <button
            onClick={() => router.reload()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

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
    </>
  );
}
