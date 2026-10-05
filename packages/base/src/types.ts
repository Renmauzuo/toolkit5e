// Challenge Rating types
export type ChallengeRating = 
  | 0 | 0.125 | 0.25 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25
  | 26 | 27 | 28 | 29 | 30;

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type SkillRank = 0 | 1 | 2;

export interface Attack {
  name?: string;
  reach?: number;
  range?: number;
  longRange?: number;
  damageType?: string;
  damageDice?: number;
  damageDieSize?: number;
  damageBonus?: number;
  damageRiderDice?: number;
  damageRiderDieSize?: number;
  damageRiderType?: string;
  attackBonus?: number;
  finesse?: boolean;
  ranged?: boolean;
  spellAttack?: boolean;
  proneOnly?: boolean;
  creatureOnly?: boolean;
  notGrappled?: boolean;
  enhancement?: number;
  bonusAttack?: number;
  bonusDamage?: number;
  proc?: string;
  generatedProc?: Trait;
  text?: string;
}

export interface Trait {
  name: string;
  description: string;
  text?: string;
  recharge?: 'short' | 'long';
  allowsSave?: boolean;
  /** Ability used for the save DC. Usually an `AbilityKey`; summons use `'summon'` to inject the caster's spell save DC. */
  dcStat?: AbilityKey | 'summon';
  dcAdjustment?: number;
  dealsDamage?: boolean;
  damageDice?: number;
  damageDieSize?: number;
  hasDuration?: boolean;
  duration?: number;
  sizeRestricted?: boolean;
  sizeAdjustment?: number;
  appliesCondition?: boolean;
  condition?: string;
  hitPointsPerHitDie?: number;
  spellList?: Record<string, { uses?: number }>;
  /** Spell keys for class-based spellcasting (prepared spells, grouped by level from the spells registry). */
  classSpells?: string[];
  school?: string;
  level?: number;
  spellcastingLevel?: number;
  /** If true, `spellcastingLevel` is scaled linearly by `scaleMonster` using the offset from the benchmark CR. */
  scalesSpellcasting?: boolean;
  /** Field names on this trait that should be resolved via nearest-lower-benchmark lookup during scaling. */
  nearestLowerBenchmarkKeys?: string[];
  /** If set to a damage type string, applies this trait's scaled damage dice as a rider to all attacks that don't already have a rider. Used for Angelic Weapons. */
  bonusDamageAllAttacks?: string;
  [key: string]: unknown;
}

export interface Multiattack {
  attacks: Record<string, number>;
  requireDifferentTargets?: boolean;
}

export interface Statblock {
  cr: string;
  name?: string;
  slug?: string;
  type?: string;
  size?: number;
  alignment?: string;
  gender?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  abilityModifiers?: Record<AbilityKey, number>;
  hitDice?: number;
  /** A fixed hit point total that bypasses the hit-dice formula. Used by summons whose HP is a flat value. */
  flatHP?: number;
  bonusArmor?: number;
  bonusHP?: number;
  armor?: string;
  armorDescription?: string;
  speed?: number;
  swim?: number;
  climb?: number;
  burrow?: number;
  fly?: number;
  darkvision?: number;
  blindsight?: number;
  proficiency?: number;
  saves?: AbilityKey[];
  saveBonus?: number;
  skills?: Partial<Record<string, SkillRank>>;
  languages?: string[];
  extraLanguages?: number;
  resistances?: string[];
  immunities?: string[];
  vulnerabilities?: string[];
  conditionImmunities?: string[];
  traits?: Record<string, Partial<Trait>>;
  attacks?: Record<string, Partial<Attack>>;
  actions?: Record<string, Partial<Trait>>;
  bonusActions?: Record<string, Partial<Trait>>;
  multiattack?: Multiattack;
  castingStat?: AbilityKey;
  castingClass?: string | string[];
  level?: number;
  description?: string;
  appearance?: string;
  unique?: boolean;
  wildShape?: boolean;
  defaultName?: string;
  sensesString?: string;
  passivePerception?: number;
  multiattackString?: string;
  legendaryActions?: Record<string, Partial<Trait> & { cost?: number }>;
  legendaryResistances?: number;
  /** Action keys that become available at this CR and above. Used in per-CR stat entries, not on resolved statblocks. */
  crActions?: string[];
}

// ---------------------------------------------------------------------------
// Tasha's summon spirits (Summon Beast, Summon Fey, etc.)
// ---------------------------------------------------------------------------

/**
 * A single option (subtype) within a summon spell — e.g. Air/Land/Water for a
 * Bestial Spirit, or Demon/Devil/Yugoloth for a Fiendish Spirit. Each option
 * overrides parts of the base spirit stat block and enables a specific set of
 * attacks and traits.
 */
