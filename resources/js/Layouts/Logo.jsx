// resources/js/Layouts/Logo.jsx
import React from "react";
import { usePage } from "@inertiajs/react";

export default function Logo() {
  const { auth } = usePage().props;

  // Fungsi untuk mendapatkan ucapan selamat berdasarkan waktu
  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return "Selamat pagi";
    } else if (hour >= 12 && hour < 15) {
      return "Selamat siang";
    } else if (hour >= 15 && hour < 19) {
      return "Selamat sore";
    } else {
      return "Selamat malam";
    }
  };

  // Fungsi untuk mendapatkan nama user atau fallback
  const getUserName = () => {
    return auth.user?.name || "User";
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-xl">G</span>
      </div>
      <span className="font-bold text-xl text-black tracking-wide">
        {getGreeting()}, {getUserName()}!
      </span>
    </div>
  );
}
