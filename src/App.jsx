import React, { useState } from 'react';
import LandingView from './components/LandingView';
import WorkbenchView from './components/WorkbenchView';
import CompareView from './components/CompareView';
import BatteryFlowBackground from './components/BatteryFlowBackground';
import { LiquidNavbar } from '@/components/ui/liquid-glass-navbar';
import { Layers, Sliders, Scale } from 'lucide-react';

const NAV_ITEMS = [
  { 
    label: 'Overview & Research', 
    icon: <Layers className="w-4 h-4" />, 
    fx: 'glow' 
  },
  { 
    label: 'Interactive Workbench', 
    icon: <Sliders className="w-4 h-4" />, 
    fx: 'drop' 
  },
  { 
    label: '3-Design Trade-offs', 
    icon: <Scale className="w-4 h-4" />, 
    fx: 'wave' 
  },
];

const TAB_INDEX_MAP = {
  landing: 0,
  workbench: 1,
  compare: 2,
};

const INDEX_TAB_MAP = ['landing', 'workbench', 'compare'];

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const activeIndex = TAB_INDEX_MAP[activeTab] ?? 0;

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Dynamic Battery Energy Flow Background Environment */}
      <BatteryFlowBackground activeTab={activeTab} />

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f1317]/90 border-b border-[#232c37] px-4 sm:px-8 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <img 
            src="/voltnexus_logo_transparent.png" 
            alt="VoltNexus Logo" 
            className="h-9 sm:h-10 object-contain hover:opacity-95 transition-opacity" 
          />
          <div className="hidden sm:block pl-2 border-l border-[#263342]">
            <span className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase">
              TATA ELXSI TELIPORT S4
            </span>
            <span className="text-[11px] font-bold text-slate-300">
              IDV Case Study 2 • MBSE Platform
            </span>
          </div>
        </div>

        {/* Liquid Glass Navbar (Nimbus Waterline) */}
        <div className="flex items-center justify-center">
          <LiquidNavbar
            items={NAV_ITEMS}
            active={activeIndex}
            onChange={(idx) => {
              const tab = INDEX_TAB_MAP[idx];
              if (tab) setActiveTab(tab);
            }}
            tone="dark"
            className="border border-[#263445]/60 shadow-lg shadow-black/40"
          />
        </div>

        {/* Status Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#14191f] px-3 py-1.5 rounded-lg border border-[#232c37]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>v1.2 LIVE</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {activeTab === 'landing' && <LandingView onNavigateToWorkbench={() => setActiveTab('workbench')} />}
        {activeTab === 'workbench' && <WorkbenchView />}
        {activeTab === 'compare' && <CompareView />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#232c37]/60 py-4 px-6 text-center text-xs text-slate-400 font-mono bg-[#0f1317]/70 backdrop-blur-sm">
        VoltNexus MBSE Platform • Tata Elxsi TELIPORT Season 4 Hackathon • 13S8P 1.57 kWh Baseline
      </footer>
    </div>
  );
}
