import React, { useState } from 'react';
import LandingView from './components/LandingView';
import WorkbenchView from './components/WorkbenchView';
import CompareView from './components/CompareView';
import { Layers, Sliders, Scale } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen bg-[#EAE6DE] text-[#182836] flex flex-col font-sans selection:bg-[#EF8557]/30 selection:text-[#226192]">
      {/* Top Editorial Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F6F4F0]/90 border-b border-[#D8D2C5] px-4 sm:px-8 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src="/voltnexus_logo_transparent.png" 
            alt="VoltNexus Logo" 
            className="h-9 sm:h-10 object-contain hover:opacity-90 transition-opacity" 
          />
          <div className="hidden sm:block pl-3 border-l border-[#D0C9BA]">
            <span className="text-[10px] font-mono text-[#485E70] block tracking-widest uppercase font-semibold">
              TATA ELXSI TELIPORT S4
            </span>
            <span className="text-[11px] font-bold text-[#226192]">
              Case Study 2 • Reusable MBSE Platform
            </span>
          </div>
        </div>

        {/* Tab Switcher Navigation */}
        <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-[#E2DDD3] border border-[#D0C8B8]">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-[#226192] text-white shadow-sm'
                : 'text-[#485E70] hover:text-[#182836] hover:bg-[#D4CDBC]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Overview & Research
          </button>

          <button
            onClick={() => setActiveTab('workbench')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'workbench'
                ? 'bg-[#226192] text-white shadow-sm'
                : 'text-[#485E70] hover:text-[#182836] hover:bg-[#D4CDBC]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Interactive Workbench
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-[#226192] text-white shadow-sm'
                : 'text-[#485E70] hover:text-[#182836] hover:bg-[#D4CDBC]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            3-Design Trade-offs
          </button>
        </nav>

        {/* Status Pill with Coral Accent */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#226192] bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#D8D2C5] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#EF8557] animate-pulse" />
          <span className="font-semibold">EXPERIMENTAL THEME</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {activeTab === 'landing' && <LandingView onNavigateToWorkbench={() => setActiveTab('workbench')} />}
        {activeTab === 'workbench' && <WorkbenchView />}
        {activeTab === 'compare' && <CompareView />}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#D8D2C5] py-4 px-6 text-center text-xs text-[#5C7285] font-mono bg-[#F2EFEA]">
        VoltNexus MBSE Platform • Warm Ivory, Deep Editorial Blue & Coral Orange Palette • 13S8P 1.57 kWh Baseline
      </footer>
    </div>
  );
}
