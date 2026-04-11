import {
  averageStats, traits, procs, actions, sizes, abilities, races,
  abilityScoreModifier, mergeObjects, flattenObject, averageRoll, stepForCR,
  typeHumanoid, raceAny, senses,
} from '@toolkit5e/base';
import type { Statblock, Trait, Attack, ChallengeRating } from '@toolkit5e/base';
import type { MonsterTemplate, MonsterVariant, ScaleMonsterOptions, Benchmarks } from './types.js';
import { monsterList } from './monsters.js';

export type { MonsterTemplate, MonsterVariant, ScaleMonsterOptions };
export { monsterList };

// ---------------------------------------------------------------------------
// Scaling helpers
// ---------------------------------------------------------------------------

/**
 * Finds the closest statblocks above and below the target CR that have all the requested stat(s).
 * Used as the first step in extrapolation — call this, then pass the result to `extrapolateFromBenchmark`.
 *
 * @param stats A stat name or array of stat names to search for (supports flattened dot-path notation, e.g. `'attacks__bite__damageDice'`)
 * @param targetCR The CR to find benchmarks around
 * @param sourceStats The monster's stat entries keyed by CR
 * @returns An object with `upper` and/or `lower` benchmark entries, or null if no matching entries exist
 */
export function findBenchmarksForStat(
  stats: string | string[],
  targetCR: string | number,
  sourceStats: Record<number, Record<string, unknown>>,
): Benchmarks | null {
  const numTargetCR = Number(targetCR);
  const statList = Array.isArray(stats) ? stats : [stats];
  let benchmarks: Benchmarks | null = null;

  for (const cr in sourceStats) {
    const numCR = Number(cr);
    const statBlock = flattenObject(sourceStats[cr] as Record<string, unknown>);
    const allStatsFound = statList.every(s => statBlock.hasOwnProperty(s));
    if (!allStatsFound) continue;

    if (!benchmarks) benchmarks = {};
    if (numCR > numTargetCR) {
      if (!benchmarks.upper || (benchmarks.upper.cr as number) > numCR) {
        benchmarks.upper = { cr: numCR };
        for (const s of statList) benchmarks.upper[s] = statBlock[s];
      }
    } else {
      if (!benchmarks.lower || (benchmarks.lower.cr as number) < numCR) {
        benchmarks.lower = { cr: numCR };
        for (const s of statList) benchmarks.lower[s] = statBlock[s];
      }
    }
  }
  return benchmarks;
}

/**
 * Extrapolates a stat value for the target CR from the given benchmarks.
 *
 * If only one benchmark direction exists, extrapolates from that alone.
 * If both upper and lower benchmarks exist, takes a weighted average based on CR distance.
 *
 * @param stat The stat name to extrapolate
 * @param targetCR The target CR
 * @param benchmarks Result from `findBenchmarksForStat`
 * @param linearExtrapolation If true, uses an additive offset from the CR average. If false, uses a multiplicative ratio.
 *   Use linear for stats like size where proportional scaling doesn't make sense; use ratio for most numeric stats.
 */
export function extrapolateFromBenchmark(
  stat: string,
  targetCR: string | number,
  benchmarks: Benchmarks,
  linearExtrapolation: boolean,
): number {
  const avg = averageStats as unknown as Record<number, Record<string, number>>;
  let upperValue: number | undefined;
  let lowerValue: number | undefined;

  if (benchmarks.upper) {
    const b = benchmarks.upper as Record<string, number>;
    upperValue = linearExtrapolation
      ? (b[stat] - avg[b.cr][stat]) + avg[Number(targetCR)][stat]
      : (b[stat] / avg[b.cr][stat]) * avg[Number(targetCR)][stat];
  }
  if (benchmarks.lower) {
    const b = benchmarks.lower as Record<string, number>;
    lowerValue = linearExtrapolation
      ? (b[stat] - avg[b.cr][stat]) + avg[Number(targetCR)][stat]
      : (b[stat] / avg[b.cr][stat]) * avg[Number(targetCR)][stat];
  }

  if (lowerValue !== undefined) {
    if (upperValue !== undefined) {
      const upperStep = stepForCR((benchmarks.upper as Record<string, number>).cr);
      const lowerStep = stepForCR((benchmarks.lower as Record<string, number>).cr);
      const stepRange = upperStep - lowerStep;
      const targetStep = stepForCR(targetCR);
      const lowerWeight = (upperStep - targetStep) / stepRange;
      const upperWeight = (targetStep - lowerStep) / stepRange;
      return Math.round(upperWeight * upperValue + lowerWeight * lowerValue);
    }
    return Math.round(lowerValue);
  }
  return Math.round(upperValue!);
}

