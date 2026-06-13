/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BREAKING_TICKER_STORIES } from "../data";

interface BreakingTickerProps {
  customStories?: string[];
  isDark?: boolean;
}

export default function BreakingTicker({ customStories, isDark = false }: BreakingTickerProps) {
  const stories = customStories && customStories.length > 0 ? customStories : BREAKING_TICKER_STORIES;
  const [activeIndex, setActiveIndex] = useState(0);

  // Transition to next story periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [stories.length]);

  return (
    <div 
      id="breaking-news-ticker"
      className={`relative flex items-center h-11 border-y shadow-xs overflow-hidden ${
        isDark 
          ? "bg-[#18181A] border-slate-800 text-slate-200" 
          : "bg-[#F5F5F5] border-slate-200 text-[#111111]"
      }`}
    >
      {/* Red Pulse Badge Section */}
      <div className="relative flex-shrink-0 flex items-center h-full px-4 bg-[#B80000] text-white font-extrabold text-[11px] md:text-xs uppercase tracking-wider z-10 select-none">
        <span className="flex h-2 w-2 relative mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        Breaking News
        {/* Angled slash divider */}
        <div className="absolute right-[-10px] top-0 bottom-0 w-5 bg-[#B80000] skew-x-12 z-0"></div>
      </div>

      {/* Slide Marquee Window */}
      <div className="flex-grow pl-5 pr-4 overflow-hidden select-text text-[12.5px] md:text-sm font-medium">
        <div 
          className="transition-all duration-700 ease-in-out flex items-center h-full"
          style={{ transform: `translateY(-${activeIndex * 100}%)`, height: `${stories.length * 100}%` }}
        >
          {stories.map((story, idx) => (
            <div 
              key={idx}
              className="h-11 flex items-center justify-start truncate w-full text-left"
              style={{ height: "44px" }}
            >
              <span className="line-clamp-1 hover:underline cursor-pointer">
                {story}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Manual story controllers */}
      <div className="flex-shrink-0 flex items-center pr-3 gap-1 z-10 select-none">
        <button 
          onClick={() => setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length)}
          className={`p-1 rounded-sm text-xs hover:bg-slate-300 hover:text-black transition-colors ${
            isDark ? "text-slate-400 hover:bg-slate-700" : "text-slate-500"
          }`}
          aria-label="Previous Breaking Item"
        >
          &larr;
        </button>
        <span className="text-[10px] opacity-60 font-mono">
          {activeIndex + 1}/{stories.length}
        </span>
        <button 
          onClick={() => setActiveIndex((prev) => (prev + 1) % stories.length)}
          className={`p-1 rounded-sm text-xs hover:bg-slate-300 hover:text-black transition-colors ${
            isDark ? "text-slate-400 hover:bg-slate-700" : "text-slate-500"
          }`}
          aria-label="Next Breaking Item"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
