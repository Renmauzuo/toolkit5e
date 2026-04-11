# toolkit5e Project Steering

This workspace contains D&D 5th edition tooling packages.

## Package Structure

- **@toolkit5e/base** - Shared types, constants, data, and utilities used across all packages
- **@toolkit5e/monster-scaler** - Scales monsters to any CR; includes the `monsterList` dataset
- **@toolkit5e/statblock** - Renders a visual statblock into a target DOM element

## Naming Conventions

- Workspace name: `toolkit5e`
- Package scope: `@toolkit5e`
- Package folders: `packages/<name>`

## Build Process

Run `npm run build` from the workspace root to compile all packages. The root `tsconfig.json` uses project references (`tsc --build`) so each package outputs to its own `dist/` folder. The per-package tsconfigs use `module: ESNext` / `moduleResolution: bundler` so Rollup can consume the output directly.

The standalone monster-scaler site (`monster-scaler/`) has its own Gulp build. After changing package source, rebuild toolkit5e first, then rebuild the site:

```
cd toolkit5e && npm run build
cd monster-scaler && npm run build
```

The Gulp watch (`npm run watch` in monster-scaler) does not currently watch for toolkit5e package changes — it only watches the site's own `src/` files. Cross-project watch is a known gap to address later.

## Package Contents

### @toolkit5e/base

- `types.ts` — Core interfaces: `Statblock`, `Trait`, `Attack`, `Multiattack`, `ChallengeRating`, `AbilityKey`, `SkillRank`
- `constants.ts` — String constants use `as const` for literal types (creature types, damage types, conditions, alignments, etc.). Numeric constants do not need `as const` as TypeScript infers literal types for them already.
- `data.ts` — Reference data: `sizes`, `abilities`, `skills`, `averageStats`, `traits`, `procs`, `actions`, `armorTypes`, `spells`, `pronouns`, `races`
- `utils.ts` — Pure utility functions: `abilityScoreModifier`, `averageRoll`, `damageString`, `stringForCR`, `stepForCR`, `toSentenceCase`, `toTitleCase`, `getOrdinal`, `flattenObject`, `mergeObjects`, `mergeArrays`

### @toolkit5e/monster-scaler

- `monsters.ts` — `monsterList`: the full dataset of scalable monster templates
- `index.ts` — `scaleMonster(template, targetCR, options?)` plus exported helpers: `findBenchmarksForStat`, `extrapolateFromBenchmark`, `generateTrait`, `findNearestLowerBenchmark`, `hitPointsPerHitDie`, `scaleDamageRoll`, `findDamageDice`, `calculateWeightedAverage`
- `types.ts` — `MonsterTemplate`, `MonsterVariant`, `ScaleMonsterOptions`, `Benchmarks`

### @toolkit5e/statblock

- `index.ts` — `renderStatblock(statblock, targetElement)` and `replaceTokensInString(str, statblock, trait)`
- `types.ts` — `StatblockRenderer`, `RenderStatblockOptions`, `WildShapeOptions`

## Key Design Decisions

- `Statblock.traits`, `.attacks`, `.actions`, `.bonusActions` are all `Record<string, Partial<T>>` — at the template level these are always partial overrides. Fully resolved objects only exist on the derived statblock after `scaleMonster` runs.
- `averageStats` is keyed by `ChallengeRating`, not `number`. Lookups with a plain `number` require a cast: `averageStats[cr as ChallengeRating]`.
- The statblock renderer is framework-agnostic vanilla DOM — no React dependency. If a React wrapper is ever needed, it should be a separate `@toolkit5e/statblock-react` package.
- The standalone monster-scaler site (`monster-scaler/`) is the primary consumer and test bed for these packages.

## Typical Usage

```ts
import { scaleMonster, monsterList } from '@toolkit5e/monster-scaler';
import { renderStatblock } from '@toolkit5e/statblock';

const statblock = scaleMonster(monsterList.wolf, '5');
renderStatblock(statblock, document.getElementById('statblock'));
```
