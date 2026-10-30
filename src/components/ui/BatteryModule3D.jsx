import React, { useState } from 'react';
import { 
  Zap, 
  Thermometer, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Activity,
  Maximize2
} from 'lucide-react';

/**
 * BatteryModule3D Component
 * 
 * High-fidelity 3D Digital Twin visualization of the VoltNexus 13S8P 1.57 kWh Battery Module:
 * - Geometric 104-Cell 21700 Array (13 Series x 8 Parallel)
 * - 1.2mm Pure Copper High-Conductivity Busbar Grid
 * - Integrated Bottom Liquid Cold Plate with Fluid Inlet/Outlet Channels
 * - BMS 13-Channel Cell Voltage & Thermal Sensor Harness
 * - Progressive Circuit Power-Up Animation & Dynamic Thermal Contour Layer
 * - Interactive Telemetry Hotspots with MBSE Specifications
 */
export default function BatteryModule3D({ 
  bootStage = 3, 
  mouseCoords = { x: 0, y: 0 } 
}) {
  const [activeLayer, setActiveLayer] = useState('combined'); // 'combined' | 'electrical' | 'thermal'
  const [activeHotspot, setActiveHotspot] = useState(null);

  // Subtle interactive 3D rotation based on mouse coordinates
  const rotX = 14 - (mouseCoords.y || 0) * 8;
  const rotY = -12 + (mouseCoords.x || 0) * 12;

  // Entrance animation classes based on boot stage
  const isEntering = bootStage >= 2;
  const isFullyArmed = bootStage >= 3;

  return (
    <div 
      className={`relative w-full max-w-[560px] mx-auto transition-all duration-1000 ease-out select-none ${
        isEntering 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-16 scale-95 pointer-events-none'
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* HUD Frame Header & View Mode Switcher */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-300 font-semibold">
            13S8P DIGITAL TWIN • 46.8V NOMINAL
          </span>
        </div>

        {/* View Mode Toggle: Combined / Electrical / Thermal */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0e1318]/90 border border-[#232c37] text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setActiveLayer('combined')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activeLayer === 'combined'
                ? 'bg-orange-500/25 text-orange-300 border border-orange-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ALL
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('electrical')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activeLayer === 'electrical'
                ? 'bg-blue-500/25 text-blue-300 border border-blue-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BUSBARS
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('thermal')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activeLayer === 'thermal'
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            THERMAL
          </button>
        </div>
      </div>

      {/* Main 3D Module Container */}
      <div 
        className="relative rounded-2xl bg-gradient-to-b from-[#151c24]/95 via-[#10151c]/90 to-[#0b0e12]/95 border border-[#283647] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden group"
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Subtle Ambient Volumetric Glow Behind Module */}
        <div 
          className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 via-transparent to-blue-500/10 rounded-3xl blur-2xl pointer-events-none transition-opacity duration-700"
          style={{ opacity: isFullyArmed ? 1 : 0 }}
        />

        {/* CAD Grid Overlay on the Enclosure Surface */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(244, 119, 33, 0.15) 0%, transparent 60%),
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 20px 20px, 20px 20px',
          }}
        />

        {/* Interactive SVG CAD Visualization */}
        <div className="relative z-10 w-full h-[270px] sm:h-[300px]">
          <svg 
            viewBox="0 0 520 280" 
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          >
            <defs>
              {/* High-Voltage Copper Busbar Gradient */}
              <linearGradient id="cuBusbar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Cell Anode Cap Shimmer */}
              <radialGradient id="cellCap" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="60%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </radialGradient>

              {/* Active Current Glow */}
              <filter id="busbarGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Thermal Gradient Map (Inlet to Outlet Temperature Rise) */}
              <linearGradient id="thermalContour" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />    {/* Inlet: 35.0°C */}
                <stop offset="35%" stopColor="#22C55E" stopOpacity="0.5" />    {/* Mid 1: 37.2°C */}
                <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.65" />   {/* Mid 2: 41.5°C */}
                <stop offset="85%" stopColor="#EF4444" stopOpacity="0.8" />    {/* Hotspot: 48.6°C */}
                <stop offset="100%" stopColor="#F97316" stopOpacity="0.6" />   {/* Outlet: 43.1°C */}
              </linearGradient>
            </defs>

            {/* 1. Structural Cold Plate Base & Mounting Flanges */}
            <g id="coldPlateBase">
              {/* Cold plate chassis extrusion */}
              <polygon 
                points="40,230 480,230 500,210 60,210" 
                fill="#161e27" 
                stroke="#2b3b4d" 
                strokeWidth="1.5"
              />
              <polygon 
                points="40,230 40,242 480,242 480,230" 
                fill="#0d1217" 
                stroke="#243242" 
                strokeWidth="1.5"
              />

              {/* Coolant Flow Direction Vectors */}
              <g opacity="0.85">
                {/* Fluid Inlet */}
                <circle cx="50" cy="236" r="4" fill="#38BDF8" className="animate-pulse" />
                <path d="M 60 236 L 85 236" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />
                <polygon points="85,233 91,236 85,239" fill="#38BDF8" />
                <text x="60" y="254" fill="#38BDF8" fontSize="8" fontFamily="monospace">INLET: 35°C</text>

                {/* Fluid Outlet */}
                <circle cx="470" cy="236" r="4" fill="#F97316" className="animate-pulse" />
                <path d="M 440 236 L 465 236" stroke="#F97316" strokeWidth="2" strokeDasharray="4 2" />
                <polygon points="465,233 471,236 465,239" fill="#F97316" />
                <text x="430" y="254" fill="#F97316" fontSize="8" fontFamily="monospace">OUTLET: 39°C</text>
              </g>
            </g>

            {/* 2. Thermal Contour Simulation Overlay (When Active) */}
            {activeLayer !== 'electrical' && (
              <g 
                id="thermalField" 
                className="transition-opacity duration-500"
                opacity={activeLayer === 'thermal' ? 0.95 : 0.4}
              >
                <polygon 
                  points="65,195 475,195 490,75 80,75" 
                  fill="url(#thermalContour)" 
                  className="animate-pulse"
                />
                {/* Isothermal Contour Lines */}
                <path d="M 160 80 Q 155 135 150 190" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                <path d="M 270 78 Q 260 135 250 192" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                <path d="M 380 76 Q 375 135 365 194" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              </g>
            )}

            {/* 3. 104-Cell Isometric Array (13 Series Rows x 8 Parallel Columns) */}
            <g id="cellMatrix">
              {Array.from({ length: 13 }).map((_, sIdx) => {
                // Series coordinate interpolation
                const xOffset = 75 + sIdx * 30;
                const yShear = 185 - sIdx * 8;

                return (
                  <g key={`series-${sIdx}`} className="group/series">
                    {/* 8 Parallel Cells per Brick */}
                    {Array.from({ length: 4 }).map((_, pIdx) => {
                      const cx = xOffset + pIdx * 5;
                      const cy = yShear - pIdx * 24;

                      return (
                        <g key={`cell-${sIdx}-${pIdx}`}>
                          {/* Cell Cylinder Body */}
                          <ellipse 
                            cx={cx} 
                            cy={cy} 
                            rx="10" 
                            ry="6.5" 
                            fill="url(#cellCap)" 
                            stroke="#1E293B" 
                            strokeWidth="1.2"
                          />
                          {/* Center Positive / Negative Terminal Stud */}
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r="2.8" 
                            fill={sIdx % 2 === 0 ? "#F59E0B" : "#94A3B8"} 
                            stroke="#0F172A" 
                            strokeWidth="0.8"
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>

            {/* 4. Electrical Busbars & Circuit Connections */}
            {activeLayer !== 'thermal' && (
              <g id="busbarNetwork">
                {/* Main High-Voltage Positive Terminal (Terminal A) */}
                <rect x="68" y="196" width="16" height="12" rx="2" fill="#F47721" stroke="#FFD18A" strokeWidth="1" />
                <text x="73" y="205" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">+</text>

                {/* Series Interconnect Straps (Copper 1.2mm) */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const x1 = 80 + i * 30;
                  const y1 = 180 - i * 8;
                  const x2 = x1 + 30;
                  const y2 = y1 - 8;

                  return (
                    <g key={`busbar-${i}`}>
                      {/* Copper Busbar Strip */}
                      <path 
                        d={`M ${x1} ${y1} L ${x2} ${y2}`} 
                        stroke="url(#cuBusbar)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        filter="url(#busbarGlow)"
                      />
                      {/* Active Energy Electron Flow */}
                      <path 
                        d={`M ${x1} ${y1} L ${x2} ${y2}`} 
                        stroke="#FFF" 
                        strokeWidth="1.8" 
                        strokeLinecap="round"
                        strokeDasharray="4 8"
                        style={{
                          animation: 'energyPulseForward 2s linear infinite',
                          animationDelay: `${i * 0.12}s`,
                        }}
                      />
                    </g>
                  );
                })}

                {/* Main High-Voltage Negative Terminal (Terminal B) */}
                <rect x="445" y="85" width="16" height="12" rx="2" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1" />
                <text x="451" y="94" fill="#FFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">−</text>

                {/* BMS Voltage Sense Tap Harness (Electric Blue Traces) */}
                <path 
                  d="M 75 190 L 135 174 L 195 158 L 255 142 L 315 126 L 375 110 L 435 94" 
                  stroke="#246BFD" 
                  strokeWidth="1.2" 
                  strokeDasharray="3 3"
                  fill="none"
                  opacity="0.75"
                />
              </g>
            )}

            {/* 5. Interactive Telemetry Hotspots */}
            {/* Hotspot 1: Cell Array */}
            <g 
              className="cursor-pointer"
              onClick={() => setActiveHotspot(activeHotspot === 'cells' ? null : 'cells')}
            >
              <circle cx="170" cy="140" r="9" fill="#14191F" stroke="#F47721" strokeWidth="1.8" />
              <circle cx="170" cy="140" r="4" fill="#F47721" className="animate-ping" />
              <text x="167" y="143" fill="#FFF" fontSize="8" fontWeight="bold">1</text>
            </g>

            {/* Hotspot 2: Busbars */}
            <g 
              className="cursor-pointer"
              onClick={() => setActiveHotspot(activeHotspot === 'busbar' ? null : 'busbar')}
            >
              <circle cx="280" cy="115" r="9" fill="#14191F" stroke="#38BDF8" strokeWidth="1.8" />
              <circle cx="280" cy="115" r="4" fill="#38BDF8" className="animate-ping" />
              <text x="277" y="118" fill="#FFF" fontSize="8" fontWeight="bold">2</text>
            </g>

            {/* Hotspot 3: Thermal Cold Plate */}
            <g 
              className="cursor-pointer"
              onClick={() => setActiveHotspot(activeHotspot === 'thermal' ? null : 'thermal')}
            >
              <circle cx="390" cy="155" r="9" fill="#14191F" stroke="#EF4444" strokeWidth="1.8" />
              <circle cx="390" cy="155" r="4" fill="#EF4444" className="animate-ping" />
              <text x="387" y="158" fill="#FFF" fontSize="8" fontWeight="bold">3</text>
            </g>
          </svg>
        </div>

        {/* Hotspot Inspection Modal / Card */}
        {activeHotspot && (
          <div className="mt-3 p-3 rounded-xl bg-[#0f141a]/95 border border-[#2b3c4f] shadow-lg animate-fadeIn text-xs font-mono">
            {activeHotspot === 'cells' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-orange-400 font-bold">
                  <span>[1] 104-CELL 21700 CYLINDRICAL MATRIX</span>
                  <span className="text-[10px] text-slate-400">13S 8P</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Molicel INR-21700-P42A (4.2Ah, 3.6V Nom). Grouped into 13 series stages of 8 parallel cells, yielding 33.6Ah pack capacity and 1.57 kWh nominal energy.
                </p>
              </div>
            )}

            {activeHotspot === 'busbar' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>[2] 1.2MM PURE COPPER BUSBAR GRID</span>
                  <span className="text-[10px] text-emerald-400">PASS IEC 60364-5-54</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Replaces stamped 0.15mm nickel. Withstands 2,850A short-circuit prospective current without exceeding adiabatic melting limits ($k^2S^2$).
                </p>
              </div>
            )}

            {activeHotspot === 'thermal' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-rose-400 font-bold">
                  <span>[3] LIQUID COLD PLATE DUCT THERMODYNAMICS</span>
                  <span className="text-[10px] text-amber-300">ΔT = 4.2°C</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Convective heat transfer ($h = 110\text{ W/m}^2\text{K}$) maintains maximum core temperature under continuous 70A cruise load below the 52°C derating threshold.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer Technical Indicators */}
        <div className="mt-4 pt-3 border-t border-[#232f3d] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>13S8P NMC 21700</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-orange-400" />
            <span>46.8V • 33.6Ah</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3 h-3 text-cyan-400" />
            <span>35°C AMBIENT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>13 RULES PASS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
