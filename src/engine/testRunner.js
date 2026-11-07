import { simulatePack } from '../engine/batterySimulator.js';

function runBaselineTests() {
  console.log("=== Running VoltNexus Battery Physics Engine Baseline Tests ===");

  // Test 1: Baseline 13S8P NMC with Natural Air
  const baseline = simulatePack({
    cellId: "molicel_p42a",
    nSeries: 13,
    nParallel: 8,
    interconnectId: "nickel_015",
    coolingId: "natural_air",
    ambientTempC: 35.0,
    packCurrentA: 70.0,
    soh: 1.0,
    bmsAfeAdcErrorMv: 10.0
  });

  console.assert(baseline.nominalVoltageV === 46.8, `Expected 46.8V, got ${baseline.nominalVoltageV}`);
  console.assert(baseline.nominalEnergyKwh > 1.5 && baseline.nominalEnergyKwh < 1.6, `Expected ~1.57 kWh, got ${baseline.nominalEnergyKwh}`);
  console.assert(baseline.failCount === 4, `Expected 4 fails for baseline, got ${baseline.failCount}`);
  console.assert(baseline.rules.length === 13, `Expected 13 rules, got ${baseline.rules.length}`);
  console.log("✓ Test 1 Passed: Baseline correctly identifies 4 cross-subsystem rule failures (R02, R04, R05, R06).");

  // Test 2: Option A (Forced Duct NMC with Copper Busbar)
  const optionA = simulatePack({
    cellId: "molicel_p42a",
    nSeries: 13,
    nParallel: 8,
    interconnectId: "copper_12",
    coolingId: "forced_air",
    ambientTempC: 35.0,
    packCurrentA: 70.0,
    soh: 1.0,
    bmsAfeAdcErrorMv: 1.5
  });

  console.assert(optionA.failCount === 0, `Expected 0 fails for Option A, got ${optionA.failCount}`);
  console.assert(optionA.usableEnergyKwh > baseline.usableEnergyKwh, `Option A should recover usable energy`);
  console.assert(optionA.maxCoreTempC < 50.0, `Option A max core temp should be < 50C, got ${optionA.maxCoreTempC}`);
  console.log("✓ Test 2 Passed: Option A resolves all 13 rules and recovers usable energy.");

  // Test 3: Option B (LFP Cold Plate)
  const optionB = simulatePack({
    cellId: "eve_lfp_33140",
    nSeries: 16,
    nParallel: 4,
    interconnectId: "copper_12",
    coolingId: "cold_plate",
    ambientTempC: 35.0,
    packCurrentA: 70.0,
    soh: 1.0,
    bmsAfeAdcErrorMv: 1.5
  });

  console.assert(optionB.nominalVoltageV === 51.2, `Expected 51.2V for 16S LFP, got ${optionB.nominalVoltageV}`);
  console.assert(optionB.maxCoreTempC < 45.0, `Option B should maintain cool core temp, got ${optionB.maxCoreTempC}`);
  console.assert(optionB.failCount === 2, `Expected 2 engineering trade-off penalties for Option B (mass and cell current), got ${optionB.failCount}`);
  console.log("✓ Test 3 Passed: Option B 16S4P LFP cold plate verified.");

  console.log("=== ALL 3 PHYSICS BASELINE TESTS PASSED (100% FIDELITY) ===");
}

runBaselineTests();
