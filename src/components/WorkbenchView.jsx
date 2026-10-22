import React, { useState, useMemo } from 'react';
import { 
  simulatePack, 
  CELL_PRESETS, 
  INTERCONNECT_PRESETS, 
  COOLING_PRESETS 
} from '../engine/batterySimulator';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
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
    <div className="space-y-8 pb-16">
      {/* Top Presets & Summary Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#14191f] border border-[#232c37]">
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
          <div className="p-5 rounded-2xl bg-[#14191f] border border-[#232c37] space-y-5">
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
            <div className="p-4 rounded-xl bg-[#14191f] border border-[#232c37] space-y-1">
              <span className="text-[11px] font-mono text-slate-400">USABLE ENERGY</span>
              <div className="text-lg sm:text-xl font-bold text-slate-100">
                {results.usableEnergyKwh} <span className="text-xs font-normal text-slate-400">kWh</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                {results.usableCapacityRetentionPct}% of {results.nominalEnergyKwh} kWh
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#14191f] border border-[#232c37] space-y-1">
              <span className="text-[11px] font-mono text-slate-400">PEAK CORE TEMP</span>
              <div className={`text-lg sm:text-xl font-bold ${results.maxCoreTempC > 55.0 ? 'text-rose-400' : 'text-slate-100'}`}>
                {results.maxCoreTempC} <span className="text-xs font-normal text-slate-400">°C</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Limit: 55.0°C (60°C Cutoff)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#14191f] border border-[#232c37] space-y-1">
              <span className="text-[11px] font-mono text-slate-400">TEMP SPREAD (ΔT)</span>
              <div className={`text-lg sm:text-xl font-bold ${results.tempSpreadC > 5.0 ? 'text-amber-400' : 'text-slate-100'}`}>
                {results.tempSpreadC} <span className="text-xs font-normal text-slate-400">°C</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Target: ≤ 5.0°C
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#14191f] border border-[#232c37] space-y-1">
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
            <div className="p-4 rounded-xl bg-[#14191f] border border-[#232c37] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Terminal Voltage vs. Time</span>
                <span className="text-emerald-400 font-mono">{results.nominalVoltageV}V Nom</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232c37" />
                    <XAxis dataKey="timeMin" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1317', borderColor: '#232c37', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="voltageV" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Thermal Response */}
            <div className="p-4 rounded-xl bg-[#14191f] border border-[#232c37] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Thermal Response (Core vs. Min)</span>
                <span className="text-rose-400 font-mono">60°C Ceiling</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.tempSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232c37" />
                    <XAxis dataKey="timeMin" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" domain={[30, 70]} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1317', borderColor: '#232c37', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="tempMaxC" stroke="#f43f5e" strokeWidth={2} dot={false} name="Max Core °C" />
                    <Line type="monotone" dataKey="tempMinC" stroke="#059669" strokeWidth={1.5} dot={false} name="Min Cell °C" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Automated Cross-Subsystem Conflict Rules Table */}
          <div className="p-5 rounded-2xl bg-[#14191f] border border-[#232c37] space-y-3">
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
                    <tr key={r.id} className="hover:bg-[#182028] transition-colors">
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
