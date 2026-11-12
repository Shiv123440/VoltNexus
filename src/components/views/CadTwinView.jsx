import React, { useState, useMemo, Suspense, lazy } from 'react';
import {
  simulatePack,
  CELL_PRESETS,
  INTERCONNECT_PRESETS,
  COOLING_PRESETS
} from '../../engine/batterySimulator';
import {
  Box,
  Sliders,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Cpu,
  Thermometer,
  Zap,
  ArrowRight
} from 'lucide-react';

const DigitalTwin3DView = lazy(() => import('../ui/DigitalTwin3DView'));

export default function CadTwinView({ onNavigateToWorkbench }) {
  // Configurable Parameters (Defaulting to Option A optimized assembly)
  const [cellId, setCellId] = useState('molicel_p42a');
  const [nSeries, setNSeries] = useState(13);
  const [nParallel, setNParallel] = useState(8);
  const [interconnectId, setInterconnectId] = useState('copper_12');
  const [coolingId, setCoolingId] = useState('forced_air');
  const [packCurrentA, setPackCurrentA] = useState(70.0);
  const [ambientTempC, setAmbientTempC] = useState(35.0);
  const [soh, setSoh] = useState(1.0);

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
      bmsAfeAdcErrorMv: 1.5,
      fuseBreakingKa: interconnectId === 'copper_12' ? 3.0 : 2.0
    });
  }, [cellId, nSeries, nParallel, interconnectId, coolingId, ambientTempC, packCurrentA, soh]);

  // Compute instantaneous Arrhenius cell DCIR for 3D per-cell HUD telemetry
  const r0NomMOhm = useMemo(() => {
    const cell = CELL_PRESETS[cellId] || CELL_PRESETS.molicel_p42a;
    const tAmbK = ambientTempC + 273.15;
    const arrhenius = Math.exp((20000.0 / 8.314) * (1.0 / tAmbK - 1.0 / 298.15));
    const agingFactor = 1.0 + 1.5 * (1.0 - soh);
    return Number((cell.r0RefMOhm * arrhenius * agingFactor).toFixed(2));
  }, [cellId, ambientTempC, soh]);

  const applyPreset = (presetName) => {
    if (presetName === 'baseline') {
      setCellId('molicel_p42a');
      setNSeries(13);
      setNParallel(8);
      setInterconnectId('nickel_015');
      setCoolingId('natural_air');
      setPackCurrentA(70.0);
      setAmbientTempC(35.0);
      setSoh(1.0);
    } else if (presetName === 'optionA') {
      setCellId('molicel_p42a');
      setNSeries(13);
      setNParallel(8);
      setInterconnectId('copper_12');
      setCoolingId('forced_air');
      setPackCurrentA(70.0);
      setAmbientTempC(35.0);
      setSoh(1.0);
    } else if (presetName === 'optionB') {
      setCellId('eve_lfp_33140');
      setNSeries(16);
      setNParallel(4);
      setInterconnectId('copper_12');
      setCoolingId('cold_plate');
      setPackCurrentA(70.0);
      setAmbientTempC(35.0);
      setSoh(1.0);
    }
  };

  const selectedCell = CELL_PRESETS[cellId] || CELL_PRESETS.molicel_p42a;

  return (
    <div className="space-y-6 pb-12">

      {/* 1. TOP PRESET & LIVE TWIN TELEMETRY BAR */}
      <div className="p-4 rounded-2xl vn-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#FFC93C] uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <Box className="w-4 h-4" />
            3D CAD Twin:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('baseline')}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#232529] hover:bg-white/10 text-[#D9DADC] border border-white/15 transition-colors cursor-pointer"
          >
            Baseline (Passive Air)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('optionA')}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium vn-badge-pass hover:brightness-110 transition-all cursor-pointer"
          >
            Option A (Forced Duct NMC)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('optionB')}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium vn-badge-cyan hover:brightness-110 transition-all cursor-pointer"
          >
            Option B (Cold Plate LFP)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('optionA')}
            className="p-1.5 rounded-lg text-[#D9DADC]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reset CAD Twin to Option A"
            aria-label="Reset CAD Twin to Option A"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Compliance Summary Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="vn-badge-pass px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{results.passCount} PASS</span>
          </div>
          <div className="vn-badge-warn px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{results.warnCount} WARN</span>
          </div>
          <div className="vn-badge-fail px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>{results.failCount} FAIL</span>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED 3D CAD WORKSPACE (3-Col Parameters + 9-Col Full-Scale 3D Viewport) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: 3D MODULE GEOMETRY & OPERATING CONTROLS (3 COLS) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="p-5 rounded-2xl vn-card space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sliders className="w-4 h-4 text-[#FFC93C]" />
                <span>CAD Assembly Inputs</span>
              </div>
              <span className="text-[10px] font-mono text-[#FFC93C] bg-[#FFC93C]/15 px-2 py-0.5 rounded border border-[#FFC93C]/40 font-semibold">
                LIVE SYNC
              </span>
            </div>

            {/* Cell Preset */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D9DADC] block">
                Cell Form Factor &amp; Chemistry
              </label>
              <select
                value={cellId}
                onChange={(e) => setCellId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#232529] border border-white/15 text-xs text-white focus:border-[#FFC93C] focus:outline-none cursor-pointer"
              >
                {Object.values(CELL_PRESETS).map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#232529] text-white">
                    {c.name} ({c.chemistry})
                  </option>
                ))}
              </select>
            </div>

            {/* Series & Parallel Array Geometry */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#D9DADC]/80 block">Series (Ns)</label>
                <input
                  type="number"
                  min="4"
                  max="20"
                  value={nSeries}
                  onChange={(e) => setNSeries(Math.max(4, Math.min(20, parseInt(e.target.value, 10) || 4)))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#232529] border border-white/15 text-xs font-mono font-bold text-[#FFC93C] focus:border-[#FFC93C] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#D9DADC]/80 block">Parallel (Np)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={nParallel}
                  onChange={(e) => setNParallel(Math.max(1, Math.min(12, parseInt(e.target.value, 10) || 1)))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#232529] border border-white/15 text-xs font-mono font-bold text-[#FFC93C] focus:border-[#FFC93C] focus:outline-none"
                />
              </div>
            </div>

            {/* Interconnect Hardware */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D9DADC] block">
                Busbar / Interconnect
              </label>
              <select
                value={interconnectId}
                onChange={(e) => setInterconnectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#232529] border border-white/15 text-xs text-white focus:border-[#FFC93C] focus:outline-none cursor-pointer"
              >
                {Object.values(INTERCONNECT_PRESETS).map((i) => (
                  <option key={i.id} value={i.id} className="bg-[#232529] text-white">
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cooling Duct / Plate */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D9DADC] block">
                Thermal Duct / Cold Plate
              </label>
              <select
                value={coolingId}
                onChange={(e) => setCoolingId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#232529] border border-white/15 text-xs text-white focus:border-[#FFC93C] focus:outline-none cursor-pointer"
              >
                {Object.values(COOLING_PRESETS).map((cl) => (
                  <option key={cl.id} value={cl.id} className="bg-[#232529] text-white">
                    {cl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Operational Thermal Stress Sliders */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#D9DADC]/80 font-medium">Load Current:</span>
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
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#D9DADC]/80 font-medium">Ambient Inlet:</span>
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
              </div>
            </div>
          </div>

          {/* Physical Packaging & Live Telemetry Card */}
          <div className="p-5 rounded-2xl vn-card space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Module Spatial Telemetry
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#D9DADC]/70 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#FFC93C]" /> Array Layout:
                </span>
                <span className="text-white font-bold">{nSeries * nParallel} Cells ({nSeries}S{nParallel}P)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#D9DADC]/70 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#FFC93C]" /> Pack Potential:
                </span>
                <span className="text-[#FFC93C] font-bold">{results.nominalVoltageV} V ({results.nominalEnergyKwh} kWh)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#D9DADC]/70 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Peak Core / ΔT:
                </span>
                <span className={`font-bold ${results.maxCoreTempC > 55 ? 'text-rose-400' : 'text-emerald-300'}`}>
                  {results.maxCoreTempC}°C / {results.tempSpreadC}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#D9DADC]/70">Form Factor:</span>
                <span className="text-white">{selectedCell.formFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#D9DADC]/70">Module Mass:</span>
                <span className="text-white font-bold">{results.totalMassKg} kg</span>
              </div>
            </div>

            {onNavigateToWorkbench && (
              <button
                type="button"
                onClick={onNavigateToWorkbench}
                className="w-full mt-2 px-3 py-2 rounded-xl bg-[#232529] hover:bg-white/10 border border-white/15 text-xs font-mono text-[#FFC93C] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Full Rules Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: FULL-SCALE 3D WEBGL CAD TWIN STAGE (9 COLS) */}
        <div className="lg:col-span-9 min-w-0">
          <Suspense
            fallback={
              <div className="w-full h-[640px] bg-[#33363B] border border-white/15 rounded-2xl flex items-center justify-center text-xs font-mono text-[#D9DADC]">
                Initializing Full-Scale 3D WebGL CAD Assembly...
              </div>
            }
          >
            <DigitalTwin3DView
              cellId={cellId}
              nSeries={nSeries}
              nParallel={nParallel}
              interconnectId={interconnectId}
              activeCooling={coolingId}
              ambientTempC={ambientTempC}
              maxCoreTempC={results.maxCoreTempC}
              vNom={results.nominalVoltageV}
              iPeakCellA={results.peakCellCurrent}
              r0NomMOhm={r0NomMOhm}
              heightClass="h-[640px]"
            />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
