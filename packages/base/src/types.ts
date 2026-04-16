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
  dcStat?: AbilityKey;
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
  spellList?: Record<string, { uses: number }>;
  school?: string;
  level?: number;
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
}
