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
  beast: 'beast',
  elemental: 'elemental',
  humanoid: 'humanoid',
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
} as const;

/** Language strings. */
export const languages = {
  creator: 'One Language Known By Its Creator',
  ignan: 'Ignan',
  anyOne: 'Any One Language',
  common: 'Common',
  dwarfish: 'Dwarfish',
  elvish: 'Elvish',
  sylvan: 'Sylvan',
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
  dwarf: 'dwarf',
  human: 'human',
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
