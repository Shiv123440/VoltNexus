import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import OverviewView from './components/views/OverviewView';
import WorkbenchView from './components/views/WorkbenchView';
import CadTwinView from './components/views/CadTwinView';
import CompareView from './components/views/CompareView';
import ExportReportModal from './components/modals/ExportReportModal';
import { simulatePack } from './engine/batterySimulator';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const paramTab = new URLSearchParams(window.location.search).get('tab');
      if (paramTab && ['landing', 'workbench', 'cadTwin', 'compare'].includes(paramTab)) {
        return paramTab;
      }
    }
    return 'landing';
  });

  const [isReportOpen, setIsReportOpen] = useState(false);

  // Sync tab with URL history
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Keyboard Navigation: [1], [2], [3], [4]
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if focus is in an input or select
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === '1') handleSelectTab('landing');
      if (e.key === '2') handleSelectTab('workbench');
      if (e.key === '3') handleSelectTab('cadTwin');
      if (e.key === '4') handleSelectTab('compare');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute active simulation for report modal and header status
  const defaultSimulation = useMemo(() => {
    return simulatePack({
      cellId: "molicel_p42a",
      nSeries: 13,
      nParallel: 8,
      interconnectId: "copper_12",
      coolingId: "forced_air",
      bmsAfeAdcErrorMv: 1.5,
      packCurrentA: 70.0,
      ambientTempC: 35.0
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F5F6] text-[#2B2D31] flex flex-col md:flex-row font-sans relative selection:bg-[#FFC93C] selection:text-[#2B2D31] overflow-x-clip">
      
      {/* Skip to Main Landmark for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#FFC93C] focus:text-[#2B2D31] focus:font-semibold focus:rounded-lg shadow-md"
      >
        Skip to main content
      </a>

      {/* Subtle Engineering Millimeter Grid */}
      <div className="fixed inset-0 pointer-events-none vn-cad-grid opacity-50 z-0" />

      {/* Left Vertical Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={handleSelectTab} 
        onOpenReport={() => setIsReportOpen(true)}
        passCount={defaultSimulation.passCount}
        failCount={defaultSimulation.failCount}
      />

      {/* Right Workspace Column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen relative z-10">
        {/* View Content */}
        <main id="main-content" className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-10">
          {activeTab === 'landing' && (
            <OverviewView 
              onNavigateToWorkbench={() => handleSelectTab('workbench')} 
              onNavigateToTwin={() => handleSelectTab('cadTwin')}
            />
          )}
          {activeTab === 'workbench' && (
            <WorkbenchView />
          )}
          {activeTab === 'cadTwin' && (
            <CadTwinView onNavigateToWorkbench={() => handleSelectTab('workbench')} />
          )}
          {activeTab === 'compare' && (
            <CompareView />
          )}
        </main>

        {/* Footer */}
        <Footer onSelectTab={handleSelectTab} />
      </div>

      {/* Export / Verification Report Modal */}
      <ExportReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        results={defaultSimulation}
        parameters={{
          cellId: "Molicel P42A (NMC)",
          nSeries: 13,
          nParallel: 8,
          interconnectId: "1.2mm Copper Busbar",
          coolingId: "Forced Air Duct (3.5 m/s)",
          packCurrentA: 70.0,
          ambientTempC: 35.0
        }}
      />

    </div>
  );
}
