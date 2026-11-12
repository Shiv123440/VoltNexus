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
          <span className="text-xs font-mono text-[#D9DADC]/70 font-bold uppercase tracking-wider mr-1">
            Design Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset("baseline")}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#232529] hover:bg-white/10 text-[#D9DADC] border border-white/15 transition-colors cursor-pointer"
          >
            Baseline (Passive Air)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("optionA")}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium vn-badge-pass hover:brightness-110 transition-all cursor-pointer"
          >
            Option A (Forced Duct NMC)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("optionB")}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium vn-badge-cyan hover:brightness-110 transition-all cursor-pointer"
          >
            Option B (Cold Plate LFP)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("baseline")}
            className="p-1.5 rounded-lg text-[#D9DADC]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sliders className="w-4 h-4 text-[#FFC93C]" />
                <span>Subsystem Configuration</span>
              </div>
              <span className="text-[11px] font-mono text-[#FFC93C] font-semibold px-2 py-0.5 rounded bg-[#FFC93C]/15 border border-[#FFC93C]/40">
                Coupled MBSE
              </span>
            </div>

            {/* A. Cell Chemistry */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D9DADC] block">
                Primary Cell Specification
              </label>
              <select
                value={cellId}
                onChange={(e) => setCellId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#232529] border border-white/15 text-xs text-white focus:border-[#FFC93C] focus:outline-none cursor-pointer"
              >
                {Object.values(CELL_PRESETS).map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#232529] text-white">
                    {c.name} ({c.chemistry}, {c.ratedCapacityAh}Ah)
                  </option>
                ))}
              </select>
              <div className="text-[10px] font-mono text-[#D9DADC]/60 flex justify-between px-1">
                <span>DCIR: {CELL_PRESETS[cellId]?.r0RefMOhm} mΩ</span>
                <span>Max: {CELL_PRESETS[cellId]?.maxContCurrent}A Cont</span>
              </div>
            </div>

            {/* B. Topology Series / Parallel */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D9DADC] block">Series (Ns)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="4"
                    max="24"
                    value={nSeries}
                    onChange={(e) => setNSeries(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-[#232529] border border-white/15 text-xs font-mono font-bold text-[#FFC93C] focus:border-[#FFC93C] focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D9DADC] block">Parallel (Np)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={nParallel}
                    onChange={(e) => setNParallel(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-[#232529] border border-white/15 text-xs font-mono font-bold text-[#FFC93C] focus:border-[#FFC93C] focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="text-[10.5px] font-mono text-[#D9DADC]/65 -mt-2 px-1">
              Total Array: <span className="text-white font-bold">{nSeries * nParallel} Cells</span> ({nSeries}S{nParallel}P)
            </div>

            {/* C. Interconnect / Busbar */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D9DADC] block">
                Interconnect &amp; Busbar Hardware
              </label>
              <select
                value={interconnectId}
                onChange={(e) => setInterconnectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#232529] border border-white/15 text-xs text-white focus:border-[#FFC93C] focus:outline-none cursor-pointer"
              >
                {Object.values(INTERCONNECT_PRESETS).map((i) => (
                  <option key={i.id} value={i.id} className="bg-[#232529] text-white">
                    {i.name}
                  </option>
                ))}
              </select>
              <div className="text-[10px] font-mono text-[#D9DADC]/60 px-1">
                Leg R: {INTERCONNECT_PRESETS[interconnectId]?.rLegMOhm} mΩ • k-Factor: {INTERCONNECT_PRESETS[interconnectId]?.kFactor}
              </div>
            </div>

            {/* D. Cooling Subsystem */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D9DADC] block">
                Thermal Management Method
              </label>
              <select
                value={coolingId}
                onChange={(e) => setCoolingId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#232529] border border-white/15 text-xs text-white focus:border-[#FFC93C] focus:outline-none cursor-pointer"
              >
                {Object.values(COOLING_PRESETS).map((cl) => (
                  <option key={cl.id} value={cl.id} className="bg-[#232529] text-white">
                    {cl.name} (h={cl.hConv} W/m²K)
                  </option>
                ))}
              </select>
            </div>

            {/* E. Operating Condition Tactical Sliders */}
            <div className="space-y-4 pt-3 border-t border-white/10">
              <div className="text-xs font-mono font-bold text-[#D9DADC]/65 uppercase tracking-wider">
                Operating Conditions
              </div>

              {/* Slider 1: Pack Current */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#D9DADC] font-medium">Discharge Current:</span>
                  <span className="font-mono text-[#FFC93C] font-bold">{packCurrentA} A</span>
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
                <div className="flex justify-between text-[10px] font-mono text-[#D9DADC]/45">
                  <span>20A (Idle)</span>
                  <span>70A (Cruise)</span>
                  <span>120A (Sprint)</span>
                </div>
              </div>

              {/* Slider 2: Ambient Temperature */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#D9DADC] font-medium">Ambient Temperature:</span>
                  <span className="font-mono text-[#FFC93C] font-bold">{ambientTempC} °C</span>
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
                <div className="flex justify-between text-[10px] font-mono text-[#D9DADC]/45">
                  <span>15°C (Cool)</span>
                  <span>35°C (Standard)</span>
                  <span>50°C (Harsh)</span>
                </div>
              </div>

              {/* Slider 3: SOH Aging */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#D9DADC] font-medium">State of Health (SOH):</span>
                  <span className="font-mono text-rose-300 font-bold">{(soh * 100).toFixed(0)}% SOH</span>
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
                <div className="flex justify-between text-[10px] font-mono text-[#D9DADC]/45">
                  <span>75% (End of Life)</span>
                  <span>100% (Fresh Cell)</span>
                </div>
              </div>

              {/* Slider 4: BMS AFE ADC Accuracy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#D9DADC] font-medium">BMS AFE ADC Accuracy:</span>
                  <span className="font-mono text-[#FFC93C] font-bold">±{bmsAfeAdcErrorMv} mV</span>
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
                <div className="flex justify-between text-[10px] font-mono text-[#D9DADC]/45">
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
              <span className="text-[10px] font-mono font-bold text-[#D9DADC]/65 uppercase tracking-wider block">
                Usable Energy
              </span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                {results.usableEnergyKwh} <span className="text-xs font-normal text-[#D9DADC]/65">kWh</span>
              </div>
              <div className="text-[10.5px] font-mono text-[#FFC93C] font-semibold bg-[#FFC93C]/15 border border-[#FFC93C]/30 inline-block px-1.5 py-0.5 rounded">
                {results.usableCapacityRetentionPct}% of {results.nominalEnergyKwh} kWh
              </div>
            </div>

            {/* Card 2: Peak Core Temp */}
            <div className="p-4 rounded-2xl vn-card space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#D9DADC]/65 uppercase tracking-wider block">
                Peak Core Temp
              </span>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight tabular-nums ${
                results.maxCoreTempC > 55 ? 'text-rose-400' : (results.maxCoreTempC > 50 ? 'text-amber-300' : 'text-emerald-300')
              }`}>
                {results.maxCoreTempC} <span className="text-xs font-normal text-[#D9DADC]/65">°C</span>
              </div>
              <div className="text-[10px] font-mono text-[#D9DADC]/65">
                Limit: 55°C (60°C Safety Trip)
              </div>
            </div>

            {/* Card 3: Thermal Spread */}
            <div className="p-4 rounded-2xl vn-card space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#D9DADC]/65 uppercase tracking-wider block">
                Spatial Gradient (ΔT)
              </span>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight tabular-nums ${
                results.tempSpreadC > 5 ? 'text-[#FFC93C]' : 'text-white'
              }`}>
                {results.tempSpreadC} <span className="text-xs font-normal text-[#D9DADC]/65">°C</span>
              </div>
              <div className="text-[10px] font-mono text-[#D9DADC]/65">
                Cloos &amp; Wetzel Limit: ≤ 5.0°C
              </div>
            </div>

            {/* Card 4: Mass & BOM */}
            <div className="p-4 rounded-2xl vn-card space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#D9DADC]/65 uppercase tracking-wider block">
                Module Mass &amp; BOM
              </span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                {results.totalMassKg} <span className="text-xs font-normal text-[#D9DADC]/65">kg</span>
              </div>
              <div className="text-[10.5px] font-mono text-[#D9DADC]/75 font-semibold">
                Est. BOM: ${results.totalBomUsd} USD
              </div>
            </div>

          </div>

          {/* B. Dual Telemetry Curves */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Chart 1: Terminal Voltage vs. 30min Discharge */}
            <div className="p-4 sm:p-5 rounded-2xl vn-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFC93C]" />
                  <span>Terminal Voltage vs. Discharge Time</span>
                </span>
                <span className="font-mono text-[#2B2D31] bg-[#FFC93C] px-2 py-0.5 rounded text-[11px] font-bold">
                  {results.nominalVoltageV}V Nom
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.timeSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="voltGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFC93C" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#FFC93C" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(217, 218, 220, 0.12)" vertical={false} />
                    <XAxis 
                      dataKey="timeMin" 
                      stroke="#9EA2AA" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#D9DADC' }} 
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis 
                      stroke="#9EA2AA" 
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']} 
                      tick={{ fontSize: 10, fill: '#D9DADC' }} 
                      tickFormatter={(v) => `${v}V`}
                    />
                    <Tooltip 
                      formatter={(val) => [`${val} V`, "Pack Terminal Voltage"]}
                      labelFormatter={(label) => `Time: ${label} min`}
                      contentStyle={{ backgroundColor: '#232529', borderColor: 'rgba(255, 201, 60, 0.45)', borderRadius: '0.75rem', fontSize: '11px', fontFamily: 'monospace', color: '#FFFFFF' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="voltageV" 
                      stroke="#FFC93C" 
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
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span>Thermal Profile (Core vs. Min Cell)</span>
                </span>
                <span className="font-mono text-rose-300 bg-rose-500/15 border border-rose-400/35 px-2 py-0.5 rounded text-[11px]">
                  60°C Ceiling
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.tempSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="coreTempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(217, 218, 220, 0.12)" vertical={false} />
                    <XAxis 
                      dataKey="timeMin" 
                      stroke="#9EA2AA" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#D9DADC' }} 
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis 
                      stroke="#9EA2AA" 
                      axisLine={false}
                      tickLine={false}
                      domain={[25, 65]} 
                      tick={{ fontSize: 10, fill: '#D9DADC' }} 
                      tickFormatter={(v) => `${v}°C`}
                    />
                    <ReferenceLine y={60} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '60°C Trip', fill: '#FCA5A5', fontSize: 10 }} />
                    <ReferenceLine y={52} stroke="#FFC93C" strokeDasharray="3 3" label={{ value: '52°C Derate', fill: '#FFC93C', fontSize: 10 }} />
                    <Tooltip 
                      formatter={(val, name) => [`${val} °C`, name === 'tempMaxC' ? 'Max Core Hotspot' : 'Inlet Cell Minimum']}
                      labelFormatter={(label) => `Time: ${label} min`}
                      contentStyle={{ backgroundColor: '#232529', borderColor: 'rgba(217, 218, 220, 0.25)', borderRadius: '0.75rem', fontSize: '11px', fontFamily: 'monospace', color: '#FFFFFF' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tempMaxC" 
                      stroke="#EF4444" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#coreTempGrad)" 
                      dot={false}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tempMinC" 
                      stroke="#10B981" 
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
                <ShieldCheck className="w-5 h-5 text-[#FFC93C]" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Automated Cross-Subsystem Conflict Checker (13 Rules)
                </h3>
              </div>
              <span className="text-xs font-mono text-[#FFC93C] bg-[#FFC93C]/15 border border-[#FFC93C]/35 px-2.5 py-1 rounded-full font-semibold">
                Real-Time Verification Engine
              </span>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1 bg-[#232529] p-1 rounded-xl border border-white/10 text-xs font-mono">
                {['ALL', 'FAILS', 'ELECTRICAL', 'THERMAL', 'PROTECTION', 'SENSING'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRuleFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      ruleFilter === cat 
                        ? 'bg-[#FFC93C] text-[#2B2D31] font-bold shadow-2xs' 
                        : 'text-[#D9DADC]/75 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#D9DADC]/50" />
                <input
                  type="text"
                  placeholder="Filter rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-[#232529] border border-white/15 text-xs text-white placeholder-[#D9DADC]/45 focus:outline-none focus:border-[#FFC93C] w-44 font-mono"
                />
              </div>
            </div>

            {/* Rules Table */}
            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#232529] font-mono text-[#FFC93C]">
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Subsystems</th>
                    <th className="py-2.5 px-3">Requirement</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Simulated Value</th>
                    <th className="py-2.5 px-3">Automated Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredRules.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#FFC93C]">{r.id}</td>
                      <td className="py-2.5 px-3 text-[#D9DADC]/65">{r.subsystems}</td>
                      <td className="py-2.5 px-3 text-white font-medium font-sans">{r.name}</td>
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
                      <td className="py-2.5 px-3 text-[#D9DADC]">{r.metric}</td>
                      <td className="py-2.5 px-3 text-[#D9DADC]/75 font-sans text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <span>{r.remediation}</span>
                          {(r.status === 'FAIL' || r.status === 'WARN') && (
                            <button
                              type="button"
                              onClick={() => handleAutoRemediate(r.id)}
                              className="px-2 py-0.5 rounded bg-[#FFC93C] text-[#2B2D31] border border-[#FFC93C] font-bold text-[10px] font-mono hover:brightness-105 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
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
