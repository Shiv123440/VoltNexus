import React from 'react';

/**
 * BatteryFlowBackground Component
 * 
 * Recreates the sophisticated 3D Digital Twin engineering atmosphere:
 * - Base Palette: Warm Ivory (#F5F0EA), Platinum Silver (#E5E4E2), Mocha Brown (#6F4E37), Espresso (#2B211D)
 * - Energy Pulses: High-voltage busbars in Warm Orange (#F47721) & BMS sensing lines in Electric Blue (#246BFD)
 * - Thermal Atmosphere: Restrained Pale Lavender (#E6E0F0) volumetric simulation glow
 * - Technical Schematics: 13S8P battery module footprints, 21700 cell arrays, duct flow vector marks, PCB vias
 * - Section-Aware: Adjusts opacity and focal areas between Landing (Hero), Workbench (Quiet), and Compare (Trade-off)
 */
export default function BatteryFlowBackground({ activeTab = 'landing', mouseCoords = { x: 0, y: 0 } }) {
  const mx = mouseCoords?.x || 0;
  const my = mouseCoords?.y || 0;
  // Section-dependent opacity and intensity multipliers
  const isLanding = activeTab === 'landing';
  const isWorkbench = activeTab === 'workbench';
  const isCompare = activeTab === 'compare';

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ======================================================== */}
      {/* 1. BASE WARM-NEUTRAL FOUNDATION & THERMAL SIMULATION GLOW */}
      {/* ======================================================== */}
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(ellipse 90% 65% at 75% 30%, rgba(244, 119, 33, 0.14) 0%, rgba(244, 119, 33, 0.04) 45%, transparent 75%),
            radial-gradient(ellipse 80% 55% at 20% 20%, rgba(230, 224, 240, 0.55) 0%, rgba(230, 224, 240, 0.18) 50%, transparent 80%),
            radial-gradient(ellipse 70% 60% at 50% 90%, rgba(36, 107, 253, 0.08) 0%, transparent 60%),
            linear-gradient(145deg, #F5F0EA 0%, #EDE7DF 25%, #E5E4E2 55%, #DCD6CE 85%, #D3CCC4 100%)
          `
        }}
      />

      {/* Atmospheric Thermal Wave (Breathing Simulation Field) */}
      <div 
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-3xl opacity-40 transition-all duration-1000 animate-[thermalShift_14s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, #E6E0F0 0%, rgba(230, 224, 240, 0.4) 50%, transparent 75%)',
        }}
      />

      {/* Thermal Dissipation Core (Warm Orange Radiance) */}
      <div 
        className="absolute top-1/4 -right-28 w-[720px] h-[720px] rounded-full blur-3xl opacity-35 transition-all duration-1000 animate-[thermalShift_18s_ease-in-out_infinite_reverse]"
        style={{
          background: 'radial-gradient(circle, rgba(244, 119, 33, 0.28) 0%, rgba(244, 119, 33, 0.1) 45%, transparent 75%)',
        }}
      />

      {/* Subtle Central Scrim to guarantee razor-sharp contrast for foreground dark HUD cards */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(circle at 50% 45%, rgba(43, 33, 29, 0.35) 0%, rgba(43, 33, 29, 0.52) 65%, rgba(25, 20, 18, 0.68) 100%)
          `,
          opacity: isWorkbench ? 0.60 : isCompare ? 0.52 : 0.44,
        }}
      />

      {/* ======================================================== */}
      {/* 2. PRECISION CAD ENGINEERING GRID & ISOMETRIC GUIDE LINES */}
      {/* ======================================================== */}
      <div 
        className="absolute inset-0 opacity-45 mix-blend-multiply"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(111, 78, 55, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(111, 78, 55, 0.12) 1px, transparent 1px),
            linear-gradient(to right, rgba(43, 33, 29, 0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 33, 29, 0.22) 1px, transparent 1px)
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
          <linearGradient id="busbarOrangeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F47721" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FFA45B" stopOpacity="1" />
            <stop offset="100%" stopColor="#F47721" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="senseBlueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#246BFD" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#70A2FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#246BFD" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="thermalLavenderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6E0F0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D8D0E8" stopOpacity="0.1" />
          </linearGradient>

          {/* Node Glow Filters */}
          <filter id="glowOrange" x="-50%" y="-50%" width="200%" height="200%">
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
        <g stroke="#6F4E37" strokeWidth="1.2" strokeOpacity="0.25" fill="none">
          {/* Top High-Voltage Busbar Infrastructure */}
          <path d="M 60 110 L 780 110 L 850 180 L 1420 180 L 1490 250 L 1860 250" />
          <path d="M 1490 250 L 1490 580 L 1560 650 L 1880 650" />
          <path d="M 780 110 L 780 340 L 710 410 L 320 410" />

          {/* Parallel BMS Sensing & Ground Return Lines */}
          <path d="M 90 135 L 760 135 L 830 205 L 1390 205 L 1460 275 L 1780 275" />
          <path d="M 120 440 L 460 440 L 520 500 L 520 720 L 610 810 L 1180 810" />
          <path d="M 80 840 L 590 840 L 660 910 L 1360 910 L 1430 980 L 1860 980" />

          {/* Cross-Link Telemetry Interconnects */}
          <line x1="850" y1="180" x2="850" y2="290" strokeDasharray="4 6" strokeOpacity="0.35" />
          <line x1="1420" y1="180" x2="1390" y2="205" strokeDasharray="2 4" strokeOpacity="0.4" />
          <line x1="520" y1="720" x2="660" y2="910" strokeDasharray="3 5" strokeOpacity="0.3" />
        </g>

        {/* ---------------------------------------------------- */}
        {/* B. 13S8P BATTERY MODULE FOOTPRINT & CELL ARRAY (3D)  */}
        {/* ---------------------------------------------------- */}
        <g 
          className="transition-opacity duration-700" 
          opacity={isLanding ? 0.75 : isCompare ? 0.6 : 0.3}
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
            stroke="#6F4E37" 
            strokeWidth="1.5" 
            strokeDasharray="8 6" 
            strokeOpacity="0.4" 
          />
          <rect 
            x="8" 
            y="8" 
            width="444" 
            height="324" 
            rx="10" 
            fill="rgba(43, 33, 29, 0.12)" 
            stroke="#F47721" 
            strokeWidth="0.8" 
            strokeOpacity="0.25" 
          />

          {/* Module Header Technical Callout */}
          <text x="20" y="32" fill="#F47721" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.85">
            [13S8P VOLTNEXUS CORE] • 46.8V NOM • 1.57 kWh
          </text>
          <text x="20" y="48" fill="#6F4E37" fontSize="8" fontFamily="monospace" opacity="0.7">
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
                      stroke={isHotspot ? '#F47721' : '#E5E4E2'} 
                      strokeWidth="1.2" 
                      strokeOpacity={isHotspot ? 0.7 : 0.28} 
                    />
                    {/* Positive Terminal Cap */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="4.5" 
                      fill={isHotspot ? 'rgba(244, 119, 33, 0.5)' : 'rgba(230, 224, 240, 0.2)'} 
                      stroke={isHotspot ? '#F47721' : '#6F4E37'} 
                      strokeWidth="0.8" 
                    />
                    {/* Interconnect Busbar Tab */}
                    {col < 7 && (
                      <line 
                        x1={cx + 13} 
                        y1={cy} 
                        x2={cx + 37} 
                        y2={cy} 
                        stroke="#F47721" 
                        strokeWidth="1" 
                        strokeOpacity="0.35" 
                      />
                    )}
                  </g>
                );
              })}
            </g>
          ))}

          {/* Downstream Thermal Hotspot Indicator Tag */}
          <rect x="280" y="278" width="160" height="38" rx="6" fill="rgba(244, 119, 33, 0.15)" stroke="#F47721" strokeWidth="0.8" />
          <circle cx="295" cy="297" r="4" fill="#F47721" className="animate-ping" opacity="0.75" />
          <circle cx="295" cy="297" r="3.5" fill="#F47721" />
          <text x="306" y="294" fill="#F5F0EA" fontSize="9" fontFamily="monospace" fontWeight="bold">
            HOTSPOT ZONE
          </text>
          <text x="306" y="306" fill="#F47721" fontSize="8" fontFamily="monospace">
            T_core: 44.1°C (Pass UL 2580)
          </text>
        </g>

        {/* ---------------------------------------------------- */}
        {/* C. ANIMATED HIGH-VOLTAGE ENERGY FLOW PULSES (ORANGE) */}
        {/* ---------------------------------------------------- */}
        <g 
          stroke="#F47721" 
          strokeWidth="2.4" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#glowOrange)"
          className="transition-opacity duration-700"
          opacity={isWorkbench ? 0.42 : isCompare ? 0.65 : 0.88}
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
        {/* D. ANIMATED BMS SENSING & CONTROL FLOWS (ELECTRIC BLUE) */}
        {/* ---------------------------------------------------- */}
        <g 
          stroke="#246BFD" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#glowBlue)"
          className="transition-opacity duration-700"
          opacity={isWorkbench ? 0.38 : isCompare ? 0.6 : 0.82}
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
        {/* Orange High-Voltage Terminal Nodes */}
        <g fill="#F47721">
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
            <g key={`node-orange-${i}`} className="transition-opacity duration-500" opacity={isWorkbench ? 0.45 : 0.9}>
              {/* Outer Radiant Corona */}
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r="9" 
                fill="none" 
                stroke="#F47721" 
                strokeWidth="1.2" 
                className="animate-[nodeGlowOrange_3s_ease-in-out_infinite]"
                style={{ animationDelay: node.delay }}
              />
              {/* Inner Solid Terminal */}
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r="4.5" 
                filter="url(#glowOrange)"
              />
            </g>
          ))}
        </g>

        {/* Electric Blue BMS Sensor Nodes */}
        <g fill="#246BFD">
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
            <g key={`node-blue-${i}`} className="transition-opacity duration-500" opacity={isWorkbench ? 0.4 : 0.85}>
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r="8" 
                fill="none" 
                stroke="#246BFD" 
                strokeWidth="1" 
                className="animate-[nodeGlowBlue_3.2s_ease-in-out_infinite]"
                style={{ animationDelay: node.delay }}
              />
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r="3.8" 
                filter="url(#glowBlue)"
              />
            </g>
          ))}
        </g>

        {/* ---------------------------------------------------- */}
        {/* F. ENGINEERING SCHEMATIC ANNOTATIONS & LABELS        */}
        {/* ---------------------------------------------------- */}
        <g fill="#6F4E37" fontSize="8.5" fontFamily="monospace" letterSpacing="0.8" opacity="0.45">
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
            <path d="M 320 700 L 750 700 L 810 760 L 1350 760" stroke="#3B82F6" opacity="0.6" />
            <text x="320" y="690" fill="#3B82F6" fontSize="9" fontFamily="monospace" fontWeight="bold">
              [PATH 03: OPTION B COLD PLATE LFP] • ULTRA SAFE (+28% MASS)
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
