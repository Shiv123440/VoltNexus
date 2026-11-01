import React from 'react';

/**
 * VoltNexusChartTooltip Component
 * 
 * Styled floating tooltip matching futuristic frosted glassmorphism:
 * - Semi-transparent dark frosted glass aesthetic with backdrop-blur-2xl
 * - Rounded pill header displaying the exact x-axis time coordinate
 * - Multi-series indicator dots with glowing ambient shadows
 * - Formatted engineering numerical values with units
 */
export default function VoltNexusChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3.5 rounded-xl bg-[rgba(14,19,27,0.78)] backdrop-blur-2xl border border-white/12 shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] text-xs space-y-2.5 select-none min-w-[160px]">
      {/* Selected X-Axis Pill Badge */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">Time Point</span>
        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono text-amber-300 font-semibold shadow-inner">
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
            <span className="font-mono font-bold text-slate-100">
              {item.value} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
