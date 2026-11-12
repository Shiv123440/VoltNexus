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
  CheckCircle, 
  XCircle, 
  ShieldCheck,
  RotateCcw,
  Search,
  Wrench
} from 'lucide-react';

export default function WorkbenchView() {
  // Configurable Parameters State
  const [cellId, setCellId] = useState("molicel_p42a");
  const [nSeries, setNSeries] = useState(13);
  const [nParallel, setNParallel] = useState(8);
  const [interconnectId, setInterconnectId] = useState("nickel_015");
  const [coolingId, setCoolingId] = useState("natural_air");
  const [packCurrentA, setPackCurrentA] = useState(70.0);
  const [ambientTempC, setAmbientTempC] = useState(35.0);
  const [soh, setSoh] = useState(1.0);
  const [sigmaQ] = useState(1.5);
  const [sigmaR] = useState(3.0);
  const [bmsAfeAdcErrorMv, setBmsAfeAdcErrorMv] = useState(10.0);

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
      sigmaQ,
      sigmaR,
      bmsAfeAdcErrorMv
    });
  }, [cellId, nSeries, nParallel, interconnectId, coolingId, ambientTempC, packCurrentA, soh, sigmaQ, sigmaR, bmsAfeAdcErrorMv]);

  // Apply Presets
  const applyPreset = (presetName) => {
    if (presetName === "baseline") {
      setCellId("molicel_p42a");
      setNSeries(13);
      setNParallel(8);
      setInterconnectId("nickel_015");
      setCoolingId("natural_air");
      setBmsAfeAdcErrorMv(10.0);
      setSoh(1.0);
      setPackCurrentA(70.0);
      setAmbientTempC(35.0);
    } else if (presetName === "optionA") {
      setCellId("molicel_p42a");
      setNSeries(13);
      setNParallel(8);
      setInterconnectId("copper_12");
      setCoolingId("forced_air");
      setBmsAfeAdcErrorMv(1.5);
      setSoh(1.0);
      setPackCurrentA(70.0);
      setAmbientTempC(35.0);
    } else if (presetName === "optionB") {
      setCellId("eve_lfp_33140");
      setNSeries(16);
      setNParallel(4);
      setInterconnectId("copper_12");
      setCoolingId("cold_plate");
      setBmsAfeAdcErrorMv(1.5);
      setSoh(1.0);
      setPackCurrentA(70.0);
      setAmbientTempC(35.0);
    }
  };

  // Quick 1-Click Remediation Actions
  const handleAutoRemediate = (ruleId) => {
    if (ruleId === 'R02' || ruleId === 'R05') {
      // Thermal issues: upgrade to forced air duct or cold plate
      setCoolingId(coolingId === 'natural_air' ? 'forced_air' : 'cold_plate');
    } else if (ruleId === 'R04' || ruleId === 'R06') {
      // Interconnect issues: upgrade to 1.2mm Copper
      setInterconnectId('copper_12');
    } else if (ruleId === 'R10') {
      // BMS ADC issue: upgrade ADC accuracy
      setBmsAfeAdcErrorMv(1.5);
    } else if (ruleId === 'R13') {
      // Mass budget issue: reduce Np or series
      if (nParallel > 4) setNParallel(nParallel - 1);
    }
  };

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return results.rules.filter((rule) => {
      // Status/Category filter
      if (ruleFilter === 'FAILS' && rule.status === 'PASS') return false;
      if (ruleFilter === 'ELECTRICAL' && !rule.subsystems.includes('Electrical')) return false;
      if (ruleFilter === 'THERMAL' && !rule.subsystems.includes('Thermal')) return false;
      if (ruleFilter === 'PROTECTION' && !rule.subsystems.includes('Protection')) return false;
      if (ruleFilter === 'SENSING' && !rule.subsystems.includes('Sensing') && !rule.subsystems.includes('Control')) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = rule.id.toLowerCase().includes(query);
        const matchesName = rule.name.toLowerCase().includes(query);
        const matchesSub = rule.subsystems.toLowerCase().includes(query);
        const matchesRem = rule.remediation.toLowerCase().includes(query);
        return matchesId || matchesName || matchesSub || matchesRem;
      }

      return true;
    });
  }, [results.rules, ruleFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. TOP PRESET BAR & COMPLIANCE SUMMARY */}
      <div className="p-4 rounded-2xl vn-card flex flex-wrap items-center justify-between gap-4">
        
        {/* Preset Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mr-1">
            Design Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset("baseline")}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            Baseline (Passive Air)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("optionA")}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium vn-badge-pass hover:brightness-95 transition-all cursor-pointer"
          >
            Option A (Forced Duct NMC)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("optionB")}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium vn-badge-cyan hover:brightness-95 transition-all cursor-pointer"
          >
            Option B (Cold Plate LFP)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("baseline")}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset to Baseline"
            aria-label="Reset to Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Rule Status Counter Badges */}
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

      {/* 2. SPLIT STUDIO: CONTROLS (LEFT 4 COLS) + TELEMETRY & RULES (RIGHT 8 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PARAMETRIC CAD / SUBSYSTEM CONSOLE (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl vn-card space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Subsystem Configuration</span>
              </div>
              <span className="text-[11px] font-mono text-blue-700 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                Coupled MBSE
              </span>
            </div>

            {/* A. Cell Chemistry */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Primary Cell Specification
              </label>
              <select
                value={cellId}
                onChange={(e) => setCellId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {Object.values(CELL_PRESETS).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.chemistry}, {c.ratedCapacityAh}Ah)
                  </option>
                ))}
              </select>
              <div className="text-[10px] font-mono text-slate-500 flex justify-between px-1">
                <span>DCIR: {CELL_PRESETS[cellId]?.r0RefMOhm} mΩ</span>
                <span>Max: {CELL_PRESETS[cellId]?.maxContCurrent}A Cont</span>
              </div>
            </div>

            {/* B. Topology Series / Parallel */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Series (Ns)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="4"
                    max="24"
                    value={nSeries}
                    onChange={(e) => setNSeries(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-blue-700 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Parallel (Np)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={nParallel}
                    onChange={(e) => setNParallel(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-blue-700 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="text-[10.5px] font-mono text-slate-500 -mt-2 px-1">
              Total Array: <span className="text-slate-900 font-bold">{nSeries * nParallel} Cells</span> ({nSeries}S{nParallel}P)
            </div>

            {/* C. Interconnect / Busbar */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Interconnect &amp; Busbar Hardware
              </label>
              <select
                value={interconnectId}
                onChange={(e) => setInterconnectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {Object.values(INTERCONNECT_PRESETS).map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <div className="text-[10px] font-mono text-slate-500 px-1">
                Leg R: {INTERCONNECT_PRESETS[interconnectId]?.rLegMOhm} mΩ • k-Factor: {INTERCONNECT_PRESETS[interconnectId]?.kFactor}
              </div>
            </div>

            {/* D. Cooling Subsystem */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Thermal Management Method
              </label>
              <select
                value={coolingId}
                onChange={(e) => setCoolingId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {Object.values(COOLING_PRESETS).map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} (h={cl.hConv} W/m²K)
                  </option>
                ))}
              </select>
            </div>

            {/* E. Operating Condition Tactical Sliders */}
            <div className="space-y-4 pt-3 border-t border-slate-200">
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Operating Conditions
              </div>

              {/* Slider 1: Pack Current */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Discharge Current:</span>
                  <span className="font-mono text-blue-700 font-bold">{packCurrentA} A</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={packCurrentA}
                  onChange={(e) => setPackCurrentA(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>20A (Idle)</span>
                  <span>70A (Cruise)</span>
                  <span>120A (Sprint)</span>
                </div>
              </div>

              {/* Slider 2: Ambient Temperature */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Ambient Temperature:</span>
                  <span className="font-mono text-amber-600 font-bold">{ambientTempC} °C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>15°C (Cool)</span>
                  <span>35°C (Standard)</span>
                  <span>50°C (Harsh)</span>
                </div>
              </div>

              {/* Slider 3: SOH Aging */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">State of Health (SOH):</span>
                  <span className="font-mono text-rose-600 font-bold">{(soh * 100).toFixed(0)}% SOH</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.0"
                  step="0.05"
                  value={soh}
                  onChange={(e) => setSoh(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>75% (End of Life)</span>
                  <span>100% (Fresh Cell)</span>
                </div>
              </div>

              {/* Slider 4: BMS AFE ADC Accuracy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">BMS AFE ADC Accuracy:</span>
                  <span className="font-mono text-blue-700 font-bold">±{bmsAfeAdcErrorMv} mV</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.5"
                  value={bmsAfeAdcErrorMv}
                  onChange={(e) => setBmsAfeAdcErrorMv(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>±1.5mV (TI BQ76952)</span>
                  <span>±10mV (Generic AFE)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: TELEMETRY & RULES STUDIO (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* A. 4 Key Primary Engineering KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            
            {/* Card 1: Usable Energy */}
            <div className="p-4 rounded-2xl vn-card space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Usable Energy
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                {results.usableEnergyKwh} <span className="text-xs font-normal text-slate-500">kWh</span>
              </div>
              <div className="text-[10.5px] font-mono text-blue-600 font-semibold">
                {results.usableCapacityRetentionPct}% of {results.nominalEnergyKwh} kWh
              </div>
            </div>

            {/* Card 2: Peak Core Temp */}
            <div className="p-4 rounded-2xl vn-card space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Peak Core Temp
              </span>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight tabular-nums ${
                results.maxCoreTempC > 55 ? 'text-rose-600' : (results.maxCoreTempC > 50 ? 'text-amber-600' : 'text-emerald-600')
              }`}>
                {results.maxCoreTempC} <span className="text-xs font-normal text-slate-500">°C</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Limit: 55°C (60°C Safety Trip)
              </div>
            </div>

            {/* Card 3: Thermal Spread */}
            <div className="p-4 rounded-2xl vn-card space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Spatial Gradient (ΔT)
              </span>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight tabular-nums ${
                results.tempSpreadC > 5 ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {results.tempSpreadC} <span className="text-xs font-normal text-slate-500">°C</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Cloos &amp; Wetzel Limit: ≤ 5.0°C
              </div>
            </div>

            {/* Card 4: Mass & BOM */}
            <div className="p-4 rounded-2xl vn-card space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Module Mass &amp; BOM
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                {results.totalMassKg} <span className="text-xs font-normal text-slate-500">kg</span>
              </div>
              <div className="text-[10.5px] font-mono text-blue-600 font-semibold">
                Est. BOM: ${results.totalBomUsd} USD
              </div>
            </div>

          </div>

          {/* B. Dual Telemetry Curves */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Chart 1: Terminal Voltage vs. 30min Discharge */}
            <div className="p-4 sm:p-5 rounded-2xl vn-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>Terminal Voltage vs. Discharge Time</span>
                </span>
                <span className="font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                  {results.nominalVoltageV}V Nom
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.timeSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="voltGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
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
                      formatter={(val) => [`${val} V`, "Pack Terminal Voltage"]}
                      labelFormatter={(label) => `Time: ${label} min`}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '0.75rem', fontSize: '11px', fontFamily: 'monospace', color: '#0F172A' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="voltageV" 
                      stroke="#2563EB" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#voltGrad)" 
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Thermal Response (Core Hotspot vs Inlet Cell) */}
            <div className="p-4 sm:p-5 rounded-2xl vn-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>Thermal Profile (Core vs. Min Cell)</span>
                </span>
                <span className="font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                  60°C Ceiling
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.tempSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="coreTempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
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
                      formatter={(val, name) => [`${val} °C`, name === 'tempMaxC' ? 'Max Core Hotspot' : 'Inlet Cell Minimum']}
                      labelFormatter={(label) => `Time: ${label} min`}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '0.75rem', fontSize: '11px', fontFamily: 'monospace', color: '#0F172A' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tempMaxC" 
                      stroke="#DC2626" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#coreTempGrad)" 
                      dot={false}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tempMinC" 
                      stroke="#059669" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#minTempGrad)" 
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* C. 13 Cross-Subsystem Conflict Rules Engine Studio */}
          <div className="p-5 sm:p-6 rounded-2xl vn-card space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Automated Cross-Subsystem Conflict Checker (13 Rules)
                </h3>
              </div>
              <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                Real-Time Verification Engine
              </span>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
                {['ALL', 'FAILS', 'ELECTRICAL', 'THERMAL', 'PROTECTION', 'SENSING'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRuleFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      ruleFilter === cat 
                        ? 'bg-white text-blue-700 border border-slate-200/80 shadow-2xs font-bold' 
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
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-44 font-mono"
                />
              </div>
            </div>

            {/* Rules Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-mono text-slate-600">
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Subsystems</th>
                    <th className="py-2.5 px-3">Requirement</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Simulated Value</th>
                    <th className="py-2.5 px-3">Automated Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredRules.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-blue-700">{r.id}</td>
                      <td className="py-2.5 px-3 text-slate-500">{r.subsystems}</td>
                      <td className="py-2.5 px-3 text-slate-900 font-medium font-sans">{r.name}</td>
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
                      <td className="py-2.5 px-3 text-slate-700">{r.metric}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-sans text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <span>{r.remediation}</span>
                          {(r.status === 'FAIL' || r.status === 'WARN') && (
                            <button
                              type="button"
                              onClick={() => handleAutoRemediate(r.id)}
                              className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
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
