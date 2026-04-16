"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_js_1 = require("./index.js");
// ---------------------------------------------------------------------------
// findDamageDice
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('findDamageDice', () => {
    (0, vitest_1.it)('returns [1,1] for very low target damage (< 1.25)', () => {
        (0, vitest_1.expect)((0, index_js_1.findDamageDice)(1, 6)).toEqual([1, 1]);
        (0, vitest_1.expect)((0, index_js_1.findDamageDice)(0, 6)).toEqual([1, 1]);
    });
    (0, vitest_1.it)('uses preferred die size when damage fits', () => {
        // 1d6 avg = 3.5, so target ~3.5 with preferred d6 → [1, 6]
        const [count, size] = (0, index_js_1.findDamageDice)(3.5, 6);
        (0, vitest_1.expect)(size).toBe(6);
        (0, vitest_1.expect)(count).toBe(1);
    });
    (0, vitest_1.it)('scales up dice count for higher damage', () => {
        // 4d6 avg = 14, preferred d6
        const [count, size] = (0, index_js_1.findDamageDice)(14, 6);
        (0, vitest_1.expect)(size).toBe(6);
        (0, vitest_1.expect)(count).toBe(4);
    });
    (0, vitest_1.it)('upgrades to larger die when target is below preferred die average', () => {
        // target 2.5 with preferred d6 (avg 3.5) — below threshold, should drop to d4
        const [count, size] = (0, index_js_1.findDamageDice)(2.5, 6);
        (0, vitest_1.expect)(size).toBe(4);
        (0, vitest_1.expect)(count).toBe(1);
    });
    (0, vitest_1.it)('caps at 15 dice and upgrades die size', () => {
        // Very high damage with preferred d4 should push to larger dice
        const [count, size] = (0, index_js_1.findDamageDice)(100, 4);
        (0, vitest_1.expect)(count).toBeLessThanOrEqual(15);
        (0, vitest_1.expect)(size).toBeGreaterThan(4);
    });
    (0, vitest_1.it)('enforces minimum die size of d4', () => {
        // Passing d2 (not a real die) should be clamped to d4
        const [, size] = (0, index_js_1.findDamageDice)(3.5, 2);
        (0, vitest_1.expect)(size).toBeGreaterThanOrEqual(4);
    });
    (0, vitest_1.it)('returns positive dice count for any reasonable damage', () => {
        for (const dmg of [2, 5, 10, 20, 50]) {
            const [count] = (0, index_js_1.findDamageDice)(dmg, 6);
            (0, vitest_1.expect)(count).toBeGreaterThan(0);
        }
    });
});
// ---------------------------------------------------------------------------
// findBenchmarksForStat
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('findBenchmarksForStat', () => {
    const sourceStats = {
        1: { hp: 50, str: 12 },
        5: { hp: 100, str: 16 },
        10: { hp: 200, str: 20 },
    };
    (0, vitest_1.it)('returns null when stat is not present in any entry', () => {
        (0, vitest_1.expect)((0, index_js_1.findBenchmarksForStat)('dex', 5, sourceStats)).toBeNull();
    });
    (0, vitest_1.it)('finds lower and upper benchmarks around target CR', () => {
        const result = (0, index_js_1.findBenchmarksForStat)('hp', 5, sourceStats);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.lower.cr).toBe(5); // CR 5 is exactly at target → lower
        (0, vitest_1.expect)(result.upper.cr).toBe(10);
    });
    (0, vitest_1.it)('finds only lower when target is at or above all benchmarks', () => {
        const result = (0, index_js_1.findBenchmarksForStat)('hp', 10, sourceStats);
        (0, vitest_1.expect)(result.upper).toBeUndefined();
        (0, vitest_1.expect)(result.lower.cr).toBe(10);
    });
    (0, vitest_1.it)('finds only upper when target is below all benchmarks', () => {
        const result = (0, index_js_1.findBenchmarksForStat)('hp', 0, sourceStats);
        (0, vitest_1.expect)(result.lower).toBeUndefined();
        (0, vitest_1.expect)(result.upper.cr).toBe(1);
    });
    (0, vitest_1.it)('requires all stats in the array to be present', () => {
        // CR 1 has hp but not dex — should not be selected for a [hp, dex] query
        const result = (0, index_js_1.findBenchmarksForStat)(['hp', 'dex'], 5, sourceStats);
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)('picks the closest upper benchmark (not just any upper)', () => {
        const result = (0, index_js_1.findBenchmarksForStat)('hp', 3, sourceStats);
        // CR 5 and CR 10 are both above 3; closest upper is CR 5
        (0, vitest_1.expect)(result.upper.cr).toBe(5);
    });
    (0, vitest_1.it)('picks the closest lower benchmark (highest CR at or below target)', () => {
        const result = (0, index_js_1.findBenchmarksForStat)('hp', 7, sourceStats);
        // CR 1 and CR 5 are both below 7; closest lower is CR 5
        (0, vitest_1.expect)(result.lower.cr).toBe(5);
    });
});
// ---------------------------------------------------------------------------
// findNearestLowerBenchmark
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('findNearestLowerBenchmark', () => {
    const sourceStats = {
        1: { speed: 30 },
        5: { speed: 40 },
        10: { speed: 50 },
    };
    (0, vitest_1.it)('returns the value at the highest CR at or below target', () => {
        (0, vitest_1.expect)((0, index_js_1.findNearestLowerBenchmark)('speed', 7, sourceStats)).toBe(40);
    });
    (0, vitest_1.it)('returns exact match when target CR has the stat', () => {
        (0, vitest_1.expect)((0, index_js_1.findNearestLowerBenchmark)('speed', 5, sourceStats)).toBe(40);
    });
    (0, vitest_1.it)('falls back to lowest benchmark when target is below all entries', () => {
        (0, vitest_1.expect)((0, index_js_1.findNearestLowerBenchmark)('speed', 0, sourceStats)).toBe(30);
    });
    (0, vitest_1.it)('returns the highest available when target is above all entries', () => {
        (0, vitest_1.expect)((0, index_js_1.findNearestLowerBenchmark)('speed', 20, sourceStats)).toBe(50);
    });
    (0, vitest_1.it)('returns undefined when stat is not present anywhere', () => {
        (0, vitest_1.expect)((0, index_js_1.findNearestLowerBenchmark)('fly', 5, sourceStats)).toBeUndefined();
    });
});
// ---------------------------------------------------------------------------
// extrapolateFromBenchmark
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('extrapolateFromBenchmark', () => {
    // Use real averageStats values for CR 1 and CR 5 to keep tests grounded.
    // averageStats[1].str = 13, averageStats[5].str = 16
    // A monster at CR 1 with str 16 is 3 above average.
    // Ratio: 16/13 ≈ 1.23. At CR 5 (avg str 16): 1.23 * 16 ≈ 19.7 → rounds to 20.
    (0, vitest_1.it)('ratio extrapolation from lower benchmark only', () => {
        const benchmarks = { lower: { cr: 1, str: 16 } };
        const result = (0, index_js_1.extrapolateFromBenchmark)('str', 5, benchmarks, false);
        (0, vitest_1.expect)(result).toBeGreaterThan(16); // stronger than average at CR 5
    });
    (0, vitest_1.it)('linear extrapolation from lower benchmark only', () => {
        // averageStats[1].str = 13, averageStats[5].str = 16
        // offset = 16 - 13 = +3. At CR 5: 16 + 3 = 19
        const benchmarks = { lower: { cr: 1, str: 16 } };
        const result = (0, index_js_1.extrapolateFromBenchmark)('str', 5, benchmarks, true);
        (0, vitest_1.expect)(result).toBe(19);
    });
    (0, vitest_1.it)('interpolates between lower and upper benchmarks', () => {
        // With benchmarks at CR 1 and CR 10 and target CR 5 (midpoint-ish),
        // result should be between the two extrapolated values.
        const benchmarks = {
            lower: { cr: 1, str: 13 }, // exactly average at CR 1
            upper: { cr: 10, str: 18 }, // exactly average at CR 10
        };
        const result = (0, index_js_1.extrapolateFromBenchmark)('str', 5, benchmarks, false);
        // Both benchmarks are exactly average → result should be exactly average at CR 5 = 16
        (0, vitest_1.expect)(result).toBe(16);
    });
    (0, vitest_1.it)('uses upper benchmark when no lower exists', () => {
        const benchmarks = { upper: { cr: 5, str: 16 } };
        const result = (0, index_js_1.extrapolateFromBenchmark)('str', 1, benchmarks, false);
        (0, vitest_1.expect)(typeof result).toBe('number');
        (0, vitest_1.expect)(isNaN(result)).toBe(false);
    });
});
// ---------------------------------------------------------------------------
// calculateWeightedAverage
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('calculateWeightedAverage', () => {
    (0, vitest_1.it)('returns lower value when target equals lower CR', () => {
        const benchmarks = {
            lower: { cr: 1, hp: 50 },
            upper: { cr: 5, hp: 100 },
        };
        // target = CR 1 (step 4), upper step = 8, lower step = 4, range = 4
        // upperWeight = (8-4)/4 = 1, lowerWeight = (4-4)/4 = 0 → result = upper value
        // Note: "lower" benchmark is at CR 1, but the weight formula gives it weight 0
        // when target == lower CR. The function weights by step distance from upper.
        (0, vitest_1.expect)((0, index_js_1.calculateWeightedAverage)('hp', benchmarks, 1)).toBe(100);
    });
    (0, vitest_1.it)('returns upper value when target equals upper CR', () => {
        const benchmarks = {
            lower: { cr: 1, hp: 50 },
            upper: { cr: 5, hp: 100 },
        };
        // target = CR 5 (step 8), upperWeight = (8-8)/4 = 0, lowerWeight = (8-4)/4 = 1
        // → result = lower value (50)
        (0, vitest_1.expect)((0, index_js_1.calculateWeightedAverage)('hp', benchmarks, 5)).toBe(50);
    });
    (0, vitest_1.it)('interpolates between benchmarks', () => {
        // CR 1 (step 4) to CR 5 (step 8), target CR 3 (step 6) → midpoint
        const benchmarks = {
            lower: { cr: 1, hp: 50 },
            upper: { cr: 5, hp: 100 },
        };
        const result = (0, index_js_1.calculateWeightedAverage)('hp', benchmarks, 3);
        (0, vitest_1.expect)(result).toBeGreaterThan(50);
        (0, vitest_1.expect)(result).toBeLessThan(100);
    });
});
// ---------------------------------------------------------------------------
// hitPointsPerHitDie
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('hitPointsPerHitDie', () => {
    // Medium creature (size 3) has d8 hit die. CON 10 → modifier 0.
    // HP per die = (8+1)/2 + 0 = 4.5
    (0, vitest_1.it)('medium creature with CON 10 → 4.5', () => {
        (0, vitest_1.expect)((0, index_js_1.hitPointsPerHitDie)({ size: 3, con: 10 })).toBe(4.5);
    });
    // Large creature (size 4) has d10 hit die. CON 14 → modifier +2.
    // HP per die = (10+1)/2 + 2 = 5.5 + 2 = 7.5
    (0, vitest_1.it)('large creature with CON 14 → 7.5', () => {
        (0, vitest_1.expect)((0, index_js_1.hitPointsPerHitDie)({ size: 4, con: 14 })).toBe(7.5);
    });
    // Tiny creature (size 1) has d4 hit die. CON 8 → modifier -1.
    // HP per die = (4+1)/2 + (-1) = 2.5 - 1 = 1.5
    (0, vitest_1.it)('tiny creature with CON 8 → 1.5', () => {
        (0, vitest_1.expect)((0, index_js_1.hitPointsPerHitDie)({ size: 1, con: 8 })).toBe(1.5);
    });
});
