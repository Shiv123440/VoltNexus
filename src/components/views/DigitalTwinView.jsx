import React, { useState } from 'react';
import { Layers, Cpu, ChevronRight } from 'lucide-react';

export default function DigitalTwinView({ 
  nSeries = 13, 
  nParallel = 8, 
  ambientTempC = 35.0, 
  maxCoreTempC = 43.2, 
  tempSpreadC = 3.2,
  interconnectId = "copper_12",
  coolingId = "forced_air",
  packCurrentA = 70.0
}) {
  const [activeLayer, setActiveLayer] = useState('assembly'); // 'assembly' | 'busbars' | 'thermal' | 'sensors'
  const [isExploded, setIsExploded] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tilt, setTilt] = useState({ x: 15, y: -20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: 15 - yRatio * 15,
      y: -20 + xRatio * 25
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 15, y: -20 });
  };

  const displaySeries = Math.min(13, Math.max(6, nSeries));
  const displayParallel = Math.min(8, Math.max(4, nParallel));

  const getCellColor = (sIdx, pIdx) => {
    const lengthFraction = sIdx / (displaySeries - 1);
    const coreFactor = 1 - Math.abs((pIdx / (displayParallel - 1)) - 0.5) * 1.4;
    const localTemp = ambientTempC + (maxCoreTempC - ambientTempC) * (0.6 * lengthFraction + 0.4 * coreFactor);

    if (activeLayer === 'thermal') {
      if (localTemp > 52) return '#DC2626'; // Red (hotspot)
      if (localTemp > 45) return '#D97706'; // Amber
      if (localTemp > 38) return '#059669'; // Emerald
      return '#2563EB'; // Blue
    }

    if (activeLayer === 'busbars') {
      return interconnectId === 'copper_12' ? '#D97706' : '#94A3B8';
    }

    // Default assembly
    if (localTemp > 50) return '#EA580C';
    return '#2563EB';
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* Studio Header & Breadcrumbs */}
      <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Interactive 3D CAD & Digital Twin Studio</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore 13S8P 104-cell array geometry, copper busbar current paths, aerodynamic fluid flow, and BMS sensor locations
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
            {[
              { id: 'assembly', label: 'Assembly' },
              { id: 'busbars', label: 'Busbars' },
              { id: 'thermal', label: 'Thermal Duct' },
              { id: 'sensors', label: 'BMS Sensors' }
            ].map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                  activeLayer === layer.id
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          {/* Explode View Toggle */}
          <button
            type="button"
            onClick={() => setIsExploded(!isExploded)}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              isExploded 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'Exploded (Active)' : 'Explode Layers'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 3D CAD Canvas Stage (8 Cols) */}
        <div className="lg:col-span-8 vn-panel p-6 sm:p-8 bg-white border border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          
          {/* Canvas HUD Status Header */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="font-bold text-slate-800">104 CYLINDRICAL CELLS • 21700 ARRAY</span>
            </div>
            <span>Rotate: Drag Mouse • Zoom: Scroll</span>
          </div>

          {/* 3D Isometric Projection Stage */}
          <div 
            className="w-full flex-1 flex items-center justify-center my-6 select-none vn-dot-grid rounded-xl bg-slate-50/50 cursor-grab active:cursor-grabbing border border-slate-200/60 p-8"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1200px' }}
          >
            <div 
              className="relative transition-transform duration-200 ease-out flex items-center justify-center"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Bottom Plate Layer: Liquid Cold Plate or Duct Floor */}
              <div 
                className="absolute rounded-2xl transition-all duration-500 border"
                style={{
                  width: `${displaySeries * 42 + 60}px`,
                  height: `${displayParallel * 32 + 60}px`,
                  transform: `translateZ(${isExploded ? -80 : -25}px)`,
                  backgroundColor: coolingId === 'cold_plate' ? '#EFF6FF' : '#F8FAFC',
                  borderColor: coolingId === 'cold_plate' ? '#3B82F6' : '#CBD5E1',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="absolute top-2 left-4 right-4 bottom-2 flex items-center justify-between font-mono text-[11px] text-blue-700 font-bold">
                  <span className="flex items-center gap-1">
                    <ChevronRight className="w-3.5 h-3.5" /> COOLANT INLET ({ambientTempC}°C)
                  </span>
                  <span className="flex items-center gap-1">
                    OUTLET ({(ambientTempC + tempSpreadC).toFixed(1)}°C) <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Middle Layer: 104 Cylindrical Cells */}
              <div 
                className="relative grid gap-2.5 p-4 rounded-xl transition-all duration-500"
                style={{
                  gridTemplateColumns: `repeat(${displaySeries}, minmax(0, 1fr))`,
                  transform: 'translateZ(0px)'
                }}
              >
                {Array.from({ length: displaySeries }).map((_, sIdx) => (
                  <div key={sIdx} className="flex flex-col gap-2.5">
                    {Array.from({ length: displayParallel }).map((_, pIdx) => {
                      const cellColor = getCellColor(sIdx, pIdx);
                      const isHovered = hoveredCell && hoveredCell.s === sIdx && hoveredCell.p === pIdx;

                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onMouseEnter={() => setHoveredCell({ s: sIdx, p: pIdx, color: cellColor })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs focus:outline-none"
                          style={{
                            backgroundColor: cellColor,
                            boxShadow: isHovered 
                              ? `0 0 0 3px #0F172A, 0 4px 12px rgba(0,0,0,0.25)` 
                              : `0 2px 4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.6)`
                          }}
                          aria-label={`Cell S${sIdx + 1}P${pIdx + 1}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-white/80 shadow-xs" />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Top Layer: Busbar Hardware & BMS Sensor Harness */}
              <div 
                className="absolute inset-0 pointer-events-none transition-all duration-500"
                style={{
                  transform: `translateZ(${isExploded ? 80 : 25}px)`
                }}
              >
                {/* Busbar Interconnect Lines */}
                {(activeLayer === 'assembly' || activeLayer === 'busbars') && (
                  <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                    {Array.from({ length: displaySeries }).map((_, sIdx) => {
                      const xPos = sIdx * 41 + 32;
                      const isCopper = interconnectId === 'copper_12';
                      return (
                        <g key={sIdx}>
                          <line 
                            x1={xPos} 
                            y1="16" 
                            x2={xPos} 
                            y2={displayParallel * 33 + 8} 
                            stroke={isCopper ? '#D97706' : '#94A3B8'} 
                            strokeWidth={isCopper ? "5" : "2.5"} 
                            strokeOpacity="0.9" 
                            strokeLinecap="round"
                          />
                        </g>
                      );
                    })}
                  </svg>
                )}

                {/* BMS Sensor Harness Probe Points */}
                {(activeLayer === 'assembly' || activeLayer === 'sensors') && (
                  <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
                    <div className="flex flex-col items-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-md animate-pulse" />
                      <span className="text-[10px] font-mono text-emerald-800 bg-white px-1.5 py-0.5 rounded shadow-xs mt-1 border border-emerald-200">
                        NTC-1
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-600 border-2 border-white shadow-md animate-pulse" />
                      <span className="text-[10px] font-mono text-amber-800 bg-white px-1.5 py-0.5 rounded shadow-xs mt-1 border border-amber-200">
                        NTC-2 (Hotspot)
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white shadow-md animate-pulse" />
                      <span className="text-[10px] font-mono text-rose-800 bg-white px-1.5 py-0.5 rounded shadow-xs mt-1 border border-rose-200">
                        NTC-3 (Outlet)
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Bottom Telemetry Legend & Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Nominal (&lt;40°C)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Warm (45–50°C)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600" />
                <span>Hotspot (&gt;52°C)</span>
              </span>
            </div>

            <div className="text-slate-500">
              Active Busbar: {interconnectId === 'copper_12' ? '1.2mm Pure Copper' : '0.15mm Stamped Nickel'}
            </div>
          </div>

        </div>

        {/* Right: Technical Cell Inspector & Packaging Specifications (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Live Cell Inspector Card */}
          <div className="vn-panel p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Selected Cell Telemetry</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {hoveredCell ? `S${hoveredCell.s + 1} • P${hoveredCell.p + 1}` : 'HOVER ANY CELL'}
              </span>
            </div>

            {hoveredCell ? (
              <div className="space-y-3 font-mono text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Terminal Potential:</span>
                  <span className="font-bold text-slate-900">{(3.60 - (hoveredCell.s * 0.01)).toFixed(2)} V</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Local Core Temp:</span>
                  <span className="font-bold text-amber-600">{(ambientTempC + (maxCoreTempC - ambientTempC) * (hoveredCell.s / displaySeries)).toFixed(1)} °C</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Parallel Current Share:</span>
                  <span className="font-bold text-slate-900">{(packCurrentA / displayParallel).toFixed(1)} A</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Internal DCIR:</span>
                  <span className="font-bold text-slate-900">16.2 mΩ</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Move your cursor over any cylindrical cell on the CAD stage to inspect its voltage, local temperature, and current share.
              </div>
            )}
          </div>

          {/* 2. Physical Module Packaging Specs */}
          <div className="vn-panel p-6 bg-white border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-3">
              Module Physical Packaging Specs
            </h3>

            <div className="space-y-3 font-mono text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Array Dimensions:</span>
                <span className="font-bold text-slate-900">385 × 210 × 75 mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Form Factor:</span>
                <span className="font-bold text-slate-900">21700 Cylindrical</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Cell Count:</span>
                <span className="font-bold text-slate-900">{nSeries * nParallel} Cells ({nSeries}S{nParallel}P)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Thermal Gradient (ΔT):</span>
                <span className="font-bold text-slate-900">{tempSpreadC}°C (Cloos-Wetzel)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Volumetric Density:</span>
                <span className="font-bold text-blue-700">258 Wh / L</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
