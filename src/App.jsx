import React, { useState } from 'react';
import LandingView from './components/LandingView';
import WorkbenchView from './components/WorkbenchView';
import CompareView from './components/CompareView';
import BatteryFlowBackground from './components/BatteryFlowBackground';
import { Layers, Sliders, Scale } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

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

        {/* Tab Switcher Navigation */}
        <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14191f] border border-[#232c37]">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-[#ea580c] text-white font-bold shadow-md shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2027]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Overview & Research
          </button>

          <button
            onClick={() => setActiveTab('workbench')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'workbench'
                ? 'bg-[#ea580c] text-white font-bold shadow-md shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2027]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Interactive Workbench
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-[#ea580c] text-white font-bold shadow-md shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2027]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            3-Design Trade-offs
          </button>
        </nav>

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
