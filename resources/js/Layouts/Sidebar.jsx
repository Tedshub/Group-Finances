// resources/js/Layouts/Sidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Home,
  BarChart2,
  Users,
  PiggyBank,
  Wallet,
  Calculator,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
  { label: "Hubungan", icon: <Users size={20} />, path: "/relations" },
  { label: "Transaksi", icon: <BarChart2 size={20} />, path: "/transactions" },
  { label: "Tabungan", icon: <PiggyBank size={20} />, path: "/savings" },
  { label: "Penganggaran", icon: <Wallet size={20} />, path: "/saving-goals" },
  { label: "Laporan Keuangan", icon: <FileText size={20} />, path: "/statements" },
  { label: "Pengaturan", icon: <Settings size={20} />, path: "/settings" },
];

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const sidebarRef = useRef(null);

  const { url } = usePage();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsDropdownOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsManualOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDesktopOpen = isHoverOpen || isManualOpen;

  const handleNavigate = (path) => {
    router.visit(path);
    setIsDropdownOpen(false);
  };

  // === MOBILE MODE ===
  if (isMobile) {
    return (
      <div
        className="fixed top-[76px] right-4 z-50 flex flex-col items-end"
        ref={sidebarRef}
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-[#4c72ff] text-white p-2 rounded-lg hover:bg-[#405ecf] transition"
          style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {isDropdownOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={`mt-2 transform transition-all duration-300 origin-top-right ${
            isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <ul className="bg-[#4c72ff] rounded-lg shadow-lg border border-[#6b87ee] text-sm w-48 overflow-hidden">
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[#6b87ee] cursor-pointer transition-all ${
                  url === item.path ? "text-white font-semibold bg-[#6b87ee]" : "text-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // === DESKTOP MODE ===
  return (
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
          <li
            key={idx}
            onClick={() => handleNavigate(item.path)}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all cursor-pointer
              hover:text-white hover:bg-[#6b87ee] ${
                url === item.path ? "bg-[#6b87ee] text-white font-semibold" : "text-gray-100"
              }`}
          >
            {item.icon}
            {isDesktopOpen && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ul>

      <footer className="px-4 py-4 text-xs text-gray-200 text-center border-t border-[#6b87ee]">
        &copy; Couple's Finances 2025
      </footer>
    </aside>
  );
}
