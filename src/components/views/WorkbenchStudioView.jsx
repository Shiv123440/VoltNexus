import React, { useState, useMemo } from 'react';
import { 
  simulatePack, 
  CELL_PRESETS, 
  INTERCONNECT_PRESETS, 
  COOLING_PRESETS 
} from '../../engine/batterySimulator';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine 
} from 'recharts';
import { 
  Sliders, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  RotateCcw, 
  Search, 
  Wrench,
  CheckCircle
} from 'lucide-react';

export default function WorkbenchStudioView({ 
  currentConfig, 
  onUpdateConfig, 
  onApplyPreset 
}) {
  const {
    cellId,
    nSeries,
    nParallel,
    interconnectId,
    coolingId,
    packCurrentA,
    ambientTempC,
    soh,
    bmsAfeAdcErrorMv
  } = currentConfig;

  // Search & Filter for Rules Engine
  const [ruleFilter, setRuleFilter] = useState('ALL'); // 'ALL' | 'FAILS' | 'ELECTRICAL' | 'THERMAL' | 'PROTECTION' | 'SENSING'
  const [searchQuery, setSearchQuery] = useState('');

  // Run Real-Time Coupled Simulation
  const results = useMemo(() => {
    return simulatePack({
      cellId,
      nSeries,
      nParallel,
      interconnectId,
      coolingId,
      ambientTempC,
      packCurrentA,
      soh,
      bmsAfeAdcErrorMv,
      // For low-impedance copper busbars, set breaking capacity appropriately to demonstrate coordinated protection
      fuseBreakingKa: interconnectId === 'copper_12' ? 3.0 : 2.0
    });
  }, [cellId, nSeries, nParallel, interconnectId, coolingId, ambientTempC, packCurrentA, soh, bmsAfeAdcErrorMv]);

  // 1-Click Auto Remediation Handler
  const handleAutoRemediate = (ruleId) => {
    if (ruleId === 'R02' || ruleId === 'R05') {
      onUpdateConfig({ coolingId: coolingId === 'natural_air' ? 'forced_air' : 'cold_plate' });
    } else if (ruleId === 'R04' || ruleId === 'R06') {
      onUpdateConfig({ interconnectId: 'copper_12' });
    } else if (ruleId === 'R10') {
      onUpdateConfig({ bmsAfeAdcErrorMv: 1.5 });
    } else if (ruleId === 'R13') {
      if (nParallel > 4) onUpdateConfig({ nParallel: nParallel - 1 });
    }
  };

  // Filtered Rules List
  const filteredRules = useMemo(() => {
    return results.rules.filter((rule) => {
      if (ruleFilter === 'FAILS' && rule.status === 'PASS') return false;
      if (ruleFilter === 'ELECTRICAL' && !rule.subsystems.includes('Electrical')) return false;
      if (ruleFilter === 'THERMAL' && !rule.subsystems.includes('Thermal')) return false;
      if (ruleFilter === 'PROTECTION' && !rule.subsystems.includes('Protection')) return false;
      if (ruleFilter === 'SENSING' && !rule.subsystems.includes('Sensing') && !rule.subsystems.includes('Control')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rule.id.toLowerCase().includes(q) ||
          rule.name.toLowerCase().includes(q) ||
          rule.subsystems.toLowerCase().includes(q) ||
          rule.remediation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [results.rules, ruleFilter, searchQuery]);

  return (
    <div className="space-y-6 py-4">
      
      {/* 1. Top Controls Banner & Live Compliance Bar */}
      <div className="vn-panel p-4 bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        
        {/* Preset Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mr-1">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => onApplyPreset('baseline')}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
          >
            Baseline (Passive Air)
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('optionA')}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold vn-badge-pass hover:brightness-95 transition-colors cursor-pointer"
          >
            Option A (Forced Duct NMC)
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('optionB')}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold vn-badge-blue hover:brightness-95 transition-colors cursor-pointer"
          >
            Option B (Cold Plate LFP)
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('baseline')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset to Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status Counter Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="vn-badge-pass px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{results.passCount} PASS</span>
          </span>
          <span className="vn-badge-warn px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{results.warnCount} WARN</span>
          </span>
          <span className="vn-badge-fail px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>{results.failCount} FAIL</span>
          </span>
        </div>

      </div>

      {/* 2. Studio Split Layout: Controls Console (Left 4 Cols) + Live Telemetry (Right 8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: SUBSYSTEM CONFIGURATION & TACTICAL SLIDERS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="vn-panel p-6 bg-white border border-slate-200 space-y-5">
            
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Subsystem Parameter Controls</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                1-RC ECM
              </span>
            </div>

            {/* A. Cell Chemistry Specification */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Primary Cell Specification
              </label>
              <select
                value={cellId}
                onChange={(e) => onUpdateConfig({ cellId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {Object.values(CELL_PRESETS).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.chemistry}, {c.ratedCapacityAh}Ah)
                  </option>
                ))}
              </select>
              <div className="flex justify-between text-[10.5px] font-mono text-slate-500 px-1">
                <span>DCIR: {CELL_PRESETS[cellId]?.r0RefMOhm} mΩ</span>
                <span>Max: {CELL_PRESETS[cellId]?.maxContCurrent}A Cont</span>
              </div>
            </div>

            {/* B. Topology Series (Ns) & Parallel (Np) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Series (Ns)</label>
                <input
                  type="number"
                  min="4"
                  max="24"
                  value={nSeries}
                  onChange={(e) => onUpdateConfig({ nSeries: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Parallel (Np)</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={nParallel}
                  onChange={(e) => onUpdateConfig({ nParallel: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
            <div className="text-[10.5px] font-mono text-slate-500 -mt-2 px-1">
              Array Layout: <span className="font-bold text-slate-800">{nSeries * nParallel} Cells</span> ({nSeries}S{nParallel}P)
            </div>

            {/* C. Interconnect / Busbar Hardware */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Interconnect & Busbar Hardware
              </label>
              <select
                value={interconnectId}
                onChange={(e) => onUpdateConfig({ interconnectId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {Object.values(INTERCONNECT_PRESETS).map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <div className="text-[10.5px] font-mono text-slate-500 px-1">
                Leg R: {INTERCONNECT_PRESETS[interconnectId]?.rLegMOhm} mΩ • k-Factor: {INTERCONNECT_PRESETS[interconnectId]?.kFactor}
              </div>
            </div>

            {/* D. Thermal Cooling Mechanism */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Thermal Management Method
              </label>
              <select
                value={coolingId}
                onChange={(e) => onUpdateConfig({ coolingId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {Object.values(COOLING_PRESETS).map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} (h={cl.hConv} W/m²K)
                  </option>
                ))}
              </select>
            </div>

            {/* E. Tactical Operating Condition Sliders */}
            <div className="space-y-4 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                Operating Conditions
              </h4>

              {/* Slider 1: Pack Current */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">Discharge Current:</span>
                  <span className="font-mono text-blue-700 font-bold">{packCurrentA} A</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={packCurrentA}
                  onChange={(e) => onUpdateConfig({ packCurrentA: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>20A (Idle)</span>
                  <span>70A (Cruise)</span>
                  <span>120A (Peak)</span>
                </div>
              </div>

              {/* Slider 2: Ambient Temperature */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">Ambient Temperature:</span>
                  <span className="font-mono text-amber-600 font-bold">{ambientTempC} °C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => onUpdateConfig({ ambientTempC: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>15°C (Cool)</span>
                  <span>35°C (Standard)</span>
                  <span>50°C (Harsh)</span>
                </div>
              </div>

              {/* Slider 3: SOH Aging */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">State of Health (SOH):</span>
                  <span className="font-mono text-rose-600 font-bold">{(soh * 100).toFixed(0)}% SOH</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.0"
                  step="0.05"
                  value={soh}
                  onChange={(e) => onUpdateConfig({ soh: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>75% (EOL)</span>
                  <span>100% (Fresh)</span>
                </div>
              </div>

              {/* Slider 4: BMS AFE ADC Accuracy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">BMS AFE ADC Accuracy:</span>
                  <span className="font-mono text-blue-700 font-bold">±{bmsAfeAdcErrorMv} mV</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.5"
                  value={bmsAfeAdcErrorMv}
                  onChange={(e) => onUpdateConfig({ bmsAfeAdcErrorMv: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>±1.5mV (TI BQ76952)</span>
                  <span>±10mV (Generic)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: TELEMETRY & 13 RULES STUDIO (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* A. 4 Key Primary Engineering KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="vn-panel p-4 bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Usable Discharge Energy
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                {results.usableEnergyKwh} <span className="text-xs font-normal text-slate-500">kWh</span>
              </div>
              <div className="text-[10.5px] font-mono text-blue-700 font-semibold">
                {results.usableCapacityRetentionPct}% of {results.nominalEnergyKwh} kWh
              </div>
            </div>

            <div className="vn-panel p-4 bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Peak Core Hotspot
              </span>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                results.maxCoreTempC > 55 ? 'text-rose-600' : (results.maxCoreTempC > 50 ? 'text-amber-600' : 'text-emerald-700')
              }`}>
                {results.maxCoreTempC} <span className="text-xs font-normal text-slate-500">°C</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Limit: 55°C (60°C Safety Trip)
              </div>
            </div>

            <div className="vn-panel p-4 bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Thermal Spread (ΔT)
              </span>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                results.tempSpreadC > 5 ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {results.tempSpreadC} <span className="text-xs font-normal text-slate-500">°C</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Cloos-Wetzel Limit: ≤ 5.0°C
              </div>
            </div>

            <div className="vn-panel p-4 bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Module Mass & BOM
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                {results.totalMassKg} <span className="text-xs font-normal text-slate-500">kg</span>
              </div>
              <div className="text-[10.5px] font-mono text-slate-600 font-semibold">
                Est. BOM: ${results.totalBomUsd} USD
              </div>
            </div>

          </div>

          {/* B. Dual Real-Time Telemetry Curves */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Chart 1: Terminal Voltage vs. Time */}
            <div className="vn-panel p-5 bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>Terminal Voltage vs. Time</span>
                </span>
                <span className="font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                  {results.nominalVoltageV}V Nom
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.timeSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="voltGradLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis 
                      dataKey="timeMin" 
                      stroke="#94A3B8" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#64748B' }} 
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']} 
                      tick={{ fontSize: 10, fill: '#64748B' }} 
                      tickFormatter={(v) => `${v}V`}
                    />
                    <Tooltip 
                      formatter={(val) => [`${val} V`, "Terminal Voltage"]}
                      labelFormatter={(label) => `Time: ${label} min`}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '0.5rem', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="voltageV" 
                      stroke="#2563EB" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#voltGradLight)" 
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Thermal Response */}
            <div className="vn-panel p-5 bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>Thermal Response (Core vs. Inlet)</span>
                </span>
                <span className="font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                  60°C Ceiling
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.tempSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="coreTempGradLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="minTempGradLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis 
                      dataKey="timeMin" 
                      stroke="#94A3B8" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#64748B' }} 
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      axisLine={false}
                      tickLine={false}
                      domain={[25, 65]} 
                      tick={{ fontSize: 10, fill: '#64748B' }} 
                      tickFormatter={(v) => `${v}°C`}
                    />
                    <ReferenceLine y={60} stroke="#DC2626" strokeDasharray="3 3" label={{ value: '60°C Trip', fill: '#DC2626', fontSize: 10 }} />
                    <ReferenceLine y={52} stroke="#D97706" strokeDasharray="3 3" label={{ value: '52°C Derate', fill: '#D97706', fontSize: 10 }} />
                    <Tooltip 
                      formatter={(val, name) => [`${val} °C`, name === 'tempMaxC' ? 'Max Core Hotspot' : 'Inlet Minimum']}
                      labelFormatter={(label) => `Time: ${label} min`}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '0.5rem', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tempMaxC" 
                      stroke="#DC2626" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#coreTempGradLight)" 
                      dot={false}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tempMinC" 
                      stroke="#059669" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#minTempGradLight)" 
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* C. 13 Cross-Subsystem Rules Engine Studio */}
          <div className="vn-panel p-6 bg-white border border-slate-200 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Automated Cross-Subsystem Conflict Rules Engine (13 Rules)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600">
                Real-Time Verification Engine
              </span>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-mono">
                {['ALL', 'FAILS', 'ELECTRICAL', 'THERMAL', 'PROTECTION', 'SENSING'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRuleFilter(cat)}
                    className={`px-2.5 py-1 rounded transition-all cursor-pointer font-semibold ${
                      ruleFilter === cat 
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-44 font-mono"
                />
              </div>
            </div>

            {/* Rules Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-mono text-slate-700">
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Subsystems</th>
                    <th className="py-2.5 px-3">Standard / Requirement</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Simulated Metric</th>
                    <th className="py-2.5 px-3">Automated Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredRules.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-blue-700">{r.id}</td>
                      <td className="py-2.5 px-3 text-slate-600">{r.subsystems}</td>
                      <td className="py-2.5 px-3 text-slate-800 font-sans font-medium">{r.name}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'PASS' 
                            ? 'vn-badge-pass' 
                            : r.status === 'WARN' 
                            ? 'vn-badge-warn' 
                            : 'vn-badge-fail'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">{r.metric}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-sans text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <span>{r.remediation}</span>
                          {(r.status === 'FAIL' || r.status === 'WARN') && (
                            <button
                              type="button"
                              onClick={() => handleAutoRemediate(r.id)}
                              className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-xs"
                            >
                              <Wrench className="w-2.5 h-2.5" />
                              <span>Fix</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
