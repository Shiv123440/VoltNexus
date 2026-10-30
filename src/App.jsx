import React, { useState } from 'react';
import LandingView from './components/LandingView';
import WorkbenchView from './components/WorkbenchView';
import CompareView from './components/CompareView';
import BatteryFlowBackground from './components/BatteryFlowBackground';
import { LiquidNavbar } from '@/components/ui/liquid-glass-navbar';
import { Layers, Sliders, Scale } from 'lucide-react';
import { useSystemBoot, useMouseParallax } from './components/ui/useCinematicMotion';

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

  // Cinematic Initial Page Load & Mouse Parallax System
  const bootStage = useSystemBoot(500);
  const mouseCoords = useMouseParallax(1);

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Dynamic Battery Energy Flow Background Environment with Parallax Tracking */}
      <BatteryFlowBackground activeTab={activeTab} mouseCoords={mouseCoords} />

      {/* Top Integrated Engineering Control Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0e1217]/95 border-b border-[#232c37] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5),0_1px_0_0_rgba(245,240,234,0.06)] px-4 sm:px-6 md:px-8 py-2 flex items-center justify-between overflow-hidden">
        {/* 1. Left Refined Branding Area: Enters from left on bootStage >= 1 */}
        <div 
          className={`flex items-center gap-3.5 group transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            bootStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
          }`}
        >
          <div className="relative flex items-center justify-center p-1 rounded-xl bg-gradient-to-b from-[#182029]/80 to-[#10141a]/90 border border-[#2b3848]/60 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <img 
              src="/voltnexus_logo_transparent.png" 
              alt="VoltNexus Logo" 
              className="h-9 sm:h-10 md:h-10.5 w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(244,119,33,0.22)] transition-transform duration-300 group-hover:scale-102" 
            />
          </div>

          <div className="hidden sm:flex flex-col justify-center pl-3 border-l border-orange-500/35 relative">
            {/* Subtle technical accent tick on the separator */}
            <span className="absolute -left-[2px] top-1/2 -translate-y-1/2 w-[3px] h-3 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full shadow-[0_0_6px_rgba(244,119,33,0.6)]" />
            
            <div className="flex items-center gap-1.5">
              <span className="text-[9.5px] font-mono tracking-[0.16em] uppercase text-slate-400 font-semibold leading-tight">
                TATA ELXSI TELIPORT S4
              </span>
              <span className="text-[9px] font-mono text-orange-400/90 font-bold px-1 py-[1px] rounded bg-orange-950/40 border border-orange-500/25">
                IDV-CS2
              </span>
            </div>
            
            <span className="text-[11.5px] font-medium tracking-tight text-slate-200 leading-snug">
              Case Study 2 <span className="text-slate-500 mx-0.5">•</span> <span className="text-slate-300 font-semibold">MBSE Battery Platform</span>
            </span>
          </div>
        </div>

        {/* 2. Central Liquid Glass Navbar: Expands horizontally from center on bootStage >= 1 */}
        <div 
          className={`flex items-center justify-center px-2 transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-center ${
            bootStage >= 1 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 pointer-events-none'
          }`}
        >
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

        {/* 3. Right Technical Status Capsule: Enters from right on bootStage >= 1 */}
        <div 
          className={`flex items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            bootStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#12171e]/85 backdrop-blur-md border border-[#2b3746]/70 shadow-[0_2px_12px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.06)]">
            {/* Segment A: Version Tag */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
              <span className="text-[10px] font-mono font-medium text-slate-400 tracking-tight">
                v1.2
              </span>
            </div>

            {/* Hairline Divider */}
            <div className="w-[1px] h-3 bg-[#2b3746]" />

            {/* Segment B: Live Telemetry Indicator with Restrained Breathing Glow */}
            <div className="flex items-center gap-1.5 pr-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 duration-1000" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              </span>
              <span className="text-[10.5px] font-mono font-semibold tracking-wider text-emerald-400 uppercase">
                LIVE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {activeTab === 'landing' && (
          <LandingView 
            onNavigateToWorkbench={() => setActiveTab('workbench')} 
            bootStage={bootStage}
            mouseCoords={mouseCoords}
          />
        )}
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
