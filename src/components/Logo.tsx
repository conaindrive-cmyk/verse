/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

interface LogoProps {
  className?: string;
  isDark?: boolean;
  hideTagline?: boolean;
}

export default function Logo({ className = "", isDark = false, hideTagline = false }: LogoProps) {
  const [imgSrc, setImgSrc] = useState<string>("/images/logo-png.png");
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    if (imgSrc === "/images/logo-png.png") {
      setImgSrc("/images/logo.jpeg");
    } else {
      setImgError(true);
    }
  };

  return (
    <div className={`flex flex-col items-start select-none font-sans ${className}`} id="news-verse-branding">
      <div className="flex items-center gap-3.5">
        {/* Render premium logo - with custom crop zoom to remove white boundaries */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.35)] border border-slate-700/30">
          {!imgError ? (
            <img
              src={imgSrc}
              onError={handleImgError}
              className="w-full h-full object-cover scale-[1.36] transition-transform duration-300 hover:scale-[1.45]"
              alt="NV Logo"
              referrerPolicy="no-referrer"
            />
          ) : (
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
            <defs>
              {/* Glowing Red Lens Flare/Refraction Filter */}
              <filter id="neonGlowRed" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="45" result="blur1" />
                <feGaussianBlur stdDeviation="2.5" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Bevel 3D Lighting Filter for Metallic Chrome N */}
              <filter id="bevel3DN" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                <feSpecularLighting
                  in="blur"
                  surfaceScale="4"
                  specularConstant="1.2"
                  specularExponent="20"
                  lightingColor="#FFFFFF"
                  result="spec"
                >
                  <fePointLight x="-40" y="-80" z="150" />
                </feSpecularLighting>
                <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
                <feComposite
                  in="SourceGraphic"
                  in2="specOut"
                  operator="arithmetic"
                  k1="0"
                  k2="1"
                  k3="0.8"
                  k4="0"
                  result="lit"
                />
                <feDropShadow dx="1.5" dy="3.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.8" />
              </filter>

              {/* Futuristic Cyber Dot Pattern for background mapping */}
              <pattern id="cyberGridDots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="#38BDF8" opacity="0.18" />
                <circle cx="7" cy="7" r="0.75" fill="#EF4444" opacity="0.12" />
              </pattern>

              {/* Clip badge inside active circular space */}
              <clipPath id="badgeCircleClip">
                <circle cx="100" cy="100" r="92" />
              </clipPath>

              {/* Chrome Gradient for "N" */}
              <linearGradient id="chromeGradient" x1="40" y1="70" x2="135" y2="135" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="15%" stopColor="#E2E8F0" />
                <stop offset="35%" stopColor="#94A3B8" />
                <stop offset="52%" stopColor="#CBD5E1" />
                <stop offset="70%" stopColor="#F8FAFC" />
                <stop offset="85%" stopColor="#475569" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              {/* Radiant Crimson Neon Red Gradient for "V" */}
              <linearGradient id="crimsonNeonGradient" x1="125" y1="70" x2="185" y2="135" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF4D4D" />
                <stop offset="25%" stopColor="#E11D48" />
                <stop offset="60%" stopColor="#BE123C" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>

              {/* Cosmic Red Orbit Swoosh Gradient */}
              <linearGradient id="redOrbitGradient" x1="90" y1="12" x2="188" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E11D48" />
                <stop offset="50%" stopColor="#FF4D4D" />
                <stop offset="100%" stopColor="#BE123C" stopOpacity="0" />
              </linearGradient>

              {/* Cosmic White Metallic Orbit Swoosh Gradient */}
              <linearGradient id="silverOrbitGradient" x1="12" y1="100" x2="110" y2="188" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#CBD5E1" />
                <stop offset="80%" stopColor="#475569" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
              </linearGradient>

              {/* Glowing flares */}
              <radialGradient id="neonCyanGlow" cx="104" cy="182" r="30" fx="104" fy="182" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#0284C7" stopOpacity="0.25" />
                <stop offset="105%" stopColor="#0F172A" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="neonRedGlow" cx="162" cy="74" r="25" fx="162" fy="74" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="1" />
                <stop offset="40%" stopColor="#BE123C" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Solid Dark Premium Badge backing */}
            <circle cx="100" cy="100" r="92" fill="#040508" stroke="#1E293B" strokeWidth="1.2" />

            {/* Cyber mapping network point layout */}
            <circle cx="100" cy="100" r="92" fill="url(#cyberGridDots)" clipPath="url(#badgeCircleClip)" />

            {/* Orbital ring sweeps */}
            {/* Top-Right Red Cosmic Swoosh */}
            <path
              d="M 112,14 A 86,86 0 0,1 186,104"
              stroke="url(#redOrbitGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Bottom-Left Silver Metallic Swoosh */}
            <path
              d="M 88,186 A 86,86 0 0,1 14,96"
              stroke="url(#silverOrbitGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Bottom Cyan flare point */}
            <circle cx="104" cy="182" r="16" fill="url(#neonCyanGlow)" />
            <circle cx="104" cy="182" r="1.5" fill="#E0F2FE" />

            {/* Top-Right Spark Flare representing the exact laser/light point */}
            <circle cx="162" cy="74" r="22" fill="url(#neonRedGlow)" />
            <circle cx="162" cy="74" r="2" fill="#FFFFFF" />
            <line x1="140" y1="74" x2="184" y2="74" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
            <line x1="162" y1="52" x2="162" y2="96" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />

            {/* Letter N (Polished Silver Italicized Structure) */}
            <g filter="url(#bevel3DN)">
              {/* Left Column of N */}
              <path d="M 40,135 L 59,72 L 77,72 L 58,135 Z" fill="url(#chromeGradient)" />
              {/* Angled Diagonal of N */}
              <path d="M 64,72 L 103,135 L 117,135 L 77,72 Z" fill="url(#chromeGradient)" />
              {/* Right Column of N */}
              <path d="M 99,135 L 118,72 L 136,72 L 117,135 Z" fill="url(#chromeGradient)" />
            </g>

            {/* Letter V (Glowing Hyper Red Crystal Neon Italicized structure next to N) */}
            <g filter="url(#neonGlowRed)">
              <path
                d="M 129,72 L 171,135 L 187,135 L 190,72 L 172,72 L 173,112 L 148,72 Z"
                fill="url(#crimsonNeonGradient)"
              />
            </g>
          </svg>
          )}
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
