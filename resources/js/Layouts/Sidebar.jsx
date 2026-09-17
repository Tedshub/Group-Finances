// resources/js/Layouts/Sidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import Logo from "./Logo";
import {
  Home,
  BarChart2,
  Users,
  PiggyBank,
  Wallet,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard",        icon: Home,      path: "/dashboard",    chipColor: '#7c98ff' },
  { label: "Hubungan",         icon: Users,     path: "/relations",    chipColor: '#c5ffbc', hasNotification: true },
  { label: "Transaksi",        icon: BarChart2, path: "/transactions", chipColor: '#4FD1C5', matchPattern: 'transactions' },
  { label: "Tabungan",         icon: PiggyBank, path: "/savings",      chipColor: '#FDBB4E', matchPattern: 'savings' },
  { label: "Penganggaran",     icon: Wallet,    path: "/budgeting",    chipColor: '#FF6B7A', matchPattern: 'budgeting' },
  { label: "Laporan Keuangan", icon: FileText,  path: "/statements",   chipColor: '#7c98ff', matchPattern: 'statements' },
  { label: "Pengaturan",       icon: Settings,  path: "/settings",     chipColor: '#E2E8F0', matchPattern: 'settings' },
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
      router.visit(`/coming-soon?feature=${path.substring(1)}`);
    } else {
      router.visit(path);
    }
    if (isMobile) setIsMobileOpen(false);
  };

  // ── MOBILE MODE ───────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Toggle Button */}
        <button
          ref={toggleButtonRef}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out text-black bg-[#7c98ff] border-2 border-black border-l-0 rounded-r-2xl shadow-[2px_2px_0px_0px_#000] flex items-center justify-center w-8 h-14"
          style={{
            left: isMobileOpen ? '260px' : '0',
          }}
        >
          {isMobileOpen ? <ChevronLeft size={18} className="stroke-[3]" /> : <ChevronRight size={18} className="stroke-[3]" />}
        </button>

        {/* Mobile Sidebar Panel */}
        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col bg-white border-r-2 border-black shadow-[6px_0px_0px_0px_#000] transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b-2 border-black bg-[#C8F5C8]">
            <Logo size="sm" showBadge={false} />
          </div>

          {/* Menu Items */}
          <ul className="px-3 py-4 space-y-1.5 flex-1 overflow-y-auto">
            {menuItems.map((item, idx) => {
              const isActive = url === item.path || (item.matchPattern && url.includes(item.matchPattern));
              const Icon = item.icon;
              return (
                <li key={idx} onClick={() => handleNavigate(item.path, item.comingSoon)}>
                  <div
                    className={`flex items-center gap-3 rounded-full px-3 py-2 cursor-pointer transition-all border-2 ${
                      isActive
                        ? 'bg-[#7c98ff] text-black font-black border-black shadow-[2px_2px_0px_0px_#000]'
                        : 'border-transparent text-black font-bold hover:bg-[#C8F5C8]/50 hover:border-black'
                    }`}
                  >
                    {/* Icon chip */}
                    <span
                      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-black"
                      style={{
                        background: isActive ? '#ffffff' : item.chipColor,
                        color: '#000000',
                      }}
                    >
                      <Icon size={14} className="stroke-[2.5]" />
                    </span>

                    <span className="text-sm flex-1 truncate">
                      {item.label}
                    </span>

                    {/* Badge notifikasi */}
                    {item.hasNotification && pendingRequestsCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black bg-[#FF6B7A] text-white border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000]">
                        {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                      </span>
                    )}

                    {/* Coming Soon badge */}
                    {item.comingSoon && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-black bg-[#FDBB4E] text-black flex-shrink-0 shadow-[1px_1px_0px_0px_#000]">
                        Segera
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <footer className="px-5 py-3 text-[11px] font-bold text-black border-t-2 border-black bg-gray-50 text-center">
            © Group Finances 2026
          </footer>
        </aside>
      </>
    );
  }

  // ── DESKTOP MODE ──────────────────────────────────────────
  return (
    <aside
      ref={sidebarRef}
      onMouseEnter={() => setIsHoverOpen(true)}
      onMouseLeave={() => setIsHoverOpen(false)}
      className={`flex flex-col bg-white border-r-2 border-black transition-all duration-300 z-30 flex-shrink-0 ${
        isDesktopOpen ? "w-60" : "w-[76px]"
      }`}
    >
      <ul className="px-2.5 py-4 space-y-1.5 flex-1 overflow-y-auto min-h-0">
        {menuItems.map((item, idx) => {
          const isActive = url === item.path || (item.matchPattern && url.includes(item.matchPattern));
          const Icon = item.icon;
          return (
            <li key={idx} onClick={() => handleNavigate(item.path, item.comingSoon)}>
              <div
                className={`flex items-center gap-3 rounded-full px-2.5 py-2 cursor-pointer transition-all border-2 ${
                  isActive
                    ? 'bg-[#7c98ff] text-black font-black border-black shadow-[2px_2px_0px_0px_#000]'
                    : 'border-transparent text-black font-bold hover:bg-[#C8F5C8]/50 hover:border-black'
                }`}
                title={!isDesktopOpen ? item.label : undefined}
              >
                {/* Icon chip */}
                <span
                  className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]"
                  style={{
                    background: isActive ? '#ffffff' : item.chipColor,
                    color: '#000000',
                  }}
                >
                  <Icon size={16} className="stroke-[2.5]" />
                </span>

                {/* Teks label */}
                {isDesktopOpen && (
                  <span className="text-sm flex-1 truncate">
                    {item.label}
                  </span>
                )}

                {/* Badge notifikasi */}
                {item.hasNotification && pendingRequestsCount > 0 && (
                  <span
                    className={`rounded-full text-[9px] font-black bg-[#FF6B7A] text-white border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000] ${
                      isDesktopOpen
                        ? "min-w-[18px] h-[18px] px-1"
                        : "absolute top-1 right-1 w-4 h-4 text-[8px]"
                    }`}
                  >
                    {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                  </span>
                )}

                {/* Coming Soon badge */}
                {item.comingSoon && isDesktopOpen && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-black bg-[#FDBB4E] text-black flex-shrink-0 shadow-[1px_1px_0px_0px_#000]">
                    Segera
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer desktop */}
      {isDesktopOpen && (
        <footer className="px-4 py-3 text-[10px] font-bold text-black border-t-2 border-black bg-gray-50 text-center">
          © Group Finances 2026
        </footer>
      )}
    </aside>
  );
}
