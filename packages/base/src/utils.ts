/**
 * Calculates the ability score modifier for a given score.
 */
export function abilityScoreModifier(ability: number): number {
  return Math.floor((ability - 10) / 2);
}

/**
 * Returns the average roll for a number of dice, rounded down.
 */
export function averageRoll(diceCount: number, dieSize: number): number {
  return Math.floor(diceCount * ((1 + dieSize) / 2));
}

/**
 * Returns a formatted damage string, e.g. "7 (2d6 + 1)".
 */
export function damageString(damageDice: number, damageDieSize: number, damageBonus = 0): string {
  const maxDamage = damageDice * damageDieSize + damageBonus;
  if (maxDamage <= 1) return '1';
  if (damageDieSize === 1) return String(damageDice + damageBonus);
  let output = `${averageRoll(damageDice, damageDieSize) + damageBonus} (${damageDice}d${damageDieSize}`;
  if (damageBonus) {
    output += (damageBonus >= 0 ? ' + ' : ' - ') + Math.abs(damageBonus);
  }
  return output + ')';
}

/**
 * Converts a CR number to its display string (e.g. 0.125 → "1/8").
 */
export function stringForCR(cr: number | string): string {
  const safeCR = parseFloat(String(cr));
  switch (safeCR) {
    case 0.125: return '1/8';
    case 0.25:  return '1/4';
    case 0.5:   return '1/2';
    default:    return String(cr);
  }
}

/**
 * Converts a CR to a step value so fractional CRs carry the same weight as integer CRs in scaling.
 */
export function stepForCR(cr: number | string): number {
  const safeCR = parseFloat(String(cr));
  switch (safeCR) {
    case 0:     return 0;
    case 0.125: return 1;
    case 0.25:  return 2;
    case 0.5:   return 3;
    default:    return safeCR + 3;
  }
}

/**
 * Returns a sentence-case version of a string.
 * Capitalizes the first letter and letters following sentence-ending punctuation.
 * Avoids capitalizing after abbreviations like "ft.", "dr.", "mr.", etc.
 */
export function toSentenceCase(targetString: string): string {
  return targetString.replace(/(^\s*\w|(?<!\b(?:ft|dr|mr|mrs|ms|prof|st|vs|etc|approx|avg)\b)[.!?]\s*\w)/gi, c => c.toUpperCase());
}

/**
 * Returns a title-case version of a string.
 */
export function toTitleCase(targetString: string): string {
  return targetString
    .toLowerCase()
    .split(/[ -]/)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Returns an ordinal string for a number (e.g. 1 → "1st", 3 → "3rd").
 */
export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Recursively flattens an object. e.g. {x: {y: 5}, z: 10} → {x__y: 5, z: 10}
 */
export function flattenObject(targetObject: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const property in targetObject) {
    const value = targetObject[property];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const flattened = flattenObject(value as Record<string, unknown>);
      for (const childProperty in flattened) {
        output[`${property}__${childProperty}`] = flattened[childProperty];
      }
    } else {
      output[property] = value;
    }
  }
  return output;
}

/**
 * Merges two arrays, combining values without duplicates.
 */
export function mergeArrays<T>(array1: T[], array2: T[]): T[] {
  const output = array1.slice();
  for (const item of array2) {
    if (!output.includes(item)) output.push(item);
  }
  return output;
}

/**
 * Recursively merges two objects. Arrays are merged without duplicates; nested objects are merged recursively.
 */
export function mergeObjects<T extends Record<string, unknown>>(object1: T, object2: Partial<T>): T {
  const output = Object.assign({}, object1) as Record<string, unknown>;
  for (const [key, value] of Object.entries(object2)) {
    if (Array.isArray(value)) {
      output[key] = output.hasOwnProperty(key)
        ? mergeArrays(output[key] as unknown[], value as unknown[])
        : (value as unknown[]).slice();
    } else if (value !== null && typeof value === 'object') {
      output[key] = output.hasOwnProperty(key)
        ? mergeObjects(output[key] as Record<string, unknown>, value as Record<string, unknown>)
        : Object.assign({}, value);
    } else {
      output[key] = value;
    }
  }
  return output as T;
}
