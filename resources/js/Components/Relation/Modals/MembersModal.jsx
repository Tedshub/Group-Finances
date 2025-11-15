// resources/js/Components/Relation/Modals/MembersModal.jsx

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Users, Crown, Calendar, UserPlus, Check, XCircle, UserMinus, CheckCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal';

export default function MembersModal({
  show,
  onClose,
  selectedRelation,
  relationMembers,
  loadingMembers,
  membersError,
  currentUserId = null,
  isOwner = false,
  onMemberKicked = null,
  onRequestHandled = null // Callback untuk refresh setelah approve/reject
}) {
  // Default tab adalah 'requests' untuk owner, 'members' untuk member biasa
  const [activeTab, setActiveTab] = useState(isOwner ? 'requests' : 'members');
  const [processing, setProcessing] = useState(null);
  const [showKickConfirm, setShowKickConfirm] = useState(false);
  const [memberToKick, setMemberToKick] = useState(null);

  // States untuk pending requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [processingRequest, setProcessingRequest] = useState(null);

  // States untuk notification modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');

  // Reset tab saat modal dibuka
  useEffect(() => {
    if (show) {
      setActiveTab(isOwner ? 'requests' : 'members');
    }
  }, [show, isOwner]);

  // Fetch pending requests saat modal dibuka dan tab requests aktif
  useEffect(() => {
    if (show && selectedRelation && activeTab === 'requests' && isOwner) {
      fetchPendingRequests();
    }
  }, [show, selectedRelation, activeTab, isOwner]);

  const fetchPendingRequests = async () => {
    if (!selectedRelation?.id) return;

    setLoadingRequests(true);
    setRequestsError('');

    try {
      const response = await axios.get(route('relations.pending-requests-json', selectedRelation.id));

      if (response.data.requests && Array.isArray(response.data.requests)) {
        setPendingRequests(response.data.requests);
      } else {
        setPendingRequests([]);
      }
    } catch (err) {
      console.error('Error fetching pending requests:', err);
      if (err.response) {
        setRequestsError(err.response.data.error || 'Gagal memuat permintaan');
      } else {
        setRequestsError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoadingRequests(false);
    }
  };

  const showSuccessNotification = (title, message) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowSuccessModal(true);
  };

  const showErrorNotification = (title, message) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowErrorModal(true);
  };

  if (!show || !selectedRelation) return null;

  const handleKickMember = (memberId, memberName) => {
    setMemberToKick({ id: memberId, name: memberName });
    setShowKickConfirm(true);
  };

  const confirmKickMember = () => {
    if (!memberToKick) return;

    setProcessing(memberToKick.id);
    setShowKickConfirm(false);

    router.delete(
      route('relations.kick-member', {
        relation: selectedRelation.id,
        user: memberToKick.id
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          setMemberToKick(null);
          showSuccessNotification(
            'Berhasil!',
            `${memberToKick.name} berhasil dikeluarkan dari relation.`
          );
          if (onMemberKicked) {
            onMemberKicked(selectedRelation.id);
          }
        },
        onError: (errors) => {
          console.error('Error kicking member:', errors);
          showErrorNotification(
            'Gagal Mengeluarkan Member',
            'Terjadi kesalahan saat mengeluarkan member. Silakan coba lagi.'
          );
        },
        onFinish: () => {
          setProcessing(null);
        }
      }
    );
  };

  const cancelKickMember = () => {
    setShowKickConfirm(false);
    setMemberToKick(null);
  };

  const handleApproveRequest = async (requestId, userName) => {
    if (processingRequest) return;

    setProcessingRequest(requestId);

    try {
      await axios.post(route('relations.approve-request-json', {
        relation: selectedRelation.id,
        request: requestId
      }));

      // Refresh pending requests
      await fetchPendingRequests();

      // Refresh members list jika ada callback
      if (onRequestHandled) {
        onRequestHandled(selectedRelation.id);
      }

      // Show success notification
      showSuccessNotification(
        'Permintaan Diterima!',
        `${userName} berhasil diterima sebagai anggota relation.`
      );
    } catch (err) {
      console.error('Error approving request:', err);
      const errorMessage = err.response?.data?.error || 'Terjadi kesalahan saat menerima permintaan. Silakan coba lagi.';
      showErrorNotification('Gagal Menerima Permintaan', errorMessage);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId, userName) => {
    if (processingRequest) return;

    setProcessingRequest(requestId);

    try {
      await axios.post(route('relations.reject-request-json', {
        relation: selectedRelation.id,
        request: requestId
      }));

      // Refresh pending requests
      await fetchPendingRequests();

      // Show success notification
      showSuccessNotification(
        'Permintaan Ditolak',
        `Permintaan dari ${userName} telah ditolak.`
      );
    } catch (err) {
      console.error('Error rejecting request:', err);
      const errorMessage = err.response?.data?.error || 'Terjadi kesalahan saat menolak permintaan. Silakan coba lagi.';
      showErrorNotification('Gagal Menolak Permintaan', errorMessage);
    } finally {
      setProcessingRequest(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg md:rounded-2xl border border-black max-w-md w-full max-h-[80vh] p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg md:text-xl font-serif font-normal text-black mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                {selectedRelation.nama}
              </h3>
              <p className="text-xs text-gray-600">
                {activeTab === 'members'
                  ? `Total ${relationMembers.length} anggota`
                  : `${pendingRequests.length} permintaan bergabung`
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full border border-black transition-colors touch-manipulation"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Tab Bar - hanya tampil jika user adalah owner */}
          {isOwner && (
            <div className="flex gap-2 mb-4">
              {/* Tab Permintaan - SEBELAH KIRI */}
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all border border-black text-sm touch-manipulation flex items-center justify-center gap-2 relative ${
                  activeTab === 'requests'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <UserPlus className="w-4 h-4 pointer-events-none" />
                Permintaan
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              {/* Tab Anggota - SEBELAH KANAN */}
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all border border-black text-sm touch-manipulation flex items-center justify-center gap-2 ${
                  activeTab === 'members'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4 pointer-events-none" />
                Anggota
              </button>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {activeTab === 'requests' ? (
              // Requests Tab - TAMPIL PERTAMA
              <>
                {loadingRequests ? (
                  <div className="flex flex-col justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                    <p className="text-gray-600 text-sm">Memuat permintaan...</p>
                  </div>
                ) : requestsError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <p className="text-gray-700 text-sm mb-2 font-medium">Gagal memuat data</p>
                    <p className="text-gray-600 text-sm mb-4">{requestsError}</p>
                  </div>
                ) : pendingRequests.length > 0 ? (
                  <div className="space-y-3">
                    {pendingRequests.map((request) => {
                      const isProcessing = processingRequest === request.id;

                      return (
                        <div
                          key={request.id}
                          className="flex items-start justify-between p-3 bg-blue-50 border border-black rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-orange-500 border border-black rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">
                                {request.user_name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate mb-1">
                                {request.user_name || 'Unknown User'}
                              </p>

                              {request.user_email && (
                                <p className="text-xs text-gray-600 truncate mb-1">
                                  {request.user_email}
                                </p>
                              )}

                              {request.message && (
                                <p className="text-xs text-gray-700 italic mb-1 line-clamp-2">
                                  "{request.message}"
                                </p>
                              )}

                              {request.created_at && (
                                <p className="text-xs text-gray-500">
                                  Mengajukan {request.created_at}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 flex-shrink-0 ml-2">
                            <button
                              onClick={() => handleApproveRequest(request.id, request.user_name)}
                              disabled={isProcessing}
                              className="p-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-full border border-black transition-all shadow-lg touch-manipulation disabled:cursor-not-allowed"
                              title={isProcessing ? 'Memproses...' : 'Terima'}
                            >
                              {isProcessing ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <Check className="w-4 h-4 pointer-events-none" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id, request.user_name)}
                              disabled={isProcessing}
                              className="p-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full border border-black transition-all shadow-lg touch-manipulation disabled:cursor-not-allowed"
                              title={isProcessing ? 'Memproses...' : 'Tolak'}
                            >
                              <XCircle className="w-4 h-4 pointer-events-none" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-700 font-medium mb-2">Tidak ada permintaan bergabung</p>
                    <p className="text-gray-600 text-sm">
                      Permintaan baru akan muncul di sini
                    </p>
                  </div>
                )}
              </>
            ) : (
              // Members Tab
              <>
                {loadingMembers ? (
                  <div className="flex flex-col justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                    <p className="text-gray-600 text-sm">Memuat data anggota...</p>
                  </div>
                ) : membersError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <p className="text-gray-700 text-sm mb-2 font-medium">Gagal memuat data</p>
                    <p className="text-gray-600 text-sm mb-4">{membersError}</p>
                    <p className="text-gray-500 text-xs">Silakan coba lagi atau hubungi administrator</p>
                  </div>
                ) : relationMembers.length > 0 ? (
                  <div className="space-y-3">
                    {relationMembers.map((member) => {
                      const canKick = isOwner && !member.is_owner && member.id !== currentUserId;
                      const isProcessing = processing === member.id;

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between gap-3 p-3 bg-gray-50 border border-black rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-blue-500 border border-black rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">
                                {member.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-gray-900 text-sm truncate">
                                  {member.name || 'Unknown User'}
                                </p>
                              </div>

                              {member.email && (
                                <p className="text-xs text-gray-600 truncate mb-1">
                                  {member.email}
                                </p>
                              )}

                              {member.join_at && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>Bergabung {member.join_at}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Role Badge & Kick Button Container */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Role Badge */}
                            {member.is_owner ? (
                              <span className="inline-flex items-center gap-1 bg-yellow-300 border border-black px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                                <Crown className="w-3 h-3" />
                                Owner
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-gray-200 border border-black px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                                Anggota
                              </span>
                            )}

                            {/* Kick Button */}
                            {canKick && (
                              <button
                                onClick={() => handleKickMember(member.id, member.name)}
                                disabled={isProcessing}
                                className="p-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full border border-black transition-all shadow-lg touch-manipulation disabled:cursor-not-allowed"
                                title={isProcessing ? 'Memproses...' : 'Keluarkan member'}
                              >
                                {isProcessing ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                ) : (
                                  <UserMinus className="w-4 h-4 pointer-events-none" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-700 font-medium mb-2">Belum ada anggota</p>
                    <p className="text-gray-600 text-sm">
                      Tambah anggota dengan membagikan kode hubungan
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-black">
            <button
              onClick={onClose}
              className="w-full px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full border border-black font-bold transition-all shadow-lg text-sm touch-manipulation active:scale-95"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal untuk Kick Member */}
      <ConfirmationModal
        show={showKickConfirm}
        onClose={cancelKickMember}
        onConfirm={confirmKickMember}
        title="Keluarkan Anggota"
        message={`Apakah Anda yakin ingin mengeluarkan ${memberToKick?.name} dari relation ini? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Keluarkan"
        cancelText="Batal"
        confirmButtonClass="bg-red-500 hover:bg-red-600 active:bg-red-700"
      />

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={notificationTitle}
        message={notificationMessage}
      />

      {/* Error Modal */}
      <ConfirmationModal
        show={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onConfirm={() => setShowErrorModal(false)}
        title={notificationTitle}
        message={notificationMessage}
        confirmText="Tutup"
        cancelText=""
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />
    </>
  );
}
