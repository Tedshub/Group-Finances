// resources/js/Layouts/NavbarIn.jsx
import React, { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import Logo from "./Logo";
import { MessageCircle, UserCircle, Bell, X } from "lucide-react";

export default function NavbarIn({ auth }) {
  const { unreadNotificationsCount: initialUnreadCount = 0 } = usePage().props;
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/notifications/unread-count');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch (err) {
        // silent fail
      }
    };

    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 900);
      if (window.innerWidth < 900) {
        setShowChatPopup(false);
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    router.visit(path);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    router.post('/logout');
    setIsDropdownOpen(false);
  };

  const handleComingSoon = (feature) => {
    router.visit(`/coming-soon?feature=${feature}`);
  };

  const handleChatClick = () => {
    if (isMobile) {
      router.visit(route('chat.index'));
    } else {
      setShowChatPopup(!showChatPopup);
    }
  };

  return (
    <>
      {/* ── Neobrutalist Navbar ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b-2 border-black">
        {/* Logo Kiri */}
        <Logo />

        {/* Icon Kanan */}
        <div className="flex items-center gap-2.5 relative" ref={dropdownRef}>

          {/* ChatGroup Button */}
          <button
            onClick={handleChatClick}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-black transition-all shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
              showChatPopup && !isMobile
                ? 'bg-[#7c98ff] text-black'
                : 'bg-white hover:bg-[#c5ffbc] text-black'
            }`}
            title="Chat Group"
          >
            <MessageCircle size={18} className="stroke-[2.5]" />
          </button>

          {/* Notifikasi */}
          <button
            onClick={() => handleNavigate('/notifications')}
            className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-black bg-white hover:bg-[#FDBB4E] text-black transition-all shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            title="Notifikasi"
          >
            <Bell size={18} className="stroke-[2.5]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#ff4d4d] border-2 border-black text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-[1px_1px_0px_0px_#000] animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black transition-all shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer overflow-hidden"
            title="Profil User"
          >
            {auth?.user?.avatar_url ? (
              <img
                src={auth.user.avatar_url}
                alt={auth.user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle size={20} className="stroke-[2.5]" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-60 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User info */}
              <div className="px-4 py-3 bg-[#c5ffbc] border-b-2 border-black flex items-center gap-2.5">
                {auth?.user?.avatar_url ? (
                  <img
                    src={auth.user.avatar_url}
                    alt={auth.user.name || "User"}
                    className="w-9 h-9 rounded-full border-2 border-black object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-sm flex-shrink-0">
                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-black uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-black text-black truncate">{auth?.user?.name || "User"}</p>
                  <p className="text-xs text-black/70 truncate">{auth?.user?.email || ""}</p>
                </div>
              </div>

              <div className="p-1.5 space-y-1">
                <button
                  onClick={() => handleNavigate('/settings')}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-black rounded-xl hover:bg-yellow-200 transition-colors cursor-pointer"
                >
                  Pengaturan Akun & Profil
                </button>
                <div className="border-t-2 border-black my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Keluar (Logout)
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Desktop Chat Popup Window (Neobrutalism) ───────────── */}
      {showChatPopup && !isMobile && (
        <div
          className="fixed top-[70px] bottom-6 right-6 z-50 flex flex-col bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] overflow-hidden w-[420px] max-w-[calc(100vw-3rem)]"
        >
          {/* Header Popup */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#7c98ff] border-b-2 border-black">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center">
                <MessageCircle size={16} className="text-black stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-black text-black block leading-tight">Live Group Chat</span>
                <span className="text-[11px] font-bold text-black/70">Diskusi Real-time</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => router.visit(route('chat.index'))}
                className="text-xs font-bold px-2.5 py-1 rounded-full border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[1.5px_1.5px_0px_0px_#000] transition-all cursor-pointer"
                title="Buka Layar Penuh"
              >
                Penuh ↗
              </button>
              <button
                onClick={() => setShowChatPopup(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-black bg-white hover:bg-red-300 text-black shadow-[1.5px_1.5px_0px_0px_#000] transition-all cursor-pointer"
                title="Tutup"
              >
                <X size={15} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Iframe ke /chat */}
          <div className="flex-1 bg-[#C8F5C8] overflow-hidden">
            <iframe
              src={route('chat.index')}
              className="w-full h-full border-none"
              title="Group Chat Popup"
            />
          </div>
        </div>
      )}
    </>
  );
}
