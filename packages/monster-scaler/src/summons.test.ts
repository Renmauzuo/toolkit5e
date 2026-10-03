import { describe, it, expect } from 'vitest';
import { summonSpirit } from './summons.js';

describe('summonSpirit', () => {
  it('resolves a Bestial Spirit (Land) at its minimum level', () => {
    const sb = summonSpirit('beast', 'land', { spellLevel: 2, spellAttackModifier: 5, spellSaveDC: 13 });
    expect(sb.name).toBe('Land Bestial Spirit');
    expect(sb.type).toBe('beast');
    // AC = 11 + level (2) = 13 → bonusArmor 3 over base 10
    expect(sb.bonusArmor).toBe(3);
    // HP = 30 (Land) + 0 levels above 2 = 30
    expect((sb as unknown as { flatHP: number }).flatHP).toBe(30);
    // No multiattack at level 2 (floor(2/2) = 1)
    expect(sb.multiattack).toBeUndefined();
    const maul = sb.attacks!.maul as { bonusAttack: number; bonusDamage: number };
    expect(maul.bonusAttack).toBe(5); // caster's spell attack modifier
    expect(maul.bonusDamage).toBe(4 + 2); // +4 base + spell level 2
  });

  it('scales HP, AC, attack count, and damage with spell level', () => {
    const sb = summonSpirit('beast', 'land', { spellLevel: 6, spellAttackModifier: 7, spellSaveDC: 15 });
    // HP = 30 + 5*(6-2) = 50
    expect((sb as unknown as { flatHP: number }).flatHP).toBe(50);
    // AC = 11 + 6 = 17 → bonusArmor 7
    expect(sb.bonusArmor).toBe(7);
    // Multiattack floor(6/2) = 3
    expect(sb.multiattack!.attacks.maul).toBe(3);
    const maul = sb.attacks!.maul as { bonusDamage: number };
    expect(maul.bonusDamage).toBe(4 + 6);
  });

  it('applies the Defender celestial AC bonus and option-specific attack', () => {
    const sb = summonSpirit('celestial', 'defender', { spellLevel: 5, spellAttackModifier: 6, spellSaveDC: 14 });
    // AC = 11 + 5 + 2 (Defender) = 18 → bonusArmor 8
    expect(sb.bonusArmor).toBe(8);
    expect(sb.attacks!.radiantMace).toBeDefined();
    expect(sb.attacks!.radiantBow).toBeUndefined();
  });

  it('clamps spell level to the minimum', () => {
    const sb = summonSpirit('fiend', 'yugoloth', { spellLevel: 1, spellAttackModifier: 8, spellSaveDC: 16 });
    // Yugoloth HP = 60 at min level 6
    expect((sb as unknown as { flatHP: number }).flatHP).toBe(60);
    expect(sb.bonusArmor).toBe(12 + 6 - 10);
  });

  it('injects the caster spell save DC via the summon ability modifier', () => {
    const sb = summonSpirit('shadowspawn', 'fear', { spellLevel: 3, spellAttackModifier: 6, spellSaveDC: 14 });
    // proficiency 0 + abilityModifiers.summon (= DC - 8) → renderer resolves DC to 14
    expect(sb.proficiency).toBe(0);
    expect((sb.abilityModifiers as Record<string, number>).summon).toBe(14 - 8);
  });

  it('merges base and option damage resistances/immunities', () => {
    const sb = summonSpirit('elemental', 'fire', { spellLevel: 4, spellAttackModifier: 5, spellSaveDC: 13 });
    // base immunity poison + fire (Fire only)
    expect(sb.immunities).toContain('poison');
    expect(sb.immunities).toContain('fire');
    // Fire uses the fire-damage slam variant
    expect(sb.attacks!.slamFire).toBeDefined();
  });
});
