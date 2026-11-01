import React from 'react';

/**
 * VoltNexusChartTooltip Component
 * 
 * Styled floating tooltip matching light warm-ivory frosted glassmorphism:
 * - Semi-transparent white/ivory frosted glass with backdrop-blur-2xl
 * - Rounded pill header displaying the exact x-axis time coordinate
 * - Multi-series indicator dots with glowing ambient shadows
 * - Formatted engineering numerical values with units in crisp dark contrast
 */
export default function VoltNexusChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3.5 rounded-xl bg-[rgba(255,255,255,0.88)] backdrop-blur-2xl border border-white/90 shadow-[0_12px_32px_rgba(70,42,20,0.12),inset_0_1px_0_rgba(255,255,255,1)] text-xs space-y-2.5 select-none min-w-[160px]">
      {/* Selected X-Axis Pill Badge */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5 gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Time Point</span>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-[10px] font-mono text-amber-900 font-bold shadow-inner">
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
                  boxShadow: `0 0 6px ${item.color}` 
                }} 
              />
              <span className="text-slate-600 font-medium">{item.name}</span>
            </div>
            <span className="font-mono font-bold text-slate-900">
              {item.value} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