/**
 * Calculates a weighted average between two CR benchmarks.
 */
export function calculateWeightedAverage(
  stat: string,
  benchmarks: Benchmarks,
  targetCR: string | number,
): number {
  const upper = benchmarks.upper as Record<string, number>;
  const lower = benchmarks.lower as Record<string, number>;
  const upperStep = stepForCR(upper.cr);
  const lowerStep = stepForCR(lower.cr);
  const stepRange = upperStep - lowerStep;
  const targetStep = stepForCR(targetCR);
  const upperWeight = (upperStep - targetStep) / stepRange;
  const lowerWeight = (targetStep - lowerStep) / stepRange;
  return Math.round(upperWeight * upper[stat] + lowerWeight * lower[stat]);
}

/**
 * Finds the nearest benchmark at or below the target CR for a given stat.
 * Falls back to the lowest available benchmark if none are at or below.
 */
export function findNearestLowerBenchmark(
  stat: string,
  targetCR: string | number,
  statList: Record<number, Record<string, unknown>>,
): unknown {
  const numTargetCR = parseFloat(String(targetCR));
  let lowestValue: unknown;
  let lowestCR = 31;
  let highestValue: unknown;
  let highestCR = 0;

  for (const cr in statList) {
    const numCR = parseFloat(cr);
    const statBlock = flattenObject(statList[cr] as Record<string, unknown>);
    if (statBlock[stat] !== undefined && statBlock[stat] !== null) {
      if (numCR < lowestCR) {
        lowestCR = numCR;
        lowestValue = statBlock[stat];
      }
      if (numCR > highestCR && numCR <= numTargetCR) {
        highestValue = statBlock[stat];
        highestCR = numCR;
      }
    }
  }
  return highestValue != null ? highestValue : lowestValue;
}

/**
 * Calculates hit points per hit die for a creature based on its size and CON.
 */
export function hitPointsPerHitDie(statblock: { size: number; con: number }): number {
  return ((sizes[statblock.size].hitDie + 1) / 2) + abilityScoreModifier(statblock.con);
}

/**
 * Scales a damage roll to the target CR by extrapolating from benchmark entries.
 * Finds the nearest stat entries that have both dice count and die size, extrapolates
 * the average damage, then finds the best dice combination to match that average.
 *
 * @param damageDiceString Flattened path to the dice count stat (e.g. `'attacks__bite__damageDice'`)
 * @param damageDieSizeString Flattened path to the die size stat (e.g. `'attacks__bite__damageDieSize'`)
 * @param targetCR The target CR
 * @param sourceStats The monster's stat entries keyed by CR
 * @returns A `[diceCount, dieSize]` tuple
 */
export function scaleDamageRoll(
  damageDiceString: string,
  damageDieSizeString: string,
  targetCR: string | number,
  sourceStats: Record<number, Record<string, unknown>>,
): [number, number] {
  const damageBenchmarks = findBenchmarksForStat([damageDiceString, damageDieSizeString], targetCR, sourceStats);
  if (!damageBenchmarks) return [1, 4];

  for (const key of ['upper', 'lower'] as const) {
    const b = damageBenchmarks[key] as Record<string, number> | undefined;
    if (b) {
      b.averageDamage = averageRoll(b[damageDiceString], b[damageDieSizeString]);
    }
  }

  const estimatedDamage = extrapolateFromBenchmark('averageDamage', targetCR, damageBenchmarks, false);
  const preferredDieSize = findNearestLowerBenchmark(damageDieSizeString, targetCR, sourceStats) as number ?? 4;
  return findDamageDice(estimatedDamage, preferredDieSize);
}

/**
 * Returns the best [diceCount, dieSize] pair to reach the target average damage.
 */
