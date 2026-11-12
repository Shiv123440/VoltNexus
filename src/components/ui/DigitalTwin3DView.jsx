/**
 * VoltNexus MBSE Studio - 3D CAD & Digital Twin Stage
 * Extracted & adapted for batterylab_web.
 *
 * Implements:
 * - Real 3D cylindrical cell array (13S8P = 104 cells or dynamic Ns x Np)
 * - 4-Layer Subsystem X-Ray: Assembly, Busbars, Thermal Heatmap, BMS NTC Sensors
 * - Continuous Exploded View displacement
 * - Real-time False-Color Thermal Gradient Mapping (Inlet Cool to Core Hotspot)
 * - Per-cell hover & click telemetry HUD (Sx, Py, V_cell, T_cell, I_share, DCIR)
 * - Fullscreen expand toggle for inspecting the 3D CAD assembly at full scale
 */

import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Thermometer,
  Zap,
  Cpu,
  Activity
} from 'lucide-react';

function getThermalColor(tempC) {
  if (tempC <= 35) return new THREE.Color('#2563EB');
  if (tempC <= 42) {
    const t = (tempC - 35) / 7;
    return new THREE.Color('#2563EB').lerp(new THREE.Color('#059669'), t);
  }
  if (tempC <= 50) {
    const t = (tempC - 42) / 8;
    return new THREE.Color('#059669').lerp(new THREE.Color('#F59E0B'), t);
  }
  const t = Math.min(1.0, (tempC - 50) / 12);
  return new THREE.Color('#F59E0B').lerp(new THREE.Color('#DC2626'), t);
}

