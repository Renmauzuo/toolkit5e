import {
  sizeTiny, sizeSmall, sizeMedium, sizeLarge, sizeHuge, sizeGargantuan,
  damageTypePiercing, damageTypeBludgeoning, damageTypeSlashing,
  damageTypeMundanePhysical, damageTypeMundanePiercingSlashing,
  damageTypeAcid, damageTypeCold, damageTypeFire, damageTypeLightning,
  damageTypeNecrotic, damageTypePoison, damageTypePsychic, damageTypeRadiant, damageTypethunder,
  conditionExhaustion, conditionGrappled, conditionParalyzed, conditionPetrified,
  conditionPoisoned, conditionProne, conditionRestrained, conditionUnconscious,
  conditionCharmed, conditionFrightened, conditionBlinded,
  languageCreator, languageIgnan, languageAnyOne, languageCommon, languageDwarfish, languageElvish, languageSylvan,
  skillRankProficient, skillRankExpert,
  raceAny, raceDwarf, raceHuman,
  armorNatural, armorTypeLight, armorTypeMedium, armorTypeHeavy,
  alignmentMaskAnyLawfulGood,
  genderFemale, genderNeutral,
} from './constants.js';
import type { ChallengeRating, Trait } from './types.js';

export interface SizeData {
  name: string;
  hitDie: number;
  reach: number[];
}

/** Size data indexed by size constant (1=Tiny through 6=Gargantuan). Index 0 is a placeholder. */
export const sizes: SizeData[] = [
  {} as SizeData, // placeholder for index 0
  { name: 'Tiny',       hitDie: 4,  reach: [5,5,5,5,5,5,5] },
  { name: 'Small',      hitDie: 6,  reach: [5,5,5,5,10,10,10] },
  { name: 'Medium',     hitDie: 8,  reach: [5,5,5,5,10,15,20] },
  { name: 'Large',      hitDie: 10, reach: [5,5,5,10,15,20,25] },
  { name: 'Huge',       hitDie: 12, reach: [5,5,10,15,20,25,30] },
  { name: 'Gargantuan', hitDie: 20, reach: [5,10,15,20,25,30,35] },
];

export interface AbilityData {
  name: string;
}

export const abilities: Record<string, AbilityData> = {
  str: { name: 'Strength' },
  dex: { name: 'Dexterity' },
  con: { name: 'Constitution' },
  int: { name: 'Intelligence' },
  wis: { name: 'Wisdom' },
  cha: { name: 'Charisma' },
};

export interface SkillData {
  ability: string;
  name?: string;
}

export const skills: Record<string, SkillData> = {
  acrobatics:     { ability: 'dex' },
  animalHandling: { ability: 'wis', name: 'Animal Handling' },
  arcana:         { ability: 'int' },
  athletics:      { ability: 'str' },
  deception:      { ability: 'cha' },
  history:        { ability: 'int' },
  insight:        { ability: 'wis' },
  intimidation:   { ability: 'cha' },
  investigation:  { ability: 'int' },
  medicine:       { ability: 'wis' },
  nature:         { ability: 'int' },
  perception:     { ability: 'wis' },
  performance:    { ability: 'cha' },
  persuasion:     { ability: 'cha' },
  religion:       { ability: 'int' },
  sleightOfHand:  { ability: 'dex', name: 'Sleight Of Hand' },
  stealth:        { ability: 'dex' },
  survival:       { ability: 'wis' },
};

export interface AverageStatEntry {
  proficiency: number;
  damagePerRound: number;
  xp: number;
  ac: number;
  hp: number;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  size: number;
}

