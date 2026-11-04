import React from 'react';

/**
 * BatteryFlowBackground Component
 * 
 * Recreates an award-winning futuristic battery engineering laboratory atmosphere:
 * - Base Palette: Deep Obsidian (#070A12), Dark Graphite (#0B111E), Space Slate (#1E293B)
 * - Energy Pulses: High-voltage busbars in Electric Blue (#3B82F6) & BMS sensing lines in Luminous Cyan (#06B6D4)
 * - Thermal Atmosphere: Restrained soft ambient glows (Cyan/Blue/Amber)
 * - Technical Schematics: 13S8P battery module footprints, 21700 cell arrays, duct flow vector marks, PCB vias
 * - Section-Aware: Adjusts opacity and focal areas between Landing (Hero), Workbench (Quiet), and Compare (Trade-off)
 */
export default function BatteryFlowBackground({ activeTab = 'landing', mouseCoords = { x: 0, y: 0 } }) {
  const mx = mouseCoords?.x || 0;
  const my = mouseCoords?.y || 0;
  const isLanding = activeTab === 'landing';
  const isWorkbench = activeTab === 'workbench';
  const isCompare = activeTab === 'compare';

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ======================================================== */}
      {/* 1. BASE OBSIDIAN SPACE & SUBTLE AMBIENT FIELD GLOWS     */}
      {/* ======================================================== */}
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(ellipse 90% 65% at 75% 25%, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.02) 50%, transparent 75%),
            radial-gradient(ellipse 80% 55% at 20% 20%, rgba(37, 99, 235, 0.14) 0%, rgba(37, 99, 235, 0.03) 50%, transparent 80%),
            radial-gradient(ellipse 70% 60% at 50% 90%, rgba(245, 158, 11, 0.06) 0%, transparent 60%),
            linear-gradient(155deg, #060911 0%, #080D18 35%, #0B1222 70%, #070B14 100%)
          `
        }}
      />

      {/* Atmospheric Cyan Thermal Wave (Breathing Simulation Field) */}
      <div 
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-3xl opacity-30 transition-all duration-1000 animate-[thermalShift_14s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* Thermal Dissipation Core (Soft Amber Radiance) */}
      <div 
        className="absolute top-1/4 -right-28 w-[720px] h-[720px] rounded-full blur-3xl opacity-25 transition-all duration-1000 animate-[thermalShift_18s_ease-in-out_infinite_reverse]"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.20) 0%, rgba(244, 119, 33, 0.08) 45%, transparent 75%)',
        }}
      />

      {/* Deep Space Vignette Scrim to guarantee ultra-sharp contrast for foreground dark glass cards */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(circle at 50% 45%, rgba(7, 10, 18, 0.25) 0%, rgba(7, 10, 18, 0.55) 65%, rgba(4, 6, 12, 0.82) 100%)
          `,
          opacity: isWorkbench ? 0.70 : isCompare ? 0.60 : 0.50,
        }}
      />

      {/* ======================================================== */}
      {/* 2. PRECISION CAD ENGINEERING GRID & ISOMETRIC GUIDE LINES */}
      {/* ======================================================== */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 200px 200px, 200px 200px',
        }}
      />

      {/* ======================================================== */}
      {/* 3. DYNAMIC VECTOR CIRCUIT PATHS & ANIMATED ENERGY FLOWS   */}
      {/* ======================================================== */}
      <svg 
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${mx * 15}px, ${my * 12}px, 0)` }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Energy Pulse Gradients */}
          <linearGradient id="busbarBlueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="senseCyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#67E8F9" stopOpacity="1" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="thermalAmberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
          </linearGradient>

          {/* Node Glow Filters */}
          <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ---------------------------------------------------- */}
        {/* A. PASSIVE STATIC CIRCUIT SCHEMATICS & BUSBAR TRACKS */}
        {/* ---------------------------------------------------- */}
        <g stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.2" fill="none">
          {/* Top High-Voltage Busbar Infrastructure */}
          <path d="M 60 110 L 780 110 L 850 180 L 1420 180 L 1490 250 L 1860 250" />
          <path d="M 1490 250 L 1490 580 L 1560 650 L 1880 650" />
          <path d="M 780 110 L 780 340 L 710 410 L 320 410" />

          {/* Parallel BMS Sensing & Ground Return Lines */}
          <path d="M 90 135 L 760 135 L 830 205 L 1390 205 L 1460 275 L 1780 275" />
          <path d="M 120 440 L 460 440 L 520 500 L 520 720 L 610 810 L 1180 810" />
          <path d="M 80 840 L 590 840 L 660 910 L 1360 910 L 1430 980 L 1860 980" />

          {/* Cross-Link Telemetry Interconnects */}
          <line x1="850" y1="180" x2="850" y2="290" strokeDasharray="4 6" strokeOpacity="0.25" />
          <line x1="1420" y1="180" x2="1390" y2="205" strokeDasharray="2 4" strokeOpacity="0.30" />
          <line x1="520" y1="720" x2="660" y2="910" strokeDasharray="3 5" strokeOpacity="0.25" />
        </g>

        {/* ---------------------------------------------------- */}
        {/* B. 13S8P BATTERY MODULE FOOTPRINT & CELL ARRAY (3D)  */}
        {/* ---------------------------------------------------- */}
        <g 
          className="transition-opacity duration-700" 
          opacity={isLanding ? 0.75 : isCompare ? 0.55 : 0.25}
          transform="translate(1380, 220)"
        >
          {/* Module Enclosure Boundary */}
          <rect 
            x="0" 
            y="0" 
            width="460" 
            height="340" 
            rx="14" 
            fill="none" 
            stroke="rgba(6, 182, 212, 0.35)" 
            strokeWidth="1.5" 
            strokeDasharray="8 6" 
          />
          <rect 
            x="8" 
            y="8" 
            width="444" 
            height="324" 
            rx="10" 
            fill="rgba(6, 182, 212, 0.04)" 
            stroke="rgba(255, 255, 255, 0.10)" 
            strokeWidth="0.8" 
          />

          {/* Module Header Technical Callout */}
          <text x="20" y="32" fill="#06B6D4" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.9">
            [13S8P VOLTNEXUS CORE] • 46.8V NOM • 1.57 kWh
          </text>
          <text x="20" y="48" fill="#94A3B8" fontSize="8" fontFamily="monospace" opacity="0.8">
            THERMAL DUCT: ΔT_FLUID ≤ 5.0°C • AIR CONVECTION h = 38 W/m²K
          </text>

          {/* 13S Cell Cluster Circular Footprints (21700 Matrix) */}
          {[...Array(6)].map((_, row) => (
            <g key={`row-${row}`}>
              {[...Array(8)].map((_, col) => {
                const cx = 35 + col * 50;
                const cy = 75 + row * 42;
                const isHotspot = row >= 3 && col >= 5;
                return (
                  <g key={`cell-${row}-${col}`}>
                    {/* Cylindrical 21700 Cell Outline */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="13" 
                      fill="none" 
                      stroke={isHotspot ? '#F59E0B' : 'rgba(255, 255, 255, 0.20)'} 
                      strokeWidth="1.2" 
                      strokeOpacity={isHotspot ? 0.8 : 0.4} 
                    />
                    {/* Positive Terminal Cap */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="4.5" 
                      fill={isHotspot ? 'rgba(245, 158, 11, 0.5)' : 'rgba(6, 182, 212, 0.25)'} 
                      stroke={isHotspot ? '#F59E0B' : '#06B6D4'} 
                      strokeWidth="0.8" 
                    />
                    {/* Interconnect Busbar Tab */}
                    {col < 7 && (
                      <line 
                        x1={cx + 13} 
                        y1={cy} 
                        x2={cx + 37} 
                        y2={cy} 
                        stroke="#06B6D4" 
                        strokeWidth="1" 
                        strokeOpacity="0.30" 
                      />
                    )}
                  </g>
                );
              })}
            </g>
          ))}

          {/* Downstream Thermal Hotspot Indicator Tag */}
          <rect x="280" y="278" width="160" height="38" rx="6" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.45)" strokeWidth="0.8" />
          <circle cx="295" cy="297" r="4" fill="#F59E0B" className="animate-ping" opacity="0.75" />
          <circle cx="295" cy="297" r="3.5" fill="#F59E0B" />
          <text x="306" y="294" fill="#F8FAFC" fontSize="9" fontFamily="monospace" fontWeight="bold">
            HOTSPOT ZONE
          </text>
          <text x="306" y="306" fill="#FBBF24" fontSize="8" fontFamily="monospace">
            T_core: 44.1°C (Pass UL 2580)
          </text>
        </g>

        {/* ---------------------------------------------------- */}
        {/* C. ANIMATED HIGH-VOLTAGE ENERGY FLOW PULSES (BLUE)   */}
        {/* ---------------------------------------------------- */}
        <g 
          stroke="#3B82F6" 
          strokeWidth="2.4" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#glowBlue)"
          className="transition-opacity duration-700"
          opacity={isWorkbench ? 0.45 : isCompare ? 0.65 : 0.85}
        >
          {/* Main Top Busbar Energy Stream */}
          <path 
            d="M 60 110 L 780 110 L 850 180 L 1420 180 L 1490 250 L 1860 250"
            strokeDasharray="90 310"
            className="animate-[energyPulseForward_4.5s_linear_infinite]"
          />
          {/* Vertical Distribution Feed */}
          <path 
            d="M 1490 250 L 1490 580 L 1560 650 L 1880 650"
            strokeDasharray="70 260"
            className="animate-[energyPulseForward_3.8s_linear_infinite_1.2s]"
          />
          {/* Bottom Module Loop */}
          <path 
            d="M 80 840 L 590 840 L 660 910 L 1360 910 L 1430 980 L 1860 980"
            strokeDasharray="80 340"
            className="animate-[energyPulseForward_5.2s_linear_infinite_0.6s]"
          />
        </g>

        {/* ---------------------------------------------------- */}
        {/* D. ANIMATED BMS SENSING & CONTROL FLOWS (CYAN)       */}
        {/* ---------------------------------------------------- */}
        <g 
          stroke="#06B6D4" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#glowCyan)"
          className="transition-opacity duration-700"
          opacity={isWorkbench ? 0.40 : isCompare ? 0.60 : 0.80}
        >
          {/* AFE Voltage Sense Line */}
          <path 
            d="M 90 135 L 760 135 L 830 205 L 1390 205 L 1460 275 L 1780 275"
            strokeDasharray="65 240"
            className="animate-[energyPulseForward_4.0s_linear_infinite_1.8s]"
          />
          {/* Subsystem Telemetry Bus */}
          <path 
            d="M 120 440 L 460 440 L 520 500 L 520 720 L 610 810 L 1180 810"
            strokeDasharray="75 280"
            className="animate-[energyPulseForward_4.8s_linear_infinite_0.9s]"
          />
        </g>

        {/* ---------------------------------------------------- */}
        {/* E. ILLUMINATED CIRCUIT NODES (VIAS / SOLDER PADS)    */}
        {/* ---------------------------------------------------- */}
        {/* Luminous Blue High-Voltage Terminal Nodes */}
        <g fill="#3B82F6">
          {[
            { cx: 60, cy: 110, delay: '0s' },
            { cx: 780, cy: 110, delay: '1.2s' },
            { cx: 850, cy: 180, delay: '1.6s' },
            { cx: 1420, cy: 180, delay: '2.4s' },
            { cx: 1490, cy: 250, delay: '3.0s' },
            { cx: 1490, cy: 580, delay: '3.8s' },
            { cx: 1560, cy: 650, delay: '4.2s' },
            { cx: 590, cy: 840, delay: '1.4s' },
            { cx: 660, cy: 910, delay: '1.9s' },
            { cx: 1360, cy: 910, delay: '3.1s' },
            { cx: 1430, cy: 980, delay: '3.7s' },
          ].map((node, i) => (
            <g key={`node-blue-${i}`} className="transition-opacity duration-500" opacity={isWorkbench ? 0.45 : 0.9}>
              {/* Outer Radiant Corona */}
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r="9" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="1.2" 
                className="animate-[nodeGlowBlue_3s_ease-in-out_infinite]"
                style={{ animationDelay: node.delay }}
              />
              {/* Inner Solid Terminal */}
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r="4.5" 
                filter="url(#glowBlue)"
              />
            </g>
          ))}
        </g>

        {/* Cyan BMS Sensor Nodes */}
        <g fill="#06B6D4">
          {[
            { cx: 90, cy: 135, delay: '0.4s' },
            { cx: 760, cy: 135, delay: '1.5s' },
            { cx: 830, cy: 205, delay: '2.1s' },
            { cx: 1390, cy: 205, delay: '2.9s' },
            { cx: 460, cy: 440, delay: '0.8s' },
            { cx: 520, cy: 500, delay: '1.3s' },
            { cx: 520, cy: 720, delay: '2.2s' },
            { cx: 610, cy: 810, delay: '2.8s' },
            { cx: 1180, cy: 810, delay: '3.6s' },
          ].map((node, i) => (
            <g key={`node-cyan-${i}`} className="transition-opacity duration-500" opacity={isWorkbench ? 0.4 : 0.85}>
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r="8" 
                fill="none" 
                stroke="#06B6D4" 
                strokeWidth="1" 
                className="animate-[nodeGlowCyan_3.2s_ease-in-out_infinite]"
                style={{ animationDelay: node.delay }}
              />
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r="3.8" 
                filter="url(#glowCyan)"
              />
            </g>
          ))}
        </g>

        {/* ---------------------------------------------------- */}
        {/* F. ENGINEERING SCHEMATIC ANNOTATIONS & LABELS        */}
        {/* ---------------------------------------------------- */}
        <g fill="#94A3B8" fontSize="8.5" fontFamily="monospace" letterSpacing="0.8" opacity="0.45">
          <text x="60" y="98">HIGH_VOLTAGE_RAIL // +46.8V_DC</text>
          <text x="860" y="168">AFE_ADC_SENSE_CH01..13 [SIL-2]</text>
          <text x="120" y="428">BMS_ISOLATION_BARRIER // 2.5kV</text>
          <text x="80" y="828">CURRENT_SHARING_KIRCHHOFF_PLANE</text>
          <text x="680" y="898">THERMAL_RUNAWAY_BARRIER // AIS-156</text>
        </g>

        {/* ---------------------------------------------------- */}
        {/* G. SECTION 3-DESIGN TRADE-OFF PATHS (COMPARE VIEW)  */}
        {/* ---------------------------------------------------- */}
        {isCompare && (
          <g 
            strokeDasharray="6 6" 
            strokeWidth="1.5" 
            fill="none"
            className="transition-opacity duration-700 animate-[schematicBreathe_4s_ease-in-out_infinite]"
          >
            {/* Design 1: Baseline Track */}
            <path d="M 320 620 L 750 620 L 810 680 L 1350 680" stroke="#F43F5E" opacity="0.6" />
            <text x="320" y="610" fill="#F43F5E" fontSize="9" fontFamily="monospace" fontWeight="bold">
              [PATH 01: BASELINE PASSIVE AIR] • FAILS 4 RULES
            </text>

            {/* Design 2: Option A Track */}
            <path d="M 320 660 L 750 660 L 810 720 L 1350 720" stroke="#10B981" opacity="0.75" />
            <text x="320" y="650" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold">
              [PATH 02: OPTION A FORCED DUCT] • RECOMMENDED (+5.6% ENERGY)
            </text>

            {/* Design 3: Option B Track */}
            <path d="M 320 700 L 750 700 L 810 760 L 1350 760" stroke="#06B6D4" opacity="0.6" />
            <text x="320" y="690" fill="#06B6D4" fontSize="9" fontFamily="monospace" fontWeight="bold">
              [PATH 03: OPTION B COLD PLATE LFP] • ULTRA SAFE (+28% MASS)
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
