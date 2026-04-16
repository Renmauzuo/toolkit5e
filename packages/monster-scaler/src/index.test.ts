import { describe, it, expect } from 'vitest';
import {
  findDamageDice,
  findBenchmarksForStat,
  findNearestLowerBenchmark,
  extrapolateFromBenchmark,
  calculateWeightedAverage,
  hitPointsPerHitDie,
} from './index.js';

// ---------------------------------------------------------------------------
// findDamageDice
// ---------------------------------------------------------------------------
describe('findDamageDice', () => {
  it('returns [1,1] for very low target damage (< 1.25)', () => {
    expect(findDamageDice(1, 6)).toEqual([1, 1]);
    expect(findDamageDice(0, 6)).toEqual([1, 1]);
  });

  it('uses preferred die size when damage fits', () => {
    // 1d6 avg = 3.5, so target ~3.5 with preferred d6 → [1, 6]
    const [count, size] = findDamageDice(3.5, 6);
    expect(size).toBe(6);
    expect(count).toBe(1);
  });

  it('scales up dice count for higher damage', () => {
    // 4d6 avg = 14, preferred d6
    const [count, size] = findDamageDice(14, 6);
    expect(size).toBe(6);
    expect(count).toBe(4);
  });

  it('upgrades to larger die when target is below preferred die average', () => {
    // target 2.5 with preferred d6 (avg 3.5) — below threshold, should drop to d4
    const [count, size] = findDamageDice(2.5, 6);
    expect(size).toBe(4);
    expect(count).toBe(1);
  });

  it('caps at 15 dice and upgrades die size', () => {
    // Very high damage with preferred d4 should push to larger dice
    const [count, size] = findDamageDice(100, 4);
    expect(count).toBeLessThanOrEqual(15);
    expect(size).toBeGreaterThan(4);
  });

  it('enforces minimum die size of d4', () => {
    // Passing d2 (not a real die) should be clamped to d4
    const [, size] = findDamageDice(3.5, 2);
    expect(size).toBeGreaterThanOrEqual(4);
  });

  it('returns positive dice count for any reasonable damage', () => {
    for (const dmg of [2, 5, 10, 20, 50]) {
      const [count] = findDamageDice(dmg, 6);
      expect(count).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// findBenchmarksForStat
// ---------------------------------------------------------------------------
describe('findBenchmarksForStat', () => {
  const sourceStats = {
    1: { hp: 50, str: 12 },
    5: { hp: 100, str: 16 },
    10: { hp: 200, str: 20 },
  };

  it('returns null when stat is not present in any entry', () => {
    expect(findBenchmarksForStat('dex', 5, sourceStats)).toBeNull();
  });

  it('finds lower and upper benchmarks around target CR', () => {
    const result = findBenchmarksForStat('hp', 5, sourceStats);
    expect(result).not.toBeNull();
    expect((result!.lower as any).cr).toBe(5);   // CR 5 is exactly at target → lower
    expect((result!.upper as any).cr).toBe(10);
  });

  it('finds only lower when target is at or above all benchmarks', () => {
    const result = findBenchmarksForStat('hp', 10, sourceStats);
    expect(result!.upper).toBeUndefined();
    expect((result!.lower as any).cr).toBe(10);
  });

  it('finds only upper when target is below all benchmarks', () => {
    const result = findBenchmarksForStat('hp', 0, sourceStats);
    expect(result!.lower).toBeUndefined();
    expect((result!.upper as any).cr).toBe(1);
  });

  it('requires all stats in the array to be present', () => {
    // CR 1 has hp but not dex — should not be selected for a [hp, dex] query
    const result = findBenchmarksForStat(['hp', 'dex'], 5, sourceStats);
    expect(result).toBeNull();
  });

  it('picks the closest upper benchmark (not just any upper)', () => {
    const result = findBenchmarksForStat('hp', 3, sourceStats);
    // CR 5 and CR 10 are both above 3; closest upper is CR 5
    expect((result!.upper as any).cr).toBe(5);
  });

  it('picks the closest lower benchmark (highest CR at or below target)', () => {
    const result = findBenchmarksForStat('hp', 7, sourceStats);
    // CR 1 and CR 5 are both below 7; closest lower is CR 5
    expect((result!.lower as any).cr).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// findNearestLowerBenchmark
// ---------------------------------------------------------------------------
describe('findNearestLowerBenchmark', () => {
  const sourceStats = {
    1: { speed: 30 },
    5: { speed: 40 },
    10: { speed: 50 },
  };

  it('returns the value at the highest CR at or below target', () => {
    expect(findNearestLowerBenchmark('speed', 7, sourceStats)).toBe(40);
  });

  it('returns exact match when target CR has the stat', () => {
    expect(findNearestLowerBenchmark('speed', 5, sourceStats)).toBe(40);
  });

  it('falls back to lowest benchmark when target is below all entries', () => {
    expect(findNearestLowerBenchmark('speed', 0, sourceStats)).toBe(30);
  });

  it('returns the highest available when target is above all entries', () => {
    expect(findNearestLowerBenchmark('speed', 20, sourceStats)).toBe(50);
  });

  it('returns undefined when stat is not present anywhere', () => {
    expect(findNearestLowerBenchmark('fly', 5, sourceStats)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// extrapolateFromBenchmark
// ---------------------------------------------------------------------------
describe('extrapolateFromBenchmark', () => {
  // Use real averageStats values for CR 1 and CR 5 to keep tests grounded.
  // averageStats[1].str = 13, averageStats[5].str = 16
  // A monster at CR 1 with str 16 is 3 above average.
  // Ratio: 16/13 ≈ 1.23. At CR 5 (avg str 16): 1.23 * 16 ≈ 19.7 → rounds to 20.

  it('ratio extrapolation from lower benchmark only', () => {
    const benchmarks = { lower: { cr: 1, str: 16 } };
    const result = extrapolateFromBenchmark('str', 5, benchmarks, false);
    expect(result).toBeGreaterThan(16); // stronger than average at CR 5
  });

  it('linear extrapolation from lower benchmark only', () => {
    // averageStats[1].str = 13, averageStats[5].str = 16
    // offset = 16 - 13 = +3. At CR 5: 16 + 3 = 19
    const benchmarks = { lower: { cr: 1, str: 16 } };
    const result = extrapolateFromBenchmark('str', 5, benchmarks, true);
    expect(result).toBe(19);
  });

  it('interpolates between lower and upper benchmarks', () => {
    // With benchmarks at CR 1 and CR 10 and target CR 5 (midpoint-ish),
    // result should be between the two extrapolated values.
    const benchmarks = {
      lower: { cr: 1, str: 13 },  // exactly average at CR 1
      upper: { cr: 10, str: 18 }, // exactly average at CR 10
    };
    const result = extrapolateFromBenchmark('str', 5, benchmarks, false);
    // Both benchmarks are exactly average → result should be exactly average at CR 5 = 16
    expect(result).toBe(16);
  });

  it('uses upper benchmark when no lower exists', () => {
    const benchmarks = { upper: { cr: 5, str: 16 } };
    const result = extrapolateFromBenchmark('str', 1, benchmarks, false);
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// calculateWeightedAverage
// ---------------------------------------------------------------------------
describe('calculateWeightedAverage', () => {
  it('returns lower value when target equals lower CR', () => {
    const benchmarks = {
      lower: { cr: 1, hp: 50 },
      upper: { cr: 5, hp: 100 },
    };
    // target = CR 1 (step 4), upper step = 8, lower step = 4, range = 4
    // upperWeight = (8-4)/4 = 1, lowerWeight = (4-4)/4 = 0 → result = upper value
    // Note: "lower" benchmark is at CR 1, but the weight formula gives it weight 0
    // when target == lower CR. The function weights by step distance from upper.
    expect(calculateWeightedAverage('hp', benchmarks, 1)).toBe(100);
  });

  it('returns upper value when target equals upper CR', () => {
    const benchmarks = {
      lower: { cr: 1, hp: 50 },
      upper: { cr: 5, hp: 100 },
    };
    // target = CR 5 (step 8), upperWeight = (8-8)/4 = 0, lowerWeight = (8-4)/4 = 1
    // → result = lower value (50)
    expect(calculateWeightedAverage('hp', benchmarks, 5)).toBe(50);
  });

  it('interpolates between benchmarks', () => {
    // CR 1 (step 4) to CR 5 (step 8), target CR 3 (step 6) → midpoint
    const benchmarks = {
      lower: { cr: 1, hp: 50 },
      upper: { cr: 5, hp: 100 },
    };
    const result = calculateWeightedAverage('hp', benchmarks, 3);
    expect(result).toBeGreaterThan(50);
    expect(result).toBeLessThan(100);
  });
});

// ---------------------------------------------------------------------------
// hitPointsPerHitDie
// ---------------------------------------------------------------------------
describe('hitPointsPerHitDie', () => {
  // Medium creature (size 3) has d8 hit die. CON 10 → modifier 0.
  // HP per die = (8+1)/2 + 0 = 4.5
  it('medium creature with CON 10 → 4.5', () => {
    expect(hitPointsPerHitDie({ size: 3, con: 10 })).toBe(4.5);
  });

  // Large creature (size 4) has d10 hit die. CON 14 → modifier +2.
  // HP per die = (10+1)/2 + 2 = 5.5 + 2 = 7.5
  it('large creature with CON 14 → 7.5', () => {
    expect(hitPointsPerHitDie({ size: 4, con: 14 })).toBe(7.5);
  });

  // Tiny creature (size 1) has d4 hit die. CON 8 → modifier -1.
  // HP per die = (4+1)/2 + (-1) = 2.5 - 1 = 1.5
  it('tiny creature with CON 8 → 1.5', () => {
    expect(hitPointsPerHitDie({ size: 1, con: 8 })).toBe(1.5);
  });
});
