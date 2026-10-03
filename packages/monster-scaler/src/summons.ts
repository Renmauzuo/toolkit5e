import { summons } from '@toolkit5e/base';
import type { Statblock, Trait, Attack, SummonSpirit, SummonOption } from '@toolkit5e/base';

export { summons };

/** A summon spell id (key of the `summons` dataset). */
export type SummonID = keyof typeof summons;

/**
 * Caster-provided inputs for resolving a summon spirit's stat block.
 *
 * The Tasha's summon spells derive their attack rolls and save DCs from the
 * summoner rather than the spirit's own ability scores, so these must be
 * supplied by the caller.
 */
export interface SummonSpiritOptions {
  /**
   * The spell slot level the spell is cast at. Clamped to the spell's minimum
   * level; higher levels increase hit points, attack count, and damage.
   */
  spellLevel: number;
  /** The caster's spell attack modifier (e.g. `+7`). Used as every attack's to-hit bonus. */
  spellAttackModifier: number;
  /** The caster's spell save DC (e.g. `15`). Used for every save-based trait/action. */
  spellSaveDC: number;
}

/**
 * The synthetic ability key used to force the renderer's DC math to resolve to
 * the caster's spell save DC. Summon traits set `dcStat: 'summon'` and we set
 * `abilityModifiers.summon = spellSaveDC - 8` (with proficiency 0) so the
 * renderer computes `8 + 0 + (spellSaveDC - 8) = spellSaveDC`.
 */
const SUMMON_DC_KEY = 'summon';

/**
 * Resolves a Tasha's summon spell into a fully rendered `Statblock` for the
 * given spell level and caster stats.
 *
 * Attack to-hit bonuses come from the caster's spell attack modifier, save DCs
 * from the caster's spell save DC, and hit points / attack count / damage scale
 * with the spell level. The returned statblock is ready to pass directly to
 * `renderStatblock`.
 *
 * @param summon A summon id (key of `summons`) or a `SummonSpirit` object
 * @param optionKey The chosen subtype/option id (e.g. `'air'`, `'demon'`)
 * @param options The spell level and caster's spell attack modifier / save DC
 * @returns A resolved `Statblock` representing the summoned spirit
 */
export function summonSpirit(
  summon: SummonID | SummonSpirit,
  optionKey: string,
  options: SummonSpiritOptions,
): Statblock {
  const spirit: SummonSpirit = typeof summon === 'string' ? summons[summon] : summon;
  const option: SummonOption = spirit.options[optionKey];
  if (!option) {
    throw new Error(`Unknown option "${optionKey}" for summon "${spirit.name}"`);
  }

  const spellLevel = Math.max(spirit.minLevel, Math.floor(options.spellLevel));
  const levelsAbove = spellLevel - spirit.minLevel;

  // Hit points: option override (if any) or base, plus per-level increment.
  const baseHP = option.hitPoints ?? spirit.hitPoints;
  const hitPoints = baseHP + spirit.hitPointsPerLevel * levelsAbove;

  // Armor class: base + spell level + option bonus. Encoded as bonusArmor over
  // the renderer's `10 + dex mod` (dex mod forced to 0 below).
  const armorClass = spirit.baseArmor + spellLevel + (option.bonusArmor ?? 0);

  // All ability-score-based math in the renderer runs through `abilityModifiers`
  // and `proficiency`. We zero these out so we can drive attack bonuses and DCs
  // explicitly. The displayed ability scores still show the spirit's real values.
  const abilityModifiers: Record<string, number> = {
    str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0,
    [SUMMON_DC_KEY]: options.spellSaveDC - 8,
  };

  const damageFlat = spellLevel;

  // Build the attacks for this option.
  const attacks: Record<string, Partial<Attack>> = {};
  for (const attackKey of option.attacks) {
    const src = spirit.attacks[attackKey];
    const attack: Partial<Attack> = { ...src };
    delete (attack as Record<string, unknown>).damageBonusBase;
    // to-hit = caster's spell attack modifier (renderer adds proficiency=0 + abilityMod=0)
    attack.bonusAttack = options.spellAttackModifier;
    // damage bonus = the attack's flat base + the spell's level
    attack.bonusDamage = src.damageBonusBase + damageFlat;
    attacks[attackKey] = attack;
  }

  // Multiattack: floor(spellLevel / 2) attacks with the option's (single) attack.
  let multiattack: Statblock['multiattack'];
  if (spirit.multiattack === 'halfLevel') {
    const count = Math.floor(spellLevel / 2);
    if (count > 1 && option.attacks.length) {
      multiattack = { attacks: { [option.attacks[0]]: count } };
    }
  }

  // Traits: base-shared traits referenced by the option, resolved to full traits.
  const traits: Record<string, Partial<Trait>> = {};
  for (const traitKey of option.traits ?? []) {
    const t = spirit.traits?.[traitKey];
    if (t) traits[traitKey] = { ...t };
  }

  // Actions and bonus actions apply to all options.
  const actions: Record<string, Partial<Trait>> = { ...(spirit.actions ?? {}) };
  const bonusActions: Record<string, Partial<Trait>> = { ...(spirit.bonusActions ?? {}) };

  const statblock: Statblock & Record<string, unknown> = {
    cr: '',
    name: `${option.name} ${spirit.name}`,
    slug: spirit.name.toLowerCase(),
    description: `the ${spirit.name.toLowerCase()}`,
    type: spirit.type,
    size: spirit.size,
    alignment: 'unaligned',
    gender: 4,
    str: spirit.str, dex: spirit.dex, con: spirit.con,
    int: spirit.int, wis: spirit.wis, cha: spirit.cha,
    abilityModifiers,
    proficiency: 0,
    bonusArmor: armorClass - 10,
    armorDescription: 'Natural Armor',
    flatHP: hitPoints,
    speed: option.speed ?? spirit.speed,
    swim: option.swim ?? spirit.swim,
    climb: option.climb ?? spirit.climb,
    burrow: option.burrow ?? spirit.burrow,
    fly: option.fly ?? spirit.fly,
    darkvision: spirit.darkvision,
    resistances: mergeLists(spirit.resistances, option.resistances),
    immunities: mergeLists(spirit.immunities, option.immunities),
    conditionImmunities: mergeLists(spirit.conditionImmunities, option.conditionImmunities),
    languages: spirit.languages ? [...spirit.languages] : undefined,
    traits: Object.keys(traits).length ? traits : undefined,
    attacks,
    actions: Object.keys(actions).length ? actions : undefined,
    bonusActions: Object.keys(bonusActions).length ? bonusActions : undefined,
    multiattack,
  };

  return statblock as unknown as Statblock;
}

/** Merges two optional string lists into one, de-duplicated, or undefined if both empty. */
function mergeLists(a?: string[], b?: string[]): string[] | undefined {
  const merged = [...new Set([...(a ?? []), ...(b ?? [])])];
  return merged.length ? merged : undefined;
}
