import React, { useState, useMemo } from 'react';
import { 
  simulatePack, 
  CELL_PRESETS, 
  INTERCONNECT_PRESETS, 
  COOLING_PRESETS 
} from '../engine/batterySimulator';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import VoltNexusChartTooltip from './ui/VoltNexusChartTooltip';
import { 
  Sliders, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Zap, 
  Thermometer, 
  ShieldCheck, 
  Layers, 
  Download,
  RotateCcw
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
  const [sigmaQ, setSigmaQ] = useState(1.5);
  const [sigmaR, setSigmaR] = useState(3.0);
  const [bmsAfeAdcErrorMv, setBmsAfeAdcErrorMv] = useState(10.0);

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
    } else if (presetName === "optionA") {
      setCellId("molicel_p42a");
      setNSeries(13);
      setNParallel(8);
      setInterconnectId("copper_12");
      setCoolingId("forced_air");
      setBmsAfeAdcErrorMv(1.5);
      setSoh(1.0);
    } else if (presetName === "optionB") {
      setCellId("eve_lfp_33140");
      setNSeries(16);
      setNParallel(4);
      setInterconnectId("copper_12");
      setCoolingId("cold_plate");
      setBmsAfeAdcErrorMv(1.5);
      setSoh(1.0);
    }
  };

  return (
    <div className="space-y-8 pb-16 transition-opacity duration-500 ease-out">
      {/* Top Presets & Summary Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-card-standard">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">DESIGN PRESETS:</span>
          <button
            onClick={() => applyPreset("baseline")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1c232b] hover:bg-[#252f3a] text-slate-200 border border-[#2e3b49] cursor-pointer"
          >
            Baseline (Passive Air)
          </button>
          <button
            onClick={() => applyPreset("optionA")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 cursor-pointer"
          >
            Option A (Forced Duct NMC)
          </button>
          <button
            onClick={() => applyPreset("optionB")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-500/30 cursor-pointer"
          >
            Option B (Cold Plate LFP)
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-4 h-4" /> {results.passCount} PASS
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <AlertTriangle className="w-4 h-4" /> {results.warnCount} WARN
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="w-4 h-4" /> {results.failCount} FAIL
          </span>
        </div>
      </div>

      {/* Main Grid: Parameter Controls (Left) + Live Analytics & Conflicts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl glass-card-dense space-y-5">
            <div className="flex items-center justify-between border-b border-[#232c37] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Subsystem Configuration
              </div>
              <span className="text-[11px] font-mono text-slate-400">Coupled MBSE</span>
            </div>

            {/* Cell Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Primary Cell Chemistry</label>
              <select
                value={cellId}
                onChange={(e) => setCellId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f1317] border border-[#2a3543] text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {Object.values(CELL_PRESETS).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.chemistry}, {c.ratedCapacityAh}Ah)
                  </option>
                ))}
              </select>
            </div>

            {/* Series / Parallel Topology */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Series (Ns)</label>
                <input
                  type="number"
                  min="4"
                  max="24"
                  value={nSeries}
                  onChange={(e) => setNSeries(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0f1317] border border-[#2a3543] text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Parallel (Np)</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={nParallel}
                  onChange={(e) => setNParallel(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0f1317] border border-[#2a3543] text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Interconnect & Busbar */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Interconnect / Busbar</label>
              <select
                value={interconnectId}
                onChange={(e) => setInterconnectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f1317] border border-[#2a3543] text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {Object.values(INTERCONNECT_PRESETS).map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cooling Subsystem */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Thermal Management</label>
              <select
                value={coolingId}
                onChange={(e) => setCoolingId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f1317] border border-[#2a3543] text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {Object.values(COOLING_PRESETS).map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} (h={cl.hConv} W/m²K)
                  </option>
                ))}
              </select>
            </div>

            {/* Operating Sliders */}
            <div className="space-y-3 pt-2 border-t border-[#232c37]">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Pack Discharge Current:</span>
                  <span className="font-mono text-emerald-400">{packCurrentA} A</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={packCurrentA}
                  onChange={(e) => setPackCurrentA(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Ambient Temperature:</span>
                  <span className="font-mono text-amber-400">{ambientTempC} °C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">State of Health (Aging):</span>
                  <span className="font-mono text-rose-400">{(soh * 100).toFixed(0)}% (SOH)</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.0"
                  step="0.05"
                  value={soh}
                  onChange={(e) => setSoh(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">BMS AFE ADC Accuracy:</span>
                  <span className="font-mono text-teal-400">±{bmsAfeAdcErrorMv} mV</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.5"
                  value={bmsAfeAdcErrorMv}
                  onChange={(e) => setBmsAfeAdcErrorMv(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Indicators & Telemetry (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl glass-card-subtle space-y-1 card-lift-3d">
              <span className="text-[11px] font-mono text-slate-400">USABLE ENERGY</span>
              <div className="text-lg sm:text-xl font-bold text-slate-100">
                {results.usableEnergyKwh} <span className="text-xs font-normal text-slate-400">kWh</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                {results.usableCapacityRetentionPct}% of {results.nominalEnergyKwh} kWh
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card-subtle space-y-1 card-lift-3d">
              <span className="text-[11px] font-mono text-slate-400">PEAK CORE TEMP</span>
              <div className={`text-lg sm:text-xl font-bold ${results.maxCoreTempC > 55.0 ? 'text-rose-400' : 'text-slate-100'}`}>
                {results.maxCoreTempC} <span className="text-xs font-normal text-slate-400">°C</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Limit: 55.0°C (60°C Cutoff)
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card-subtle space-y-1 card-lift-3d">
              <span className="text-[11px] font-mono text-slate-400">TEMP SPREAD (ΔT)</span>
              <div className={`text-lg sm:text-xl font-bold ${results.tempSpreadC > 5.0 ? 'text-amber-400' : 'text-slate-100'}`}>
                {results.tempSpreadC} <span className="text-xs font-normal text-slate-400">°C</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Target: ≤ 5.0°C
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card-subtle space-y-1 card-lift-3d">
              <span className="text-[11px] font-mono text-slate-400">MODULE MASS & BOM</span>
              <div className="text-lg sm:text-xl font-bold text-slate-100">
                {results.totalMassKg} <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                Est. BOM: ${results.totalBomUsd} USD
              </div>
            </div>
          </div>

          {/* Coupled Telemetry Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voltage Response */}
            <div className="p-4 rounded-xl glass-card-dense space-y-3 card-lift-3d">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  <span>Terminal Voltage vs. Time</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/35 text-emerald-400 font-mono text-[11px] font-semibold">
                  {results.nominalVoltageV}V Nom
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.timeSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                    <XAxis 
                      dataKey="timeMin" 
                      stroke="#64748b" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      tickFormatter={(v) => `${v}V`}
                    />
                    <Tooltip 
                      content={<VoltNexusChartTooltip unit="V" />}
                      cursor={{ stroke: 'rgba(148, 163, 184, 0.3)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="voltageV" baseValue="dataMin" 
                      name="Terminal Voltage"
                      stroke="#10b981" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#voltageGradient)" 
                      dot={false} isAnimationActive={false}
                      activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#0a0e14' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Thermal Response */}
            <div className="p-4 rounded-xl glass-card-dense space-y-3 card-lift-3d">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
                  <span>Thermal Response (Core vs. Min)</span>
                  <div className="hidden sm:flex items-center gap-2 ml-2 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      Core
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Min
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/35 text-rose-400 font-mono text-[11px] font-semibold">
                  60°C Ceiling
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.tempSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tempCoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="tempMinGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.20} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                    <XAxis 
                      dataKey="timeMin" 
                      stroke="#64748b" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      axisLine={false}
                      tickLine={false}
                      domain={[30, 70]} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      tickFormatter={(v) => `${v}°C`}
                    />
                    <Tooltip 
                      content={<VoltNexusChartTooltip unit="°C" />}
                      cursor={{ stroke: 'rgba(148, 163, 184, 0.3)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tempMaxC" baseValue="dataMin" 
                      name="Max Core" 
                      stroke="#f43f5e" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#tempCoreGradient)" 
                      dot={false} isAnimationActive={false}
                      activeDot={{ r: 5, stroke: '#f43f5e', strokeWidth: 2, fill: '#0a0e14' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tempMinC" baseValue="dataMin" 
                      name="Min Cell" 
                      stroke="#059669" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#tempMinGradient)" 
                      dot={false} isAnimationActive={false}
                      activeDot={{ r: 4.5, stroke: '#059669', strokeWidth: 2, fill: '#0a0e14' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Automated Cross-Subsystem Conflict Rules Table */}
          <div className="p-5 rounded-2xl glass-card-dense space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Automated Cross-Subsystem Conflict Checker (13 Rules)
              </div>
              <span className="text-xs font-mono text-slate-400">
                Innovation & Rules Engine (10%)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#232c37] text-slate-400 font-mono">
                    <th className="py-2 px-2">Rule ID</th>
                    <th className="py-2 px-2">Subsystems</th>
                    <th className="py-2 px-2">Description</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Simulated Metric</th>
                    <th className="py-2 px-2">Automated Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2631]">
                  {results.rules.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-2.5 px-2 font-mono font-bold text-slate-300">{r.id}</td>
                      <td className="py-2.5 px-2 text-slate-400">{r.subsystems}</td>
                      <td className="py-2.5 px-2 text-slate-200">{r.name}</td>
                      <td className="py-2.5 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'PASS' 
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
                            : r.status === 'WARN'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-300">{r.metric}</td>
                      <td className="py-2.5 px-2 text-slate-400 text-[11px]">{r.remediation}</td>
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
