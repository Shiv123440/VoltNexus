import React from 'react';
import { 
  Zap, 
  FileText, 
  Sliders, 
  Scale, 
  Layers, 
  Printer
} from 'lucide-react';

export default function StudioHeader({ 
  activeTab, 
  onSelectTab, 
  onOpenReport,
  onApplyPreset,
  _passCount = 13,
  failCount = 0
}) {
  const navTabs = [
    { id: 'research', label: '1. Research & Foundations', icon: FileText, shortcut: '1' },
    { id: 'digitalTwin', label: '2. CAD & Digital Twin', icon: Layers, shortcut: '2' },
    { id: 'workbench', label: '3. Parametric Simulator', icon: Sliders, shortcut: '3' },
    { id: 'benchmark', label: '4. Trade-Off Benchmark', icon: Scale, shortcut: '4' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility & Spec Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            VOLTNEXUS™ MBSE STUDIO
          </span>
          <span className="text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Model: Thevenin 1-RC ECM (Arrhenius) • Cloos-Wetzel Convective Gradient
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">Baseline: 13S8P NMC • 46.8V • 1.57 kWh</span>
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
              failCount === 0 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}>
              {failCount === 0 ? '✓ ALL 13 RULES PASS' : `⚠ ${failCount} RULE VIOLATIONS`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Platform Identity */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => onSelectTab('research')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 font-sans">
                  VOLTNEXUS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                  v2.0 MBSE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 font-medium">
                Battery Module Design & Multi-Physics Twin
              </p>
            </div>
          </button>
        </div>

        {/* 4 Workspace Segment Tabs */}
        <nav className="hidden lg:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <kbd className="text-[9px] font-mono opacity-50 px-1 rounded bg-slate-100 border border-slate-200">
                  {tab.shortcut}
                </kbd>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions & Export Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Quick Presets Dropdown / Buttons */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => onApplyPreset('baseline')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-[11px]"
              title="Apply Baseline (Passive Air NMC)"
            >
              Baseline
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('optionA')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer text-[11px] font-bold"
              title="Apply Option A (Forced Duct NMC)"
            >
              Option A
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('optionB')}
              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer text-[11px] font-bold"
              title="Apply Option B (Cold Plate LFP)"
            >
              Option B
            </button>
          </div>

          {/* Export Report Trigger */}
          <button
            type="button"
            onClick={onOpenReport}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Verification Report</span>
          </button>
        </div>

      </div>

      {/* Mobile Workspace Tabs (Visible on small screens) */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50 px-2 py-1.5 overflow-x-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
                isActive ? 'bg-white text-blue-600 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label.split('. ')[1]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
