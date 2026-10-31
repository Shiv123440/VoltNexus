import React from 'react';

/**
 * VoltNexusChartTooltip Component
 * 
 * Styled floating tooltip matching Image 1:
 * - Dark translucent glass aesthetic with subtle border blur
 * - Rounded pill header displaying the exact x-axis time coordinate
 * - Multi-series indicator dots with glowing ambient shadows
 * - Formatted engineering numerical values with units
 */
export default function VoltNexusChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3 rounded-xl bg-[#0b0f15]/95 backdrop-blur-xl border border-slate-700/60 shadow-[0_12px_28px_rgba(0,0,0,0.65)] text-xs space-y-2 select-none min-w-[155px]">
      {/* Selected X-Axis Pill Badge */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Time Point</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700/60 text-[10px] font-mono text-amber-300 font-semibold shadow-inner">
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