/** Average stats per CR, used as reference points for scaling calculations. */
export const averageStats: Record<ChallengeRating, AverageStatEntry> = {
  0:     { proficiency: 2, damagePerRound: .5,   xp: 10,     ac: 12, hp: 4,   str: 5,  dex: 12, con: 10, int: 7,  wis: 10, cha: 5,  size: sizeSmall - .5 },
  .125:  { proficiency: 2, damagePerRound: 2.5,  xp: 25,     ac: 13, hp: 21,  str: 9,  dex: 12, con: 10, int: 7,  wis: 10, cha: 6,  size: sizeSmall },
  .25:   { proficiency: 2, damagePerRound: 4.5,  xp: 50,     ac: 13, hp: 43,  str: 10, dex: 12, con: 10, int: 8,  wis: 10, cha: 6,  size: sizeMedium - .5 },
  .5:    { proficiency: 2, damagePerRound: 7,    xp: 100,    ac: 13, hp: 60,  str: 11, dex: 12, con: 11, int: 8,  wis: 10, cha: 7,  size: sizeMedium - .4 },
  1:     { proficiency: 2, damagePerRound: 11.5, xp: 200,    ac: 13, hp: 78,  str: 13, dex: 12, con: 13, int: 8,  wis: 10, cha: 8,  size: sizeMedium - .25 },
  2:     { proficiency: 2, damagePerRound: 17.5, xp: 450,    ac: 13, hp: 93,  str: 14, dex: 12, con: 14, int: 8,  wis: 11, cha: 8,  size: sizeMedium },
  3:     { proficiency: 2, damagePerRound: 23.5, xp: 700,    ac: 13, hp: 108, str: 14, dex: 13, con: 14, int: 9,  wis: 11, cha: 9,  size: sizeMedium + .25 },
  4:     { proficiency: 2, damagePerRound: 29.5, xp: 1100,   ac: 14, hp: 123, str: 15, dex: 13, con: 15, int: 9,  wis: 11, cha: 9,  size: sizeMedium + .4 },
  5:     { proficiency: 3, damagePerRound: 35.5, xp: 1800,   ac: 15, hp: 138, str: 16, dex: 13, con: 16, int: 9,  wis: 11, cha: 9,  size: sizeLarge - .5 },
  6:     { proficiency: 3, damagePerRound: 41.5, xp: 2300,   ac: 15, hp: 153, str: 16, dex: 13, con: 16, int: 10, wis: 12, cha: 10, size: sizeLarge - .4 },
  7:     { proficiency: 3, damagePerRound: 47.5, xp: 2900,   ac: 15, hp: 168, str: 17, dex: 13, con: 16, int: 10, wis: 12, cha: 11, size: sizeLarge - .3 },
  8:     { proficiency: 3, damagePerRound: 53.5, xp: 3900,   ac: 16, hp: 183, str: 17, dex: 13, con: 16, int: 10, wis: 13, cha: 12, size: sizeLarge - .25 },
  9:     { proficiency: 4, damagePerRound: 59.5, xp: 5000,   ac: 16, hp: 198, str: 17, dex: 13, con: 17, int: 11, wis: 13, cha: 12, size: sizeLarge - .15 },
  10:    { proficiency: 4, damagePerRound: 65.5, xp: 5900,   ac: 17, hp: 213, str: 18, dex: 14, con: 18, int: 11, wis: 14, cha: 13, size: sizeLarge },
  11:    { proficiency: 4, damagePerRound: 71.5, xp: 7200,   ac: 17, hp: 228, str: 18, dex: 14, con: 18, int: 11, wis: 14, cha: 14, size: sizeLarge + .1 },
  12:    { proficiency: 4, damagePerRound: 77.5, xp: 8400,   ac: 17, hp: 243, str: 18, dex: 14, con: 19, int: 12, wis: 14, cha: 15, size: sizeLarge + .2 },
  13:    { proficiency: 5, damagePerRound: 83.5, xp: 10000,  ac: 18, hp: 258, str: 19, dex: 14, con: 19, int: 12, wis: 14, cha: 15, size: sizeLarge + .3 },
  14:    { proficiency: 5, damagePerRound: 89.5, xp: 11500,  ac: 18, hp: 273, str: 19, dex: 14, con: 19, int: 13, wis: 15, cha: 15, size: sizeHuge - .5 },
  15:    { proficiency: 5, damagePerRound: 95.5, xp: 13000,  ac: 18, hp: 288, str: 20, dex: 14, con: 19, int: 13, wis: 15, cha: 16, size: sizeHuge - .4 },
  16:    { proficiency: 5, damagePerRound: 101.5,xp: 15000,  ac: 18, hp: 303, str: 21, dex: 14, con: 20, int: 13, wis: 16, cha: 17, size: sizeHuge - .3 },
  17:    { proficiency: 6, damagePerRound: 107.5,xp: 18000,  ac: 19, hp: 318, str: 21, dex: 14, con: 20, int: 14, wis: 16, cha: 18, size: sizeHuge - .2 },
  18:    { proficiency: 6, damagePerRound: 113.5,xp: 20000,  ac: 19, hp: 333, str: 22, dex: 14, con: 20, int: 14, wis: 17, cha: 19, size: sizeHuge },
  19:    { proficiency: 6, damagePerRound: 119.5,xp: 22000,  ac: 19, hp: 348, str: 23, dex: 14, con: 21, int: 15, wis: 18, cha: 20, size: sizeHuge + .1 },
  20:    { proficiency: 6, damagePerRound: 131.5,xp: 25000,  ac: 19, hp: 378, str: 24, dex: 15, con: 22, int: 15, wis: 18, cha: 20, size: sizeHuge + .2 },
  21:    { proficiency: 7, damagePerRound: 149.5,xp: 33000,  ac: 19, hp: 423, str: 25, dex: 15, con: 23, int: 16, wis: 19, cha: 21, size: sizeHuge + .3 },
  22:    { proficiency: 7, damagePerRound: 167.5,xp: 41000,  ac: 19, hp: 468, str: 26, dex: 15, con: 24, int: 17, wis: 19, cha: 21, size: sizeHuge + .4 },
  23:    { proficiency: 7, damagePerRound: 185.5,xp: 50000,  ac: 19, hp: 513, str: 27, dex: 15, con: 25, int: 18, wis: 20, cha: 22, size: sizeGargantuan - .2 },
  24:    { proficiency: 7, damagePerRound: 203.5,xp: 62000,  ac: 19, hp: 558, str: 27, dex: 15, con: 25, int: 18, wis: 20, cha: 23, size: sizeGargantuan },
  25:    { proficiency: 8, damagePerRound: 221,  xp: 75000,  ac: 19, hp: 603, str: 28, dex: 15, con: 26, int: 19, wis: 20, cha: 24, size: sizeGargantuan },
  26:    { proficiency: 8, damagePerRound: 240,  xp: 90000,  ac: 19, hp: 648, str: 28, dex: 15, con: 26, int: 20, wis: 21, cha: 25, size: sizeGargantuan },
  27:    { proficiency: 8, damagePerRound: 258,  xp: 105000, ac: 19, hp: 693, str: 29, dex: 15, con: 27, int: 21, wis: 21, cha: 26, size: sizeGargantuan },
  28:    { proficiency: 8, damagePerRound: 276,  xp: 120000, ac: 19, hp: 738, str: 29, dex: 15, con: 28, int: 22, wis: 21, cha: 27, size: sizeGargantuan },
  29:    { proficiency: 9, damagePerRound: 294,  xp: 135000, ac: 19, hp: 783, str: 30, dex: 15, con: 29, int: 23, wis: 22, cha: 28, size: sizeGargantuan },
  30:    { proficiency: 9, damagePerRound: 312,  xp: 155000, ac: 19, hp: 828, str: 30, dex: 15, con: 30, int: 24, wis: 22, cha: 28, size: sizeGargantuan },
};

