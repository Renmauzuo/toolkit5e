"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_js_1 = require("./index.js");
// Minimal statblock fixture — only the fields each test group needs.
function makeStatblock(overrides = {}) {
    return {
        name: 'Wolf',
        description: 'the wolf',
        slug: 'wolf',
        size: 3, // Medium
        proficiency: 2,
        cr: '1',
        gender: 4, // it/its
        abilityModifiers: { str: 1, dex: 2, con: 1, int: -4, wis: 1, cha: -2 },
        castingStat: 'wis',
        castingClass: 'druid',
        level: 3,
        ...overrides,
    };
}
function makeTrait(overrides = {}) {
    return { ...overrides };
}
// ---------------------------------------------------------------------------
// Direct statblock field tokens
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('direct statblock field tokens', () => {
    (0, vitest_1.it)('replaces {{name}} with the statblock name', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{name}} attacks.', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toContain('Wolf');
    });
    (0, vitest_1.it)('replaces {{description}} with the description field', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{description}} moves.', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result.toLowerCase()).toContain('the wolf');
    });
});
// ---------------------------------------------------------------------------
// Casting stat tokens
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('casting stat tokens', () => {
    (0, vitest_1.it)('{{castingStatName}} resolves wis → "Wisdom"', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{castingStatName}}', makeStatblock({ castingStat: 'wis' }), makeTrait());
        (0, vitest_1.expect)(result).toContain('Wisdom');
    });
    (0, vitest_1.it)('{{castingStatName}} resolves int → "Intelligence"', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{castingStatName}}', makeStatblock({ castingStat: 'int' }), makeTrait());
        (0, vitest_1.expect)(result).toContain('Intelligence');
    });
    (0, vitest_1.it)('{{castingModifier}} formats as +N', () => {
        // wis modifier = 1 → "+1"
        const result = (0, index_js_1.replaceTokensInString)('{{castingModifier}}', makeStatblock({ castingStat: 'wis' }), makeTrait());
        (0, vitest_1.expect)(result).toContain('+1');
    });
    (0, vitest_1.it)('{{spellSaveDC}} = 8 + proficiency + casting modifier', () => {
        // 8 + 2 + 1 = 11
        const result = (0, index_js_1.replaceTokensInString)('{{spellSaveDC}}', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toContain('11');
    });
    (0, vitest_1.it)('{{spellAttackModifier}} = proficiency + casting modifier', () => {
        // 2 + 1 = 3 → "+3"
        const result = (0, index_js_1.replaceTokensInString)('{{spellAttackModifier}}', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toContain('+3');
    });
});
// ---------------------------------------------------------------------------
// DC tokens
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('DC tokens', () => {
    (0, vitest_1.it)('{{DC:str}} = 8 + proficiency + str modifier', () => {
        // 8 + 2 + 1 = 11
        const result = (0, index_js_1.replaceTokensInString)('DC {{DC:str}}', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toContain('11');
    });
    (0, vitest_1.it)('{{DC:str:2}} applies an additional offset', () => {
        // 8 + 2 + 1 + 2 = 13
        const result = (0, index_js_1.replaceTokensInString)('DC {{DC:str:2}}', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toContain('13');
    });
});
// ---------------------------------------------------------------------------
// Trait tokens
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('trait tokens', () => {
    (0, vitest_1.it)('{{trait:count}} resolves to the trait count field', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{trait:count}} times', makeStatblock(), makeTrait({ count: 3 }));
        (0, vitest_1.expect)(result).toContain('3');
    });
    (0, vitest_1.it)('{{trait:DC}} = 8 + proficiency + dcStat modifier', () => {
        // dcStat = str, modifier = 1 → 8 + 2 + 1 = 11
        const result = (0, index_js_1.replaceTokensInString)('DC {{trait:DC}}', makeStatblock(), makeTrait({ dcStat: 'str' }));
        (0, vitest_1.expect)(result).toContain('11');
    });
    (0, vitest_1.it)('{{trait:DC}} applies dcAdjustment', () => {
        // 8 + 2 + 1 + 2 = 13
        const result = (0, index_js_1.replaceTokensInString)('DC {{trait:DC}}', makeStatblock(), makeTrait({ dcStat: 'str', dcAdjustment: 2 }));
        (0, vitest_1.expect)(result).toContain('13');
    });
    (0, vitest_1.it)('{{trait:damage}} formats dice string', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{trait:damage}}', makeStatblock(), makeTrait({ damageDice: 2, damageDieSize: 6 }));
        (0, vitest_1.expect)(result).toContain('2d6');
    });
    (0, vitest_1.it)('{{trait:damage}} returns flat number for d1', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{trait:damage}}', makeStatblock(), makeTrait({ damageDice: 3, damageDieSize: 1 }));
        (0, vitest_1.expect)(result).toContain('3');
        (0, vitest_1.expect)(result).not.toContain('d1');
    });
    (0, vitest_1.it)('{{trait:ordinalLevel}} uses trait level when present', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{trait:ordinalLevel}}', makeStatblock(), makeTrait({ level: 5 }));
        (0, vitest_1.expect)(result).toContain('5th');
    });
    (0, vitest_1.it)('{{trait:ordinalLevel}} falls back to statblock level', () => {
        // statblock.level = 3
        const result = (0, index_js_1.replaceTokensInString)('{{trait:ordinalLevel}}', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toContain('3rd');
    });
    (0, vitest_1.it)('{{trait:key}} resolves attack key to attack display name', () => {
        const statblock = makeStatblock({
            attacks: { bite: { name: 'Bite' } },
        });
        const result = (0, index_js_1.replaceTokensInString)('{{trait:chargeAttack}}', statblock, makeTrait({ chargeAttack: 'bite' }));
        (0, vitest_1.expect)(result.toLowerCase()).toContain('bite'); // lowercased attack name
    });
});
// ---------------------------------------------------------------------------
// Pronoun tokens
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('pronoun tokens', () => {
    (0, vitest_1.it)('{{pronoun:subject}} for gender 4 (it) → "it"', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{pronoun:subject}}', makeStatblock({ gender: 4 }), makeTrait());
        (0, vitest_1.expect)(result.toLowerCase()).toContain('it');
    });
    (0, vitest_1.it)('{{pronoun:possessiveAdj}} for gender 1 (he) → "his"', () => {
        const result = (0, index_js_1.replaceTokensInString)('{{pronoun:possessiveAdj}}', makeStatblock({ gender: 1 }), makeTrait());
        (0, vitest_1.expect)(result.toLowerCase()).toContain('his');
    });
});
// ---------------------------------------------------------------------------
// abilityBonus token
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('abilityBonus token', () => {
    (0, vitest_1.it)('{{abilityBonus:dex:2}} = dex modifier + proficiency * 2', () => {
        // dex modifier = 2, proficiency = 2, multiplier = 2 → 2 + 4 = 6 → "+6"
        const result = (0, index_js_1.replaceTokensInString)('{{abilityBonus:dex:2}}', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toContain('+6');
    });
});
// ---------------------------------------------------------------------------
// toSentenceCase applied to output
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('output sentence casing', () => {
    (0, vitest_1.it)('capitalizes the first character of the result', () => {
        const result = (0, index_js_1.replaceTokensInString)('the wolf attacks.', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result[0]).toBe('T');
    });
});
// ---------------------------------------------------------------------------
// No tokens — passthrough
// ---------------------------------------------------------------------------
(0, vitest_1.describe)('strings with no tokens', () => {
    (0, vitest_1.it)('returns the string unchanged (modulo sentence case)', () => {
        const result = (0, index_js_1.replaceTokensInString)('No tokens here.', makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toBe('No tokens here.');
    });
    (0, vitest_1.it)('handles null/undefined gracefully', () => {
        // targetString ?? '' guard in the implementation
        const result = (0, index_js_1.replaceTokensInString)(null, makeStatblock(), makeTrait());
        (0, vitest_1.expect)(result).toBe('');
    });
});