export interface SummonOption {
  /** Display name of the option (e.g. `'Air'`, `'Demon'`). */
  name: string;
  /**
   * Overrides the base hit points for this option. The per-level HP increment
   * (`SummonSpirit.hitPointsPerLevel`) still applies on top of this value.
   */
  hitPoints?: number;
  /** Extra flat bonus added to the spirit's armor class for this option (e.g. Defender celestial gets +2). */
  bonusArmor?: number;
  /** Walking speed in feet, if this option changes it from the base. */
  speed?: number;
  /** Swim speed in feet. */
  swim?: number;
  /** Climb speed in feet. */
  climb?: number;
  /** Burrow speed in feet. */
  burrow?: number;
  /** Fly speed in feet. */
  fly?: number;
  /** Keys (into `SummonSpirit.attacks`) of the attacks this option can make. */
  attacks: string[];
  /** Keys (into `SummonSpirit.traits`) of the traits this option gains, on top of the base traits. */
  traits?: string[];
  /** Additional damage resistances granted by this option. */
  resistances?: string[];
  /** Additional damage immunities granted by this option. */
  immunities?: string[];
  /** Additional condition immunities granted by this option. */
  conditionImmunities?: string[];
}

/**
 * A Tasha's-style summon spell whose statblock scales with the spell slot used
 * and the caster's spell attack modifier / spell save DC, rather than by CR.
 *
 * The `summonSpirit` function in `@toolkit5e/monster-scaler` consumes this to
 * produce a fully resolved `Statblock`.
 */
export interface SummonSpirit {
  /** Display name of the spirit stat block (e.g. `'Bestial Spirit'`). */
  name: string;
  /** Display name of the summoning spell (e.g. `'Summon Beast'`). */
  spellName: string;
  /** Minimum spell level the spell can be cast at (its base slot level). */
  minLevel: number;
  /** Creature type (from `creatureTypes`). */
  type: string;
  /** Creature size (from the size constants). */
  size: number;
  /** Base armor class before adding the spell level (AC = `baseArmor` + spell level + option `bonusArmor`). */
  baseArmor: number;
  /** Base hit points at the minimum spell level, before per-level increments or option overrides. */
  hitPoints: number;
  /** Hit points added for each spell level above `minLevel`. */
  hitPointsPerLevel: number;
  /** Base walking speed in feet. */
  speed?: number;
  /** Base swim speed in feet. */
  swim?: number;
  /** Base climb speed in feet. */
  climb?: number;
  /** Base burrow speed in feet. */
  burrow?: number;
  /** Base fly speed in feet. */
  fly?: number;
  /** Darkvision range in feet. */
  darkvision?: number;
  /** Ability scores. All summons use fixed ability scores regardless of spell level. */
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  /** Damage resistances shared by all options. */
  resistances?: string[];
  /** Damage immunities shared by all options. */
  immunities?: string[];
  /** Condition immunities shared by all options. */
  conditionImmunities?: string[];
  /** Languages line. */
  languages?: string[];
  /** Traits shared by all options, keyed by trait id. Values are trait definition keys or inline partial traits. */
  traits?: Record<string, Partial<Trait>>;
  /** Every attack the spirit can make, keyed by id. Options reference these by key. */
  attacks: Record<string, Partial<Attack> & {
    /** Flat damage bonus added on top of `+ the spell's level` (e.g. Maul is `+4 + level`, so `damageBonusBase: 4`). */
    damageBonusBase: number;
  }>;
  /** Actions shared by all options (e.g. Healing Touch, Dreadful Scream), keyed by id. */
  actions?: Record<string, Partial<Trait>>;
  /** Bonus actions shared by all options, keyed by id. */
  bonusActions?: Record<string, Partial<Trait>>;
  /** The options (subtypes) a caster chooses between. Keyed by option id. */
  options: Record<string, SummonOption>;
  /**
   * How the multiattack count scales. `'halfLevel'` = floor(spell level / 2)
   * attacks (the standard Tasha's rule). If omitted, the spirit makes a single attack.
   */
  multiattack?: 'halfLevel';
}

// ---------------------------------------------------------------------------
// Content sources
// ---------------------------------------------------------------------------

/**
 * Describes where a piece of content (a creature, race, world-generator type, etc.)
 * originates. Sources let consuming apps group, filter, and attribute content —
 * e.g. letting a user toggle homebrew sources on or off.
 */
export interface Source {
  /** Stable id used to reference this source from content (e.g. `'srd'`, `'toolkit5e'`). */
  id: string;
  /** Human-readable display name (e.g. `'SRD 5.1'`, `'toolkit5e Original'`). */
  name: string;
  /** Optional publisher / author attribution. */
  publisher?: string;
  /** Optional link to the source material. */
  url?: string;
  /**
   * When true, this source is unofficial / third-party / homebrew content.
   * Apps may default these to off or surface them separately.
   */
  homebrew?: boolean;
  /**
   * How consuming apps should treat this source when filtering content for
   * generation. Attribution (what the content *is*) is independent of this —
   * this field only governs filtering behavior. Defaults to `'default'` when unset.
   *
   * - `'default'` — filterable; shown as a toggle, enabled by default, user can turn off.
   * - `'always'` — exempt from filtering; always generates regardless of user toggles
   *   (e.g. purely-flavor content that should appear in any setting).
   * - `'setting'` — opt-in only; disabled by default and never generates unless
   *   explicitly enabled (e.g. a specific campaign setting's unique content).
   */
  filterPolicy?: 'default' | 'always' | 'setting';
}