export const pronouns = [
  {} as Record<string, string>, // placeholder for index 0
  { subject: 'he',   object: 'him',  possessive: 'his',    possessiveAdj: 'his' },
  { subject: 'she',  object: 'her',  possessive: 'hers',   possessiveAdj: 'her' },
  { subject: 'they', object: 'them', possessive: 'theirs', possessiveAdj: 'their' },
  { subject: 'it',   object: 'it',   possessive: 'its',    possessiveAdj: 'its' },
];

export const traits: Record<string, Trait> = {
  amorphous:            { name: 'Amorphous',             description: '{{description}} can move through a space as narrow as 1 inch wide without squeezing.' },
  amphibious:           { name: 'Amphibious',            description: '{{description}} can breathe air and water.' },
  bloodyFrenzy:         { name: 'Bloody Frenzy',         description: "{{description}} has advantage on melee attack rolls against any creature that doesn't have all its hit points." },
  dwarvenResilience:    { name: 'Dwarven Resilience',    description: '{{description}} has advantage on saving throws against poison.' },
  dwarvenToughness:     { name: 'Dwarven Tougness',      description: '{{description}} has one extra hit point per hit die.', hitPointsPerHitDie: 1 },
  dwarvenTraining:      { name: 'Dwarven Combat Training',description: '{{description}} has proficiency with the battleaxe, handaxe, light hammer, and warhammer.' },
  echolocation:         { name: 'Echolocation',          description: "{{description}} can't use {{pronoun:possessiveAdj}} blindsight while deafened." },
  empoweredSpells:      { name: 'Empowered Spells',      description: 'Whenever {{description}} casts a spell of the {{trait:school}} school by expending a spell slot, {{description}} can add {{pronoun:possessiveAdj}} spellcasting ability modifier ({{castingModifier}}) to the spell\'s damage roll or healing roll, if any.' },
  falseAppearance:      { name: 'False Appearance',      description: 'While {{description}} remains motionless, {{pronoun:subject}} is indistinguishable from a normal {{appearance}}.' },
  fireForm:             { name: 'Fire Form',             description: '{{description}} can move through a space as narrow as 1 inch wide without squeezing. A creature that touches {{description}} or hits {{pronoun:object}} with a melee attack while within 5 ft. of {{pronoun:object}} takes {{trait:damage}} fire damage. In addition, {{description}} can enter a hostile creature\'s space and stop there. The first time {{pronoun:subject}} enters a creature\'s space on a turn, that creature takes {{trait:damage}} fire damage and catches fire; until someone takes an action to douse the fire, the creature takes {{trait:damage}} fire damage at the start of each of its turns.', dealsDamage: true },
  flyby:                { name: 'Flyby',                 description: "{{description}} doesn't provoke an opportunity attack when it flies out of an enemy's reach." },
  holdBreath:           { name: 'Hold Breath',           description: '{{description}} can hold {{pronoun:possessiveAdj}} breath for {{trait:duration}} minutes.', hasDuration: true },
  illumination:         { name: 'Illumination',          description: '{{description}} sheds bright light in a 30-foot radius and dim light in an additional 30 ft.' },
  innateSpellcasting:   { name: 'Innate Spellcasting',   description: "{{description}}'s spellcasting ability is Charisma (spell save DC {{trait:DC}}). {{pronoun:subject}} can innately cast the following spells, requiring no material components: {{trait:spellListInnate}}", allowsSave: true, dcStat: 'cha' },
  invisibleInWater:     { name: 'Invisible in Water',    description: '{{description}} is invisible while fully immersed in water.' },
  keenHearing:          { name: 'Keen Hearing',          description: '{{description}} has advantage on Wisdom (Perception) checks that rely on hearing.' },
  keenHearingSmell:     { name: 'Keen Hearing and Smell',description: '{{description}} has advantage on Wisdom (Perception) checks that rely on hearing or smell.' },
  keenSmell:            { name: 'Keen Smell',            description: '{{description}} has advantage on Wisdom (Perception) checks that rely on smell.' },
  packTactics:          { name: 'Pack Tactics',          description: "{{description}} has advantage on an attack roll against a creature if at least one of {{description}}'s allies is within 5 ft. of the creature and the ally isn't incapacitated." },
  magicAttacks:         { name: 'Magic Weapons',         description: "{{description}}'s weapon attacks are magical." },
  magicResistance:      { name: 'Magic Resistance',      description: '{{description}} has advantage on saving throws against spells and other magical effects.' },
  potentCantrips:       { name: 'Potent Cantrips',       description: '{{description}} can add {{pronoun:possessiveAdj}} spellcasting ability modifier ({{castingModifier}}) to the damage {{pronoun:subject}} deals with any cantrip.' },
  pounce:               { name: 'Pounce',                description: 'If {{description}} moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC {{trait:DC}} Strength saving throw or be knocked prone. If the target is prone, {{description}} can make one bite attack against it as a bonus action.', allowsSave: true, dcStat: 'str' },
  shadowStealth:        { name: 'Shadow Stealth',        description: 'While in dim light or darkness, {{description}} can take the Hide action as a bonus action. {{pronoun:possessive}} stealth bonus is also improved to {{abilityBonus:dex:2}}.' },
  speakWithBeastsAndPlants: { name: 'Speak with Beasts and Plants', description: '{{description}} can communicate with beasts and plants as if they shared a language.' },
  spellcasting:         { name: 'Spellcasting',          description: '{{description}} is a {{trait:ordinalLevel}}-level spellcaster. {{pronoun:object}} spellcasting ability is {{castingStatName}} (spell save DC {{spellSaveDC}}, {{spellAttackModifier}} to hit with spell attacks). {{description}} has the following {{trait:castingClass}} spells prepared:{{spellListClass}}' },
  stoneCunning:         { name: 'Stonecunning',          description: 'Whenever {{description}} makes an Intelligence (History) check related to the origin of stonework, {{pronoun:subject}} is considered proficient in the History skill and add double {{pronoun:possessiveAdj}} proficiency bonus to the check, instead of {{pronoun:possessiveAdj}} normal proficiency bonus.' },
  sunlightWeakness:     { name: 'Sunlight Weakness',     description: 'While in sunlight, {{description}} has disadvantage on attack rolls, ability checks, and saving throws.' },
  treeStride:           { name: 'Tree Stride',           description: 'Once on {{pronoun:object}} turn, {{description}} can use 10 feet of {{pronoun:object}} movement to step magically into one living tree within {{pronoun:object}} reach and emerge from a second living tree within 60 feet of the first tree, appearing in an unoccupied space within 5 feet of the second tree. Both trees must be large or bigger.' },
  toolProficiency:      { name: 'Tool Proficiency',      description: "{{description}} has proficiency with one type of artisan\u2019s tools: smith\u2019s tools, brewer\u2019s supplies, or mason\u2019s tools." },
  tramplingCharge:      { name: 'Trampling Charge',      description: 'If {{description}} moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC {{trait:DC}} Strength saving throw or be knocked prone. If the target is prone, {{description}} can make one stomp attack against it as a bonus action.', allowsSave: true, dcStat: 'str' },
  waterBreathing:       { name: 'Water Breathing',       description: '{{description}} can breathe only underwater.' },
  waterSusceptibility:  { name: 'Water Suspceptibility', description: 'For every 5 ft. {{description}} moves in water, or for every gallon of water splashed on {{pronoun:object}}, {{pronoun:subject}} takes {{trait:damage}} cold damage.', dealsDamage: true },
};

