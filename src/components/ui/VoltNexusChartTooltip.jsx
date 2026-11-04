import React from 'react';

/**
 * VoltNexusChartTooltip Component
 * 
 * Styled floating tooltip matching dark precision obsidian glassmorphism:
 * - Semi-transparent dark obsidian frosted glass with backdrop-blur-2xl
 * - Rounded pill header displaying the exact x-axis time coordinate
 * - Multi-series indicator dots with glowing ambient shadows
 * - Formatted engineering numerical values with units in crisp high-contrast white
 */
export default function VoltNexusChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3.5 rounded-xl bg-[rgba(10,15,26,0.92)] backdrop-blur-2xl border border-white/16 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] text-xs space-y-2.5 select-none min-w-[160px]">
      {/* Selected X-Axis Pill Badge */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Time Point</span>
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold shadow-inner">
          {label} min
        </span>
      </div>

      {/* Series Values */}
      <div className="space-y-1.5">
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ 
                  backgroundColor: item.color, 
                  boxShadow: `0 0 8px ${item.color}` 
                }} 
              />
              <span className="text-slate-300 font-medium">{item.name}</span>
            </div>
            <span className="font-mono font-bold text-white">
              {item.value} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
