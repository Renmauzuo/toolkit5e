import { describe, it, expect } from 'vitest';
import {
  abilityScoreModifier,
  averageRoll,
  damageString,
  stringForCR,
  stepForCR,
  getOrdinal,
  toSentenceCase,
  toTitleCase,
  flattenObject,
  mergeObjects,
  mergeArrays,
} from './utils.js';

// ---------------------------------------------------------------------------
// abilityScoreModifier
// ---------------------------------------------------------------------------
describe('abilityScoreModifier', () => {
  it('returns 0 for score 10', () => expect(abilityScoreModifier(10)).toBe(0));
  it('returns 0 for score 11', () => expect(abilityScoreModifier(11)).toBe(0));
  it('returns -1 for score 8', () => expect(abilityScoreModifier(8)).toBe(-1));
  it('returns -1 for score 9', () => expect(abilityScoreModifier(9)).toBe(-1));
  it('returns +1 for score 12', () => expect(abilityScoreModifier(12)).toBe(1));
  it('returns +1 for score 13', () => expect(abilityScoreModifier(13)).toBe(1));
  it('returns +5 for score 20', () => expect(abilityScoreModifier(20)).toBe(5));
  it('returns -5 for score 1', () => expect(abilityScoreModifier(1)).toBe(-5));
  it('returns +10 for score 30', () => expect(abilityScoreModifier(30)).toBe(10));
});

// ---------------------------------------------------------------------------
// averageRoll
// ---------------------------------------------------------------------------
describe('averageRoll', () => {
  it('1d6 → 3', () => expect(averageRoll(1, 6)).toBe(3));
  it('2d6 → 7', () => expect(averageRoll(2, 6)).toBe(7));
  it('1d8 → 4', () => expect(averageRoll(1, 8)).toBe(4));
  it('1d4 → 2', () => expect(averageRoll(1, 4)).toBe(2));
  it('floors the result (1d3 → 2)', () => expect(averageRoll(1, 3)).toBe(2));
  it('3d10 → 16', () => expect(averageRoll(3, 10)).toBe(16));
});

// ---------------------------------------------------------------------------
// damageString
// ---------------------------------------------------------------------------
describe('damageString', () => {
  it('formats basic dice with no bonus', () => expect(damageString(2, 6)).toBe('7 (2d6)'));
  it('formats dice with positive bonus', () => expect(damageString(2, 6, 3)).toBe('10 (2d6 + 3)'));
  it('formats dice with negative bonus', () => expect(damageString(2, 6, -2)).toBe('5 (2d6 - 2)'));
  it('returns "1" when max damage is 1 or less', () => expect(damageString(1, 1)).toBe('1'));
  it('returns flat number for d1 dice', () => expect(damageString(3, 1)).toBe('3'));
  it('returns flat number for d1 with bonus', () => expect(damageString(3, 1, 2)).toBe('5'));
});

// ---------------------------------------------------------------------------
// stringForCR
// ---------------------------------------------------------------------------
describe('stringForCR', () => {
  it('converts 0.125 to "1/8"', () => expect(stringForCR(0.125)).toBe('1/8'));
  it('converts 0.25 to "1/4"', () => expect(stringForCR(0.25)).toBe('1/4'));
  it('converts 0.5 to "1/2"', () => expect(stringForCR(0.5)).toBe('1/2'));
  it('passes integers through as strings', () => expect(stringForCR(5)).toBe('5'));
  it('accepts string input', () => expect(stringForCR('0.25')).toBe('1/4'));
  it('handles CR 0', () => expect(stringForCR(0)).toBe('0'));
});