export const procs: Record<string, Trait> = {
  ignite:                    { name: 'Ignite',             description: 'If the target is a creature or a flammable object, it ignites. Until a creature takes an action to douse the fire, the target takes {{trait:damage}} fire damage at the start of each of its turns.', dealsDamage: true },
  flyingCharge:              { name: 'Flying Charge',      description: 'If {{description}} flew least 30 feet toward the target immediately before the hit, the target takes an extra {{trait:damage}} piercing damage.', dealsDamage: true },
  grappleBiteSizeRestricted: { name: 'Grapple Bite',       description: "If the target is a {{trait:size}} or smaller creature, it is grappled (escape DC {{trait:DC}}). Until this grapple ends, the target is restrained, and {{description}} can't bite another target", allowsSave: true, dcStat: 'str', sizeRestricted: true },
  grappleBite:               { name: 'Grapple Bite',       description: "The target is grappled (escape dc {{trait:DC}}) Until this grapple ends, the target is restrained, and {{description}} can't bite another target.", allowsSave: true, dcStat: 'str' },
  conditionNoSave:           { name: 'Status No Save',     description: "The target is {{trait:condition}} until the start of {{description}}'s next turn.", appliesCondition: true },
  strengthDrain:             { name: 'Strength Drain',     description: "the target's Strength score is reduced by 1d4. The target dies if this reduces its Strength to 0. Otherwise, the reduction lasts until the target finishes a short or long rest. If a non-evil humanoid dies from this attack, a new {{slug}} rises from the corpse 1d4 hours later." },
  takeDown:                  { name: 'Takedown',           description: 'If the target is a creature, it must succeed on a DC {{trait:DC}} Strength saving throw or be knocked prone', allowsSave: true, dcStat: 'str' },
};

