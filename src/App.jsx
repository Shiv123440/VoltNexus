import React, { useState, useEffect, useMemo } from 'react';
import StudioHeader from './components/studio/StudioHeader';
import StudioFooter from './components/studio/StudioFooter';
import ResearchView from './components/views/ResearchView';
import DigitalTwinView from './components/views/DigitalTwinView';
import WorkbenchStudioView from './components/views/WorkbenchStudioView';
import TradeoffBenchmarkView from './components/views/TradeoffBenchmarkView';
import EngineeringReportModal from './components/modals/EngineeringReportModal';
import { simulatePack } from './engine/batterySimulator';
import { DESIGN_PRESETS } from './services/batteryPhysicsService';

const DEFAULT_CONFIG = {
  cellId: "molicel_p42a",
  nSeries: 13,
  nParallel: 8,
  interconnectId: "copper_12",
  coolingId: "forced_air",
  packCurrentA: 70.0,
  ambientTempC: 35.0,
  soh: 0.98,
  bmsAfeAdcErrorMv: 1.5,
  fuseBreakingKa: 3.0
};

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const paramTab = new URLSearchParams(window.location.search).get('tab');
      if (paramTab && ['research', 'digitalTwin', 'workbench', 'benchmark'].includes(paramTab)) {
        return paramTab;
      }
    }
    return 'workbench';
  });

  const [currentConfig, setCurrentConfig] = useState(DEFAULT_CONFIG);
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

  // Keyboard navigation: [1], [2], [3], [4]
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.key === '1') handleSelectTab('research');
      if (e.key === '2') handleSelectTab('digitalTwin');
      if (e.key === '3') handleSelectTab('workbench');
      if (e.key === '4') handleSelectTab('benchmark');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Preset Applicator
  const handleApplyPreset = (presetKey) => {
    if (DESIGN_PRESETS[presetKey]) {
      const p = DESIGN_PRESETS[presetKey].config;
      setCurrentConfig((prev) => ({
        ...prev,
        ...p,
        fuseBreakingKa: (p.interconnectId === 'copper_12' || p.interconnectId === 'copper_20') ? 3.0 : 2.0
      }));
    }
  };

  // Generic Parameter Update
  const handleUpdateConfig = (updater) => {
    setCurrentConfig((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  };

  // Real-Time Electro-Thermal Simulation
  const activeSimulation = useMemo(() => {
    return simulatePack(currentConfig);
  }, [currentConfig]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Skip to Main Landmark for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-bold focus:rounded-lg shadow-xl"
      >
        Skip to main content
      </a>

      {/* Main Studio Command Header */}
      <StudioHeader 
        activeTab={activeTab} 
        onSelectTab={handleSelectTab} 
        onOpenReport={() => setIsReportOpen(true)}
        onApplyPreset={handleApplyPreset}
        passCount={activeSimulation.passCount}
        failCount={activeSimulation.failCount}
      />

      {/* Active Workspace View */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'research' && (
          <ResearchView 
            onNavigateToWorkbench={() => handleSelectTab('workbench')} 
            onNavigateToTwin={() => handleSelectTab('digitalTwin')} 
          />
        )}
        {activeTab === 'digitalTwin' && (
          <DigitalTwinView 
            nSeries={currentConfig.nSeries}
            nParallel={currentConfig.nParallel}
            ambientTempC={currentConfig.ambientTempC}
            maxCoreTempC={activeSimulation.maxCoreTempC}
            tempSpreadC={activeSimulation.tempSpreadC}
            interconnectId={currentConfig.interconnectId}
            coolingId={currentConfig.coolingId}
            packCurrentA={currentConfig.packCurrentA}
          />
        )}
        {activeTab === 'workbench' && (
          <WorkbenchStudioView 
            currentConfig={currentConfig}
            onUpdateConfig={handleUpdateConfig}
            onApplyPreset={handleApplyPreset}
          />
        )}
        {activeTab === 'benchmark' && (
          <TradeoffBenchmarkView />
        )}
      </main>

      {/* Engineering Studio Footer */}
      <StudioFooter />

      {/* Verification & Certification Report Modal */}
      <EngineeringReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        results={activeSimulation}
        parameters={currentConfig}
      />

    </div>
  );
}
