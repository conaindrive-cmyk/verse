/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { VideoReport } from "../types";
import { Play, Eye, Calendar, Film, FilmIcon } from "lucide-react";
import { INITIAL_VIDEOS } from "../data";

interface VideoSectionProps {
  isDark?: boolean;
}

export default function VideoSection({ isDark = false }: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoReport>(INITIAL_VIDEOS[0]);

  return (
    <div 
      className={`p-6 md:p-8 rounded-xl border transition-all ${
        isDark ? "bg-[#18181A] border-slate-800 text-white" : "bg-white border-slate-200 text-[#111111]"
      }`}
      id="video-broadcasting-station"
    >
      {/* Category header */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-rose-900/10">
        <FilmIcon className="text-[#B80000]" size={20} />
        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">News Verse World Broadcasts</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Main large viewer console (Left - spanning 2 columns) */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black shadow-lg">
            {/* The active YouTube embed frame */}
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-none"
              id="broadcast-player-frame"
            ></iframe>
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#B80000] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-[1px] select-none">
                {activeVideo.category}
              </span>
              <span className="text-[11px] opacity-60 font-mono">Video Report</span>
            </div>
            
            <h4 className="text-base md:text-xl font-serif font-bold leading-snug">
              {activeVideo.title}
            </h4>

            <div className="flex items-center gap-4 text-xs opacity-60 font-mono pb-2 select-none">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {activeVideo.views}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {activeVideo.publishedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic playlist sidebar (Right - spanning 1 column) */}
        <div className="flex flex-col space-y-3">
          <span className="text-xs font-black uppercase tracking-wider opacity-60 border-b pb-2 select-none">
            Up Next In Broadcasts
          </span>

          <div className="flex-grow space-y-3 overflow-y-auto max-h-[350px] pr-1">
            {INITIAL_VIDEOS.map((vid) => {
              const isActive = vid.id === activeVideo.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className={`flex gap-3 p-2 rounded-lg border transition-all cursor-pointer group ${
                    isActive 
                      ? isDark ? "bg-[#252528] border-red-900/45" : "bg-red-50/40 border-red-150" 
                      : isDark ? "bg-transparent border-transparent hover:bg-slate-800" : "bg-transparent border-transparent hover:bg-slate-100"
                  }`}
                  id={`video-playlist-item-${vid.id}`}
                >
                  {/* Thumbnail with overlay icon */}
                  <div className="relative w-28 aspect-video flex-shrink-0 bg-slate-900 rounded overflow-hidden select-none shadow">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Play button indicator */}
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center transition-opacity group-hover:bg-black/50">
                      <div className="w-7 h-7 bg-[#B80000] rounded-full flex items-center justify-center text-white shadow-md">
                        <Play size={10} className="fill-white ml-0.5" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <span className="absolute bottom-1 right-1 bg-black/75 text-[9px] font-bold text-white px-1 py-0.2 rounded-[1px] font-mono">
                      {vid.duration}
                    </span>
                  </div>

                  {/* Visual specs */}
                  <div className="flex flex-col justify-between py-0.5">
                    <h5 className={`text-xs font-bold leading-snug tracking-tight line-clamp-2 ${
                      isActive ? "text-[#B80000]" : "opacity-90"
                    }`}>
                      {vid.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] opacity-60 font-mono">
                      <span>{vid.category}</span>
                      <span>&bull;</span>
                      <span>{vid.publishedAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-[#B80000]/5 p-3 rounded-lg border border-[#B80000]/10 text-center select-none">
            <p className="text-[10px] opacity-75 font-semibold leading-relaxed">
              Have news alerts or raw clips in Pakistan? Reach out to News Verse Video Reporters on WhatsApp or Email.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
