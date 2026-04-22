import {
    sizeTiny, sizeSmall, sizeMedium, sizeLarge, sizeHuge,
    reachShort, reachMediumShort, reachMedium,
    creatureTypes, alignments, damageTypes, conditions, languages, skillRanks, raceKeys, armorMaterials, genders,
} from '@toolkit5e/base';
import type { MonsterTemplate } from './types.js';

export const monsterList: Record<string, MonsterTemplate> = {
    ape: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: {
            attacks: {
                fist: { reach: reachMedium, damageType: damageTypes.bludgeoning, name: 'Fist' },
                rock: { damageType: damageTypes.bludgeoning, name: 'Rock', ranged: true },
            },
            skills: { athletics: skillRanks.proficient, perception: skillRanks.proficient },
            slug: 'ape',
            multiattack: { attacks: { fist: 2 } },
        },
        stats: {
            0.5: { name: 'Ape', hitDice: 3, speed: 30, climb: 30, size: sizeMedium, str: 16, dex: 14, con: 14, int: 6, wis: 12, cha: 7, attacks: { fist: { damageDice: 1, damageDieSize: 6 }, rock: { range: 25, longRange: 50, damageDice: 1, damageDieSize: 6 } } },
            7: { name: 'Giant Ape', hitDice: 15, speed: 40, climb: 40, size: sizeHuge, str: 23, dex: 14, con: 18, int: 7, wis: 12, cha: 7, attacks: { fist: { damageDice: 3, damageDieSize: 10 }, rock: { range: 50, longRange: 100, damageDice: 7, damageDieSize: 6 } } },
        },
    },
    awakenedPlant: {
        name: 'Awakened Plant',
        type: creatureTypes.plant,
        alignment: alignments.unaligned,
        lockedStats: {
            armorDescription: armorMaterials.natural,
            int: 10,
            wis: 10,
            vulnerabilities: [damageTypes.fire],
            languages: [languages.creator],
        },
        variants: {
            shrub: {
                name: 'Awakened Shrub',
                stats: { 0: { name: 'Awakened Shrub', attacks: { rake: { damageDice: 1, damageDieSize: 4 } } } },
                lockedStats: { slug: 'shrub', resistances: [damageTypes.piercing], attacks: { rake: { reach: reachMediumShort, damageType: damageTypes.slashing, name: 'Rake', finesse: true } } },
            },
            tree: {
                name: 'Awakened Tree',
                stats: { 0: { name: 'Awakened Sapling' }, 2: { name: 'Awakened Tree', attacks: { slam: { damageDice: 3, damageDieSize: 6 } } } },
                lockedStats: { slug: 'tree', resistances: [damageTypes.bludgeoning, damageTypes.piercing], attacks: { slam: { reach: reachMediumShort, damageType: damageTypes.bludgeoning, name: 'Slam' } } },
            },
        },
        traits: ['falseAppearance'],
        stats: {
            0: { bonusArmor: 0, speed: 20, hitDice: 3, size: sizeSmall, str: 3, dex: 8, con: 11, cha: 6 },
            2: { bonusArmor: 5, hitDice: 7, size: sizeHuge, str: 19, dex: 6, con: 15, cha: 7 },
        },
    },
    baboon: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { attacks: { bite: { reach: reachMedium, damageType: damageTypes.piercing, name: 'Bite' } }, slug: 'baboon' },
        traits: ['packTactics'],
        stats: { 0: { name: 'Baboon', hitDice: 1, speed: 30, climb: 30, size: sizeSmall, str: 8, dex: 14, con: 11, int: 4, wis: 12, cha: 6, attacks: { bite: { damageDice: 1, damageDieSize: 4 } } } },
    },
    badger: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { attacks: { bite: { reach: reachMedium, damageType: damageTypes.piercing, name: 'Bite', finesse: true } }, int: 2, slug: 'badger' },
        traits: ['keenSmell'],
        stats: {
            0: { name: 'Badger', hitDice: 1, speed: 20, burrow: 5, size: sizeTiny, str: 4, dex: 11, con: 12, wis: 12, cha: 5, attacks: { bite: { damageDice: 1, damageDieSize: 1 } } },
            0.25: { name: 'Giant Badger', hitDice: 12, speed: 30, burrow: 10, size: sizeMedium, str: 13, dex: 10, con: 15, wis: 12, cha: 5, multiattack: { attacks: { bite: 1, claws: 1 } }, attacks: { bite: { damageDice: 1, damageDieSize: 6 }, claws: { reach: reachMedium, damageType: damageTypes.slashing, name: 'Claws', damageDice: 2, damageDieSize: 4 } } },
        },
    },
    bat: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { attacks: { bite: { reach: reachMedium, damageType: damageTypes.piercing, name: 'Bite' } }, int: 2, blindsight: 60, slug: 'bat' },
        traits: ['keenHearing', 'echolocation'],
        stats: {
            0: { name: 'Bat', hitDice: 1, speed: 5, fly: 30, size: sizeTiny, str: 2, dex: 15, con: 8, wis: 12, cha: 4, attacks: { bite: { damageDice: 1, damageDieSize: 1 } } },
            0.25: { name: 'Giant Bat', hitDice: 12, speed: 30, fly: 30, size: sizeMedium, str: 15, dex: 16, con: 11, wis: 12, cha: 6, attacks: { bite: { damageDice: 1, damageDieSize: 6 } } },
        },
    },
    camel: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { attacks: { bite: { reach: reachMedium, damageType: damageTypes.bludgeoning, name: 'Bite' } }, int: 2, slug: 'camel' },
        stats: {
            0.125: { name: 'Camel', hitDice: 2, speed: 50, size: sizeLarge, str: 16, dex: 8, con: 14, wis: 8, cha: 5, attacks: { bite: { damageDice: 1, damageDieSize: 4 } } },
        },
    },
    boar: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: {
            attacks: { tusk: { reach: reachMedium, damageType: damageTypes.slashing, name: 'Tusk' } },
            int: 2,
            slug: 'boar',
        },
        traits: ['relentless', 'tramplingCharge'],
        stats: {
            0: { name: 'Piglet' },
            0.25: { name: 'Boar', hitDice: 2, speed: 40, size: sizeMedium, str: 13, dex: 11, con: 12, wis: 9, cha: 5, attacks: { tusk: { damageDice: 1, damageDieSize: 6 } }, traits: { relentless: { damageDice: 7, damageDieSize: 1 }, tramplingCharge: { chargeAttack: 'tusk', knockdownAttack: 'tusk', dcAdjustment: -4 } } },
            2: { name: 'Giant Boar', hitDice: 5, speed: 40, size: sizeLarge, str: 17, dex: 10, con: 16, wis: 9, cha: 5, attacks: { tusk: { damageDice: 2, damageDieSize: 6 } }, traits: { relentless: { damageDice: 10, damageDieSize: 1 }, tramplingCharge: { chargeAttack: 'tusk', knockdownAttack: 'tusk', dcAdjustment: -2 } } },
        },
    },
    bear: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: {
            armorDescription: armorMaterials.natural,
            attacks: {
                bite: { reach: reachMedium, damageType: damageTypes.piercing, name: 'Bite' },
                claws: { reach: reachMedium, damageType: damageTypes.slashing, name: 'Claws' },
            },
            multiattack: { attacks: { bite: 1, claws: 1 } },
            int: 2,
            slug: 'bear',
            speed: 40,
            skills: { perception: skillRanks.proficient },
        },
        traits: ['keenSmell'],
        stats: {
            0: { name: 'Bear Cub' },
            0.5: { name: 'Black Bear', hitDice: 3, bonusArmor: 1, size: sizeMedium, str: 15, con: 14, climb: 30, attacks: { bite: { damageDice: 1, damageDieSize: 6 }, claws: { damageDice: 2, damageDieSize: 4 } } },
            1: { name: 'Brown Bear', hitDice: 4, bonusArmor: 1, size: sizeLarge, str: 19, con: 16, climb: 30, attacks: { bite: { damageDice: 1, damageDieSize: 8 }, claws: { damageDice: 2, damageDieSize: 6 } } },
            2: { name: 'Polar Bear', hitDice: 5, bonusArmor: 2, size: sizeLarge, str: 20, con: 16, swim: 30, attacks: { bite: { damageDice: 1, damageDieSize: 8 }, claws: { damageDice: 2, damageDieSize: 6 } } },
        },
    },
    commoner: {
        type: creatureTypes.humanoid,
        alignment: alignments.any,
        race: raceKeys.any,
        gender: genders.neutral,
        lockedStats: { attacks: { club: { reach: reachMedium, damageType: damageTypes.bludgeoning, name: 'Club' } }, extraLanguages: 1, slug: 'commoner', size: sizeMedium },
        stats: { 0: { name: 'Commoner', hitDice: 1, speed: 30, str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, attacks: { club: { damageDice: 1, damageDieSize: 4 } } } },
    },
    crocodile: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { armorDescription: armorMaterials.natural, int: 2, slug: 'crocodile', attacks: { bite: { reach: reachShort, damageType: damageTypes.piercing, name: 'Bite', proc: 'grappleBite' } }, skills: { stealth: skillRanks.expert } },
        traits: ['holdBreath'],
        stats: {
            0.5: { name: 'Crocodile', bonusArmor: 2, hitDice: 3, speed: 20, swim: 30, size: sizeLarge, str: 15, dex: 10, con: 13, wis: 10, cha: 5, attacks: { bite: { damageDice: 1, damageDieSize: 10 } }, traits: { holdBreath: { duration: 15 } } },
            5: { name: 'Giant Crocodile', bonusArmor: 5, hitDice: 9, speed: 30, swim: 50, size: sizeHuge, str: 21, dex: 9, con: 17, wis: 10, cha: 7, multiattack: { attacks: { bite: 1, tail: 1 } }, attacks: { bite: { damageDice: 3, damageDieSize: 10 }, tail: { reach: reachMediumShort, damageType: damageTypes.bludgeoning, name: 'Tail', proc: 'takeDown', damageDice: 2, damageDieSize: 8, notGrappled: true } }, traits: { holdBreath: { duration: 30 } } },
        },
    },
    dolphinDelighter: {
        name: 'Dolphin Delighter',
        type: creatureTypes.fey,
        alignment: alignments.chaoticGood,
        lockedStats: { armorDescription: armorMaterials.natural, attacks: { dazzlingSlam: { reach: reachShort, damageType: damageTypes.bludgeoning, damageRiderType: damageTypes.psychic, name: 'Dazzling Slam', proc: 'conditionNoSave' } }, multiattack: { attacks: { dazzlingSlam: 2 } }, skills: { perception: skillRanks.proficient, performance: skillRanks.proficient }, slug: 'dolphin' },
        bonusActions: ['delightfulLight', 'feyLeap'],
        traits: ['holdBreath'],
        stats: {
            3: { name: 'Dolphin Delighter', bonusArmor: 3, blindsight: 60, hitDice: 5, speed: 0, swim: 60, size: sizeMedium, str: 14, dex: 13, con: 13, int: 11, wis: 12, cha: 16, attacks: { dazzlingSlam: { damageDice: 1, damageDieSize: 6, damageRiderDice: 2, damageRiderDieSize: 6 } }, traits: { conditionNoSave: { condition: 'blinded' }, delightfulLight: { damageDice: 2, damageDieSize: 10 }, holdBreath: { duration: 20 } } },
        },
    },
    dryad: {
        type: creatureTypes.fey,
        alignment: alignments.neutral,
        lockedStats: {
            attacks: { club: { reach: reachMedium, damageType: damageTypes.bludgeoning, name: 'Club' } },
            castingStat: 'cha',
            gender: genders.female,
            languages: [languages.elvish, languages.sylvan],
            skills: { perception: skillRanks.proficient, stealth: skillRanks.proficient },
            slug: 'dryad',
            size: sizeMedium,
            traits: { innateSpellcasting: { spellList: { druidcraft: { uses: 0 }, entangle: { uses: 3 }, goodberry: { uses: 3 }, barkskin: { uses: 1 }, passWithoutTrace: { uses: 1 }, shillelagh: { uses: 1 } } } },
        },
        actions: ['feyCharm'],
        traits: ['innateSpellcasting', 'magicResistance', 'speakWithBeastsAndPlants', 'treeStride'],
        stats: { 1: { name: 'Dryad', hitDice: 5, speed: 30, str: 10, dex: 12, con: 11, int: 14, wis: 15, cha: 18, attacks: { club: { damageDice: 1, damageDieSize: 4 } } } },
    },
    eagle: {
        type: creatureTypes.beast,
        alignment: alignments.neutralGood,
        lockedStats: {
            attacks: {
                beak: { reach: reachMedium, damageType: damageTypes.piercing, name: 'Beak' },
                talons: { reach: reachMedium, damageType: damageTypes.slashing, name: 'Talons' },
            },
            slug: 'eagle',
            skills: { perception: skillRanks.proficient },
        },
        traits: ['keenSight'],
        stats: {
            0: { name: 'Eaglet' },
            0.125: { name: 'Eagle', hitDice: 1, speed: 10, fly: 60, size: sizeSmall, str: 6, dex: 15, con: 10, int: 2, wis: 14, cha: 7, attacks: { talons: { damageDice: 1, damageDieSize: 4 } } },
            1: { name: 'Giant Eagle', hitDice: 4, speed: 10, fly: 80, size: sizeLarge, str: 16, dex: 17, con: 13, int: 8, wis: 14, cha: 10, multiattack: { attacks: { beak: 1, talons: 1 } }, attacks: { beak: { damageDice: 1, damageDieSize: 6 }, talons: { damageDice: 2, damageDieSize: 6 } }, languages: ['Giant Eagle'] },
        },
    },
    elephant: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { armorDescription: armorMaterials.natural, attacks: { gore: { reach: reachShort, damageType: damageTypes.piercing, name: 'Gore' }, stomp: { reach: reachShort, damageType: damageTypes.bludgeoning, name: 'Stomp', proneOnly: true } }, int: 3 },
        traits: ['tramplingCharge'],
        variants: {
            elephant: {
                name: 'Elephant',
                lockedStats: { int: 3 },
                stats: { 4: { slug: 'elephant', name: 'Elephant', speed: 40, cha: 6 }, 6: { slug: 'mammoth', name: 'Mammoth', cha: 6 } },
            },
            triceratops: {
                name: 'Triceratops',
                lockedStats: { int: 2 },
                stats: { 5: { slug: 'triceratops', name: 'Triceratops', speed: 50, cha: 5 } },
            },
        },
        stats: {
            4: { bonusArmor: 3, hitDice: 8, size: sizeHuge, str: 22, dex: 9, con: 17, wis: 11, traits: { tramplingCharge: { dcAdjustment: -4 } }, attacks: { gore: { damageDice: 3, damageDieSize: 8 }, stomp: { damageDice: 3, damageDieSize: 10 } } },
            5: { bonusArmor: 4, hitDice: 10, size: sizeHuge, str: 22, dex: 9, con: 17, wis: 11, traits: { tramplingCharge: { dcAdjustment: -4 } }, attacks: { gore: { damageDice: 4, damageDieSize: 8 }, stomp: { damageDice: 3, damageDieSize: 10 } } },
            6: { bonusArmor: 4, hitDice: 11, size: sizeHuge, str: 24, dex: 9, con: 21, wis: 11, traits: { tramplingCharge: { dcAdjustment: 0 } }, attacks: { gore: { damageDice: 4, damageDieSize: 8, reach: reachMediumShort }, stomp: { damageDice: 4, damageDieSize: 10 } } },
        },
    },

    fireElemental: {
        name: 'Fire Elemental',
        type: creatureTypes.elemental,
        alignment: alignments.neutral,
        lockedStats: { darkvision: 60, languages: [languages.ignan], resistances: [damageTypes.mundanePhysical], immunities: [damageTypes.fire, damageTypes.poison], conditionImmunities: [conditions.exhaustion, conditions.grappled, conditions.paralyzed, conditions.petrified, conditions.poisoned, conditions.prone, conditions.restrained, conditions.unconscious], attacks: { touch: { reach: reachMediumShort, damageType: damageTypes.fire, name: 'Touch', proc: 'ignite' } }, slug: 'elemental', multiattack: { attacks: { touch: 2 } } },
        traits: ['fireForm', 'illumination', 'waterSusceptibility'],
        stats: { 5: { name: 'Fire Elemental', hitDice: 12, speed: 50, size: sizeLarge, str: 10, dex: 17, con: 16, int: 6, wis: 10, cha: 7, attacks: { touch: { damageDice: 2, damageDieSize: 6, finesse: true } }, traits: { ignite: { damageDice: 1, damageDieSize: 10 }, fireForm: { damageDice: 1, damageDieSize: 10 }, waterSusceptibility: { damageDice: 1, damageDieSize: 1 } } } },
    },
    giantSpider: {
        name: 'Giant Spider',
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: {
            armorDescription: armorMaterials.natural,
            attacks: {
                bite: { reach: reachMedium, damageType: damageTypes.piercing, name: 'Bite', proc: 'poisonBite' },
            },
            int: 2,
            blindsight: 10,
            darkvision: 60,
            slug: 'giantSpider',
            skills: { stealth: skillRanks.expert },
        },
        traits: ['spiderClimb', 'webSense', 'webWalker'],
        actions: ['web'],
        stats: {
            1: { name: 'Giant Spider', hitDice: 4, bonusArmor: 4, speed: 30, climb: 30, size: sizeLarge, str: 14, dex: 16, con: 12, wis: 11, cha: 4, attacks: { bite: { damageDice: 1, damageDieSize: 8 } } },
        },
    },
    horse: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: {
            attacks: { hooves: { reach: reachMedium, damageType: damageTypes.bludgeoning, name: 'Hooves' } },
            int: 2,
            size: sizeLarge,
            slug: 'horse',
        },
        variants: {
            riding: {
                name: 'Riding Horse',
                stats: {
                    0: { name: 'Foal' },
                    0.25: { name: 'Riding Horse', hitDice: 2, speed: 60, str: 16, attacks: { hooves: { damageDice: 2, damageDieSize: 4 } } },
                },
            },
            draft: {
                name: 'Draft Horse',
                stats: {
                    0: { name: 'Foal' },
                    0.25: { name: 'Draft Horse', hitDice: 3, speed: 40, str: 18, attacks: { hooves: { damageDice: 2, damageDieSize: 4 } } },
                },
            },
            war: {
                name: 'Warhorse',
                traits: ['tramplingCharge'],
                lockedStats: { slug: 'warhorse', bonusArmor: 1 },
                stats: {
                    0: { name: 'Foal' },
                    0.5: { name: 'Warhorse', hitDice: 3, speed: 60, str: 18, attacks: { hooves: { damageDice: 2, damageDieSize: 6 } }, traits: { tramplingCharge: { chargeAttack: 'hooves', knockdownAttack: 'hooves' } } },
                    4: { name: 'Destrier' },
                },
            },
        },
        stats: {
            0.25: { hitDice: 2, speed: 60, str: 16, dex: 10, con: 12, wis: 11, cha: 7, attacks: { hooves: { damageDice: 2, damageDieSize: 4 } } },
            0.5: { hitDice: 3, speed: 60, str: 18, dex: 12, con: 13, wis: 12, cha: 7, attacks: { hooves: { damageDice: 2, damageDieSize: 6 } }, traits: { tramplingCharge: { chargeAttack: 'hooves', knockdownAttack: 'hooves' } } },
        },
    },
    killerWhale: {
        name: 'Killer Whale',
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { armorDescription: armorMaterials.natural, attacks: { bite: { reach: reachShort, damageType: damageTypes.piercing, name: 'Bite' } }, int: 3, skills: { perception: skillRanks.proficient }, slug: 'whale' },
        traits: ['echolocation', 'holdBreath', 'keenHearing'],
        stats: { 3: { name: 'Killer Whale', bonusArmor: 2, blindsight: 120, hitDice: 12, speed: 0, swim: 60, size: sizeHuge, str: 19, dex: 10, con: 13, wis: 12, cha: 7, attacks: { bite: { damageDice: 5, damageDieSize: 6 } }, traits: { holdBreath: { duration: 30 } } } },
    },
    naiad: {
        type: creatureTypes.fey,
        alignment: alignments.chaoticNeutral,
        lockedStats: {
            armorDescription: armorMaterials.natural,
            attacks: { psychicTouch: { reach: reachMedium, damageType: damageTypes.psychic, name: 'Psychic Touch', spellAttack: true } },
            castingStat: 'cha',
            languages: [languages.common, languages.sylvan],
            resistances: [damageTypes.psychic],
            immunities: [damageTypes.poison],
            conditionImmunities: [conditions.charmed, conditions.frightened, conditions.poisoned],
            skills: { persuasion: skillRanks.proficient, sleightOfHand: skillRanks.proficient },
            slug: 'naiad',
            size: sizeMedium,
            traits: { innateSpellcasting: { spellList: { minorIllusion: { uses: 0 }, phantasmalForce: { uses: 3 }, fly: { uses: 1 }, hypnoticPattern: { uses: 1 } } } },
            multiattack: { attacks: { psychicTouch: 2 } },
        },
        traits: ['amphibious', 'invisibleInWater', 'innateSpellcasting', 'magicResistance'],
        stats: { 2: { name: 'Naiad', bonusArmor: 2, hitDice: 7, speed: 30, swim: 30, str: 10, dex: 16, con: 11, int: 15, wis: 10, cha: 18, attacks: { psychicTouch: { damageDice: 1, damageDieSize: 10 } } } },
    },
    priest: {
        name: 'Priest',
        type: creatureTypes.humanoid,
        alignment: alignments.any,
        race: raceKeys.any,
        lockedStats: {
            castingStat: 'wis',
            castingClass: 'cleric',
            extraLanguages: 1,
            size: sizeMedium,
            skills: { medicine: skillRanks.proficient, persuasion: skillRanks.proficient, religion: skillRanks.proficient },
        },
        traits: ['spellcasting'],
        variants: {
            healer: {
                name: 'Healer',
                lockedStats: {
                    slug: 'acolyte',
                    attacks: { club: { reach: reachMedium, damageType: damageTypes.bludgeoning, name: 'Club' } },
                },
                stats: {
                    0.25: { name: 'Acolyte', hitDice: 2, bonusArmor: 0, attacks: { club: { damageDice: 1, damageDieSize: 4 } }, traits: { spellcasting: { spellcastingLevel: 1, classSpells: ['light', 'sacredFlame', 'thaumaturgy', 'bless', 'cureWounds', 'sanctuary'] } } },
                    2: { name: 'Priest', hitDice: 5, bonusArmor: 3, attacks: { club: { damageDice: 1, damageDieSize: 4 } }, traits: { spellcasting: { spellcastingLevel: 5, classSpells: ['light', 'sacredFlame', 'thaumaturgy', 'guidingBolt', 'cureWounds', 'sanctuary', 'lesserRestoration', 'spiritualWeapon'] } } },
                },
            },
            warpriest: {
                name: 'War Priest',
                lockedStats: {
                    slug: 'warpriest',
                    attacks: { mace: { reach: reachMedium, damageType: damageTypes.bludgeoning, name: 'Mace' } },
                    armor: 'chainMail',
                },
                stats: {
                    0.25: { name: 'Acolyte', hitDice: 2, attacks: { mace: { damageDice: 1, damageDieSize: 6 } }, traits: { spellcasting: { spellcastingLevel: 1, classSpells: ['light', 'sacredFlame', 'thaumaturgy', 'guidingBolt', 'cureWounds', 'sanctuary'] } } },
                    2: { name: 'War Priest', hitDice: 5, attacks: { mace: { damageDice: 1, damageDieSize: 6 } }, traits: { spellcasting: { spellcastingLevel: 5, classSpells: ['light', 'sacredFlame', 'thaumaturgy', 'guidingBolt', 'cureWounds', 'sanctuary', 'lesserRestoration', 'spiritualWeapon'] } } },
                },
            },
        },
        stats: {
            0.25: { hitDice: 2, speed: 30, str: 10, dex: 10, con: 10, int: 10, wis: 14, cha: 11 },
            2: { bonusArmor: 3, hitDice: 5, speed: 30, str: 10, dex: 10, con: 12, int: 13, wis: 16, cha: 13, saves: ['wis', 'cha'] },
        },
    },
    quetzalcoatlus: {
        type: creatureTypes.beast,
        subtype: 'dinosaur',
        alignment: alignments.unaligned,
        lockedStats: { int: 2, skills: { perception: skillRanks.proficient }, attacks: { bite: { reach: reachShort, damageType: damageTypes.piercing, name: 'Bite', proc: 'flyingCharge' } } },
        traits: ['flyby'],
        stats: {
            2: { name: 'Quetzalcoatlus', size: sizeHuge, hitDice: 4, str: 15, dex: 13, con: 13, wis: 10, cha: 5, slug: 'quetzalcoatlus', speed: 10, fly: 80, attacks: { bite: { damageDice: 3, damageDieSize: 6 } }, traits: { flyingCharge: { damageDice: 3, damageDieSize: 6 } } },
            8: { name: 'Hatzegopteryx', slug: 'hatzegopteryx' },
        },
    },
    saberToothedTiger: {
        name: 'Saber-Toothed Tiger',
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { slug: 'tiger', int: 3, skills: { perception: skillRanks.proficient, stealth: skillRanks.expert }, attacks: { bite: { reach: reachShort, damageType: damageTypes.piercing, name: 'Bite' }, claw: { reach: reachShort, damageType: damageTypes.slashing, name: 'Claw' } } },
        traits: ['keenSmell', 'pounce'],
        stats: { 2: { name: 'Saber-Toothed Tiger', size: sizeLarge, hitDice: 7, str: 18, dex: 14, con: 15, wis: 12, cha: 8, speed: 40, attacks: { bite: { damageDice: 1, damageDieSize: 10 }, claw: { damageDice: 2, damageDieSize: 6 } } } },
    },
    shadow: {
        alignment: alignments.chaoticEvil,
        type: creatureTypes.undead,
        lockedStats: { attacks: { strengthDrain: { reach: reachMedium, damageType: damageTypes.necrotic, name: 'Strength Drain', finesse: true, proc: 'strengthDrain' } }, conditionImmunities: [conditions.exhaustion, conditions.frightened, conditions.grappled, conditions.paralyzed, conditions.petrified, conditions.poisoned, conditions.prone, conditions.restrained], immunities: [damageTypes.necrotic, damageTypes.poison], resistances: [damageTypes.acid, damageTypes.cold, damageTypes.fire, damageTypes.lightning, damageTypes.thunder], skills: { stealth: skillRanks.proficient }, slug: 'shadow' },
        traits: ['amorphous', 'shadowStealth', 'sunlightWeakness'],
        variants: {
            shadow: { name: 'Shadow', type: creatureTypes.undead, lockedStats: { resistances: [damageTypes.mundanePhysical], vulnerabilities: [damageTypes.radiant] }, stats: { 2: { name: 'Shadow' } } },
            detachedShadow: { name: 'Detached Shadow', type: creatureTypes.fey, lockedStats: { resistances: [damageTypes.mundanePhysical], vulnerabilities: [damageTypes.radiant] }, stats: { 2: { name: 'Detached Shadow' } } },
            reflection: { name: 'Reflection', type: creatureTypes.fey, lockedStats: { slug: 'reflection', resistances: [damageTypes.mundanePiercingSlashing], vulnerabilities: [damageTypes.bludgeoning] }, stats: { 2: { name: 'Reflection' } } },
        },
        stats: { 2: { hitDice: 3, speed: 40, size: sizeMedium, str: 6, dex: 14, con: 13, int: 6, wis: 10, cha: 8, attacks: { strengthDrain: { damageDice: 2, damageDieSize: 6 } } } },
    },
    shark: {
        name: 'Shark',
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { armorDescription: armorMaterials.natural, attacks: { bite: { reach: reachShort, damageType: damageTypes.piercing, name: 'Bite' } }, int: 1, skills: { perception: skillRanks.proficient }, slug: 'shark' },
        traits: ['waterBreathing'],
        variants: {
            frenzy: { name: 'Bloody Frenzy', traits: ['bloodyFrenzy'], stats: { 0.5: { name: 'Small Hunter Shark' }, 2: { name: 'Hunter Shark' } } },
            packHunter: { name: 'Pack Hunter', traits: ['packTactics'], stats: { 0.5: { name: 'Reef Shark' }, 2: { name: 'Large Reef Shark' } } },
        },
        stats: {
            0.5: { bonusArmor: 1, hitDice: 4, swim: 40, size: sizeMedium, str: 14, dex: 13, con: 13, wis: 10, cha: 4, attacks: { bite: { damageDice: 1, damageDieSize: 8 } } },
            2: { bonusArmor: 1, hitDice: 6, swim: 40, size: sizeLarge, str: 18, dex: 13, con: 15, wis: 10, cha: 4, attacks: { bite: { damageDice: 2, damageDieSize: 8 } } },
            5: { name: 'Giant Shark', bonusArmor: 3, hitDice: 11, swim: 50, size: sizeHuge, str: 23, dex: 11, con: 21, wis: 10, cha: 5, attacks: { bite: { damageDice: 3, damageDieSize: 10 } } },
        },
    },
    trex: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { armorDescription: armorMaterials.natural, attacks: { bite: { reach: reachMedium, proc: 'grappleBiteSizeRestricted', damageType: damageTypes.piercing, name: 'Bite' }, tail: { reach: reachMedium, damageType: damageTypes.bludgeoning, name: 'Tail' } }, int: 2, skills: { perception: skillRanks.proficient }, slug: 'tyrannosaurus', multiattack: { attacks: { bite: 1, tail: 1 }, requireDifferentTargets: true } },
        stats: { 8: { name: 'Tyrannosaurus Rex', bonusArmor: 3, hitDice: 13, speed: 50, size: sizeHuge, str: 25, dex: 10, con: 19, wis: 12, cha: 9, attacks: { bite: { damageDice: 4, damageDieSize: 12 }, tail: { damageDice: 3, damageDieSize: 8 } }, traits: { grappleBiteSizeRestricted: { dcAdjustment: -1, sizeAdjustment: -2 } } } },
    },
    wolf: {
        type: creatureTypes.beast,
        alignment: alignments.unaligned,
        lockedStats: { armorDescription: armorMaterials.natural, attacks: { bite: { reach: reachShort, proc: 'takeDown', damageType: damageTypes.piercing, name: 'Bite', finesse: true } }, int: 3, skills: { perception: skillRanks.proficient, stealth: skillRanks.proficient }, slug: 'wolf' },
        traits: ['keenHearingSmell', 'packTactics'],
        stats: {
            0: { name: 'Wolf Pup' },
            0.25: { name: 'Wolf', bonusArmor: 1, hitDice: 2, speed: 40, size: sizeMedium, str: 12, dex: 15, con: 12, wis: 12, cha: 6, attacks: { bite: { damageDice: 2, damageDieSize: 4 } } },
            1: { name: 'Dire Wolf', bonusArmor: 2, hitDice: 5, speed: 50, size: sizeLarge, str: 17, dex: 15, con: 15, wis: 12, cha: 7, attacks: { bite: { damageDice: 2, damageDieSize: 6 } } },
            20: { name: 'Legendary Wolf' },
        },
    },
};
