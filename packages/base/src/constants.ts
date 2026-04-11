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

// Creature types
export const typeBeast = 'beast' as const;
export const typeElemental = 'elemental' as const;
export const typeHumanoid = 'humanoid' as const;
export const typePlant = 'plant' as const;
export const typeFey = 'fey' as const;
export const typeUndead = 'undead' as const;

// Alignments
export const alignmentUnaligned = 'unaligned' as const;
export const alignmentNeutral = 'neutral' as const;
export const alignmentAny = 'any alignment' as const;
export const alignmentChaoticNeutral = 'chaotic neutral' as const;
export const alignmentChaoticGood = 'chaotic good' as const;
export const alignmentChaoticEvil = 'chaotic evil' as const;

// Alignment masks
export const alignmentMaskUnaligned = 0;
export const alignmentMaskLG = 1;
export const alignmentMaskNG = 2;
export const alignmentMaskCG = 4;
export const alignmentMaskLN = 8;
export const alignmentMaskTN = 16;
export const alignmentMaskCN = 32;
export const alignmentMaskLE = 64;
export const alignmentMaskNE = 128;
export const alignmentMaskCE = 256;
export const alignmentMaskAny = 511;

export const alignmentMaskGood = alignmentMaskLG | alignmentMaskNG | alignmentMaskCG;
export const alignmentMaskEvil = alignmentMaskLE | alignmentMaskNE | alignmentMaskCE;
export const alignmentMaskLawful = alignmentMaskLG | alignmentMaskLN | alignmentMaskLE;
export const alignmentMaskChaotic = alignmentMaskCG | alignmentMaskCN | alignmentMaskCE;
export const alignmentMaskAnyLawfulGood = alignmentMaskGood | alignmentMaskLawful;

// Gender
export const genderMale = 1;
export const genderFemale = 2;
export const genderNeutral = 3;
export const genderNone = 4;

// Damage types
export const damageTypePiercing = 'piercing' as const;
export const damageTypeBludgeoning = 'bludgeoning' as const;
export const damageTypeSlashing = 'slashing' as const;
export const damageTypeMundanePhysical = 'Bludgeoning, Piercing, and Slashing From Nonmagical Attacks' as const;
export const damageTypeMundanePiercingSlashing = 'Piercing and Slashing From Nonmagical Attacks' as const;
export const damageTypeAcid = 'acid' as const;
export const damageTypeCold = 'cold' as const;
export const damageTypeFire = 'fire' as const;
export const damageTypeLightning = 'lightning' as const;
export const damageTypeNecrotic = 'necrotic' as const;
export const damageTypePoison = 'poison' as const;
export const damageTypePsychic = 'psychic' as const;
export const damageTypeRadiant = 'radiant' as const;
export const damageTypethunder = 'thunder' as const;

// Conditions
export const conditionExhaustion = 'exhaustion' as const;
export const conditionGrappled = 'grappled' as const;
export const conditionParalyzed = 'paralyzed' as const;
export const conditionPetrified = 'petrified' as const;
export const conditionPoisoned = 'poisoned' as const;
export const conditionProne = 'prone' as const;
export const conditionRestrained = 'restrained' as const;
export const conditionUnconscious = 'unconscious' as const;
export const conditionCharmed = 'charmed' as const;
export const conditionFrightened = 'frightened' as const;
export const conditionBlinded = 'blinded' as const;

// Languages
export const languageCreator = 'One Language Known By Its Creator' as const;
export const languageIgnan = 'Ignan' as const;
export const languageAnyOne = 'Any One Language' as const;
export const languageCommon = 'Common' as const;
export const languageDwarfish = 'Dwarfish' as const;
export const languageElvish = 'Elvish' as const;
export const languageSylvan = 'Sylvan' as const;

// Skill ranks
export const skillRankUnproficient = 0;
export const skillRankProficient = 1;
export const skillRankExpert = 2;

// Races
export const raceAny = 'any race' as const;
export const raceDwarf = 'dwarf' as const;
export const raceHuman = 'human' as const;

// Armor
export const armorNatural = 'Natural Armor' as const;

// Senses
export const senses = ['darkvision', 'blindsight'] as const;

// Armor types
export const armorTypeLight = 1;
export const armorTypeMedium = 2;
export const armorTypeHeavy = 3;
