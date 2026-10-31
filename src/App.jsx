import React, { useState } from 'react';
import LandingView from './components/LandingView';
import WorkbenchView from './components/WorkbenchView';
import CompareView from './components/CompareView';
import BatteryFlowBackground from './components/BatteryFlowBackground';
import { LiquidNavbar } from '@/components/ui/liquid-glass-navbar';
import { Layers, Sliders, Scale } from 'lucide-react';
import { useSystemBoot, useMouseParallax, useScrollThreshold } from './components/ui/useCinematicMotion';

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
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const paramTab = new URLSearchParams(window.location.search).get('tab');
      if (paramTab && ['landing', 'workbench', 'compare'].includes(paramTab)) {
        return paramTab;
      }
    }
    return 'landing';
  });
  const activeIndex = TAB_INDEX_MAP[activeTab] ?? 0;

  // Cinematic Initial Page Load & Mouse Parallax System
  const bootStage = useSystemBoot(500);
  const mouseCoords = useMouseParallax(1);
  const isScrolled = useScrollThreshold(55, 20);

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Dynamic Battery Energy Flow Background Environment with Parallax Tracking */}
      <BatteryFlowBackground activeTab={activeTab} mouseCoords={mouseCoords} />

      {/* Top Integrated Engineering Control Header with SwiftPieces Scroll Transformation */}
      <header 
        className={`sticky top-0 z-50 w-full pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? 'pt-2 sm:pt-3.5 px-2 sm:px-6 md:px-8' 
            : 'pt-0 px-0'
        }`}
      >
        <div 
          className={`pointer-events-auto mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? 'w-full max-w-[1120px] rounded-full bg-[#0c1015]/85 backdrop-blur-2xl border border-[#2b394b]/80 shadow-[0_16px_38px_rgba(0,0,0,0.65),0_1px_0_rgba(255,255,255,0.08)] px-2 sm:px-5 py-1 sm:py-1.5'
              : 'w-full max-w-full rounded-none bg-[#0e1217]/95 backdrop-blur-xl border border-b-[#232c37] border-t-transparent border-x-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5),0_1px_0_0_rgba(245,240,234,0.06)] px-4 sm:px-6 md:px-8 py-2'
          }`}
        >
          {/* 1. Left Refined Branding Area: Enters from left on bootStage >= 1, glides inward on scroll */}
          <div 
            className={`flex items-center group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              bootStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
            } ${isScrolled ? 'gap-0' : 'gap-3.5'}`}
          >
            <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-b from-[#182029]/80 to-[#10141a]/90 border border-[#2b3848]/60 shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-500 ${
              isScrolled ? 'p-0.5 sm:p-1' : 'p-1'
            }`}>
              <img 
                src="/voltnexus_logo_transparent.png" 
                alt="VoltNexus Logo" 
                className={`w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(244,119,33,0.22)] transition-all duration-500 group-hover:scale-102 ${
                  isScrolled ? 'h-6 sm:h-7.5 md:h-8.5' : 'h-8 sm:h-9 md:h-10.5'
                }`} 
              />
            </div>

            <div 
              aria-hidden={isScrolled}
              className={`hidden sm:flex flex-col justify-center relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isScrolled 
                  ? 'max-w-0 opacity-0 pl-0 border-l border-transparent pointer-events-none select-none' 
                  : 'max-w-[320px] opacity-100 pl-3 border-l border-orange-500/35 pointer-events-auto'
              }`}
            >
              {/* Subtle technical accent tick on the separator */}
              <span 
                className={`absolute -left-[2px] top-1/2 -translate-y-1/2 w-[3px] h-3 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full shadow-[0_0_6px_rgba(244,119,33,0.6)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`} 
              />
              
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[9.5px] font-mono tracking-[0.16em] uppercase text-slate-400 font-semibold leading-tight">
                  TATA ELXSI TELIPORT S4
                </span>
                <span className="text-[9px] font-mono text-orange-400/90 font-bold px-1 py-[1px] rounded bg-orange-950/40 border border-orange-500/25">
                  IDV-CS2
                </span>
              </div>
              
              <span className="text-[11.5px] font-medium tracking-tight text-slate-200 leading-snug whitespace-nowrap">
                Case Study 2 <span className="text-slate-500 mx-0.5">•</span> <span className="text-slate-300 font-semibold">MBSE Battery Platform</span>
              </span>
            </div>
          </div>

          {/* 2. Central Liquid Glass Navbar: Stays centered with liquid-glass animations intact */}
          <div 
            className={`flex items-center justify-center px-1 sm:px-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
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

          {/* 3. Right Technical Status Capsule: Glides inward on scroll, live breathing dot */}
          <div 
            className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              bootStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-[#12171e]/85 backdrop-blur-md border border-[#2b3746]/70 shadow-[0_2px_12px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all duration-500">
              {/* Segment A: Version Tag (hidden on extra small screens to maintain flawless proportion) */}
              <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                <span className="text-[10px] font-mono font-medium text-slate-400 tracking-tight">
                  v1.2
                </span>
              </div>

              {/* Hairline Divider */}
              <div className="hidden sm:block w-[1px] h-3 bg-[#2b3746]" />

              {/* Segment B: Live Telemetry Indicator with Restrained Breathing Glow */}
              <div className="flex items-center gap-1.5 pr-0.5 sm:pr-1">
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
