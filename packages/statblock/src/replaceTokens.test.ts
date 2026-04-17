import { describe, it, expect } from 'vitest';
import { replaceTokensInString } from './index.js';

// Minimal statblock fixture — only the fields each test group needs.
function makeStatblock(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Wolf',
    description: 'the wolf',
    slug: 'wolf',
    size: 3,           // Medium
    proficiency: 2,
    cr: '1',
    gender: 4,         // it/its
    abilityModifiers: { str: 1, dex: 2, con: 1, int: -4, wis: 1, cha: -2 },
    castingStat: 'wis',
    castingClass: 'druid',
    level: 3,
    ...overrides,
  } as any;
}

function makeTrait(overrides: Record<string, unknown> = {}) {
  return { ...overrides } as any;
}

// ---------------------------------------------------------------------------
// Direct statblock field tokens
// ---------------------------------------------------------------------------
describe('direct statblock field tokens', () => {
  it('replaces {{name}} with the statblock name', () => {
    const result = replaceTokensInString('{{name}} attacks.', makeStatblock(), makeTrait());
    expect(result).toContain('Wolf');
  });

  it('replaces {{description}} with the description field', () => {
    const result = replaceTokensInString('{{description}} moves.', makeStatblock(), makeTrait());
    expect(result.toLowerCase()).toContain('the wolf');
  });
});

// ---------------------------------------------------------------------------
// Casting stat tokens
// ---------------------------------------------------------------------------
describe('casting stat tokens', () => {
  it('{{castingStatName}} resolves wis → "Wisdom"', () => {
    const result = replaceTokensInString('{{castingStatName}}', makeStatblock({ castingStat: 'wis' }), makeTrait());
    expect(result).toContain('Wisdom');
  });

  it('{{castingStatName}} resolves int → "Intelligence"', () => {
    const result = replaceTokensInString('{{castingStatName}}', makeStatblock({ castingStat: 'int' }), makeTrait());
    expect(result).toContain('Intelligence');
  });

  it('{{castingModifier}} formats as +N', () => {
    // wis modifier = 1 → "+1"
    const result = replaceTokensInString('{{castingModifier}}', makeStatblock({ castingStat: 'wis' }), makeTrait());
    expect(result).toContain('+1');
  });

  it('{{spellSaveDC}} = 8 + proficiency + casting modifier', () => {
    // 8 + 2 + 1 = 11
    const result = replaceTokensInString('{{spellSaveDC}}', makeStatblock(), makeTrait());
    expect(result).toContain('11');
  });

  it('{{spellAttackModifier}} = proficiency + casting modifier', () => {
    // 2 + 1 = 3 → "+3"
    const result = replaceTokensInString('{{spellAttackModifier}}', makeStatblock(), makeTrait());
    expect(result).toContain('+3');
  });
});

// ---------------------------------------------------------------------------
// DC tokens
// ---------------------------------------------------------------------------
describe('DC tokens', () => {
  it('{{DC:str}} = 8 + proficiency + str modifier', () => {
    // 8 + 2 + 1 = 11
    const result = replaceTokensInString('DC {{DC:str}}', makeStatblock(), makeTrait());
    expect(result).toContain('11');
  });

  it('{{DC:str:2}} applies an additional offset', () => {
    // 8 + 2 + 1 + 2 = 13
    const result = replaceTokensInString('DC {{DC:str:2}}', makeStatblock(), makeTrait());
    expect(result).toContain('13');
  });
});

