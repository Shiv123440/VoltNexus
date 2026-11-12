import React from 'react';

export default function Footer({ onSelectTab: _onSelectTab }) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#232529] pt-9 pb-8 text-xs text-[#D9DADC]/75 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-1">
            <div className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
              <span>VOLTNEXUS</span>
              <span className="text-[10px] font-mono text-[#2B2D31] bg-[#FFC93C] px-1.5 py-0.5 rounded font-bold">
                v2.0
              </span>
            </div>
            <p className="text-xs text-[#D9DADC]/65 leading-relaxed">
              Model-Based Systems Engineering (MBSE) Platform for high-voltage battery modules. Virtually detects cross-subsystem interface failures in sub-second runtime.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Verified Standards
            </h4>
            <ul className="space-y-1 font-mono text-[11px] text-[#D9DADC]/70">
              <li>• IEC 60364-5-54 (Adiabatic Limit)</li>
              <li>• UL 2580 (Short-Circuit Breaking)</li>
              <li>• AIS-156 Amendment 3 (Thermal Runaway)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Literature Models
            </h4>
            <ul className="space-y-1 text-[11px] text-[#D9DADC]/70">
              <li>• Cloos &amp; Wetzel (2025) Thermal Gradients</li>
              <li>• Bruen &amp; Marco (2016) Parallel Divergence</li>
              <li>• Zhou et al. (2017) Series Bottleneck</li>
              <li>• Pan et al. (2020) Coupled 1-RC ECM</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Quick Shortcuts
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-[#D9DADC]">
              <span className="px-2 py-1 rounded-md bg-[#2B2D31] border border-white/10">
                Key [1]: Overview
              </span>
              <span className="px-2 py-1 rounded-md bg-[#2B2D31] border border-white/10">
                Key [2]: Workbench
              </span>
              <span className="px-2 py-1 rounded-md bg-[#2B2D31] border border-white/10">
                Key [3]: 3D CAD Twin
              </span>
              <span className="px-2 py-1 rounded-md bg-[#2B2D31] border border-white/10">
                Key [4]: Trade-Offs
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#D9DADC]/50 font-mono">
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