// ---------------------------------------------------------------------------
// stepForCR
// ---------------------------------------------------------------------------
describe('stepForCR', () => {
  it('CR 0 → step 0', () => expect(stepForCR(0)).toBe(0));
  it('CR 1/8 → step 1', () => expect(stepForCR(0.125)).toBe(1));
  it('CR 1/4 → step 2', () => expect(stepForCR(0.25)).toBe(2));
  it('CR 1/2 → step 3', () => expect(stepForCR(0.5)).toBe(3));
  it('CR 1 → step 4', () => expect(stepForCR(1)).toBe(4));
  it('CR 5 → step 8', () => expect(stepForCR(5)).toBe(8));
  it('CR 20 → step 23', () => expect(stepForCR(20)).toBe(23));
  it('accepts string input', () => expect(stepForCR('5')).toBe(8));
  // fractional CRs must carry the same weight as integer CRs — step gap between
  // 0 and 1 is 4 steps (0,1,2,3,4), same as between 1 and 5 (4 steps)
  it('fractional CRs have equal step spacing to integer CRs', () => {
    expect(stepForCR(1) - stepForCR(0.5)).toBe(1);
    expect(stepForCR(0.5) - stepForCR(0.25)).toBe(1);
    expect(stepForCR(0.25) - stepForCR(0.125)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// getOrdinal
// ---------------------------------------------------------------------------
describe('getOrdinal', () => {
  it('1 → "1st"', () => expect(getOrdinal(1)).toBe('1st'));
  it('2 → "2nd"', () => expect(getOrdinal(2)).toBe('2nd'));
  it('3 → "3rd"', () => expect(getOrdinal(3)).toBe('3rd'));
  it('4 → "4th"', () => expect(getOrdinal(4)).toBe('4th'));
  it('11 → "11th" (teen exception)', () => expect(getOrdinal(11)).toBe('11th'));
  it('12 → "12th" (teen exception)', () => expect(getOrdinal(12)).toBe('12th'));
  it('13 → "13th" (teen exception)', () => expect(getOrdinal(13)).toBe('13th'));
  it('21 → "21st"', () => expect(getOrdinal(21)).toBe('21st'));
});

// ---------------------------------------------------------------------------
// toSentenceCase
// ---------------------------------------------------------------------------
describe('toSentenceCase', () => {
  it('capitalizes first letter', () => expect(toSentenceCase('hello world')).toBe('Hello world'));
  it('capitalizes after period', () => expect(toSentenceCase('hello. world')).toBe('Hello. World'));
  it('capitalizes after exclamation', () => expect(toSentenceCase('hello! world')).toBe('Hello! World'));
  it('leaves already-capitalized strings alone', () => expect(toSentenceCase('Hello World')).toBe('Hello World'));
  it('does not capitalize after ft. abbreviation', () => expect(toSentenceCase('move up to 10 ft. toward a creature')).toBe('Move up to 10 ft. toward a creature'));
  it('does not capitalize after dr. abbreviation', () => expect(toSentenceCase('consult dr. smith for details')).toBe('Consult dr. smith for details'));
  it('still capitalizes after a real sentence boundary', () => expect(toSentenceCase('it falls prone. the creature takes damage')).toBe('It falls prone. The creature takes damage'));
});

// ---------------------------------------------------------------------------
// toTitleCase
// ---------------------------------------------------------------------------
describe('toTitleCase', () => {
  it('title-cases a simple string', () => expect(toTitleCase('hello world')).toBe('Hello World'));
  it('handles hyphenated words (splits on spaces, not hyphens)', () => expect(toTitleCase('half elf')).toBe('Half Elf'));
  it('lowercases before capitalizing', () => expect(toTitleCase('HELLO WORLD')).toBe('Hello World'));
});

// ---------------------------------------------------------------------------
// flattenObject
// ---------------------------------------------------------------------------
describe('flattenObject', () => {
  it('leaves flat objects unchanged', () => {
    expect(flattenObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('flattens one level of nesting', () => {
    expect(flattenObject({ a: { b: 1 } })).toEqual({ a__b: 1 });
  });

  it('flattens multiple levels', () => {
    expect(flattenObject({ a: { b: { c: 3 } } })).toEqual({ a__b__c: 3 });
  });

  it('handles mixed flat and nested', () => {
    expect(flattenObject({ x: 1, y: { z: 2 } })).toEqual({ x: 1, y__z: 2 });
  });

  it('does not flatten arrays', () => {
    expect(flattenObject({ a: [1, 2, 3] })).toEqual({ a: [1, 2, 3] });
  });
});

// ---------------------------------------------------------------------------
// mergeArrays
// ---------------------------------------------------------------------------
describe('mergeArrays', () => {
  it('combines two arrays without duplicates', () => {
    expect(mergeArrays([1, 2], [2, 3])).toEqual([1, 2, 3]);
  });

  it('preserves order — array1 items first', () => {
    expect(mergeArrays(['a', 'b'], ['c'])).toEqual(['a', 'b', 'c']);
  });

  it('handles empty arrays', () => {
    expect(mergeArrays([], [1, 2])).toEqual([1, 2]);
    expect(mergeArrays([1, 2], [])).toEqual([1, 2]);
  });

  it('returns a new array (does not mutate)', () => {
    const a = [1, 2];
    const b = [3];
    mergeArrays(a, b);
    expect(a).toEqual([1, 2]);
  });
});

// ---------------------------------------------------------------------------
// mergeObjects
// ---------------------------------------------------------------------------
describe('mergeObjects', () => {
  it('merges flat objects, object2 wins on conflict', () => {
    const result = mergeObjects({ a: 1, b: 2 } as Record<string, number>, { b: 99, c: 3 } as Record<string, number>);
    expect(result).toEqual({ a: 1, b: 99, c: 3 });
  });

  it('deep-merges nested objects', () => {
    const result = mergeObjects(
      { x: { a: 1, b: 2 } } as Record<string, Record<string, number>>,
      { x: { b: 99 } } as Record<string, Record<string, number>>,
    );
    expect(result).toEqual({ x: { a: 1, b: 99 } });
  });

  it('merges arrays without duplicates', () => {
    const result = mergeObjects(
      { tags: ['a', 'b'] } as Record<string, string[]>,
      { tags: ['b', 'c'] } as Record<string, string[]>,
    );
    expect(result).toEqual({ tags: ['a', 'b', 'c'] });
  });

  it('does not mutate object1', () => {
    const obj: Record<string, number> = { a: 1 };
    mergeObjects(obj, { b: 2 } as Record<string, number>);
    expect(obj).toEqual({ a: 1 });
  });

  it('adds new keys from object2', () => {
    expect(mergeObjects({ a: 1 } as Record<string, number>, { b: 2 } as Record<string, number>)).toEqual({ a: 1, b: 2 });
  });
});