export const actions: Record<string, Trait> = {
  delightfulLight: { name: 'Delightful Light (Recharge 5\u20136)', description: '{{description}} magically emanates light in a 10-foot radius for a moment. {{description}} and each creature of {{pronoun:possessiveAdj}} choice in that light gain {{trait:damage}} temporary hit points.', dealsDamage: true },
  feyCharm:        { name: 'Fey Charm',  description: "{{description}} targets one humanoid or beast that {{pronoun:subject}} can see within 30 feet of {{pronoun:object}}. If the target can see {{description}}, it must succeed on a DC {{trait:DC}} Wisdom saving throw or be magically charmed. The charmed creature regards {{description}} as a trusted friend to be heeded and protected. Although the target isn't under {{description}}'s control, it takes {{description}}'s requests or actions in the most favorable way it can.<span class='trait-spacer'></span>Each time {{description}} or {{pronoun:possessiveAdj}} allies do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until {{description}} dies, is on a different plane of existence from the target, or ends the effect as a bonus action. If a target's saving throw is successful, the target is immune to {{description}}'s Fey Charm for the next 24 hours.<span class='trait-spacer'></span>{{description}} can have no more than one humanoid and up to three beasts charmed at a time.", allowsSave: true, dcStat: 'cha' },
  feyLeap:         { name: 'Fey Leap',   description: '{{description}} teleports up to 30 feet to an unoccupied space {{pronoun:subject}} can see. Immediately before teleporting, {{description}} can choose one creature within 5 feet of {{pronoun:object}}. That creature can teleport with {{description}}, appearing in an unoccupied space within 5 feet of {{description}}\'s destination space.' },
  helpful:         { name: 'Helpful',    description: '{{description}} takes the Help action.' },
};

