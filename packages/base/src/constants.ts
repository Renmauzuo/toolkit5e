// Sizes (start at 1 so tiny doesn't implicitly evaluate to false)
export const sizeTiny = 1;
export const sizeSmall = 2;
export const sizeMedium = 3;
export const sizeLarge = 4;
export const sizeHuge = 5;
export const sizeGargantuan = 6;

// Reach constants
export const reachVeryShort = 0;
export const reachShort = 1;
export const reachMediumShort = 2;
export const reachMedium = 3;
export const reachMediumLong = 4;
export const reachLong = 4;
export const reachVeryLong = 5;

/** Creature types. */
export const creatureTypes = {
  aberration: 'aberration',
  beast: 'beast',
  celestial: 'celestial',
  construct: 'construct',
  dragon: 'dragon',
  elemental: 'elemental',
  fiend: 'fiend',
  giant: 'giant',
  humanoid: 'humanoid',
  monstrosity: 'monstrosity',
  plant: 'plant',
  fey: 'fey',
  undead: 'undead',
} as const;

/** Alignment strings. */
export const alignments = {
  unaligned: 'unaligned',
  neutral: 'neutral',
  any: 'any alignment',
  chaoticNeutral: 'chaotic neutral',
  chaoticGood: 'chaotic good',
  chaoticEvil: 'chaotic evil',
  lawfulEvil: 'lawful evil',
  lawfulGood: 'lawful good',
  neutralEvil: 'neutral evil',
  neutralGood: 'neutral good',
} as const;

/** Alignment bitmask values for filtering by alignment category. */
export const alignmentMasks = {
  unaligned: 0,
  LG: 1,
  NG: 2,
  CG: 4,
  LN: 8,
  TN: 16,
  CN: 32,
  LE: 64,
  NE: 128,
  CE: 256,
  any: 511,
  get good() { return this.LG | this.NG | this.CG; },
  get evil() { return this.LE | this.NE | this.CE; },
  get lawful() { return this.LG | this.LN | this.LE; },
  get chaotic() { return this.CG | this.CN | this.CE; },
  get anyLawfulGood() { return this.good | this.lawful; },
} as const;

/** Gender constants. */
export const genders = {
  male: 1,
  female: 2,
  neutral: 3,
  none: 4,
} as const;

/** Damage types. */
export const damageTypes = {
  piercing: 'piercing',
  bludgeoning: 'bludgeoning',
  slashing: 'slashing',
  mundanePhysical: 'Bludgeoning, Piercing, and Slashing From Nonmagical Attacks',
  mundanePiercingSlashing: 'Piercing and Slashing From Nonmagical Attacks',
  acid: 'acid',
  cold: 'cold',
  fire: 'fire',
  force: 'force',
  lightning: 'lightning',
  necrotic: 'necrotic',
  poison: 'poison',
  psychic: 'psychic',
  radiant: 'radiant',
  thunder: 'thunder',
} as const;

/** Condition names. */
export const conditions = {
  exhaustion: 'exhaustion',
  grappled: 'grappled',
  paralyzed: 'paralyzed',
  petrified: 'petrified',
  poisoned: 'poisoned',
  prone: 'prone',
  restrained: 'restrained',
  unconscious: 'unconscious',
  charmed: 'charmed',
  frightened: 'frightened',
  blinded: 'blinded',
  incapacitated: 'incapacitated',
} as const;

/** Language strings. */
export const languages = {
  creator: 'One Language Known By Its Creator',
  abyssal: 'Abyssal',
  aquan: 'Aquan',
  auran: 'Auran',
  blinkDog: 'Blink Dog',
  ignan: 'Ignan',
  infernal: 'Infernal',
  terran: 'Terran',
  anyOne: 'Any One Language',
  common: 'Common',
  draconic: 'Draconic',
  dwarfish: 'Dwarfish',
  elvish: 'Elvish',
  giant: 'Giant',
  goblin: 'Goblin',
  sylvan: 'Sylvan',
  deepSpeech: 'Deep Speech',
  primordial: 'Primordial',
  celestial: 'Celestial',
  understandsCaster: 'understands the languages you speak',
} as const;

/** Skill proficiency ranks. */
export const skillRanks = {
  unproficient: 0,
  proficient: 1,
  expert: 2,
} as const;

/** Race strings. */
export const raceKeys = {
  any: 'any race',
  dragonborn: 'dragonborn',
  dwarf: 'dwarf',
  elf: 'elf',
  gnome: 'gnome',
  goliath: 'goliath',
  halfElf: 'half-elf',
  halfOrc: 'half-orc',
  halfling: 'halfling',
  human: 'human',
  orc: 'orc',
  tiefling: 'tiefling',
} as const;

/** Armor material types. */
export const armorMaterials = {
  natural: 'Natural Armor',
} as const;

// Senses
export const senses = ['darkvision', 'blindsight'] as const;

/** Armor class types (light / medium / heavy). */
export const armorClasses = {
  light: 1,
  medium: 2,
  heavy: 3,
} as const;

// ---------------------------------------------------------------------------
// Content sources
// ---------------------------------------------------------------------------

/**
 * Stable source ids. Content references a source by one of these keys via its
 * optional `source` field. Content with no `source` is treated as {@link defaultSourceId}.
 */
export const sourceKeys = {
  /**
   * Source-agnostic / "common" content that isn't tied to any ruleset — structural
   * scaffolding like geography and settlements. Always generates (never filtered),
   * so a campaign restricted to a single ruleset still gets a populated world.
   */
  common: 'common',
  srd: 'srd',
  srd52: 'srd52',
  toolkit5e: 'toolkit5e',
} as const;

/**
 * The source assumed when *statblock-style* content (creatures, etc.) declares no
 * `source`. Most such content comes from the SRD, so treating "no source" as SRD
 * keeps the common case annotation-free — only non-SRD content needs an explicit tag.
 *
 * Note this default suits ruleset content specifically. Apps whose untagged content
 * is mostly non-rules scaffolding (e.g. the world generator's geography/settlements)
 * should default those to {@link sourceKeys.common} instead — see `resolveSourceId`'s
 * optional `fallback` parameter.
 */
export const defaultSourceId = sourceKeys.srd;

/** Registry of known content sources, keyed by {@link sourceKeys}. */
export const sources = {
  [sourceKeys.common]: {
    id: sourceKeys.common,
    name: 'Common',
    homebrew: false,
    filterPolicy: 'always',
  },
  [sourceKeys.srd]: {
    id: sourceKeys.srd,
    name: 'SRD 5.1',
    publisher: 'Wizards of the Coast',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
    homebrew: false,
    filterPolicy: 'default',
  },
  [sourceKeys.srd52]: {
    id: sourceKeys.srd52,
    name: 'SRD 5.2',
    publisher: 'Wizards of the Coast',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
    homebrew: false,
    filterPolicy: 'default',
  },
  [sourceKeys.toolkit5e]: {
    id: sourceKeys.toolkit5e,
    name: 'toolkit5e Original',
    publisher: 'toolkit5e',
    homebrew: false,
    filterPolicy: 'default',
  },
} as const;
