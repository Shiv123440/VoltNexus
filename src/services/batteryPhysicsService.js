/**
 * VoltNexus Battery Physics Service
 * Pure backend integration service providing electro-thermal simulation,
 * cross-subsystem rule checks, and design preset orchestration.
 */
import { 
  simulatePack, 
  CELL_PRESETS, 
  INTERCONNECT_PRESETS, 
  COOLING_PRESETS, 
  getOcv 
} from '../engine/batterySimulator.js';

export const DESIGN_PRESETS = {
  baseline: {
    id: "baseline",
    name: "Baseline Design",
    description: "13S8P NMC with passive natural convection & 0.15mm nickel strip",
    config: {
      cellId: "molicel_p42a",
      nSeries: 13,
      nParallel: 8,
      interconnectId: "nickel_015",
      coolingId: "natural_air",
      ambientTempC: 35.0,
      packCurrentA: 70.0,
      soh: 1.0,
      bmsAfeAdcErrorMv: 10.0
    }
  },
  optionA: {
    id: "optionA",
    name: "Option A (Optimized NMC)",
    description: "13S8P NMC with 3.5 m/s forced air duct & 1.2mm copper busbars",
    config: {
      cellId: "molicel_p42a",
      nSeries: 13,
      nParallel: 8,
      interconnectId: "copper_12",
      coolingId: "forced_air",
      ambientTempC: 35.0,
      packCurrentA: 70.0,
      soh: 1.0,
      bmsAfeAdcErrorMv: 1.5
    }
  },
  optionB: {
    id: "optionB",
    name: "Option B (High-Safety LFP)",
    description: "16S4P Cylindrical LFP with liquid cold plate & 1.2mm copper busbars",
    config: {
      cellId: "eve_lfp_33140",
      nSeries: 16,
      nParallel: 4,
      interconnectId: "copper_12",
      coolingId: "cold_plate",
      ambientTempC: 35.0,
      packCurrentA: 70.0,
      soh: 1.0,
      bmsAfeAdcErrorMv: 1.5
    }
  }
};

export function runSimulation(params) {
  return simulatePack(params);
}

export { CELL_PRESETS, INTERCONNECT_PRESETS, COOLING_PRESETS, getOcv };
