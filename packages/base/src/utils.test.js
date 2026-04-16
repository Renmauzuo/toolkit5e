"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const utils_js_1 = require("./utils.js");
// ---------------------------------------------------------------------------
// abilityScoreModifier
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('abilityScoreModifier', () => {
    (0, vitest_1.it)('returns 0 for score 10', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(10)).toBe(0));
    (0, vitest_1.it)('returns 0 for score 11', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(11)).toBe(0));
    (0, vitest_1.it)('returns -1 for score 8', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(8)).toBe(-1));
    (0, vitest_1.it)('returns -1 for score 9', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(9)).toBe(-1));
    (0, vitest_1.it)('returns +1 for score 12', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(12)).toBe(1));
    (0, vitest_1.it)('returns +1 for score 13', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(13)).toBe(1));
    (0, vitest_1.it)('returns +5 for score 20', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(20)).toBe(5));
    (0, vitest_1.it)('returns -5 for score 1', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(1)).toBe(-5));
    (0, vitest_1.it)('returns +10 for score 30', () => (0, vitest_1.expect)((0, utils_js_1.abilityScoreModifier)(30)).toBe(10));
});
// ---------------------------------------------------------------------------
// averageRoll
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('averageRoll', () => {
    (0, vitest_1.it)('1d6 → 3', () => (0, vitest_1.expect)((0, utils_js_1.averageRoll)(1, 6)).toBe(3));
    (0, vitest_1.it)('2d6 → 7', () => (0, vitest_1.expect)((0, utils_js_1.averageRoll)(2, 6)).toBe(7));
    (0, vitest_1.it)('1d8 → 4', () => (0, vitest_1.expect)((0, utils_js_1.averageRoll)(1, 8)).toBe(4));
    (0, vitest_1.it)('1d4 → 2', () => (0, vitest_1.expect)((0, utils_js_1.averageRoll)(1, 4)).toBe(2));
    (0, vitest_1.it)('floors the result (1d3 → 2)', () => (0, vitest_1.expect)((0, utils_js_1.averageRoll)(1, 3)).toBe(2));
    (0, vitest_1.it)('3d10 → 16', () => (0, vitest_1.expect)((0, utils_js_1.averageRoll)(3, 10)).toBe(16));
});
// ---------------------------------------------------------------------------
// damageString
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('damageString', () => {
    (0, vitest_1.it)('formats basic dice with no bonus', () => (0, vitest_1.expect)((0, utils_js_1.damageString)(2, 6)).toBe('7 (2d6)'));
    (0, vitest_1.it)('formats dice with positive bonus', () => (0, vitest_1.expect)((0, utils_js_1.damageString)(2, 6, 3)).toBe('10 (2d6 + 3)'));
    (0, vitest_1.it)('formats dice with negative bonus', () => (0, vitest_1.expect)((0, utils_js_1.damageString)(2, 6, -2)).toBe('5 (2d6 - 2)'));
    (0, vitest_1.it)('returns "1" when max damage is 1 or less', () => (0, vitest_1.expect)((0, utils_js_1.damageString)(1, 1)).toBe('1'));
    (0, vitest_1.it)('returns flat number for d1 dice', () => (0, vitest_1.expect)((0, utils_js_1.damageString)(3, 1)).toBe('3'));
    (0, vitest_1.it)('returns flat number for d1 with bonus', () => (0, vitest_1.expect)((0, utils_js_1.damageString)(3, 1, 2)).toBe('5'));
});
// ---------------------------------------------------------------------------
// stringForCR
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('stringForCR', () => {
    (0, vitest_1.it)('converts 0.125 to "1/8"', () => (0, vitest_1.expect)((0, utils_js_1.stringForCR)(0.125)).toBe('1/8'));
    (0, vitest_1.it)('converts 0.25 to "1/4"', () => (0, vitest_1.expect)((0, utils_js_1.stringForCR)(0.25)).toBe('1/4'));
    (0, vitest_1.it)('converts 0.5 to "1/2"', () => (0, vitest_1.expect)((0, utils_js_1.stringForCR)(0.5)).toBe('1/2'));
    (0, vitest_1.it)('passes integers through as strings', () => (0, vitest_1.expect)((0, utils_js_1.stringForCR)(5)).toBe('5'));
    (0, vitest_1.it)('accepts string input', () => (0, vitest_1.expect)((0, utils_js_1.stringForCR)('0.25')).toBe('1/4'));
    (0, vitest_1.it)('handles CR 0', () => (0, vitest_1.expect)((0, utils_js_1.stringForCR)(0)).toBe('0'));
});
// ---------------------------------------------------------------------------
// stepForCR
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('stepForCR', () => {
    (0, vitest_1.it)('CR 0 → step 0', () => (0, vitest_1.expect)((0, utils_js_1.stepForCR)(0)).toBe(0));
    (0, vitest_1.it)('CR 1/8 → step 1', () => (0, vitest_1.expect)((0, utils_js_1.stepForCR)(0.125)).toBe(1));
    (0, vitest_1.it)('CR 1/4 → step 2', () => (0, vitest_1.expect)((0, utils_js_1.stepForCR)(0.25)).toBe(2));
    (0, vitest_1.it)('CR 1/2 → step 3', () => (0, vitest_1.expect)((0, utils_js_1.stepForCR)(0.5)).toBe(3));
    (0, vitest_1.it)('CR 1 → step 4', () => (0, vitest_1.expect)((0, utils_js_1.stepForCR)(1)).toBe(4));
    (0, vitest_1.it)('CR 5 → step 8', () => (0, vitest_1.expect)((0, utils_js_1.stepForCR)(5)).toBe(8));
    (0, vitest_1.it)('CR 20 → step 23', () => (0, vitest_1.expect)((0, utils_js_1.stepForCR)(20)).toBe(23));
    (0, vitest_1.it)('accepts string input', () => (0, vitest_1.expect)((0, utils_js_1.stepForCR)('5')).toBe(8));
    // fractional CRs must carry the same weight as integer CRs — step gap between
    // 0 and 1 is 4 steps (0,1,2,3,4), same as between 1 and 5 (4 steps)
    (0, vitest_1.it)('fractional CRs have equal step spacing to integer CRs', () => {
        (0, vitest_1.expect)((0, utils_js_1.stepForCR)(1) - (0, utils_js_1.stepForCR)(0.5)).toBe(1);
        (0, vitest_1.expect)((0, utils_js_1.stepForCR)(0.5) - (0, utils_js_1.stepForCR)(0.25)).toBe(1);
        (0, vitest_1.expect)((0, utils_js_1.stepForCR)(0.25) - (0, utils_js_1.stepForCR)(0.125)).toBe(1);
    });
});
// ---------------------------------------------------------------------------
// getOrdinal
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('getOrdinal', () => {
    (0, vitest_1.it)('1 → "1st"', () => (0, vitest_1.expect)((0, utils_js_1.getOrdinal)(1)).toBe('1st'));
    (0, vitest_1.it)('2 → "2nd"', () => (0, vitest_1.expect)((0, utils_js_1.getOrdinal)(2)).toBe('2nd'));
    (0, vitest_1.it)('3 → "3rd"', () => (0, vitest_1.expect)((0, utils_js_1.getOrdinal)(3)).toBe('3rd'));
    (0, vitest_1.it)('4 → "4th"', () => (0, vitest_1.expect)((0, utils_js_1.getOrdinal)(4)).toBe('4th'));
    (0, vitest_1.it)('11 → "11th" (teen exception)', () => (0, vitest_1.expect)((0, utils_js_1.getOrdinal)(11)).toBe('11th'));
    (0, vitest_1.it)('12 → "12th" (teen exception)', () => (0, vitest_1.expect)((0, utils_js_1.getOrdinal)(12)).toBe('12th'));
    (0, vitest_1.it)('13 → "13th" (teen exception)', () => (0, vitest_1.expect)((0, utils_js_1.getOrdinal)(13)).toBe('13th'));
    (0, vitest_1.it)('21 → "21st"', () => (0, vitest_1.expect)((0, utils_js_1.getOrdinal)(21)).toBe('21st'));
});
// ---------------------------------------------------------------------------
// toSentenceCase
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('toSentenceCase', () => {
    (0, vitest_1.it)('capitalizes first letter', () => (0, vitest_1.expect)((0, utils_js_1.toSentenceCase)('hello world')).toBe('Hello world'));
    (0, vitest_1.it)('capitalizes after period', () => (0, vitest_1.expect)((0, utils_js_1.toSentenceCase)('hello. world')).toBe('Hello. World'));
    (0, vitest_1.it)('capitalizes after exclamation', () => (0, vitest_1.expect)((0, utils_js_1.toSentenceCase)('hello! world')).toBe('Hello! World'));
    (0, vitest_1.it)('leaves already-capitalized strings alone', () => (0, vitest_1.expect)((0, utils_js_1.toSentenceCase)('Hello World')).toBe('Hello World'));
});
// ---------------------------------------------------------------------------
// toTitleCase
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('toTitleCase', () => {
    (0, vitest_1.it)('title-cases a simple string', () => (0, vitest_1.expect)((0, utils_js_1.toTitleCase)('hello world')).toBe('Hello World'));
    (0, vitest_1.it)('handles hyphenated words (splits on spaces, not hyphens)', () => (0, vitest_1.expect)((0, utils_js_1.toTitleCase)('half elf')).toBe('Half Elf'));
    (0, vitest_1.it)('lowercases before capitalizing', () => (0, vitest_1.expect)((0, utils_js_1.toTitleCase)('HELLO WORLD')).toBe('Hello World'));
});
// ---------------------------------------------------------------------------
// flattenObject
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('flattenObject', () => {
    (0, vitest_1.it)('leaves flat objects unchanged', () => {
        (0, vitest_1.expect)((0, utils_js_1.flattenObject)({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
    });
    (0, vitest_1.it)('flattens one level of nesting', () => {
        (0, vitest_1.expect)((0, utils_js_1.flattenObject)({ a: { b: 1 } })).toEqual({ a__b: 1 });
    });
    (0, vitest_1.it)('flattens multiple levels', () => {
        (0, vitest_1.expect)((0, utils_js_1.flattenObject)({ a: { b: { c: 3 } } })).toEqual({ a__b__c: 3 });
    });
    (0, vitest_1.it)('handles mixed flat and nested', () => {
        (0, vitest_1.expect)((0, utils_js_1.flattenObject)({ x: 1, y: { z: 2 } })).toEqual({ x: 1, y__z: 2 });
    });
    (0, vitest_1.it)('does not flatten arrays', () => {
        (0, vitest_1.expect)((0, utils_js_1.flattenObject)({ a: [1, 2, 3] })).toEqual({ a: [1, 2, 3] });
    });
});
// ---------------------------------------------------------------------------
// mergeArrays
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('mergeArrays', () => {
    (0, vitest_1.it)('combines two arrays without duplicates', () => {
        (0, vitest_1.expect)((0, utils_js_1.mergeArrays)([1, 2], [2, 3])).toEqual([1, 2, 3]);
    });
    (0, vitest_1.it)('preserves order — array1 items first', () => {
        (0, vitest_1.expect)((0, utils_js_1.mergeArrays)(['a', 'b'], ['c'])).toEqual(['a', 'b', 'c']);
    });
    (0, vitest_1.it)('handles empty arrays', () => {
        (0, vitest_1.expect)((0, utils_js_1.mergeArrays)([], [1, 2])).toEqual([1, 2]);
        (0, vitest_1.expect)((0, utils_js_1.mergeArrays)([1, 2], [])).toEqual([1, 2]);
    });
    (0, vitest_1.it)('returns a new array (does not mutate)', () => {
        const a = [1, 2];
        const b = [3];
        (0, utils_js_1.mergeArrays)(a, b);
        (0, vitest_1.expect)(a).toEqual([1, 2]);
    });
});
// ---------------------------------------------------------------------------
// mergeObjects
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('mergeObjects', () => {
    (0, vitest_1.it)('merges flat objects, object2 wins on conflict', () => {
        const result = (0, utils_js_1.mergeObjects)({ a: 1, b: 2 }, { b: 99, c: 3 });
        (0, vitest_1.expect)(result).toEqual({ a: 1, b: 99, c: 3 });
    });
    (0, vitest_1.it)('deep-merges nested objects', () => {
        const result = (0, utils_js_1.mergeObjects)({ x: { a: 1, b: 2 } }, { x: { b: 99 } });
        (0, vitest_1.expect)(result).toEqual({ x: { a: 1, b: 99 } });
    });
    (0, vitest_1.it)('merges arrays without duplicates', () => {
        const result = (0, utils_js_1.mergeObjects)({ tags: ['a', 'b'] }, { tags: ['b', 'c'] });
        (0, vitest_1.expect)(result).toEqual({ tags: ['a', 'b', 'c'] });
    });
    (0, vitest_1.it)('does not mutate object1', () => {
        const obj = { a: 1 };
        (0, utils_js_1.mergeObjects)(obj, { b: 2 });
        (0, vitest_1.expect)(obj).toEqual({ a: 1 });
    });
    (0, vitest_1.it)('adds new keys from object2', () => {
        (0, vitest_1.expect)((0, utils_js_1.mergeObjects)({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    });
});