export const armorTypes: Record<string, { ac: number; type: number; name?: string }> = {
  padded:         { ac: 11, type: armorTypeLight },
  leather:        { ac: 11, type: armorTypeLight },
  studdedLeather: { ac: 12, name: 'Studded Leather', type: armorTypeLight },
  chainShirt:     { ac: 13, name: 'Chain Shirt',     type: armorTypeMedium },
  scaleMail:      { ac: 14, name: 'Scale Mail',      type: armorTypeMedium },
  breastplate:    { ac: 14,                           type: armorTypeMedium },
  halfPlate:      { ac: 15, name: 'Half Plate',      type: armorTypeMedium },
  ringMail:       { ac: 14, name: 'Ring Mail',       type: armorTypeHeavy },
  chainMail:      { ac: 16, name: 'Chain Mail',      type: armorTypeHeavy },
  split:          { ac: 17,                           type: armorTypeHeavy },
  plate:          { ac: 18,                           type: armorTypeHeavy },
};

export const spells: Record<string, { name: string; level?: number; classes?: string[] }> = {
  barkskin:         { name: 'barkskin' },
  druidcraft:       { name: 'druidcraft' },
  entangle:         { name: 'entangle' },
  fly:              { name: 'fly' },
  goodberry:        { name: 'goodberry' },
  hypnoticPattern:  { name: 'hypnotic pattern' },
  minorIllusion:    { name: 'minor illusion' },
  passWithoutTrace: { name: 'pass without trace' },
  phantasmalForce:  { name: 'phantasmal force' },
  shillelagh:       { name: 'shillelagh' },
};

export interface RaceData {
  name: string;
  stats?: {
    size?: number;
    languages?: string[];
    alignment?: number;
    speed?: number;
    darkvision?: number;
    resistances?: string[];
    [key: string]: unknown;
  };
  traits?: string[];
  bonusStats?: Record<string, number>;
}

export const races: RaceData[] = [
  { name: raceAny },
  {
    name: raceDwarf,
    stats: {
      size: sizeMedium,
      languages: [languageCommon, languageDwarfish],
      alignment: alignmentMaskAnyLawfulGood,
      speed: 25,
      darkvision: 60,
      resistances: [damageTypePoison],
    },
    traits: ['dwarvenTraining', 'dwarvenResilience', 'dwarvenToughness', 'toolProficiency', 'stoneCunning'],
    bonusStats: { con: 2, wis: 1 },
  },
  {
    name: raceHuman,
    stats: {
      size: sizeMedium,
      languages: [languageCommon],
      speed: 30,
    },
    bonusStats: { str: 1, con: 1, dex: 1, int: 1, wis: 1, cha: 1 },
  },
];