function CylindricalCellMesh({
  seriesIdx,
  parallelIdx,
  nSeries,
  nParallel,
  position,
  height,
  radius,
  layer,
  tCoreMax,
  ambTempC,
  vCellNom,
  iPeakCell,
  r0NomMOhm,
  isHovered,
  isSelected,
  onHover,
  onClick
}) {
  const meshRef = useRef(null);

  const { localTemp, cellV, currentShare, dcir } = useMemo(() => {
    const posFlow = nSeries > 1 ? seriesIdx / (nSeries - 1) : 0.5;
    const normP = nParallel > 1 ? parallelIdx / (nParallel - 1) : 0.5;
    const factorCore = 1.0 - Math.abs(normP - 0.5) * 1.4;
    const temp =
      ambTempC +
      (tCoreMax - ambTempC) * (0.6 * posFlow + 0.4 * Math.max(0, factorCore));

    const vOffset = (((seriesIdx * 7 + parallelIdx * 13) % 11) - 5) * 0.002;
    const iOffset = (((parallelIdx * 5 + seriesIdx * 3) % 7) - 3) * 0.08;
    const rOffset = (((seriesIdx * 11 + parallelIdx * 17) % 9) - 4) * 0.15;

    return {
      localTemp: Number(temp.toFixed(1)),
      cellV: Number((vCellNom + vOffset).toFixed(3)),
      currentShare: Number((iPeakCell + iOffset).toFixed(2)),
      dcir: Number((r0NomMOhm + rOffset).toFixed(2))
    };
  }, [
    seriesIdx,
    parallelIdx,
    nSeries,
    nParallel,
    ambTempC,
    tCoreMax,
    vCellNom,
    iPeakCell,
    r0NomMOhm
  ]);

  const cellColor = useMemo(() => {
    if (layer === 'thermal') {
      return getThermalColor(localTemp);
    }
    if (layer === 'busbars') {
      return new THREE.Color('#334155');
    }
    if (layer === 'bms') {
      const isProbe =
        (seriesIdx === 0 && parallelIdx === Math.floor(nParallel / 2)) ||
        (seriesIdx === Math.floor(nSeries / 2) &&
          parallelIdx === Math.floor(nParallel / 2)) ||
        (seriesIdx === nSeries - 1 && parallelIdx === Math.floor(nParallel / 2));
      return isProbe ? new THREE.Color('#38BDF8') : new THREE.Color('#1E293B');
    }
    if (isSelected) return new THREE.Color('#38BDF8');
    if (isHovered) return new THREE.Color('#60A5FA');
    return new THREE.Color('#1E293B');
  }, [
    layer,
    localTemp,
    isSelected,
    isHovered,
    seriesIdx,
    parallelIdx,
    nSeries,
    nParallel
  ]);

  const cellData = useMemo(
    () => ({
      seriesIdx: seriesIdx + 1,
      parallelIdx: parallelIdx + 1,
      temp: localTemp,
      voltage: cellV,
      currentShare,
      dcir
    }),
    [seriesIdx, parallelIdx, localTemp, cellV, currentShare, dcir]
  );

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(cellData);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onClick(cellData);
        }}
      >
        <cylinderGeometry args={[radius, radius, height, 16]} />
        <meshStandardMaterial
          color={cellColor}
          metalness={0.7}
          roughness={0.3}
          emissive={isHovered || isSelected ? '#1E40AF' : '#000000'}
          emissiveIntensity={isHovered ? 0.4 : 0.0}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.08, 0]}>
        <cylinderGeometry args={[radius * 0.45, radius * 0.45, 0.16, 12]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[0, height / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.48, radius * 0.85, 16]} />
        <meshBasicMaterial color="#DC2626" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BusbarSystem({
  nSeries,
  nParallel,
  pitchX,
  pitchY,
  height,
  interconnectId,
  explodedOffset
}) {
  const isCopper = interconnectId === 'copper_12';
  const busbarColor = isCopper ? '#D97706' : '#94A3B8';
  const busbarThickness = isCopper ? 0.35 : 0.15;

  const busbarLines = useMemo(() => {
    const bars = [];
    const totalX = (nSeries - 1) * pitchX;
    const startX = -totalX / 2;
    const totalY = (nParallel - 1) * pitchY;

    for (let s = 0; s < nSeries; s++) {
      const posX = startX + s * pitchX;
      bars.push(
        <mesh
          key={`busbar-${s}`}
          position={[posX, height / 2 + 0.25 + explodedOffset, 0]}
        >
          <boxGeometry args={[busbarThickness, 0.12, totalY + 1.2]} />
          <meshStandardMaterial
            color={busbarColor}
            metalness={0.85}
            roughness={0.2}
            emissive={isCopper ? '#78350F' : '#1E293B'}
            emissiveIntensity={0.2}
          />
        </mesh>
      );
    }
    return bars;
  }, [
    nSeries,
    nParallel,
    pitchX,
    pitchY,
    height,
    isCopper,
    busbarColor,
    busbarThickness,
    explodedOffset
  ]);

  return <group>{busbarLines}</group>;
}

