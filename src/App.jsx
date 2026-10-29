import React, { useState } from 'react';
import LandingView from './components/LandingView';
import WorkbenchView from './components/WorkbenchView';
import CompareView from './components/CompareView';
import LiquidNavbar from './components/LiquidNavbar';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen bg-[#0c0f12] text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f1317]/90 border-b border-[#232c37] px-4 sm:px-8 py-2.5 flex items-center justify-between">
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

        {/* Liquid-Morphing Tab Switcher Navigation */}
        <LiquidNavbar activeTab={activeTab} onChange={setActiveTab} />

        {/* Status Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#14191f] px-3 py-1.5 rounded-lg border border-[#232c37]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>v1.2 LIVE</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {activeTab === 'landing' && <LandingView onNavigateToWorkbench={() => setActiveTab('workbench')} />}
        {activeTab === 'workbench' && <WorkbenchView />}
        {activeTab === 'compare' && <CompareView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2631] py-4 px-6 text-center text-xs text-slate-500 font-mono">
        VoltNexus MBSE Platform • Tata Elxsi TELIPORT Season 4 Hackathon • 13S8P 1.57 kWh Baseline
      </footer>
    </div>
  );
}
