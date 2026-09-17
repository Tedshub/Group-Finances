// resources/js/Layouts/Logo.jsx
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Sparkles } from "lucide-react";

export default function Logo({
  size = "md", // "sm" | "md" | "lg"
  showGreeting = false,
  showBadge = true,
  href = null,
  inverted = false, // for dark backgrounds like footer
  className = "",
  hideTextOnMobile = false, // hides brand text on small screens, shows only icon
}) {
  const page = usePage();
  const auth = page?.props?.auth;

  const targetHref = href !== null ? href : (auth?.user ? "/dashboard" : "/");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Selamat pagi";
    if (hour >= 12 && hour < 15) return "Selamat siang";
    if (hour >= 15 && hour < 19) return "Selamat sore";
    return "Selamat malam";
  };

  const getUserName = () => auth?.user?.name || "User";

  // Size variations
  const sizeConfig = {
    sm: {
      box: "w-8 h-8 rounded-xl",
      fontSize: "text-sm sm:text-base",
      gLetter: "text-base",
      badge: "text-[9px] px-1.5 py-0.2",
    },
    md: {
      box: "w-10 h-10 rounded-xl",
      fontSize: "text-base sm:text-lg",
      gLetter: "text-xl",
      badge: "text-[10px] px-2 py-0.5",
    },
    lg: {
      box: "w-11 h-11 sm:w-13 sm:h-13 rounded-2xl",
      fontSize: "text-lg sm:text-xl md:text-2xl",
      gLetter: "text-2xl sm:text-3xl",
      badge: "text-xs px-2.5 py-0.5",
    },
  };

  const cfg = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <Link href={targetHref} className="flex items-center gap-2.5 group">
        {/* Neobrutalist Emblem Badge */}
        <div
          className={`relative ${cfg.box} border-2 border-black flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 ${
            inverted
              ? "bg-[#FDBB4E] text-black shadow-[3px_3px_0px_0px_#fff]"
              : "bg-[#7C98FF] text-black shadow-[3px_3px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#000]"
          }`}
        >
          {/* Inner Neobrutalist Layer */}
          <div className="absolute inset-0.5 rounded-[9px] bg-[#FFFDF0] border border-black flex items-center justify-center overflow-hidden">
            <span
              className={`font-black tracking-tighter ${cfg.gLetter} text-black font-sans leading-none select-none`}
            >
              G
            </span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#FDBB4E] border-t border-l border-black rounded-tl" />
          </div>
        </div>

        {/* Brand Text */}
        <div className={`flex items-center gap-1.5 ${hideTextOnMobile ? 'hidden sm:flex' : 'flex'}`}>
          <span
            className={`font-black tracking-wide leading-none ${cfg.fontSize} ${
              inverted ? "text-white" : "text-black"
            }`}
          >
            GROUP FINANCES
          </span>

          {showBadge && (
            <span
              className={`font-black uppercase tracking-wider rounded-md border border-black shadow-[1px_1px_0px_0px_#000] hidden sm:inline-block ${cfg.badge} ${
                inverted ? "bg-white text-black" : "bg-[#C8F5C8] text-black"
              }`}
            >
              HUB
            </span>
          )}
        </div>
      </Link>

      {/* Optional Greeting for Dashboard/Navbar */}
      {showGreeting && auth?.user && (
        <>
          <div className="h-6 w-[2px] bg-black/20 hidden sm:block mx-0.5" />
          <div className="hidden sm:block leading-tight">
            <p className="text-[11px] text-black/60 font-bold">{getGreeting()},</p>
            <p className="text-sm font-black text-black flex items-center gap-1">
              <span>{getUserName()}</span>
              <Sparkles size={13} className="text-yellow-500 fill-yellow-400 inline" />
            </p>
          </div>
        </>
      )}
    </div>
  );
}
