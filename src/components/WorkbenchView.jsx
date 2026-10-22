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
  ShieldCheck
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
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#485E70]">DESIGN PRESETS:</span>
          <button
            onClick={() => applyPreset("baseline")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EAE6DE] hover:bg-[#DDD8CD] text-[#226192] border border-[#D0C8B8] cursor-pointer transition-colors"
          >
            Baseline (Passive Air)
          </button>
          <button
            onClick={() => applyPreset("optionA")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#226192] hover:bg-[#164366] text-white cursor-pointer transition-colors shadow-2xs"
          >
            Option A (Forced Duct NMC)
          </button>
          <button
            onClick={() => applyPreset("optionB")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EF8557] hover:bg-[#E3703E] text-white cursor-pointer transition-colors shadow-2xs"
          >
            Option B (Cold Plate LFP)
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-lg">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {results.passCount} PASS
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 bg-amber-100/70 border border-amber-300 px-2.5 py-1 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {results.warnCount} WARN
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 bg-rose-100/70 border border-rose-300 px-2.5 py-1 rounded-lg">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> {results.failCount} FAIL
          </span>
        </div>
      </div>

      {/* Main Grid: Parameter Controls (Left) + Live Analytics & Conflicts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D4] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#182836]">
                <Sliders className="w-4 h-4 text-[#226192]" />
                Subsystem Configuration
              </div>
              <span className="text-[11px] font-mono text-[#5C7285] font-semibold">Coupled MBSE</span>
            </div>

            {/* Cell Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#3E5263]">Primary Cell Chemistry</label>
              <select
                value={cellId}
                onChange={(e) => setCellId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F1EA] border border-[#D0C8B8] text-xs text-[#182836] font-medium focus:outline-none focus:border-[#226192]"
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
                <label className="text-xs font-semibold text-[#3E5263]">Series (Ns)</label>
                <input
                  type="number"
                  min="4"
                  max="24"
                  value={nSeries}
                  onChange={(e) => setNSeries(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F1EA] border border-[#D0C8B8] text-xs text-[#182836] font-medium focus:outline-none focus:border-[#226192]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3E5263]">Parallel (Np)</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={nParallel}
                  onChange={(e) => setNParallel(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F1EA] border border-[#D0C8B8] text-xs text-[#182836] font-medium focus:outline-none focus:border-[#226192]"
                />
              </div>
            </div>

            {/* Interconnect & Busbar */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#3E5263]">Interconnect / Busbar</label>
              <select
                value={interconnectId}
                onChange={(e) => setInterconnectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F1EA] border border-[#D0C8B8] text-xs text-[#182836] font-medium focus:outline-none focus:border-[#226192]"
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
              <label className="text-xs font-semibold text-[#3E5263]">Thermal Management</label>
              <select
                value={coolingId}
                onChange={(e) => setCoolingId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F1EA] border border-[#D0C8B8] text-xs text-[#182836] font-medium focus:outline-none focus:border-[#226192]"
              >
                {Object.values(COOLING_PRESETS).map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} (h={cl.hConv} W/m²K)
                  </option>
                ))}
              </select>
            </div>

            {/* Styled Sliders (Adopting Colorful Custom Track Accents from Picture 2) */}
            <div className="space-y-3 pt-3 border-t border-[#E5E0D4]">
              {/* Slider 1: Green/Emerald Accent */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#3E5263] font-medium">Pack Discharge Current:</span>
                  <span className="font-mono font-bold text-emerald-600">{packCurrentA} A</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={packCurrentA}
                  onChange={(e) => setPackCurrentA(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-[#E0DBCF] rounded-lg"
                />
              </div>

              {/* Slider 2: Amber Accent */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#3E5263] font-medium">Ambient Temperature:</span>
                  <span className="font-mono font-bold text-amber-600">{ambientTempC} °C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-[#E0DBCF] rounded-lg"
                />
              </div>

              {/* Slider 3: Coral/Rose Accent */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#3E5263] font-medium">State of Health (Aging):</span>
                  <span className="font-mono font-bold text-rose-600">{(soh * 100).toFixed(0)}% (SOH)</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.0"
                  step="0.05"
                  value={soh}
                  onChange={(e) => setSoh(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-[#E0DBCF] rounded-lg"
                />
              </div>

              {/* Slider 4: Deep Editorial Blue / Teal Accent */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#3E5263] font-medium">BMS AFE ADC Accuracy:</span>
                  <span className="font-mono font-bold text-[#226192]">±{bmsAfeAdcErrorMv} mV</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.5"
                  value={bmsAfeAdcErrorMv}
                  onChange={(e) => setBmsAfeAdcErrorMv(parseFloat(e.target.value))}
                  className="w-full accent-[#226192] cursor-pointer h-2 bg-[#E0DBCF] rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Indicators & Telemetry (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] space-y-1 shadow-2xs">
              <span className="text-[11px] font-mono text-[#5C7285] font-semibold">USABLE ENERGY</span>
              <div className="text-lg sm:text-xl font-bold text-[#182836]">
                {results.usableEnergyKwh} <span className="text-xs font-normal text-[#5C7285]">kWh</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                {results.usableCapacityRetentionPct}% of {results.nominalEnergyKwh} kWh
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] space-y-1 shadow-2xs">
              <span className="text-[11px] font-mono text-[#5C7285] font-semibold">PEAK CORE TEMP</span>
              <div className={`text-lg sm:text-xl font-bold ${results.maxCoreTempC > 55.0 ? 'text-rose-600' : 'text-[#182836]'}`}>
                {results.maxCoreTempC} <span className="text-xs font-normal text-[#5C7285]">°C</span>
              </div>
              <div className="text-[10px] text-[#5C7285] font-mono">
                Limit: 55.0°C (60°C Cutoff)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] space-y-1 shadow-2xs">
              <span className="text-[11px] font-mono text-[#5C7285] font-semibold">TEMP SPREAD (ΔT)</span>
              <div className={`text-lg sm:text-xl font-bold ${results.tempSpreadC > 5.0 ? 'text-amber-600' : 'text-[#182836]'}`}>
                {results.tempSpreadC} <span className="text-xs font-normal text-[#5C7285]">°C</span>
              </div>
              <div className="text-[10px] text-[#5C7285] font-mono">
                Target: ≤ 5.0°C
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] space-y-1 shadow-2xs">
              <span className="text-[11px] font-mono text-[#5C7285] font-semibold">MODULE MASS & BOM</span>
              <div className="text-lg sm:text-xl font-bold text-[#182836]">
                {results.totalMassKg} <span className="text-xs font-normal text-[#5C7285]">kg</span>
              </div>
              <div className="text-[10px] text-[#226192] font-mono font-semibold">
                Est. BOM: ${results.totalBomUsd} USD
              </div>
            </div>
          </div>

          {/* Coupled Telemetry Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voltage Response */}
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#182836]">
                <span>Terminal Voltage vs. Time</span>
                <span className="text-[#226192] font-mono">{results.nominalVoltageV}V Nom</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D4" />
                    <XAxis dataKey="timeMin" stroke="#8596A6" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#8596A6" domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', borderColor: '#D8D2C5', fontSize: '11px', color: '#182836' }} />
                    <Line type="monotone" dataKey="voltageV" stroke="#226192" strokeWidth={2.2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Thermal Response */}
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#182836]">
                <span>Thermal Response (Core vs. Min)</span>
                <span className="text-[#EF8557] font-mono font-bold">60°C Ceiling</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.tempSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D4" />
                    <XAxis dataKey="timeMin" stroke="#8596A6" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#8596A6" domain={[30, 70]} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', borderColor: '#D8D2C5', fontSize: '11px', color: '#182836' }} />
                    <Line type="monotone" dataKey="tempMaxC" stroke="#EF8557" strokeWidth={2.2} dot={false} name="Max Core °C" />
                    <Line type="monotone" dataKey="tempMinC" stroke="#226192" strokeWidth={1.8} dot={false} name="Min Cell °C" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Automated Cross-Subsystem Conflict Rules Table */}
          <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#D8D2C5] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#182836]">
                <ShieldCheck className="w-4 h-4 text-[#226192]" />
                Automated Cross-Subsystem Conflict Checker (13 Rules)
              </div>
              <span className="text-xs font-mono text-[#5C7285] font-semibold">
                Innovation & Rules Engine (10%)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E0D4] text-[#5C7285] font-mono">
                    <th className="py-2 px-2">Rule ID</th>
                    <th className="py-2 px-2">Subsystems</th>
                    <th className="py-2 px-2">Description</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Simulated Metric</th>
                    <th className="py-2 px-2">Automated Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE7DF]">
                  {results.rules.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F6F3EC] transition-colors">
                      <td className="py-2.5 px-2 font-mono font-bold text-[#226192]">{r.id}</td>
                      <td className="py-2.5 px-2 text-[#485E70]">{r.subsystems}</td>
                      <td className="py-2.5 px-2 text-[#182836] font-medium">{r.name}</td>
                      <td className="py-2.5 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'PASS' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : r.status === 'WARN'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-[#182836]">{r.metric}</td>
                      <td className="py-2.5 px-2 text-[#485E70] text-[11px]">{r.remediation}</td>
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
