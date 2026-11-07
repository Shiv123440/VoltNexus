import React, { useState } from 'react';
import { 
  Zap, 
  Layers,
  ChevronRight
} from 'lucide-react';

export default function DigitalTwinViewer({ 
  packData: _packData = {}, 
  activeCooling = "forced_air",
  ambientTempC = 35.0,
  maxCoreTempC = 43.2,
  tempSpreadC = 3.2,
  nSeries = 13,
  nParallel = 8,
  interconnectId = "copper_12"
}) {
  const [activeLayer, setActiveLayer] = useState('assembly'); // 'assembly' | 'electrical' | 'thermal' | 'bms'
  const [hoveredCell, setHoveredCell] = useState(null);
  const [isExploded, setIsExploded] = useState(false);
  const [tilt, setTilt] = useState({ x: 12, y: -15 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: 14 - yRatio * 14,
      y: -15 + xRatio * 20
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 12, y: -15 });
  };

  // Generate a realistic grid of 13 series groups x 8 parallel cells (or nSeries x nParallel clamped for visual clarity)
  const displaySeries = Math.min(13, Math.max(6, nSeries));
  const displayParallel = Math.min(8, Math.max(4, nParallel));

  const getCellColor = (sIdx, pIdx) => {
    // Inlet is on left (sIdx = 0), outlet is on right (sIdx = displaySeries - 1)
    // Core cells (middle pIdx) are warmer
    const lengthGradient = sIdx / (displaySeries - 1);
    const coreFactor = 1 - Math.abs((pIdx / (displayParallel - 1)) - 0.5) * 1.2;
    const localTemp = ambientTempC + (maxCoreTempC - ambientTempC) * (0.6 * lengthGradient + 0.4 * coreFactor);

    if (activeLayer === 'thermal') {
      if (localTemp > 55) return '#EF4444'; // Red
      if (localTemp > 50) return '#F59E0B'; // Amber
      if (localTemp > 40) return '#10B981'; // Emerald
      return '#00E5FF'; // Cyan
    }

    if (activeLayer === 'electrical') {
      return interconnectId === 'copper_12' ? '#F59E0B' : '#94A3B8';
    }

    // Default Assembly view
    if (localTemp > 55) return '#EF4444';
    if (localTemp > 51) return '#F59E0B';
    return '#0284C7';
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_8px_#00e5ff]"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            13S8P DIGITAL TWIN • 104 CELLS • 46.8V
          </span>
        </div>

        {/* Layer Selectors */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveLayer('assembly')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeLayer === 'assembly' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Assembly
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('electrical')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeLayer === 'electrical' 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Busbars
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('thermal')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeLayer === 'thermal' 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Thermal
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('bms')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeLayer === 'bms' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BMS NTCs
          </button>
        </div>

        {/* Explode View Toggle */}
        <button
          type="button"
          onClick={() => setIsExploded(!isExploded)}
          className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
            isExploded 
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isExploded ? 'Exploded (Active)' : 'Explode View'}</span>
        </button>
      </div>

      {/* 3D Canvas Stage */}
      <div 
        className="relative w-full h-[380px] sm:h-[440px] rounded-2xl bg-gradient-to-b from-[#0A0E17] to-[#06090F] border border-white/10 overflow-hidden vn-cad-grid flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '1100px' }}
      >
        {/* Subtle Ambient Lighting Ring */}
        <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        {/* 3D Transform Container */}
        <div 
          className="relative transition-transform duration-200 ease-out flex items-center justify-center"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Bottom Layer: Liquid Cold Plate / Aerodynamic Duct Floor */}
          <div 
            className="absolute rounded-xl transition-all duration-500"
            style={{
              width: `${displaySeries * 36 + 60}px`,
              height: `${displayParallel * 26 + 60}px`,
              transform: `translateZ(${isExploded ? -70 : -25}px)`,
              background: activeCooling === 'cold_plate' 
                ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.45) 0%, rgba(15, 23, 42, 0.85) 100%)' 
                : 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.5) 100%)',
              border: activeCooling === 'cold_plate' ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
            }}
          >
            {/* Coolant Flow Channel Indicator */}
            <div className="absolute top-2 left-3 right-3 bottom-2 flex items-center justify-between px-3 text-[10px] font-mono text-cyan-400 opacity-60">
              <span className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 animate-pulse" /> INLET ({ambientTempC}°C)
              </span>
              <span className="flex items-center gap-1">
                OUTLET ({(ambientTempC + tempSpreadC).toFixed(1)}°C) <ChevronRight className="w-3 h-3 animate-pulse" />
              </span>
            </div>
          </div>

          {/* Middle Layer: 104 Cylindrical Cells Array */}
          <div 
            className="relative grid gap-2 p-4 rounded-xl transition-all duration-500"
            style={{
              gridTemplateColumns: `repeat(${displaySeries}, minmax(0, 1fr))`,
              transform: `translateZ(${isExploded ? 0 : 0}px)`
            }}
          >
            {Array.from({ length: displaySeries }).map((_, sIdx) => (
              <div key={sIdx} className="flex flex-col gap-2">
                {Array.from({ length: displayParallel }).map((_, pIdx) => {
                  const cellColor = getCellColor(sIdx, pIdx);
                  const isHovered = hoveredCell && hoveredCell.s === sIdx && hoveredCell.p === pIdx;

                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onMouseEnter={() => setHoveredCell({ s: sIdx, p: pIdx, color: cellColor })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md focus:outline-none"
                      style={{
                        backgroundColor: cellColor,
                        boxShadow: isHovered 
                          ? `0 0 16px ${cellColor}, inset 0 0 0 2px #ffffff` 
                          : `0 2px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4)`
                      }}
                      aria-label={`Cell S${sIdx + 1}P${pIdx + 1}`}
                    >
                      {/* Cell Terminal Center Dot */}
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950/70" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Top Layer: Busbar Interconnect Grid & BMS Harness */}
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-500"
            style={{
              transform: `translateZ(${isExploded ? 75 : 22}px)`
            }}
          >
            {/* Busbar Strips Overlay */}
            {(activeLayer === 'assembly' || activeLayer === 'electrical') && (
              <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                {Array.from({ length: displaySeries }).map((_, sIdx) => {
                  const xPos = sIdx * 35 + 28;
                  const isCopper = interconnectId === 'copper_12';
                  return (
                    <g key={sIdx}>
                      <line 
                        x1={xPos} 
                        y1="16" 
                        x2={xPos} 
                        y2={displayParallel * 28 + 8} 
                        stroke={isCopper ? '#F59E0B' : '#94A3B8'} 
                        strokeWidth={isCopper ? "5" : "2.5"} 
                        strokeOpacity="0.85" 
                        strokeLinecap="round"
                      />
                      {/* Current pulse dot */}
                      <circle 
                        cx={xPos} 
                        cy="30" 
                        r="3" 
                        fill="#FFFFFF" 
                        className="animate-ping opacity-60" 
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* BMS NTC Sensor Probe Markers */}
            {(activeLayer === 'assembly' || activeLayer === 'bms') && (
              <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
                <div className="flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 border border-white shadow-[0_0_10px_#10B981] animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-300 bg-slate-950/80 px-1 rounded mt-1">NTC-1</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full bg-amber-400 border border-white shadow-[0_0_10px_#F59E0B] animate-pulse" />
                  <span className="text-[9px] font-mono text-amber-300 bg-slate-950/80 px-1 rounded mt-1">NTC-2 (Hotspot)</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full bg-rose-400 border border-white shadow-[0_0_10px_#EF4444] animate-pulse" />
                  <span className="text-[9px] font-mono text-rose-300 bg-slate-950/80 px-1 rounded mt-1">NTC-3 (Outlet)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hovered Cell Live Telemetry Tooltip */}
        {hoveredCell && (
          <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-md shadow-2xl text-xs font-mono space-y-1 pointer-events-none">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Cell S{hoveredCell.s + 1} • Parallel Leg P{hoveredCell.p + 1}</span>
            </div>
            <div className="text-slate-300">
              Terminal Potential: <span className="text-white font-bold">{(3.60 - (hoveredCell.s * 0.01)).toFixed(2)} V</span>
            </div>
            <div className="text-slate-300">
              Estimated Temperature: <span className="text-amber-400 font-bold">{(ambientTempC + (maxCoreTempC - ambientTempC) * (hoveredCell.s / displaySeries)).toFixed(1)} °C</span>
            </div>
            <div className="text-slate-400 text-[10px]">
              Impedance: 16.2 mΩ • Current Share: {(70.0 / displayParallel).toFixed(1)} A
            </div>
          </div>
        )}

        {/* Ambient Legend Bar */}
        <div className="absolute top-4 right-4 hidden sm:flex flex-col gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-white/10 text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Nominal (&lt;42°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Warm (&gt;50°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Critical (&gt;55°C)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
