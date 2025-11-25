// resources/js/Layouts/Sidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
  Home,
  BarChart2,
  Users,
  PiggyBank,
  Wallet,
  Calculator,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
  Clock,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
  { label: "Hubungan", icon: <Users size={20} />, path: "/relations", hasNotification: true },
  { label: "Transaksi", icon: <BarChart2 size={20} />, path: "/transactions", comingSoon: true },
  { label: "Tabungan", icon: <PiggyBank size={20} />, path: "/savings", comingSoon: true },
  { label: "Penganggaran", icon: <Wallet size={20} />, path: "/saving-goals", comingSoon: true },
  { label: "Laporan Keuangan", icon: <FileText size={20} />, path: "/statements", comingSoon: true },
  { label: "Pengaturan", icon: <Settings size={20} />, path: "/settings", comingSoon: true },
];

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const { url, props } = usePage();
  const pendingRequestsCount = props.pendingRequestsCount || 0;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Untuk mobile: tutup sidebar jika klik di luar sidebar dan toggle button
      if (isMobile && isMobileOpen) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target) &&
          toggleButtonRef.current &&
          !toggleButtonRef.current.contains(event.target)
        ) {
          setIsMobileOpen(false);
        }
      }

      // Untuk desktop: reset manual open
      if (!isMobile && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsManualOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isMobileOpen]);

  const isDesktopOpen = isHoverOpen || isManualOpen;

  const handleNavigate = (path, isComingSoon) => {
    if (isComingSoon) {
      // Jika fitur coming soon, arahkan ke halaman coming soon dengan parameter
      router.visit(`/coming-soon?feature=${path.substring(1)}`);
    } else {
      // Jika fitur sudah tersedia, navigasi normal
      router.visit(path);
    }

    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // === MOBILE MODE ===
  if (isMobile) {
    return (
      <>
        {/* Overlay backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Toggle Button */}
        <button
          ref={toggleButtonRef}
          onClick={toggleMobileSidebar}
          className={`fixed top-1/2 -translate-y-1/2 bg-[#4c72ff] text-white p-2 hover:bg-[#405ecf] z-50 shadow-lg border-r border-t border-b border-[#6b87ee] transition-all duration-300 ease-in-out ${
            isMobileOpen ? "left-64" : "left-0"
          }`}
          style={{
            width: "36px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTopRightRadius: "30px",
            borderBottomRightRadius: "30px",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          }}
        >
          {isMobileOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-0 h-full w-64 bg-[#4c72ff] shadow-2xl text-gray-100 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-6 border-b border-[#6b87ee]">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <p className="text-xs text-gray-200 mt-1">Group Finances</p>
          </div>

          {/* Menu Items */}
          <ul className="px-3 mt-4 space-y-1 flex-1 overflow-y-auto">
            {menuItems.map((item, idx) => (
              <li key={idx} onClick={() => handleNavigate(item.path, item.comingSoon)}>
                <div
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all cursor-pointer touch-manipulation relative
                    hover:text-white hover:bg-[#6b87ee] ${
                      url === item.path
                        ? "bg-[#6b87ee] text-white font-semibold"
                        : "text-gray-100"
                    }`}
                >
                  <span className="pointer-events-none relative">
                    {item.icon}

                    {/* Badge Coming Soon - Mobile */}
                    {item.comingSoon && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-[#4c72ff]"></span>
                    )}
                  </span>
                  <span className="text-sm font-medium pointer-events-none">{item.label}</span>

                  {/* Badge Notifikasi - Mobile */}
                  {item.hasNotification && pendingRequestsCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}

                  {/* Coming Soon Badge - Mobile */}
                  {item.comingSoon && (
                    <span className="ml-auto text-xs bg-yellow-400 text-[#4c72ff] px-2 py-0.5 rounded-full font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <footer className="px-4 py-4 text-xs text-gray-200 text-center border-t border-[#6b87ee]">
            <p>&copy; Group Finances 2025</p>
          </footer>
        </aside>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1);
            }
          }

          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </>
    );
  }

  // === DESKTOP MODE ===
  return (
    <>
      <aside
        ref={sidebarRef}
        onMouseEnter={() => setIsHoverOpen(true)}
        onMouseLeave={() => setIsHoverOpen(false)}
        className={`flex flex-col transition-all duration-300 bg-[#4c72ff] shadow-lg text-gray-100 ${
          isDesktopOpen ? "w-64" : "w-20"
        }`}
      >
        <ul className="px-3 mt-6 space-y-1 flex-1 overflow-y-auto min-h-0">
          {menuItems.map((item, idx) => (
            <li key={idx} onClick={() => handleNavigate(item.path, item.comingSoon)}>
              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all cursor-pointer relative
                  hover:text-white hover:bg-[#6b87ee] ${
                    url === item.path
                      ? "bg-[#6b87ee] text-white font-semibold"
                      : "text-gray-100"
                  }`}
              >
                <span className="relative">
                  {item.icon}

                  {/* Badge Notifikasi - Desktop (icon only) */}
                  {item.hasNotification && pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#4c72ff] animate-pulse"></span>
                  )}

                  {/* Badge Coming Soon - Desktop (icon only) */}
                  {item.comingSoon && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-[#4c72ff]"></span>
                  )}
                </span>

                {isDesktopOpen && (
                  <>
                    <span className="text-sm font-medium">{item.label}</span>

                    {/* Coming Soon Badge - Desktop (text only) */}
                    {item.comingSoon && (
                      <span className="ml-auto text-xs bg-yellow-400 text-[#4c72ff] px-2 py-0.5 rounded-full font-medium">
                        Coming Soon
                      </span>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        <footer className="px-4 py-4 text-xs text-gray-200 text-center border-t border-[#6b87ee]">
          &copy; Group Finances 2025
        </footer>
      </aside>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}