function BmsHarnessProbes({
  nSeries,
  pitchX,
  height,
  explodedOffset
}) {
  const totalX = (nSeries - 1) * pitchX;
  const startX = -totalX / 2;

  const probes = [
    {
      id: 'NTC-1',
      pos: [startX, height / 2 + 0.6 + explodedOffset, 0],
      color: '#38BDF8'
    },
    {
      id: 'NTC-2',
      pos: [0, height / 2 + 0.6 + explodedOffset, 0],
      color: '#F59E0B'
    },
    {
      id: 'NTC-3',
      pos: [-startX, height / 2 + 0.6 + explodedOffset, 0],
      color: '#EF4444'
    }
  ];

  return (
    <group>
      {probes.map((p) => (
        <group key={p.id} position={p.pos}>
          <mesh>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.6, 8]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DuctFlowMarkers({ length }) {
  return (
    <group>
      <group position={[-length / 2 - 1.6, 0, 0]}>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.65}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
        >
          COOLANT INLET
        </Text>
      </group>

      <group position={[length / 2 + 1.6, 0, 0]}>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.65}
          color="#EF4444"
          anchorX="center"
          anchorY="middle"
        >
          OUTLET FLUID (ΔT)
        </Text>
      </group>
    </group>
  );
}

function BatteryModuleAssembly({
  simData,
  layer,
  explodedPct,
  hoveredCell,
  selectedCell,
  setHoveredCell,
  setSelectedCell
}) {
  const {
    nSeries,
    nParallel,
    cellId,
    interconnectId,
    coolingId,
    ambientTempC,
    vNom,
    iPeakCellA,
    r0NomMOhm,
    tCoreMaxC
  } = simData;

  const cellRadius = 0.85;
  const cellHeight = cellId.includes('33140') ? 5.2 : 3.8;
  const pitchX = cellRadius * 2 + 0.35;
  const pitchY = cellRadius * 2 + 0.25;

  const totalLength = nSeries * pitchX;
  const totalWidth = nParallel * pitchY;

  const topHarnessOffset = (explodedPct / 100) * 4.0;
  const bottomDuctOffset = -(explodedPct / 100) * 4.0;

  const cells = useMemo(() => {
    const list = [];
    const startX = -((nSeries - 1) * pitchX) / 2;
    const startY = -((nParallel - 1) * pitchY) / 2;

    for (let s = 0; s < nSeries; s++) {
      for (let p = 0; p < nParallel; p++) {
        const posX = startX + s * pitchX;
        const posZ = startY + p * pitchY;
        const isHovered =
          hoveredCell &&
          hoveredCell.seriesIdx === s + 1 &&
          hoveredCell.parallelIdx === p + 1;
        const isSelected =
          selectedCell &&
          selectedCell.seriesIdx === s + 1 &&
          selectedCell.parallelIdx === p + 1;

        list.push(
          <CylindricalCellMesh
            key={`cell-${s}-${p}`}
            seriesIdx={s}
            parallelIdx={p}
            nSeries={nSeries}
            nParallel={nParallel}
            position={[posX, 0, posZ]}
            height={cellHeight}
            radius={cellRadius}
            layer={layer}
            tCoreMax={tCoreMaxC}
            ambTempC={ambientTempC}
            vCellNom={vNom / nSeries}
            iPeakCell={iPeakCellA}
            r0NomMOhm={r0NomMOhm}
            isHovered={Boolean(isHovered)}
            isSelected={Boolean(isSelected)}
            onHover={setHoveredCell}
            onClick={setSelectedCell}
          />
        );
      }
    }
    return list;
  }, [
    nSeries,
    nParallel,
    pitchX,
    pitchY,
    cellHeight,
    cellRadius,
    layer,
    tCoreMaxC,
    ambientTempC,
    vNom,
    iPeakCellA,
    r0NomMOhm,
    hoveredCell,
    selectedCell,
    setHoveredCell,
    setSelectedCell
  ]);

  return (
    <group>
      <group>{cells}</group>

      {(layer === 'assembly' || layer === 'busbars') && (
        <BusbarSystem
          nSeries={nSeries}
          nParallel={nParallel}
          pitchX={pitchX}
          pitchY={pitchY}
          height={cellHeight}
          interconnectId={interconnectId}
          explodedOffset={topHarnessOffset}
        />
      )}

      {(layer === 'assembly' || layer === 'bms') && (
        <BmsHarnessProbes
          nSeries={nSeries}
          pitchX={pitchX}
          height={cellHeight}
          explodedOffset={topHarnessOffset}
        />
      )}

      {layer === 'thermal' && <DuctFlowMarkers length={totalLength} />}

      <mesh position={[0, -cellHeight / 2 - 0.35 + bottomDuctOffset, 0]}>
        <boxGeometry args={[totalLength + 2.0, 0.45, totalWidth + 1.6]} />
        <meshStandardMaterial
          color={coolingId === 'cold_plate' ? '#0284C7' : '#1E293B'}
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {layer === 'assembly' && (
        <mesh position={[0, cellHeight / 2 + 0.65 + topHarnessOffset, 0]}>
          <boxGeometry args={[totalLength + 1.6, 0.15, totalWidth + 1.2]} />
          <meshPhysicalMaterial
            color="#E2E8F0"
            transparent
            opacity={0.18}
            roughness={0.1}
            transmission={0.85}
            thickness={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

export default function DigitalTwin3DView({
  simulation = null,
  cellId = 'molicel_p42a',
  nSeries = 13,
  nParallel = 8,
  interconnectId = 'copper_12',
  activeCooling = 'forced_air',
  ambientTempC = 35.0,
  maxCoreTempC = 43.2,
  vNom = 46.8,
  iPeakCellA = 9.47,
  r0NomMOhm = 12.32
}) {
  const [layer, setLayer] = useState('thermal');
  const [explodedPct, setExplodedPct] = useState(0);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cameraKey, setCameraKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  const simData = useMemo(() => {
    if (simulation) {
      return {
        nSeries: simulation.parameters.nSeries,
        nParallel: simulation.parameters.nParallel,
        cellId: simulation.parameters.cellId,
        interconnectId: simulation.parameters.interconnectId,
        coolingId: simulation.parameters.coolingId,
        ambientTempC: simulation.parameters.ambientTempC,
        vNom: simulation.sizing.vNom,
        iPeakCellA: simulation.electrical.iPeakCellA,
        r0NomMOhm: simulation.electrical.r0NomMOhm,
        tCoreMaxC: simulation.thermal.tCoreMaxC
      };
    }
    return {
      nSeries,
      nParallel,
      cellId,
      interconnectId,
      coolingId: activeCooling,
      ambientTempC,
      vNom,
      iPeakCellA,
      r0NomMOhm,
      tCoreMaxC: maxCoreTempC
    };
  }, [
    simulation,
    nSeries,
    nParallel,
    cellId,
    interconnectId,
    activeCooling,
    ambientTempC,
    vNom,
    iPeakCellA,
    r0NomMOhm,
    maxCoreTempC
  ]);

  const resetCamera = () => {
    setCameraKey((prev) => prev + 1);
  };

  const activeCell = selectedCell || hoveredCell;
  const totalCells = simData.nSeries * simData.nParallel;

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#070A11] flex flex-col overflow-hidden select-none'
          : 'relative w-full h-[540px] bg-[#070A11] border border-white/10 rounded-2xl flex flex-col overflow-hidden select-none shadow-2xl'
      }
    >
      {/* Top Control Bar */}
      <div className="shrink-0 z-20 p-2.5 bg-[#0B0F19]/95 border-b border-[#172033] flex flex-wrap items-center justify-between gap-2">
        {/* Layer Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-[#070A11] p-1 rounded-lg border border-[#172033]">
          <span className="text-[10px] font-mono text-slate-400 px-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-sky-400" />
            X-RAY:
          </span>

          <button
            type="button"
            onClick={() => setLayer('assembly')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              layer === 'assembly'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#172033]'
            }`}
          >
            1. Assembly
          </button>

          <button
            type="button"
            onClick={() => setLayer('busbars')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
              layer === 'busbars'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#172033]'
            }`}
          >
            <Zap className="w-3 h-3" />
            2. Busbars
          </button>

          <button
            type="button"
            onClick={() => setLayer('thermal')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
              layer === 'thermal'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#172033]'
            }`}
          >
            <Thermometer className="w-3 h-3" />
            3. Thermal
          </button>

          <button
            type="button"
            onClick={() => setLayer('bms')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
              layer === 'bms'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#172033]'
            }`}
          >
            <Cpu className="w-3 h-3" />
            4. BMS
          </button>
        </div>

        {/* Exploded View Slider, Reset & Fullscreen */}
        <div className="flex items-center gap-2.5 px-2 py-1 bg-[#070A11] border border-[#172033] rounded-lg">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400">EXPLODE:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={explodedPct}
              onChange={(e) => setExplodedPct(Number(e.target.value))}
              className="w-16 sm:w-20 accent-sky-500 cursor-pointer"
            />
            <span className="text-[11px] font-mono text-sky-400 min-w-[3ch]">
              {explodedPct}%
            </span>
          </div>

          <div className="h-3.5 w-px bg-[#222F49]" />

          <button
            type="button"
            onClick={resetCamera}
            title="Reset 3D Camera View"
            className="p-1 rounded hover:bg-[#172033] text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand 3D CAD Viewport'}
            className="p-1 rounded hover:bg-[#172033] text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="flex-1 min-h-0 w-full cursor-grab active:cursor-grabbing relative">
        <Canvas
          key={cameraKey}
          camera={{ position: [21, 16, 26], fov: 38 }}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#070A11']} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[20, 30, 20]} intensity={1.4} />
          <directionalLight position={[-20, -10, -20]} intensity={0.4} />
          <pointLight position={[0, 15, 0]} intensity={0.8} color="#38BDF8" />

          <Suspense fallback={null}>
            <BatteryModuleAssembly
              simData={simData}
              layer={layer}
              explodedPct={explodedPct}
              hoveredCell={hoveredCell}
              selectedCell={selectedCell}
              setHoveredCell={setHoveredCell}
              setSelectedCell={setSelectedCell}
            />
          </Suspense>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        </Canvas>
      </div>

      {/* Bottom Telemetry & Inspection Footer */}
      <div className="shrink-0 z-20 p-3 bg-[#0B0F19]/95 border-t border-[#172033] flex flex-wrap items-center justify-between gap-3">
        {/* Per-Cell Telemetry Readout */}
        <div className="flex-1 min-w-[230px]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold text-slate-200">
                {activeCell
                  ? `CELL TELEMETRY [S${activeCell.seriesIdx}:P${activeCell.parallelIdx}]`
                  : `${simData.nSeries}S${simData.nParallel}P CAD TWIN • ${totalCells} CELLS • ${simData.vNom}V`}
              </span>
            </div>
            {activeCell && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                ACTIVE
              </span>
            )}
          </div>

          {activeCell ? (
            <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
              <div className="bg-[#111726] px-2 py-1 rounded border border-[#172033]">
                <div className="text-[9px] text-slate-400">TEMP</div>
                <div
                  className={`font-bold ${
                    activeCell.temp > 52
                      ? 'text-rose-400'
                      : activeCell.temp > 45
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {activeCell.temp}°C
                </div>
              </div>
              <div className="bg-[#111726] px-2 py-1 rounded border border-[#172033]">
                <div className="text-[9px] text-slate-400">VOLT</div>
                <div className="font-bold text-sky-300">{activeCell.voltage}V</div>
              </div>
              <div className="bg-[#111726] px-2 py-1 rounded border border-[#172033]">
                <div className="text-[9px] text-slate-400">CURRENT</div>
                <div className="font-bold text-slate-200">
                  {activeCell.currentShare}A
                </div>
              </div>
              <div className="bg-[#111726] px-2 py-1 rounded border border-[#172033]">
                <div className="text-[9px] text-slate-400">DCIR</div>
                <div className="font-bold text-slate-200">{activeCell.dcir}mΩ</div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono">
              Drag to orbit, scroll to zoom, or hover/click any of the {totalCells} cells to inspect local telemetry.
            </div>
          )}
        </div>

        {/* Thermal Gradient Legend (Layer 3) */}
        {layer === 'thermal' && (
          <div className="bg-[#111726] border border-[#172033] rounded-lg px-3 py-2 shrink-0">
            <div className="text-[10px] font-mono text-slate-300 mb-1 font-semibold flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-400" />
              THERMAL GRADIENT
            </div>
            <div className="w-44 h-2 rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 via-amber-500 to-red-600 mb-1" />
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>≤35°C</span>
              <span>42°C</span>
              <span>50°C</span>
              <span className="text-rose-400 font-bold">&gt;52°C</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
