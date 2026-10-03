"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const summons_js_1 = require("./summons.js");
(0, vitest_1.describe)('summonSpirit', () => {
    (0, vitest_1.it)('resolves a Bestial Spirit (Land) at its minimum level', () => {
        const sb = (0, summons_js_1.summonSpirit)('beast', 'land', { spellLevel: 2, spellAttackModifier: 5, spellSaveDC: 13 });
        (0, vitest_1.expect)(sb.name).toBe('Land Bestial Spirit');
        (0, vitest_1.expect)(sb.type).toBe('beast');
        // AC = 11 + level (2) = 13 → bonusArmor 3 over base 10
        (0, vitest_1.expect)(sb.bonusArmor).toBe(3);
        // HP = 30 (Land) + 0 levels above 2 = 30
        (0, vitest_1.expect)(sb.flatHP).toBe(30);
        // No multiattack at level 2 (floor(2/2) = 1)
        (0, vitest_1.expect)(sb.multiattack).toBeUndefined();
        const maul = sb.attacks.maul;
        (0, vitest_1.expect)(maul.bonusAttack).toBe(5); // caster's spell attack modifier
        (0, vitest_1.expect)(maul.bonusDamage).toBe(4 + 2); // +4 base + spell level 2
    });
    (0, vitest_1.it)('scales HP, AC, attack count, and damage with spell level', () => {
        const sb = (0, summons_js_1.summonSpirit)('beast', 'land', { spellLevel: 6, spellAttackModifier: 7, spellSaveDC: 15 });
        // HP = 30 + 5*(6-2) = 50
        (0, vitest_1.expect)(sb.flatHP).toBe(50);
        // AC = 11 + 6 = 17 → bonusArmor 7
        (0, vitest_1.expect)(sb.bonusArmor).toBe(7);
        // Multiattack floor(6/2) = 3
        (0, vitest_1.expect)(sb.multiattack.attacks.maul).toBe(3);
        const maul = sb.attacks.maul;
        (0, vitest_1.expect)(maul.bonusDamage).toBe(4 + 6);
    });
    (0, vitest_1.it)('applies the Defender celestial AC bonus and option-specific attack', () => {
        const sb = (0, summons_js_1.summonSpirit)('celestial', 'defender', { spellLevel: 5, spellAttackModifier: 6, spellSaveDC: 14 });
        // AC = 11 + 5 + 2 (Defender) = 18 → bonusArmor 8
        (0, vitest_1.expect)(sb.bonusArmor).toBe(8);
        (0, vitest_1.expect)(sb.attacks.radiantMace).toBeDefined();
        (0, vitest_1.expect)(sb.attacks.radiantBow).toBeUndefined();
    });
    (0, vitest_1.it)('clamps spell level to the minimum', () => {
        const sb = (0, summons_js_1.summonSpirit)('fiend', 'yugoloth', { spellLevel: 1, spellAttackModifier: 8, spellSaveDC: 16 });
        // Yugoloth HP = 60 at min level 6
        (0, vitest_1.expect)(sb.flatHP).toBe(60);
        (0, vitest_1.expect)(sb.bonusArmor).toBe(12 + 6 - 10);
    });
    (0, vitest_1.it)('injects the caster spell save DC via the summon ability modifier', () => {
        const sb = (0, summons_js_1.summonSpirit)('shadowspawn', 'fear', { spellLevel: 3, spellAttackModifier: 6, spellSaveDC: 14 });
        // proficiency 0 + abilityModifiers.summon (= DC - 8) → renderer resolves DC to 14
        (0, vitest_1.expect)(sb.proficiency).toBe(0);
        (0, vitest_1.expect)(sb.abilityModifiers.summon).toBe(14 - 8);
    });
    (0, vitest_1.it)('merges base and option damage resistances/immunities', () => {
        const sb = (0, summons_js_1.summonSpirit)('elemental', 'fire', { spellLevel: 4, spellAttackModifier: 5, spellSaveDC: 13 });
        // base immunity poison + fire (Fire only)
        (0, vitest_1.expect)(sb.immunities).toContain('poison');
        (0, vitest_1.expect)(sb.immunities).toContain('fire');
        // Fire uses the fire-damage slam variant
        (0, vitest_1.expect)(sb.attacks.slamFire).toBeDefined();
    });
});