export function findDamageDice(targetDamage: number, preferredDieSize: number): [number, number] {
  if (targetDamage < 1.25) return [1, 1];
  preferredDieSize = Math.max(preferredDieSize, 4);

  const dice = [12, 10, 8, 6, 4];
  const dieAverages = [6.5, 5.5, 4.5, 3.5, 2.5];
  const preferredIdx = dice.indexOf(preferredDieSize);

  if (targetDamage < dieAverages[preferredIdx] - 0.5) {
    let desiredAverage = Math.max(Math.floor(targetDamage) + 0.5, 2.5);
    return [1, dice[dieAverages.indexOf(desiredAverage)]];
  }

  const maximumDice = 15;
  let dieCount = Math.round(targetDamage / dieAverages[preferredIdx]);
  let dieSize = preferredDieSize;
  while (dieCount > maximumDice && dieSize < 12) {
    dieSize = dice[dice.indexOf(dieSize) - 1];
    dieCount = Math.round(targetDamage / dieAverages[dice.indexOf(dieSize)]);
  }
  return [dieCount, dieSize];
}

/**
 * Generates a fully resolved trait, proc, or action for the target CR.
 * Looks up the base trait definition, applies any CR-specific overrides from the source stats,
 * then scales damage, DC adjustments, durations, and conditions as needed.
 *
 * @param traitName The trait/proc/action key (e.g. `'packTactics'`, `'grappleBite'`)
 * @param targetCR The CR to generate the trait for
 * @param sourceStats The monster's stat entries keyed by CR
 */
