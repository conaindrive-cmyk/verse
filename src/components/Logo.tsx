/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LogoProps {
  className?: string;
  isDark?: boolean;
  hideTagline?: boolean;
}

export default function Logo({ className = "", isDark = false, hideTagline = false }: LogoProps) {
  return (
    <div className={`flex flex-col items-start select-none font-sans ${className}`} id="news-verse-branding">
      <div className="flex items-center gap-2.5">
        {/* Globe Circular N Orbit Asset Icon */}
        <div className="relative w-10 h-10 flex-shrink-0 animate-pulse-slow">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark background capsule */}
            <circle cx="50" cy="50" r="46" fill="#111111" />
            
            {/* Globe latitude/longitude grid lines in a tech blue-gray style */}
            <circle cx="50" cy="50" r="32" stroke="#2a3342" strokeWidth="1" />
            <ellipse cx="50" cy="50" rx="16" ry="32" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="18" y1="50" x2="82" y2="50" stroke="#1e293b" strokeWidth="1.5" />
            
            {/* Inner Globe Continent Shimmer */}
            <path
              d="M34 40 C38 35, 45 32, 50 35 C55 38, 52 46, 58 48 C64 50, 68 45, 72 52 C76 59, 70 65, 62 68 C54 71, 46 64, 40 68 C34 72, 30 65, 34 40 Z"
              fill="#1e293b"
              opacity="0.25"
            />
            
            {/* Orbit Red & White Swooshes */}
            <path
              d="M10 50 A40 40 0 1 1 90 50"
              stroke="#B80000"
              strokeWidth="5.5"
              strokeLinecap="round"
              className="opacity-90"
            />
            <path
              d="M90 50 A40 40 0 0 1 10 50"
              stroke="#FFFFFF"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            
            {/* The Stylized Heavy N Symbol overlapping */}
            {/* Left Column (White) */}
            <path
              d="M32 30 L45 30 L45 70 L32 70 Z"
              fill="#E2E8F0"
            />
            {/* Center Slanted Overlay Stripe (Gradient feeling, red & white split) */}
            <path
              d="M45 30 L55 30 L68 70 L55 70 Z"
              fill="#B80000"
            />
            {/* Right Column (Red) */}
            <path
              d="M55 30 L68 30 L68 70 L55 70 Z"
              fill="#880000"
            />
          </svg>
        </div>

        {/* Text Wordmark */}
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-normal font-black text-2xl md:text-3xl">
            <span className={`${isDark ? "text-white" : "text-[#111111]"}`}>NEWS</span>
            <span className="text-[#B80000] ml-1">VERSE</span>
          </div>
          {!hideTagline && (
            <span 
              className={`text-[9.5px] tracking-[0.25em] uppercase font-semibold mt-0.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Truth Beyond Headlines
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
