// resources/js/Components/Relation/PendingRequestsList.jsx

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import ConfirmationModal from './Modals/ConfirmationModal';

export default function PendingRequestsList() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch pending requests
  const fetchPendingRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await axios.get(route('relations.user-pending-requests'));

      if (response.data.success) {
        setPendingRequests(response.data.data || []);
      } else {
        setError(response.data.message || 'Gagal memuat data');
      }
    } catch (err) {
      console.error('Error fetching pending requests:', err);
      setError(err.response?.data?.message || 'Gagal memuat permintaan pending');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPendingRequests();
  }, []);

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
      route('relations.cancel-request', selectedRequest.id),
      {
        preserveScroll: true,
        onSuccess: () => {
          // Refresh list setelah berhasil cancel
          fetchPendingRequests();
          setSelectedRequest(null);
        },
        onError: (errors) => {
          console.error('Error cancelling request:', errors);
          setError('Gagal membatalkan permintaan');
        },
        onFinish: () => {
          setCancellingId(null);
        }
      }
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPendingRequests(true);
  };

  if (loading && !refreshing) {
    return (
      <div className="bg-white border border-black rounded-2xl p-6">
        <h3 className="text-lg font-serif font-normal text-black mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          Permintaan Bergabung Saya
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
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
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchPendingRequests()}
                className="text-xs text-red-600 hover:text-red-800 underline mt-1"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {!loading && pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Tidak ada permintaan yang pending</p>
          </div>
        ) : (
          <div className="space-y-0">
            {pendingRequests.map((request, index) => (
              <div
                key={request.id}
                className={`p-3 transition-colors hover:bg-gray-50 ${
                  index !== pendingRequests.length - 1 ? 'border-b border-black' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-serif font-normal text-black truncate" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                        {request.relation_name}
                      </h4>
                      <span className="flex-shrink-0 inline-flex items-center gap-1 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-full text-xs font-medium text-yellow-800">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                        Pending
                      </span>
                    </div>

                    {request.message && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        "{request.message}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">{request.created_at_human}</span>
                      </div>

                      {request.relation_owner && (
                        <span className="text-gray-500">
                          • Owner: <span className="font-medium text-gray-700">{request.relation_owner}</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      <span className="font-mono bg-blue-100 border border-black px-2 py-0.5 rounded-full text-xs font-bold">
                        {request.relation_code}
                      </span>
                    </div>
                  </div>

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
              Anda yakin ingin membatalkan permintaan bergabung ke <strong>"{selectedRequest.relation_name}"</strong>?
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
