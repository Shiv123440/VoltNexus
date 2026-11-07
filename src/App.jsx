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
    shortLabel: 'Overview',
    icon: <Layers className="w-4 h-4" />, 
    fx: 'glow' 
  },
  { 
    label: 'Interactive Workbench', 
    shortLabel: 'Workbench',
    icon: <Sliders className="w-4 h-4" />, 
    fx: 'drop' 
  },
  { 
    label: 'Design Trade-offs', 
    shortLabel: 'Trade-offs',
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

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Skip to Main Content Landmark Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Dynamic Battery Energy Flow Background Environment with Parallax Tracking */}
      <BatteryFlowBackground activeTab={activeTab} mouseCoords={mouseCoords} />

      {/* Sticky Opaque Glassmorphic Header (Full-width backdrop prevents text overlap on scroll) */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800/50 shadow-lg shadow-black/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          
          {/* 1. Left Branding: Clean VoltNexus Logo */}
          <div 
            className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              bootStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab('landing')}
              className="relative flex items-center justify-center rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/12 p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:border-cyan-500/40 hover:bg-white/[0.08] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
              aria-label="VoltNexus Home"
            >
              <img 
                src="/voltnexus_logo_transparent.png" 
                alt="VoltNexus Logo" 
                className="h-7 sm:h-8 md:h-9 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.35)]" 
              />
            </button>
          </div>

          {/* 2. Central Liquid Glass Navbar: Compact & Accessible on Mobile */}
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
              compact={false}
              className="border border-white/12 shadow-lg shadow-black/50"
            />
          </div>

          {/* 3. Right Technical Status Capsule: Telemetry Live Indicator */}
          <div 
            className={`hidden md:flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              bootStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/14 shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.10)] transition-all duration-500">
              {/* Segment A: Version Tag */}
              <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">
                <span className="text-[10px] font-mono font-medium text-slate-400 tracking-tight">
                  v1.2
                </span>
              </div>

              {/* Hairline Divider */}
              <div className="hidden sm:block w-[1px] h-3 bg-white/15" />

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

      {/* Main Container with landmark id and ample padding to prevent section clipping */}
      <main id="main-content" className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 pt-6 sm:pt-8">
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

      {/* Clean VoltNexus Footer */}
      <footer className="relative z-10 border-t border-white/10 py-5 px-6 text-center text-xs text-slate-400 font-mono bg-slate-950/80 backdrop-blur-md">
        VoltNexus MBSE Platform • Advanced Battery Simulation Engine • 13S8P 1.57 kWh Baseline
      </footer>
    </div>
  );
}