// ---------------------------------------------------------------------------
// Trait tokens
// ---------------------------------------------------------------------------
describe('trait tokens', () => {
  it('{{trait:count}} resolves to the trait count field', () => {
    const result = replaceTokensInString('{{trait:count}} times', makeStatblock(), makeTrait({ count: 3 }));
    expect(result).toContain('3');
  });

  it('{{trait:DC}} = 8 + proficiency + dcStat modifier', () => {
    // dcStat = str, modifier = 1 → 8 + 2 + 1 = 11
    const result = replaceTokensInString('DC {{trait:DC}}', makeStatblock(), makeTrait({ dcStat: 'str' }));
    expect(result).toContain('11');
  });

  it('{{trait:DC}} applies dcAdjustment', () => {
    // 8 + 2 + 1 + 2 = 13
    const result = replaceTokensInString('DC {{trait:DC}}', makeStatblock(), makeTrait({ dcStat: 'str', dcAdjustment: 2 }));
    expect(result).toContain('13');
  });

  it('{{trait:damage}} formats dice string', () => {
    const result = replaceTokensInString('{{trait:damage}}', makeStatblock(), makeTrait({ damageDice: 2, damageDieSize: 6 }));
    expect(result).toContain('2d6');
  });

  it('{{trait:damage}} returns flat number for d1', () => {
    const result = replaceTokensInString('{{trait:damage}}', makeStatblock(), makeTrait({ damageDice: 3, damageDieSize: 1 }));
    expect(result).toContain('3');
    expect(result).not.toContain('d1');
  });

  it('{{trait:ordinalLevel}} uses trait level when present', () => {
    const result = replaceTokensInString('{{trait:ordinalLevel}}', makeStatblock(), makeTrait({ level: 5 }));
    expect(result).toContain('5th');
  });

  it('{{trait:ordinalLevel}} falls back to statblock level', () => {
    // statblock.level = 3
    const result = replaceTokensInString('{{trait:ordinalLevel}}', makeStatblock(), makeTrait());
    expect(result).toContain('3rd');
  });

  it('{{trait:key}} resolves attack key to attack display name', () => {
    const statblock = makeStatblock({
      attacks: { bite: { name: 'Bite' } },
    });
    const result = replaceTokensInString('{{trait:chargeAttack}}', statblock, makeTrait({ chargeAttack: 'bite' }));
    expect(result.toLowerCase()).toContain('bite'); // lowercased attack name
  });
});

// ---------------------------------------------------------------------------
// Pronoun tokens
// ---------------------------------------------------------------------------
describe('pronoun tokens', () => {
  it('{{pronoun:subject}} for gender 4 (it) → "it"', () => {
    const result = replaceTokensInString('{{pronoun:subject}}', makeStatblock({ gender: 4 }), makeTrait());
    expect(result.toLowerCase()).toContain('it');
  });

  it('{{pronoun:possessiveAdj}} for gender 1 (he) → "his"', () => {
    const result = replaceTokensInString('{{pronoun:possessiveAdj}}', makeStatblock({ gender: 1 }), makeTrait());
    expect(result.toLowerCase()).toContain('his');
  });
});

// ---------------------------------------------------------------------------
// abilityBonus token
// ---------------------------------------------------------------------------
describe('abilityBonus token', () => {
  it('{{abilityBonus:dex:2}} = dex modifier + proficiency * 2', () => {
    // dex modifier = 2, proficiency = 2, multiplier = 2 → 2 + 4 = 6 → "+6"
    const result = replaceTokensInString('{{abilityBonus:dex:2}}', makeStatblock(), makeTrait());
    expect(result).toContain('+6');
  });
});

// ---------------------------------------------------------------------------
// toSentenceCase applied to output
// ---------------------------------------------------------------------------
describe('output sentence casing', () => {
  it('capitalizes the first character of the result', () => {
    const result = replaceTokensInString('the wolf attacks.', makeStatblock(), makeTrait());
    expect(result[0]).toBe('T');
  });
});

// ---------------------------------------------------------------------------
// No tokens — passthrough
// ---------------------------------------------------------------------------
describe('strings with no tokens', () => {
  it('returns the string unchanged (modulo sentence case)', () => {
    const result = replaceTokensInString('No tokens here.', makeStatblock(), makeTrait());
    expect(result).toBe('No tokens here.');
  });

  it('handles null/undefined gracefully', () => {
    // targetString ?? '' guard in the implementation
    const result = replaceTokensInString(null as any, makeStatblock(), makeTrait());
    expect(result).toBe('');
  });
});
