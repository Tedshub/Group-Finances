// resources/js/Components/Relation/Modals/MembersModal.jsx

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Users, Crown, Calendar, UserPlus, Check, XCircle, UserMinus } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';

export default function MembersModal({
  show,
  onClose,
  selectedRelation,
  currentUserId = null,
  onMemberKicked = null,
  onRequestHandled = null
}) {
  const [activeTab, setActiveTab] = useState('members');
  const [processing, setProcessing] = useState(null);
  const [showKickConfirm, setShowKickConfirm] = useState(false);
  const [memberToKick, setMemberToKick] = useState(null);

  // States untuk members
  const [relationMembers, setRelationMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  // States untuk pending requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [processingRequest, setProcessingRequest] = useState(null);

  // States untuk confirmation modals
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch members data saat modal dibuka
  useEffect(() => {
    if (show && selectedRelation) {
      fetchMembersData();
    }
  }, [show, selectedRelation]);

  // Fetch pending requests saat tab requests aktif
  useEffect(() => {
    if (show && selectedRelation && activeTab === 'requests' && isOwner) {
      fetchPendingRequests();
    }
  }, [show, selectedRelation, activeTab, isOwner]);

  // Reset tab saat modal dibuka
  useEffect(() => {
    if (show && isOwner) {
      setActiveTab('requests');
    } else if (show) {
      setActiveTab('members');
    }
  }, [show, isOwner]);

  const fetchMembersData = async () => {
    if (!selectedRelation?.id) return;

    setLoadingMembers(true);
    setMembersError('');

    try {
      const response = await axios.get(route('relations.members-data', selectedRelation.id));

      if (response.data.members && Array.isArray(response.data.members)) {
        setRelationMembers(response.data.members);
        setIsOwner(response.data.is_owner || false);
      } else {
        setRelationMembers([]);
        setIsOwner(false);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      if (err.response) {
        setMembersError(err.response.data.error || 'Gagal memuat data anggota');
      } else {
        setMembersError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoadingMembers(false);
    }
  };

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
          fetchMembersData();
          if (onMemberKicked) {
            onMemberKicked(selectedRelation.id);
          }
        },
        onError: (errors) => {
          console.error('Error kicking member:', errors);
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

  const handleShowApproveConfirm = (request) => {
    setSelectedRequest(request);
    setShowApproveConfirm(true);
  };

  const handleShowRejectConfirm = (request) => {
    setSelectedRequest(request);
    setShowRejectConfirm(true);
  };

  const handleApproveRequest = () => {
    if (!selectedRequest) return;

    setProcessingRequest(selectedRequest.id);
    setShowApproveConfirm(false);

    router.post(
      route('relations.join-requests.approve', selectedRequest.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          fetchPendingRequests();
          fetchMembersData();

          if (onRequestHandled) {
            onRequestHandled(selectedRelation.id);
          }

          setSelectedRequest(null);
        },
        onError: (errors) => {
          console.error('Error approving request:', errors);
          setRequestsError('Gagal menerima permintaan');
        },
        onFinish: () => {
          setProcessingRequest(null);
        }
      }
    );
  };

  const handleRejectRequest = () => {
    if (!selectedRequest) return;

    setProcessingRequest(selectedRequest.id);
    setShowRejectConfirm(false);

    router.post(
      route('relations.join-requests.reject', selectedRequest.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          fetchPendingRequests();
          setSelectedRequest(null);
        },
        onError: (errors) => {
          console.error('Error rejecting request:', errors);
          setRequestsError('Gagal menolak permintaan');
        },
        onFinish: () => {
          setProcessingRequest(null);
        }
      }
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-2xl border-2 border-black max-w-lg w-full max-h-[85vh] p-5 md:p-6 shadow-[6px_6px_0px_0px_#000] overflow-hidden flex flex-col text-black">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black">
            <div className="min-w-0 pr-3">
              <h3
                className="text-2xl font-serif font-black text-black truncate leading-tight"
                style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
              >
                {selectedRelation.nama}
              </h3>
              <p className="text-xs font-bold text-black/70 mt-0.5">
                {activeTab === 'members'
                  ? `Total ${relationMembers.length} anggota bergabung`
                  : `${pendingRequests.length} permintaan bergabung menunggu persetujuan`
                }
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex-shrink-0"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Tab Bar - jika user adalah owner */}
          {isOwner && (
            <div className="flex gap-2.5 mb-4">
              {/* Tab Permintaan */}
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-2 px-3 rounded-full font-black text-xs sm:text-sm transition-all border-2 border-black flex items-center justify-center gap-2 relative shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                  activeTab === 'requests'
                    ? 'bg-[#7c98ff] text-black shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-yellow-100'
                }`}
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Permintaan</span>
                {pendingRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.2 border border-black shadow-[1px_1px_0px_0px_#000]">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              {/* Tab Anggota */}
              <button
                type="button"
                onClick={() => setActiveTab('members')}
                className={`flex-1 py-2 px-3 rounded-full font-black text-xs sm:text-sm transition-all border-2 border-black flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                  activeTab === 'members'
                    ? 'bg-[#7c98ff] text-black shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-yellow-100'
                }`}
              >
                <Users className="w-4 h-4 stroke-[2.5]" />
                <span>Anggota</span>
                <span className="text-[11px] font-bold opacity-75">
                  ({relationMembers.length})
                </span>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-3">
            {activeTab === 'requests' ? (
              // Requests Tab
              <>
                {loadingRequests ? (
                  <div className="flex flex-col justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-black border-t-transparent mb-3"></div>
                    <p className="text-black font-bold text-sm">Memuat permintaan...</p>
                  </div>
                ) : requestsError ? (
                  <div className="text-center py-8 p-4 bg-red-100 border-2 border-black rounded-xl">
                    <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-600 stroke-[2.5]" />
                    <p className="text-black font-black text-sm mb-1">Gagal memuat data</p>
                    <p className="text-black/70 font-bold text-xs mb-3">{requestsError}</p>
                    <button
                      type="button"
                      onClick={fetchPendingRequests}
                      className="px-4 py-1.5 bg-white hover:bg-gray-100 text-black rounded-full border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      Coba Lagi
                    </button>
                  </div>
                ) : pendingRequests.length > 0 ? (
                  <div className="space-y-3">
                    {pendingRequests.map((request) => {
                      const isProcessing = processingRequest === request.id;

                      return (
                        <div
                          key={request.id}
                          className="flex items-start justify-between p-3.5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-yellow-300 border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0 text-black font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
                              {request.user_name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-black text-sm truncate">
                                {request.user_name || 'Unknown User'}
                              </p>

                              {request.user_email && (
                                <p className="text-xs font-bold text-black/60 truncate">
                                  {request.user_email}
                                </p>
                              )}

                              {request.message && (
                                <p className="text-xs font-medium text-black/80 italic mt-1 line-clamp-2 bg-gray-50 border border-black/30 rounded p-1.5">
                                  "{request.message}"
                                </p>
                              )}

                              {request.created_at && (
                                <p className="text-[10px] font-bold text-black/50 mt-1">
                                  Diajukan: {request.created_at}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 flex-shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => handleShowApproveConfirm(request)}
                              disabled={isProcessing}
                              className="w-8 h-8 bg-[#c5ffbc] hover:bg-green-300 disabled:opacity-50 text-black rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                              title={isProcessing ? 'Memproses...' : 'Terima'}
                            >
                              {isProcessing ? (
                                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-black border-t-transparent" />
                              ) : (
                                <Check className="w-4 h-4 stroke-[3]" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShowRejectConfirm(request)}
                              disabled={isProcessing}
                              className="w-8 h-8 bg-red-200 hover:bg-red-300 disabled:opacity-50 text-black rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                              title={isProcessing ? 'Memproses...' : 'Tolak'}
                            >
                              <XCircle className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-yellow-50 border-2 border-black rounded-xl p-4">
                    <UserPlus className="w-10 h-10 mx-auto mb-2 text-black/40 stroke-[2]" />
                    <p className="text-black font-black text-sm mb-1">Tidak ada permintaan bergabung</p>
                    <p className="text-black/60 font-bold text-xs">
                      Permintaan baru yang masuk akan tampil di sini
                    </p>
                  </div>
                )}
              </>
            ) : (
              // Members Tab
              <>
                {loadingMembers ? (
                  <div className="flex flex-col justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-black border-t-transparent mb-3"></div>
                    <p className="text-black font-bold text-sm">Memuat data anggota...</p>
                  </div>
                ) : membersError ? (
                  <div className="text-center py-8 p-4 bg-red-100 border-2 border-black rounded-xl">
                    <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-600 stroke-[2.5]" />
                    <p className="text-black font-black text-sm mb-1">Gagal memuat data</p>
                    <p className="text-black/70 font-bold text-xs mb-3">{membersError}</p>
                    <button
                      type="button"
                      onClick={fetchMembersData}
                      className="px-4 py-1.5 bg-white hover:bg-gray-100 text-black rounded-full border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      Coba Lagi
                    </button>
                  </div>
                ) : relationMembers.length > 0 ? (
                  <div className="space-y-3">
                    {relationMembers.map((member) => {
                      const canKick = isOwner && !member.is_owner && member.id !== currentUserId;
                      const isProcessing = processing === member.id;

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between gap-3 p-3.5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-[#7c98ff] border-2 border-black rounded-xl flex items-center justify-center font-black text-black text-sm flex-shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                              {member.name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-black text-black text-sm truncate">
                                  {member.name || 'Unknown User'}
                                </p>
                                {member.id === currentUserId && (
                                  <span className="text-[10px] font-black bg-blue-100 border border-black rounded-full px-1.5 py-0.2">
                                    Anda
                                  </span>
                                )}
                              </div>

                              {member.email && (
                                <p className="text-xs font-bold text-black/60 truncate">
                                  {member.email}
                                </p>
                              )}

                              {member.join_at && (
                                <div className="flex items-center gap-1 text-[11px] font-bold text-black/50 mt-0.5">
                                  <Calendar className="w-3 h-3 stroke-[2.5]" />
                                  <span>Bergabung: {member.join_at}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Role Badge & Kick Button */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {member.is_owner ? (
                              <span className="inline-flex items-center gap-1 bg-yellow-300 border-2 border-black px-2.5 py-0.5 rounded-full text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                                <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
                                Owner
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-[#c5ffbc] border-2 border-black px-2.5 py-0.5 rounded-full text-xs font-bold shadow-[1.5px_1.5px_0px_0px_#000]">
                                Anggota
                              </span>
                            )}

                            {/* Kick Button */}
                            {canKick && (
                              <button
                                type="button"
                                onClick={() => handleKickMember(member.id, member.name)}
                                disabled={isProcessing}
                                className="w-8 h-8 bg-red-200 hover:bg-red-300 disabled:opacity-50 text-black rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                title={isProcessing ? 'Memproses...' : 'Keluarkan anggota'}
                              >
                                {isProcessing ? (
                                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-black border-t-transparent" />
                                ) : (
                                  <UserMinus className="w-4 h-4 stroke-[2.5]" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-yellow-50 border-2 border-black rounded-xl p-4">
                    <Users className="w-10 h-10 mx-auto mb-2 text-black/40 stroke-[2]" />
                    <p className="text-black font-black text-sm mb-1">Belum ada anggota</p>
                    <p className="text-black/60 font-bold text-xs">
                      Bagikan kode hubungan untuk mengundang anggota lain
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
        title="Keluarkan Anggota?"
        message={`Apakah Anda yakin ingin mengeluarkan ${memberToKick?.name} dari hubungan ini? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Keluarkan"
        cancelText="Batal"
        confirmButtonClass="bg-red-300 hover:bg-red-400 text-black"
      />

      {/* Confirmation Modal untuk Approve Request */}
      <ConfirmationModal
        show={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        onConfirm={handleApproveRequest}
        title="Terima Permintaan?"
        message={`Terima ${selectedRequest?.user_name} sebagai anggota hubungan "${selectedRelation?.nama}"?`}
        confirmText="Ya, Terima"
        cancelText="Batal"
        confirmButtonClass="bg-[#c5ffbc] hover:bg-green-300 text-black"
      />

      {/* Confirmation Modal untuk Reject Request */}
      <ConfirmationModal
        show={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={handleRejectRequest}
        title="Tolak Permintaan?"
        message={`Tolak permintaan dari ${selectedRequest?.user_name} untuk bergabung ke hubungan "${selectedRelation?.nama}"?`}
        confirmText="Ya, Tolak"
        cancelText="Batal"
        confirmButtonClass="bg-red-300 hover:bg-red-400 text-black"
      />
    </>
  );
}
