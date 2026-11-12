import React from 'react';

export default function Footer({ onSelectTab: _onSelectTab }) {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#07090E]/95 backdrop-blur-md pt-10 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-1">
            <div className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
              <span>VOLTNEXUS</span>
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-400/30 px-1.5 py-0.2 rounded">v2.0</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Model-Based Systems Engineering (MBSE) Platform for high-voltage battery modules. Virtually detects cross-subsystem interface failures in sub-second runtime.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Verified Standards</h4>
            <ul className="space-y-1 font-mono text-[11px] text-slate-400">
              <li>• IEC 60364-5-54 (Adiabatic Limit)</li>
              <li>• UL 2580 (Short-Circuit Breaking)</li>
              <li>• AIS-156 Amendment 3 (Thermal Runaway)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Literature Models</h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Cloos & Wetzel (2025) Thermal Gradients</li>
              <li>• Bruen & Marco (2016) Parallel Divergence</li>
              <li>• Zhou et al. (2017) Series Bottleneck</li>
              <li>• Pan et al. (2020) Coupled 1-RC ECM</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Quick Shortcuts</h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Key [1]: Overview</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Key [2]: Workbench</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Key [3]: 3D CAD Twin</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Key [4]: Trade-Offs</span>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div>
            VoltNexus MBSE Battery Digital Twin • Tata Elxsi TELIPORT S4 Case Study 2 Submission Baseline
          </div>
          <div className="flex items-center gap-4">
            <span>Branch: experimental / main</span>
            <span>Status: Verified 13 Rules Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
