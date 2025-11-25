// resources/js/Layouts/NavbarIn.jsx
import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import Logo from "./Logo";
import { MessageCircle, UserCircle, Bell } from "lucide-react";

export default function NavbarIn({ auth }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 900);
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

  // Fungsi navigasi pakai Inertia router
  const handleNavigate = (path) => {
    router.visit(path);
    setIsDropdownOpen(false);
  };

  // Fungsi logout pakai POST method
  const handleLogout = () => {
    router.post('/logout');
    setIsDropdownOpen(false);
  };

  // Fungsi untuk navigasi ke halaman Coming Soon
  const handleComingSoon = (feature) => {
    router.visit(`/coming-soon?feature=${feature}`);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300 shadow-sm">
      {/* Logo Kiri */}
      <Logo />

      {/* Icon Kanan */}
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        {/* ChatGroup */}
        <button
          onClick={() => handleComingSoon('chat')}
          className="text-gray-700 hover:text-black transition-colors cursor-pointer"
          title="Fitur Chat Group"
        >
          <MessageCircle size={22} />
        </button>

        {/* Notifikasi */}
        <button
          onClick={() => handleComingSoon('notification')}
          className="text-gray-700 hover:text-black transition-colors cursor-pointer"
          title="Fitur Notifikasi"
        >
          <Bell size={22} />
        </button>

        {/* Akun */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-gray-700 hover:text-black transition-colors cursor-pointer"
        >
          <UserCircle size={26} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer font-medium text-gray-700"
                onClick={() => handleNavigate('/profile')}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer font-medium"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
