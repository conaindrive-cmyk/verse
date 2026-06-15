/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Volume2, VolumeX, X, Radio, Tv, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface IntroVideoPlayerProps {
  onComplete: () => void;
  isDark?: boolean;
}

export default function IntroVideoPlayer({ onComplete, isDark = true }: IntroVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play synthetic audio mirroring the telemetry beats of the teletype and brass chime intro
  const playIntroAudio = () => {
    try {
      if (isMuted) return;
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // 1. Deep Bass Rumble (Ramps up, then fades low)
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = "sawtooth";
      droneOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A
      droneOsc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 4.5);
      
      droneGain.gain.setValueAtTime(0.01, ctx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.2);
      droneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 8.5);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start();
      droneOsc.stop(ctx.currentTime + 9.0);

      // 2. High-Tech Electronic Sound (Teletype/Beeps)
      for (let i = 0; i < 24; i++) {
        const time = ctx.currentTime + i * 0.35;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";

        // Major/Minor high-speed diplomatic transmission tones
        const notes = [329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99]; // E minor pentatonic
        const freq = notes[i % notes.length];
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.35);
      }

      // 3. Cinematic Imperial Fanfare Chords (Matches the visual blast lines)
      const playFanfare = (root: number, start: number, duration: number, volume: number) => {
        // Compose rich multi-tonal cords (Root, Perfect 5th, Octave, Major 3rd)
        const partials = [root, root * 1.25, root * 1.5, root * 2.0];
        partials.forEach((f, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = idx % 2 === 0 ? "sawtooth" : "sine";
          o.frequency.setValueAtTime(f, start);

          // Add minor vibrato
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 5.5; // 5Hz vibrato
          lfoGain.gain.value = 4.0; // depth

          lfo.connect(lfoGain);
          lfoGain.connect(o.frequency);
          lfo.start(start);
          lfo.stop(start + duration);

          g.gain.setValueAtTime(0.0, start);
          g.gain.linearRampToValueAtTime(volume / partials.length, start + 0.12);
          g.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          const lowpass = ctx.createBiquadFilter();
          lowpass.type = "lowpass";
          lowpass.frequency.setValueAtTime(600, start);

          o.connect(lowpass);
          lowpass.connect(g);
          g.connect(ctx.destination);
          o.start(start);
          o.stop(start + duration);
        });
      };

      // Play major global broadcast theme chords (0.8s, 3.2s, 5.8s)
      playFanfare(196.00, ctx.currentTime + 0.8, 4.0, 0.35); // G chord
      playFanfare(220.00, ctx.currentTime + 3.2, 5.0, 0.4);  // A chord
      playFanfare(293.66, ctx.currentTime + 5.8, 6.0, 0.45); // D major resolution
      
      setAudioStarted(true);
    } catch (err) {
      console.warn("Web Audio API not supported or interaction blocked:", err);
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    playIntroAudio();

    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const startTimeStamp = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeStamp) / 1000;
      if (elapsed >= 9.0) {
        setCurrentTime(9.0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => {
          onComplete();
        }, 800);
      } else {
        setCurrentTime(elapsed);
      }
    }, 50);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (_) {}
      }
    };
  }, []);

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (!isMuted && audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
    }
  };

  const progressPercentage = (currentTime / 9.0) * 100;

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center z-[100] p-4 font-mono overflow-hidden">
      {/* Dynamic Cyber Grid Styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#151518_1px,transparent_1px),linear-gradient(to_bottom,#151518_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 select-none"></div>
      
      {/* Ambient scanning light */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#B80000]/10 via-transparent to-transparent h-1/2 w-full animate-pulse opacity-15 pointer-events-none"></div>

      {/* Modern Sci-fi Broadcast Framing */}
      <div className="relative w-full max-w-4xl bg-[#121215] rounded-xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden z-10">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F0F12] border-b border-slate-800 text-[10px] text-slate-500 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B80000] animate-ping"></span>
            <span className="text-[#B80000] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Radio size={10} /> LIVE BROADCAST CHANNEL
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>SYS_LOC: ISB-BUREAU</span>
            <span>DE_SIGNAL: SECURE_LINK</span>
            <span>FREQ: 981.25 MHz</span>
          </div>
          <button 
            onClick={onComplete}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 bg-[#222227] px-2 py-0.5 rounded text-[9.5px] border border-slate-700/55 cursor-pointer"
          >
            <X size={10} />
            Skip Intro
          </button>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,#18181F_0%,#030303_100%)]">
          
          <AnimatePresence mode="wait">
            {!isPlaying ? (
              /* Pre-load Play Request (Bypasses Autoplay Restrictions) */
              <motion.div 
                key="preload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center space-y-6"
                id="pre-broadcast-trigger"
              >
                <div className="w-20 h-20 rounded-full bg-[#B80000]/10 border border-[#B80000]/50 flex items-center justify-center text-[#B80000] animate-pulse select-none">
                  <Tv size={36} />
                </div>
                
                <div className="space-y-2 max-w-md">
                  <span className="text-[10px] text-[#B80000] font-black uppercase tracking-widest bg-[#B80000]/10 px-2.5 py-0.5 rounded">
                    DIPLOMATIC SPECIAL ALERT
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-200 tracking-tight leading-snug">
                    Pakistan brokers peace. Secure Live Signal ready. Connect to official introductory broadcast.
                  </h3>
                </div>

                <button
                  onClick={startPlayback}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-[#B80000] hover:bg-rose-700 text-white px-7 py-3 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(184,0,0,0.4)]"
                >
                  <Play size={12} className="fill-white" />
                  Connect Signal (9s)
                </button>
              </motion.div>
            ) : (
              /* Cinematic Intro Stage Sequence (9 seconds) */
              <motion.div 
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden"
              >
                {/* 3D World Map Wireframe Grid (Background) */}
                <div className="absolute inset-0 w-full h-full opacity-10 scale-[1.1] pointer-events-none">
                  <svg viewBox="0 0 1000 500" className="w-full h-full text-white fill-current">
                    <path d="M150 150 Q 300 200 450 150 T 750 150 T 950 150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                    <path d="M150 300 Q 300 350 450 300 T 750 300 T 950 300" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="500" cy="250" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="500" cy="250" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3"/>
                  </svg>
                </div>

                {/* Sweeping Light Lens Flare (Flashes across the screen at ~0.5s to 3s) */}
                {currentTime > 0.4 && currentTime < 3.2 && (
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "150%" }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-30 blur-2xl pointer-events-none"
                  ></motion.div>
                )}

                {/* Primary NV Logo Spinner (Red and Silver metallic bevel simulation) */}
                <motion.div 
                  initial={{ scale: 0.1, rotateY: 180, opacity: 0 }}
                  animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative z-10 flex flex-col items-center justify-center"
                >
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    
                    {/* Rotating Tech Circle boundary ring */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-slate-700/60"
                    ></motion.div>

                    {/* Outer glow ring */}
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="absolute inset-2 rounded-full border border-[#B80000]/40 shadow-[0_0_25px_rgba(184,0,0,0.2)]"
                    ></motion.div>

                    {/* NV Core Logo Text */}
                    <div className="flex items-center justify-center -space-x-1 font-sans font-black tracking-tighter select-none scale-[1.3] drop-shadow-2xl">
                      {/* N in Steel/Silver */}
                      <motion.span 
                        animate={{ scale: [1, 1.02, 1], rotateX: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="text-6xl text-slate-100 bg-gradient-to-b from-white via-slate-300 to-slate-400 bg-clip-text text-transparent transform skew-x-6 pr-0.5 pointer-events-none"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}
                      >
                        N
                      </motion.span>
                      {/* V in Crimson */}
                      <motion.span 
                        animate={{ scale: [1, 1.02, 1], rotateX: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.1 }}
                        className="text-6xl text-[#B80000] bg-gradient-to-b from-red-500 via-[#B80000] to-red-900 bg-clip-text text-transparent transform -skew-x-6 pr-0.5 pointer-events-none"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}
                      >
                        V
                      </motion.span>
                    </div>

                  </div>
                </motion.div>

                {/* Newsroom Tickers and Taglines sliding in sequentially */}
                <div className="absolute bottom-6 left-0 right-0 text-center space-y-1.5 z-20">
                  {currentTime > 1.2 && (
                    <motion.h4 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-sans font-black tracking-widest text-[#B80000] uppercase pr-0.5"
                    >
                      NEWSVERSE
                    </motion.h4>
                  )}

                  {currentTime > 2.5 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-semibold tracking-wider select-none pr-0.5"
                    >
                      <span>INFORM</span>
                      <span className="text-[#B80000]">&bull;</span>
                      <span>INSPIRE</span>
                      <span className="text-[#B80000]">&bull;</span>
                      <span>IMPACT</span>
                    </motion.div>
                  )}

                  {currentTime > 5.5 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-1.5 text-[9.5px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 mt-2 rounded"
                    >
                      <Sparkles size={8} className="animate-spin" />
                      <span>ISLAMABAD DIPLOMATIC FEED ONLINE</span>
                    </motion.div>
                  )}
                </div>

                {/* Floating telemetry lines */}
                <div className="absolute top-4 left-6 text-left space-y-1 select-none text-[8px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>SIGNAL LEVEL: 100%</span>
                  </div>
                  <div>FPS: 60.00 / LATENCY: 12ms</div>
                  <div>COORD: 33°43'N 73°05'E</div>
                </div>

                <div className="absolute top-4 right-6 text-right select-none text-[8px] text-slate-500">
                  <div>DISPATCH_ID: NV-990833</div>
                  <div className="text-rose-500">PEACE ACCORD SECURE_SYNC</div>
                  <div className="font-mono text-slate-400">00:0{Math.floor(currentTime)}.0{Math.floor((currentTime % 1) * 10)}</div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Video Player Control Bar */}
        <div className="px-5 py-3.5 bg-[#0F0F12] border-t border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center select-none text-xs text-slate-400">
          
          {/* Mute and Player controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleMuteToggle}
              className="hover:text-white transition-colors p-1 bg-[#1A1A1E] border border-slate-800 rounded flex items-center gap-1 cursor-pointer select-none"
              title={isMuted ? "Unmute intro music" : "Mute intro music"}
            >
              {isMuted ? (
                <>
                  <VolumeX size={14} className="text-rose-500" />
                  <span className="text-[10px]">SOUND OFF</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} className="text-emerald-500 animate-bounce" />
                  <span className="text-[10px]">SOUND ON</span>
                </>
              )}
            </button>
            
            {isPlaying && (
              <span className="text-[10px] bg-slate-800 text-slate-300 rounded px-1.5 py-0.5 font-mono">
                Duration: 00:0{Math.floor(currentTime)} / 00:09
              </span>
            )}
          </div>

          {/* Title banner */}
          <div className="text-[10px] text-slate-500 font-semibold tracking-wide text-center sm:text-right flex items-center gap-1">
            <CheckCircle2 size={10} className="text-emerald-500" />
            <span>AUTHENTIC JOURNALISM INTRO VECTOR • DIGITAL HIGH-FIDELITY REPLICA</span>
          </div>
        </div>

        {/* Timeline Slider Progress Bar wrapper */}
        {isPlaying && (
          <div className="relative w-full h-1 bg-slate-900 select-none">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.7)] transition-all ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        )}

      </div>
    </div>
  );
}
