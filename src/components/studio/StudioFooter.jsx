import React from 'react';

export default function StudioFooter() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-16 pt-10 pb-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-2 md:col-span-1">
            <div className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5 font-sans">
              <span>VOLTNEXUS STUDIO</span>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-bold">
                ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Model-Based Systems Engineering (MBSE) Platform for high-voltage battery modules. Virtually detects cross-subsystem interface defects across electrical, thermal, protection, sensing, and control boundaries.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Compliance Standards
            </h4>
            <ul className="space-y-1 font-mono text-[11px] text-slate-600">
              <li>• IEC 60364-5-54 (Busbar Adiabatic Limit)</li>
              <li>• UL 2580 (Short-Circuit Breaking Capacity)</li>
              <li>• AIS-156 Amendment 3 (Thermal Protection)</li>
              <li>• SAE J2464 (Electric Vehicle Safety)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Literature Foundations
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-600">
              <li>• Cloos & Wetzel (2025) Thermal Gradients</li>
              <li>• Bruen & Marco (2016) Parallel Imbalance</li>
              <li>• Zhou et al. (2017) Series Bottleneck</li>
              <li>• Pan et al. (2020) Coupled 1-RC ECM</li>
              <li>• Chang et al. (2023) Monte Carlo Spread</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10.5px]">
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">[1] Research</span>
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">[2] CAD Twin</span>
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">[3] Simulator</span>
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">[4] Trade-Offs</span>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div>
            VoltNexus MBSE Battery Platform • Tata Elxsi TELIPORT Season 4 (Case Study 2)
          </div>
          <div className="flex items-center gap-4">
            <span>Branch: frontend-rebuild / main</span>
            <span className="text-emerald-700 font-semibold">● Engine Status: 100% Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
