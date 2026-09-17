// resources/js/Pages/NotificationsPage.jsx
import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
  Bell, Check, CheckCheck, Trash2, ArrowRight,
  TrendingUp, PiggyBank, UserPlus, ExternalLink,
  Calendar, Inbox, Filter
} from "lucide-react";
import Sidebar from "@/Layouts/Sidebar";
import NavbarIn from "@/Layouts/NavbarIn";

export default function NotificationsPage({ notifications = [] }) {
  const { auth, flash } = usePage().props;
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'transaction' | 'savings' | 'join_request'

  // Format date to Indonesian format
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Baru saja";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return formatDate(isoString);
  };

  // Get icon and color based on notification type
  const getTypeMeta = (type) => {
    switch (type) {
      case "transaction":
        return {
          icon: TrendingUp,
          bg: "bg-[#c5ffbc]",
          label: "Transaksi",
        };
      case "savings":
      case "savings_goal":
      case "contribution":
        return {
          icon: PiggyBank,
          bg: "bg-[#FFE082]",
          label: "Tabungan",
        };
      case "join_request":
      case "join_approved":
      case "join_rejected":
        return {
          icon: UserPlus,
          bg: "bg-[#7C98FF]",
          label: "Hubungan",
        };
      default:
        return {
          icon: Bell,
          bg: "bg-[#E2E8F0]",
          label: "Info",
        };
    }
  };

  const handleNotificationClick = (notif) => {
    // Navigasi melalui route read-and-go yang menandai notifikasi sebagai dibaca dan redirect ke target
    router.visit(route("notifications.read-and-go", { notification: notif.id }));
  };

  const handleMarkAllRead = () => {
    router.post(route("notifications.mark-all-read"), {}, {
      preserveScroll: true,
    });
  };

  const handleDelete = (e, notifId) => {
    e.stopPropagation();
    router.delete(route("notifications.destroy", { notification: notifId }), {
      preserveScroll: true,
    });
  };

  // Filtered notifications
  const filteredList = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read_at;
    if (filter === "transaction") return notif.type === "transaction";
    if (filter === "savings") return ["savings", "savings_goal", "contribution"].includes(notif.type);
    if (filter === "join_request") return ["join_request", "join_approved", "join_rejected"].includes(notif.type);
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex flex-col font-sans text-black">
      <Head title="Notifikasi - Group Finances" />
      <NavbarIn auth={auth} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-[#FDBB4E] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]">
                  <Bell size={22} className="stroke-[2.5]" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Notifikasi</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-black bg-[#ff4d4d] text-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000]">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
                Semua pembaruan aktivitas transaksi, target tabungan, dan relasi grup Anda
              </p>
            </div>

            {/* Mark All Read Button */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#c5ffbc] border-2 border-black rounded-xl font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <CheckCheck size={16} className="stroke-[2.5]" />
                Tandai Semua Dibaca
              </button>
            )}
          </div>

          {/* Flash Messages */}
          {flash?.success && (
            <div className="mb-6 p-4 bg-[#C8F5C8] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center gap-3">
              <Check size={20} className="stroke-[3] text-green-800 flex-shrink-0" />
              <p className="font-bold text-sm text-green-950">{flash.success}</p>
            </div>
          )}

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { id: "all", label: `Semua (${notifications.length})` },
              { id: "unread", label: `Belum Dibaca (${unreadCount})` },
              { id: "transaction", label: "Transaksi" },
              { id: "savings", label: "Tabungan" },
              { id: "join_request", label: "Permintaan Hubungan" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl border-2 font-black text-xs transition-all cursor-pointer ${
                  filter === tab.id
                    ? "bg-[#7C98FF] border-black text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5"
                    : "bg-white border-black text-gray-700 hover:bg-gray-100 shadow-[1px_1px_0px_0px_#000]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {filteredList.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-10 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl border-2 border-black bg-[#FFE082] flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_#000]">
                <Inbox size={32} className="stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-black mb-1">Tidak Ada Notifikasi</h3>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 max-w-sm">
                {filter === "unread"
                  ? "Semua notifikasi sudah dibaca! Anda selalu ter-update dengan aktivitas grup."
                  : "Belum ada riwayat notifikasi untuk filter ini."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredList.map((notif) => {
                const isUnread = !notif.read_at;
                const meta = getTypeMeta(notif.type);
                const Icon = meta.icon;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`group relative p-4 sm:p-5 rounded-2xl border-2 border-black transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isUnread
                        ? "bg-[#FFF9D2] hover:bg-[#FFF3B0] shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5"
                        : "bg-white hover:bg-gray-50 shadow-[3px_3px_0px_0px_#000] opacity-90 hover:opacity-100"
                    }`}
                  >
                    {/* Left Icon + Text Content */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Icon */}
                      <div
                        className={`w-11 h-11 rounded-xl border-2 border-black ${meta.bg} flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000] mt-0.5`}
                      >
                        <Icon size={20} className="stroke-[2.5] text-black" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-white border border-black rounded-md">
                            {meta.label}
                          </span>
                          {notif.relation_name && (
                            <span className="text-xs font-bold text-gray-700 truncate">
                              • {notif.relation_name}
                            </span>
                          )}
                          {isUnread && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff4d4d] border border-black inline-block animate-pulse" />
                          )}
                        </div>

                        <h4 className="text-sm sm:text-base font-black text-black leading-tight mb-1">
                          {notif.title}
                        </h4>

                        <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed">
                          {notif.body}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 mt-2">
                          <Calendar size={12} className="stroke-[2.5]" />
                          <span>{getRelativeTime(notif.created_at)}</span>
                          <span>•</span>
                          <span>{formatDate(notif.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      {notif.url && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notif);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-white group-hover:bg-[#c5ffbc] text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          Buka Menu
                          <ArrowRight size={14} className="stroke-[3] transition-transform group-hover:translate-x-0.5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => handleDelete(e, notif.id)}
                        className="p-2 rounded-lg border border-black bg-white hover:bg-red-100 text-gray-600 hover:text-red-700 transition-colors shadow-[1px_1px_0px_0px_#000] ml-2"
                        title="Hapus notifikasi"
                      >
                        <Trash2 size={15} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
