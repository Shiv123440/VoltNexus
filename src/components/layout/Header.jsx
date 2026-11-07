import React from 'react';
import { 
  Layers, 
  Sliders, 
  Scale, 
  FileDown, 
  Zap
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  onSelectTab, 
  onOpenReport,
  failCount = 0
}) {
  const tabs = [
    { id: 'landing', label: 'Overview & Twin', icon: Layers, keyHint: '1' },
    { id: 'workbench', label: 'Interactive Workbench', icon: Sliders, keyHint: '2' },
    { id: 'compare', label: 'Design Trade-Offs', icon: Scale, keyHint: '3' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07090E]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="VoltNexus Home"
          >
            <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Zap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white font-sans">
                  VOLT<span className="text-cyan-400">NEXUS</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-cyan-300 border border-white/10 font-bold">
                  MBSE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 -mt-0.5 tracking-tight">
                Battery Digital Twin Studio
              </span>
            </div>
          </button>
        </div>

        {/* Center Mechanical Navigation Segment */}
        <nav 
          className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-white/10 shadow-inner"
          role="tablist"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,229,255,0.25)] font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === 'landing' ? 'Overview' : (tab.id === 'workbench' ? 'Workbench' : 'Compare')}</span>
                <kbd className="hidden md:inline-block text-[9px] font-mono opacity-50 px-1 rounded bg-black/40 border border-white/10">
                  {tab.keyHint}
                </kbd>
              </button>
            );
          })}
        </nav>

        {/* Right Action & Status Capsule */}
        <div className="flex items-center gap-2.5">
          {/* Compliance Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${failCount > 0 ? 'bg-rose-400' : 'bg-emerald-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${failCount > 0 ? 'bg-rose-400' : 'bg-emerald-400'}`} />
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              {failCount > 0 ? `${failCount} CONFLICTS` : 'ALL 13 PASS'}
            </span>
          </div>

          {/* Verification Report Trigger */}
          <button
            type="button"
            onClick={onOpenReport}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(0,229,255,0.3)] active:scale-95"
            aria-label="Export Engineering Verification Report"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
