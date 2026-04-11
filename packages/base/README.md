# @toolkit5e/base

Shared types, constants, data, and utilities for D&D 5th edition tooling. Used as a foundation by the other `@toolkit5e` packages.

## Installation

```bash
npm install @toolkit5e/base
```

## What's included

### Types

Core TypeScript interfaces for working with D&D 5e data:

- `Statblock` — a fully derived monster statblock
- `Trait`, `Attack`, `Multiattack` — statblock sub-types
- `ChallengeRating` — union type of all valid CR values (0–30)
- `AbilityKey`, `SkillRank`

### Constants

Named constants for all the standard D&D 5e values you'd otherwise hardcode as magic strings or numbers:

```ts
import { typeBeast, damageTypeFire, conditionPoisoned, sizeLarge, reachMedium } from '@toolkit5e/base';
```

Covers creature types, damage types, conditions, alignments, sizes, reach values, languages, skill ranks, and more. String constants are typed as literals (`'beast'` not `string`) for type safety.

### Data

Reference tables used in calculations and rendering:

- `averageStats` — average AC, HP, ability scores, proficiency, XP by CR
- `sizes` — hit die and reach values per size category
- `abilities`, `skills` — ability and skill metadata
- `traits`, `procs`, `actions` — the base trait/ability library
- `races` — race stat blocks (used for humanoid NPC scaling)
- `armorTypes`, `spells`, `pronouns`

### Utilities

Pure functions with no side effects:

```ts
import { abilityScoreModifier, averageRoll, damageString, mergeObjects, toSentenceCase } from '@toolkit5e/base';

abilityScoreModifier(16); // 3
averageRoll(2, 6);        // 7
damageString(2, 6, 3);    // "10 (2d6 + 3)"
```

Full list: `abilityScoreModifier`, `averageRoll`, `damageString`, `stringForCR`, `stepForCR`, `toSentenceCase`, `toTitleCase`, `getOrdinal`, `flattenObject`, `mergeObjects`, `mergeArrays`.

## License

MIT
