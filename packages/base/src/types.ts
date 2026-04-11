// Challenge Rating types
export type ChallengeRating = 
  | 0 | 0.125 | 0.25 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25
  | 26 | 27 | 28 | 29 | 30;

// Size enum
export enum Size {
  Tiny = 1,
  Small = 2,
  Medium = 3,
  Large = 4,
  Huge = 5,
  Gargantuan = 6
}

// Reach distances
export enum Reach {
  VeryShort = 0,
  Short = 1,
  MediumShort = 2,
  Medium = 3,
  MediumLong = 4,
  Long = 4,
  VeryLong = 5
}

// Damage types
export type DamageType = 
  | 'piercing'
  | 'bludgeoning'
  | 'slashing'
  | 'Bludgeoning, Piercing, and Slashing From Nonmagical Attacks'
  | 'Piercing and Slashing From Nonmagical Attacks'
  | 'acid'
  | 'cold'
  | 'fire'
  | 'lightning'
  | 'necrotic'
  | 'poison'
  | 'psychic'
  | 'radiant'
  | 'thunder';

// Condition types
export type Condition = 
  | 'exhaustion'
  | 'grappled'
  | 'paralyzed'
  | 'petrified'
  | 'poisoned'
  | 'prone'
  | 'restrained'
  | 'unconscious'
  | 'charmed'
  | 'frightened'
  | 'blinded';

// Skill types
export type Skill = 
  | 'acrobatics'
  | 'animalHandling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleightOfHand'
  | 'stealth'
  | 'survival';

// Skill ranks
export enum SkillRank {
  Unproficient = 0,
  Proficient = 1,
  Expert = 2
}

// Ability scores
export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