export function generateTrait(
  traitName: string,
  targetCR: string | number,
  sourceStats: Record<number, Record<string, unknown>>,
): Trait {
  const baseTrait = (traits as Record<string, Trait>)[traitName]
    || (procs as Record<string, Trait>)[traitName]
    || (actions as Record<string, Trait>)[traitName];
  let newTrait = Object.assign({}, baseTrait) as Trait & Record<string, unknown>;

  const crStats = sourceStats[Number(targetCR)] as Record<string, unknown> | undefined;
  if (crStats?.traits && (crStats.traits as Record<string, unknown>)[traitName]) {
    newTrait = Object.assign(newTrait, (crStats.traits as Record<string, unknown>)[traitName]);
  }

  if (baseTrait.allowsSave && !newTrait.hasOwnProperty('dcAdjustment')) {
    const dcKey = `traits__${traitName}__dcAdjustment`;
    const dcBenchmarks = findBenchmarksForStat(dcKey, targetCR, sourceStats);
    if (dcBenchmarks) {
      if (dcBenchmarks.upper && dcBenchmarks.lower) {
        newTrait.dcAdjustment = calculateWeightedAverage(dcKey, dcBenchmarks, targetCR);
      } else if (dcBenchmarks.upper) {
        newTrait.dcAdjustment = (dcBenchmarks.upper as Record<string, number>)[dcKey];
      } else if (dcBenchmarks.lower) {
        newTrait.dcAdjustment = (dcBenchmarks.lower as Record<string, number>)[dcKey];
      }
    } else {
      newTrait.dcAdjustment = 0;
    }
  }

  if (baseTrait.hasDuration && !newTrait.hasOwnProperty('duration')) {
    newTrait.duration = findNearestLowerBenchmark(`traits__${traitName}__duration`, targetCR, sourceStats) as number;
  }

  if (baseTrait.sizeRestricted && !newTrait.hasOwnProperty('sizeAdjustment')) {
    newTrait.sizeAdjustment = findNearestLowerBenchmark(`traits__${traitName}__sizeAdjustment`, targetCR, sourceStats) as number;
  }

  if (baseTrait.appliesCondition && !newTrait.hasOwnProperty('condition')) {
    newTrait.condition = findNearestLowerBenchmark(`traits__${traitName}__condition`, targetCR, sourceStats) as string;
  }

  if (baseTrait.dealsDamage) {
    const [damageDice, damageDieSize] = scaleDamageRoll(
      `traits__${traitName}__damageDice`,
      `traits__${traitName}__damageDieSize`,
      targetCR,
      sourceStats,
    );
    newTrait.damageDice = damageDice;
    newTrait.damageDieSize = damageDieSize;
  }

  return newTrait;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export type MonsterID = keyof typeof monsterList;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Scales a monster to the target challenge rating.
 *
 * @param monster A monster ID string (keyof monsterList) or a MonsterTemplate object
 * @param targetCR The target CR as a string — '0', '0.5', '1', '5', '20', etc.
 * @param options Optional variant and race selections
 * @returns A fully derived statblock for the target CR
 */
export function scaleMonster(monster: MonsterID | MonsterTemplate, targetCR: string, options?: ScaleMonsterOptions): Statblock;
export function scaleMonster(
  monster: MonsterID | MonsterTemplate,
  targetCR: string,
  options: ScaleMonsterOptions = {},
): Statblock {
  const selectedMonster: MonsterTemplate = typeof monster === 'string' ? monsterList[monster] : monster;
  const numTargetCR = Number(targetCR);
  let selectedVariant: MonsterVariant | undefined;
  if (selectedMonster.variants) {
    selectedVariant = selectedMonster.variants[options.variant ?? ''];
  }

  // Merge variant stats with base stats
  const sourceStats: Record<number, Record<string, unknown>> = Object.assign({}, selectedMonster.stats) as Record<number, Record<string, unknown>>;
  if (selectedVariant?.stats) {
    for (const cr in selectedVariant.stats) {
      const numCR = Number(cr);
      sourceStats[numCR] = sourceStats[numCR]
        ? mergeObjects(sourceStats[numCR] as Record<string, unknown>, selectedVariant.stats[numCR] as Record<string, unknown>)
        : { ...selectedVariant.stats[numCR] };
    }
  }

  let derivedStats: Record<string, unknown> = { cr: targetCR, gender: selectedMonster.gender ?? 4 };

  if (sourceStats[numTargetCR]) {
    derivedStats = mergeObjects(derivedStats, sourceStats[numTargetCR]);
  }
  derivedStats = mergeObjects(derivedStats, selectedMonster.lockedStats as Record<string, unknown>);
  if (selectedVariant?.lockedStats) {
    derivedStats = mergeObjects(derivedStats, selectedVariant.lockedStats as Record<string, unknown>);
  }

  // Determine type and handle humanoid races
  const type = (selectedVariant?.type ?? selectedMonster.type) as string;
  let currentRace: (typeof races)[number] | undefined;

  if (type === typeHumanoid) {
    if (selectedMonster.race === raceAny) {
      currentRace = races[options.race ?? 0];
      derivedStats.type = `${type} (${currentRace.name})`;
      if (currentRace !== races[0]) {
        derivedStats = mergeObjects(derivedStats, currentRace.stats as Record<string, unknown>);
        if (derivedStats.extraLanguages && currentRace.stats?.languages) {
          derivedStats.extraLanguages = Math.max(0, (derivedStats.extraLanguages as number) - (currentRace.stats.languages as unknown[]).length);
        }
      }
    } else {
      derivedStats.type = `${type} (${type})`;
    }
  } else {
    derivedStats.type = type;
    if (selectedMonster.subtype) {
      derivedStats.type += ` (${selectedMonster.subtype})`;
    }
  }

  derivedStats.proficiency = averageStats[numTargetCR as ChallengeRating].proficiency;
  derivedStats.alignment = selectedMonster.alignment;

  // Name and slug
  if (!derivedStats.name) {
    derivedStats.name = findNearestLowerBenchmark('name', targetCR, sourceStats);
  }
  if (!derivedStats.slug) {
    derivedStats.slug = findNearestLowerBenchmark('slug', targetCR, sourceStats);
  }
  derivedStats.appearance = derivedStats.slug;

  // Traits
  const lockedTraits = derivedStats.traits as Record<string, Trait> | undefined;
  derivedStats.traits = {};
  const traitList: string[] = [
    ...(selectedMonster.traits ?? []),
    ...(selectedVariant?.traits ?? []),
    ...(currentRace?.traits ?? []),
  ];
  for (const traitName of traitList) {
    (derivedStats.traits as Record<string, Trait>)[traitName] = generateTrait(traitName, targetCR, sourceStats);
  }
  if (lockedTraits) {
    derivedStats.traits = mergeObjects(derivedStats.traits as Record<string, unknown>, lockedTraits as Record<string, unknown>);
  }

  // Actions
  if (selectedMonster.actions) {
    derivedStats.actions = {};
    for (const actionName of selectedMonster.actions) {
      (derivedStats.actions as Record<string, Trait>)[actionName] = generateTrait(actionName, targetCR, sourceStats);
    }
  }
  if (selectedMonster.bonusActions) {
    derivedStats.bonusActions = {};
    for (const bonusActionName of selectedMonster.bonusActions) {
      (derivedStats.bonusActions as Record<string, Trait>)[bonusActionName] = generateTrait(bonusActionName, targetCR, sourceStats);
    }
  }

  // Size
  if (!derivedStats.size) {
    const sizeBenchmarks = findBenchmarksForStat('size', targetCR, sourceStats);
    if (sizeBenchmarks) {
      derivedStats.size = Math.min(6, extrapolateFromBenchmark('size', targetCR, sizeBenchmarks, true));
    }
  }

  // Ability scores
  derivedStats.abilityModifiers = {};
  for (const ability in abilities) {
    if (!derivedStats[ability]) {
      const abilityBenchmarks = findBenchmarksForStat(ability, targetCR, sourceStats);
      if (abilityBenchmarks) {
        derivedStats[ability] = extrapolateFromBenchmark(ability, targetCR, abilityBenchmarks, false);
      }
    }
    (derivedStats.abilityModifiers as Record<string, number>)[ability] = abilityScoreModifier(derivedStats[ability] as number);
  }

  // Armor (bonus armor)
  if (derivedStats.bonusArmor === undefined) {
    const acBenchmarks = findBenchmarksForStat(['bonusArmor', 'dex'], targetCR, sourceStats);
    if (acBenchmarks) {
      for (const key of ['upper', 'lower'] as const) {
        const b = acBenchmarks[key] as Record<string, number> | undefined;
        if (b) b.ac = 10 + b.bonusArmor + abilityScoreModifier(b.dex);
      }
      const targetAC = extrapolateFromBenchmark('ac', targetCR, acBenchmarks, false);
      derivedStats.bonusArmor = Math.max(0, targetAC - 10 - (derivedStats.abilityModifiers as Record<string, number>).dex);
    } else {
      derivedStats.bonusArmor = 0;
    }
  }

  // Hit dice
  if (!derivedStats.hitDice) {
    const hpStats = ['con', 'hitDice'];
    if (!(selectedMonster.lockedStats as Record<string, unknown>).size) hpStats.push('size');
    const hpBenchmarks = findBenchmarksForStat(hpStats, targetCR, sourceStats);
    if (hpBenchmarks) {
      for (const key of ['upper', 'lower'] as const) {
        const b = hpBenchmarks[key] as Record<string, number> | undefined;
        if (b) {
          if (!b.size) b.size = derivedStats.size as number;
          b.hp = Math.floor(hitPointsPerHitDie({ size: b.size, con: b.con }) * b.hitDice);
        }
      }
      const targetHP = extrapolateFromBenchmark('hp', targetCR, hpBenchmarks, false);
      const hpPerHD = hitPointsPerHitDie({ size: derivedStats.size as number, con: derivedStats.con as number });
      derivedStats.hitDice = Math.max(1, Math.round(targetHP / hpPerHD));
    }
  }

  // Attacks
  if (!derivedStats.attacks) derivedStats.attacks = {};
  for (const cr in sourceStats) {
    if (parseFloat(cr) <= numTargetCR && (sourceStats[Number(cr)] as Record<string, unknown>).attacks) {
      const crAttacks = (sourceStats[Number(cr)] as Record<string, Record<string, unknown>>).attacks;
      for (const attack in crAttacks) {
        if (!(derivedStats.attacks as Record<string, unknown>)[attack]) {
          const attackCopy = Object.assign({}, crAttacks[attack]) as Record<string, unknown>;
          delete attackCopy.damageDice;
          delete attackCopy.damageDieSize;
          (derivedStats.attacks as Record<string, unknown>)[attack] = attackCopy;
        }
      }
    }
  }

  for (const attack in derivedStats.attacks as Record<string, Attack>) {
    const currentAttack = (derivedStats.attacks as Record<string, Record<string, unknown>>)[attack];
    const crAttacks = (sourceStats[numTargetCR] as Record<string, Record<string, Record<string, unknown>>> | undefined)?.attacks;
    if (crAttacks?.[attack]) {
      (derivedStats.attacks as Record<string, Record<string, unknown>>)[attack] = Object.assign(currentAttack, crAttacks[attack]);
    }

    if (!currentAttack.damageDice) {
      const damageDiceString = `attacks__${attack}__damageDice`;
      const damageDieSizeString = `attacks__${attack}__damageDieSize`;
      const attributes = ['str', damageDiceString, damageDieSizeString];
      if (currentAttack.finesse) attributes.push('dex');

      const damageBenchmarks = findBenchmarksForStat(attributes, targetCR, sourceStats);
      if (damageBenchmarks) {
        for (const key of ['upper', 'lower'] as const) {
          const b = damageBenchmarks[key] as Record<string, number> | undefined;
          if (b) {
            b.damagePerRound = averageRoll(b[damageDiceString], b[damageDieSizeString]);
            b.damagePerRound += abilityScoreModifier(currentAttack.finesse ? Math.max(b.str, b.dex ?? 0) : b.str);
          }
        }
        const estimatedDamage = extrapolateFromBenchmark('damagePerRound', targetCR, damageBenchmarks, false);
        const abilityMods = derivedStats.abilityModifiers as Record<string, number>;
        const targetDamage = estimatedDamage - (currentAttack.finesse
          ? Math.max(abilityMods.str, abilityMods.dex)
          : abilityMods.str);
        const preferredDieSize = findNearestLowerBenchmark(damageDieSizeString, targetCR, sourceStats) as number;
        const [damageDice, damageDieSize] = findDamageDice(targetDamage, preferredDieSize);
        currentAttack.damageDice = damageDice;
        currentAttack.damageDieSize = damageDieSize;
      }
    }

    if (currentAttack.ranged && !currentAttack.range) {
      currentAttack.range = findNearestLowerBenchmark(`attacks__${attack}__range`, targetCR, sourceStats);
      currentAttack.longRange = findNearestLowerBenchmark(`attacks__${attack}__longRange`, targetCR, sourceStats);
    }

    if (currentAttack.damageRiderType && !currentAttack.damageRiderDice) {
      const [riderDice, riderDieSize] = scaleDamageRoll(
        `attacks__${attack}__damageRiderDice`,
        `attacks__${attack}__damageRiderDieSize`,
        targetCR,
        sourceStats,
      );
      currentAttack.damageRiderDice = riderDice;
      currentAttack.damageRiderDieSize = riderDieSize;
    }

    if (currentAttack.proc) {
      currentAttack.generatedProc = generateTrait(currentAttack.proc as string, targetCR, sourceStats);
    }
  }

  // Multiattack
  if (!derivedStats.multiattack) {
    let highestCR = 0;
    for (const cr in sourceStats) {
      const numCR = Number(cr);
      if (numCR <= numTargetCR && numCR > highestCR && (sourceStats[numCR] as Record<string, unknown>).multiattack) {
        highestCR = numCR;
        derivedStats.multiattack = (sourceStats[numCR] as Record<string, unknown>).multiattack;
      }
    }
  }

  // Racial bonuses (applied last so they don't affect other calculations)
  if (type === typeHumanoid && selectedMonster.race === raceAny && currentRace && currentRace !== races[0]) {
    const abilityMods = derivedStats.abilityModifiers as Record<string, number>;
    for (const stat in currentRace.bonusStats) {
      (derivedStats[stat] as number) += (currentRace.bonusStats as Record<string, number>)[stat];
      abilityMods[stat] = abilityScoreModifier(derivedStats[stat] as number);
    }
  }

  // Movement speeds (taken from nearest lower benchmark, don't scale with CR)
  derivedStats.speed = findNearestLowerBenchmark('speed', targetCR, sourceStats);
  derivedStats.swim = findNearestLowerBenchmark('swim', targetCR, sourceStats);
  derivedStats.climb = findNearestLowerBenchmark('climb', targetCR, sourceStats);
  derivedStats.burrow = findNearestLowerBenchmark('burrow', targetCR, sourceStats);
  derivedStats.fly = findNearestLowerBenchmark('fly', targetCR, sourceStats);

  // Senses
  for (const sense of senses) {
    if (!derivedStats[sense]) {
      derivedStats[sense] = findNearestLowerBenchmark(sense, targetCR, sourceStats);
    }
  }

  return derivedStats as unknown as Statblock;
}
