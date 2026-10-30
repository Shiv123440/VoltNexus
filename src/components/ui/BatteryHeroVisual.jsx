import React from 'react';

/**
 * BatteryHeroVisual Component
 * 
 * High-fidelity 13S8P Battery Module Digital Twin hero visualization:
 * - Studio-grade transparent isometric render with pristine alpha channel (no white/grey halos or checkerboard artifacts)
 * - Occupies ~42-45% of the visual hero width, naturally centered with the hero heading
 * - Pure transparent integration: no floating specification pills, HUD labels, or opaque cards
 * - Soft industrial contact shadow and subtle ambient backlight harmonizing with the battery energy flow background
 * - Subtle interactive mouse parallax tilt and smooth entrance sequence
 */
export default function BatteryHeroVisual({ 
  bootStage = 3, 
  mouseCoords = { x: 0, y: 0 } 
}) {
  const isEntering = bootStage >= 2;

  // Gentle parallax tilt (restricted to subtle range for realistic depth without distortion)
  const tiltX = (mouseCoords?.y || 0) * -5;
  const tiltY = (mouseCoords?.x || 0) * 7;

  return (
    <div 
      className={`relative w-full max-w-[660px] xl:max-w-[720px] mx-auto flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] select-none pointer-events-none ${
        isEntering 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* 1. Ambient Digital-Twin Backlight: Soft orange and cyan aura behind the battery */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div 
          className="w-[85%] h-[80%] rounded-full blur-3xl opacity-60 transition-transform duration-700 ease-out"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, rgba(244, 119, 33, 0.16) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 75%)',
            transform: `translate3d(${tiltY * 0.8}px, ${tiltX * 0.8}px, 0)`
          }}
        />
      </div>

      {/* 2. Soft Contact Ground Shadow (anchors the metallic casing onto the website floor) */}
      <div 
        className="absolute bottom-2 sm:bottom-4 w-[82%] h-[18%] pointer-events-none -z-5"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.25) 50%, transparent 75%)',
          filter: 'blur(10px)',
          transform: `translate3d(${tiltY * 0.4}px, 0, 0)`
        }}
        aria-hidden="true"
      />

      {/* 3. Main Battery Module Digital Twin Image */}
      <div 
        className="relative w-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <img 
          src="/battery_hero_digital_twin.png" 
          alt="VoltNexus 13S8P 1.57 kWh NMC Battery Module Digital Twin"
          className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] transition-all duration-700 hover:scale-[1.02]"
          style={{
            maxHeight: '480px',
            objectFit: 'contain'
          }}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
