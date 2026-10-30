import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Play, CheckCircle2, Eye } from 'lucide-react';

/**
 * BatteryModuleVideo Component
 * 
 * Renders the transparent 13S8P Battery Module digital twin assembly animation.
 * Features:
 * - Direct WebM playback preserving transparent alpha channel
 * - Autoplays once during hero introduction
 * - Smoothly transitions to stable resting state at final assembled frame without looping
 * - Accessible static fallback for prefers-reduced-motion
 * - Sleek translucent telemetry badge and subtle replay control
 * - Zero opaque containers: underlying Battery Energy Flow background remains completely visible
 */
export default function BatteryModuleVideo({ bootStage = 3 }) {
  const videoRef = useRef(null);
  const [isResting, setIsResting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle video playback lifecycle
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      // For reduced motion, seek to the resting frame and hold
      video.pause();
      setIsResting(true);
      return;
    }

    // Attempt autoplay if boot stage is reached
    if (bootStage >= 2 && !isResting) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            // Autoplay policy or user gesture requirement fallback
            console.warn('Autoplay prevented or pending interaction:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [bootStage, reducedMotion, isResting]);

  const handleEnded = () => {
    setIsPlaying(false);
    setIsResting(true);
    // Explicitly pause on the completed resting frame
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsResting(false);
    video.currentTime = 0;
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.warn('Replay failed:', err));
  };

  const handleLoadedData = () => {
    setIsReady(true);
    if (reducedMotion && videoRef.current) {
      // Seek near end for reduced-motion static representation
      videoRef.current.currentTime = Math.max(0, videoRef.current.duration - 0.1);
      videoRef.current.pause();
      setIsResting(true);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-[620px] mx-auto flex flex-col items-center justify-center transition-all duration-1000 ease-out select-none bg-transparent ${
        bootStage >= 2 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
      }`}
    >
      {/* HUD Telemetry Top Indicator (Transparent Glass Pill, No Box) */}
      <div className="w-full flex items-center justify-between mb-2 px-2 z-20">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/40 backdrop-blur-md border border-slate-700/40 text-[11px] font-mono text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isResting ? 'bg-emerald-400' : 'animate-ping bg-orange-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isResting ? 'bg-emerald-500' : 'bg-orange-500'
            }`} />
          </span>
          <span className="font-semibold tracking-wider">
            {reducedMotion
              ? '13S8P MODULE • STATIC VIEW (REDUCED MOTION)'
              : isResting
              ? '13S8P DIGITAL TWIN • ASSEMBLED STATE'
              : '13S8P MODULE • ASSEMBLY DYNAMICS'}
          </span>
        </div>

        {/* Action Button: Replay or Status */}
        {isResting && !reducedMotion && (
          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-[11px] font-mono text-orange-300 transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Replay module assembly animation"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        )}
      </div>

      {/* Main Transparent Video Container - Completely Transparent, Zero Opaque Box */}
      <div className="relative w-full flex items-center justify-center overflow-visible bg-transparent">
        {/* Subtle Ambient Radial Lighting around the transparent battery */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center -z-10"
          aria-hidden="true"
        >
          <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-tr from-orange-500/10 via-amber-400/5 to-cyan-500/8 blur-3xl" />
        </div>

        {/* Video Element */}
        {!hasError ? (
          <video
            ref={videoRef}
            src="/videos/battery-module.webm"
            poster="/videos/battery-module-poster.png"
            autoPlay={!reducedMotion}
            muted
            playsInline
            preload="auto"
            onLoadedData={handleLoadedData}
            onEnded={handleEnded}
            onError={() => setHasError(true)}
            className="w-full max-w-[580px] h-auto object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)] transition-opacity duration-700 bg-transparent"
            style={{
              backgroundColor: 'transparent',
              mixBlendMode: 'normal'
            }}
          />
        ) : (
          /* Static Image Fallback if Video Playback Fails */
          <div className="relative w-full max-w-[580px] flex flex-col items-center justify-center p-6 bg-transparent">
            <img
              src="/videos/battery-module-poster.png"
              alt="13S8P 1.57 kWh NMC Battery Module Digital Twin"
              className="w-full h-auto object-contain rounded-xl drop-shadow-2xl"
            />
            <span className="text-xs font-mono text-slate-400 mt-2">
              13S8P Battery Module • Static Fallback Mode
            </span>
          </div>
        )}

        {/* Subtle Bottom Technical Specs Strip (Floats seamlessly without card bounds) */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/30 text-[10px] font-mono text-slate-400 z-10 pointer-events-none whitespace-nowrap">
          <span>104 Cells (21700)</span>
          <span className="text-slate-600">•</span>
          <span>46.8V Nom</span>
          <span className="text-slate-600">•</span>
          <span>1.57 kWh</span>
          <span className="text-slate-600">•</span>
          <span className="text-orange-400/90 font-medium">Bottom Cold Plate</span>
        </div>
      </div>
    </div>
  );
}
