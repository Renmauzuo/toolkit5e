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

The Gulp watch (`npm run watch` in monster-scaler) watches both the site's own `src/` files and the toolkit5e package `dist/` folders — changes to package source will trigger a site JS rebuild after `tsc --watch` recompiles them.

## Publishing

Packages are published to npm under the `@toolkit5e` org (public). Publishing is automated via GitHub Actions — create a release in GitHub with a tag matching the version (e.g. `1.2.0`, no `v` prefix) and the workflow handles the rest.

The workflow (`publish.yml`):
1. Upgrades npm to latest (required for OIDC Trusted Publishing)
2. Builds all packages
3. Sets the version in each package from the release tag
4. Publishes each package with provenance via npm Trusted Publishing (no token needed)

After changing inter-package dependencies (e.g. bumping the `@toolkit5e/base` version range in monster-scaler/statblock), run `npm install` from the workspace root and commit the updated `package-lock.json` before releasing — `npm ci` in the workflow requires the lock file to be in sync.

The root `package.json` is `"private": true` to prevent accidentally publishing the workspace root.

## Package Contents

### @toolkit5e/base

- `types.ts` — Core interfaces: `Statblock`, `Trait`, `Attack`, `Multiattack`, `ChallengeRating`, `AbilityKey`, `SkillRank`
- `constants.ts` — String constants use `as const` for literal types (creature types, damage types, conditions, alignments, etc.). Numeric constants do not need `as const` as TypeScript infers literal types for them already.
- `data.ts` — Reference data: `sizes`, `abilities`, `skills`, `averageStats`, `traits`, `procs`, `actions`, `armorTypes`, `spells`, `fullCasterSlots`, `pronouns`, `races`
- `utils.ts` — Pure utility functions: `abilityScoreModifier`, `averageRoll`, `damageString`, `stringForCR`, `stepForCR`, `toSentenceCase`, `toTitleCase`, `getOrdinal`, `flattenObject`, `mergeObjects`, `mergeArrays`

### @toolkit5e/monster-scaler

- `monsters.ts` — `monsterList`: the full dataset of scalable monster templates
- `index.ts` — `scaleMonster(template, targetCR, options?)` plus exported helpers: `findBenchmarksForStat`, `extrapolateFromBenchmark`, `generateTrait`, `findNearestLowerBenchmark`, `hitPointsPerHitDie`, `scaleDamageRoll`, `findDamageDice`, `calculateWeightedAverage`
- `types.ts` — `MonsterTemplate`, `MonsterVariant`, `ScaleMonsterOptions`, `Benchmarks`
  - `ScaleMonsterOptions.legendary: 3 | 5` — upgrades the statblock with legendary resistances and auto-generated legendary actions after scaling

### @toolkit5e/statblock

- `index.ts` — `renderStatblock(statblock, targetElement)` and `replaceTokensInString(str, statblock, trait)`
- `types.ts` — `StatblockRenderer`, `RenderStatblockOptions`, `WildShapeOptions`
## Key Design Decisions

- `Statblock.traits`, `.attacks`, `.actions`, `.bonusActions` are all `Record<string, Partial<T>>` — at the template level these are always partial overrides. Fully resolved objects only exist on the derived statblock after `scaleMonster` runs.
- `averageStats` is keyed by `ChallengeRating`, not `number`. Lookups with a plain `number` require a cast: `averageStats[cr as ChallengeRating]`.
- The statblock renderer is framework-agnostic vanilla DOM — no React dependency. If a React wrapper is ever needed, it should be a separate `@toolkit5e/statblock-react` package.
- The standalone monster-scaler site (`monster-scaler/`) is the primary consumer and test bed for these packages.
- `renderStatblock` builds all its own DOM from scratch into the target element — the caller only needs to provide an empty container. Optional sections (saves, skills, resistances, traits, bonus actions, legendary actions, etc.) are only added when the statblock has data for them. The target's class is set to `stat-block` automatically.
- `Attack` has `bonusAttack` and `bonusDamage` fields for applying flat bonuses (e.g. wild shape modifiers) on top of the computed ability-score-based values. These should be set on the attack objects before calling `renderStatblock`, not inside the renderer.
- `damageRiderDice`/`damageRiderDieSize`/`damageRiderDieType` on an attack are always scaled by `scaleMonster` — they are stripped from the source stats before the scaling pass so the scaler always recomputes them proportionally.
- `tramplingCharge` (and any trait that references an attack by name) uses `{{trait:chargeAttack}}` / `{{trait:knockdownAttack}}` tokens. When a `{{trait:key}}` value is a string matching an attack key on the statblock, `replaceTokensInString` resolves it to that attack's display name. Monsters set these fields in their per-CR trait data (e.g. `traits: { tramplingCharge: { chargeAttack: 'hooves', knockdownAttack: 'hooves' } }`). Defaults (`'gore'`/`'stomp'`) are set on the trait definition in `data.ts`.
- Trait names go through `replaceTokensInString` in the renderer, so tokens like `{{trait:count}}` work in names as well as descriptions.
- `Statblock.legendaryActions` and `Statblock.legendaryResistances` are populated by `applyLegendary()` inside `scaleMonster` when `options.legendary` is set. Legendary action costs are derived from each attack's average damage as a fraction of the CR's expected DPR: <25% → cost 1, 25–50% → cost 2, >50% → cost 3. The `description` field on the statblock is set by the caller (site) after `scaleMonster` returns — `applyLegendary` constructs the resistance trait inline rather than relying on it.

## Code Documentation

Use JSDoc comments on all exported functions, types, and interfaces. This enables hover documentation in the IDE and makes the API easier to navigate without digging into source.

For TypeScript functions, include a description and `@param` / `@returns` tags even when types are already declared — the description is what shows up in the hover tooltip:

```ts
/**
 * Scales a monster template to the target CR.
 * @param template - The monster template from `monsterList`
 * @param targetCR - The desired challenge rating
 * @param options - Optional overrides (e.g. legendary upgrades)
 * @returns A fully resolved `Statblock` at the target CR
 */
export function scaleMonster(template: MonsterTemplate, targetCR: ChallengeRating, options?: ScaleMonsterOptions): Statblock { ... }
```

For interfaces and type aliases, document each field with an inline or block comment:

```ts
/** Options passed to `scaleMonster` to modify scaling behavior. */
export interface ScaleMonsterOptions {
  /** Adds legendary resistances and auto-generates legendary actions. `3` or `5` resistances. */
  legendary?: 3 | 5;
}
```

## Typical Usage

```ts
import { scaleMonster, monsterList } from '@toolkit5e/monster-scaler';
import { renderStatblock } from '@toolkit5e/statblock';

const statblock = scaleMonster(monsterList.wolf, '5');
renderStatblock(statblock, document.getElementById('statblock'));
```

## Monster Template Authoring

### Stats vs lockedStats

- `lockedStats` — stats that never change regardless of CR or variant: attack definitions (reach, damage type, name), condition immunities, languages, fixed ability scores (e.g. `int: 2`), `slug`, `size` if it never scales.
- `stats` — keyed by CR, used as benchmarks for interpolation/extrapolation. `averageStats` is used as a *ratio reference* (how does this creature compare to average at its CR?) not as a fallback — so if a stat is missing from all benchmarks, it comes out undefined. Every core stat (str, dex, con, int, wis, cha, hitDice, size) must appear at least once somewhere across the base `stats`, `lockedStats`, or variant `stats`. Stats can be spread across multiple CR benchmarks — a stat only in the CR 1 benchmark will be extrapolated to other CRs. Variant `stats` only need to specify what differs from the base; everything else is inherited via the merge.

### Variant authoring

- Variant `stats` and `lockedStats` are merged on top of the base after scaling. Only include what genuinely differs from the base.
- Stats shared by all variants belong in the base `lockedStats` (e.g. `size`, `int`, base `slug`).
- Stats shared by most variants but overridden by one should still live in the base — the outlier variant overrides just that field (e.g. `slug: 'warhorse'` on the war variant while base has `slug: 'horse'`).
- Avoid repeating `name` in base `stats` benchmarks when variants exist — `findNearestLowerBenchmark('name', ...)` will bleed the highest-CR benchmark's name across all variants. Put `name` only in each variant's `stats` entries.
- Variant-specific traits (e.g. `tramplingCharge` only on the warhorse) go in the variant's `traits` array, not the base `traits` array. The variant's per-CR `traits` object still carries the trait's data fields (DC adjustments, attack key overrides, etc.).
- `description` on the rendered statblock is set by the caller (site) after `scaleMonster` returns, as `'the ' + statblock.slug`. Make sure slugs are human-readable lowercase strings (`'horse'`, `'warhorse'`) not camelCase (`'ridingHorse'`).
- Movement speeds (`speed`, `swim`, `climb`, `burrow`, `fly`) are resolved exclusively from `sourceStats` benchmarks via `findNearestLowerBenchmark` — they are **not** read from `lockedStats`. If a speed is identical across all benchmarks, it can go in `lockedStats` as a fixed value. If it varies across benchmarks (e.g. two otherwise similar creatures consolidated into one entry with different speeds), put it in the per-CR `stats` entries so the scaler picks up the nearest lower value. If a variant lacks a speed that the base has (e.g. polar bear has no climb), simply omit it from that benchmark — don't try to zero it out.

### Trait tokens and attack references

- `{{trait:key}}` in a trait description or name resolves the trait's own field. If the value is a string matching an attack key on the statblock, it resolves to that attack's display name (lowercased). Use this for traits that reference a specific attack by name so the text stays correct across variants (e.g. `tramplingCharge` with `chargeAttack: 'hooves'` vs `'gore'`).
- Trait names go through `replaceTokensInString` in the renderer — tokens work in names as well as descriptions.
- Any `proc` key referenced on an attack (e.g. `proc: 'poisonBite'`) must have a corresponding entry in `procs` in `data.ts`. If the key is missing, `generateTrait` will receive `undefined` as `baseTrait` and crash with a `Cannot read properties of undefined` error at runtime. Always define the proc before referencing it.
- Avoid constructing trait text that depends on `statblock.description` inside `scaleMonster` or `applyLegendary` — `description` is set by the caller after scaling. Construct inline strings using `statblock.slug` as a fallback if needed.
- `{{trait:damage}}` renders as a dice string (e.g. `2d6 (7)`) when `damageDieSize > 1`, or as a plain number when `damageDieSize === 1`. Use `damageDieSize: 1` for traits whose "damage" is actually a flat threshold or count (e.g. Relentless's hit point threshold) — the scaler will still interpolate `damageDice` proportionally across CRs, and the renderer will output just the number with no dice notation.
- Trait tokens (`{{trait:key}}`) are the right choice for any value that lives on the trait itself — spell lists, caster level, DC adjustments, etc. Bare tokens (`{{key}}`) resolve against the statblock, not the trait. When in doubt, use `{{trait:key}}`.
- `Trait.classSpells` is a `string[]` of spell keys for class-based prepared spellcasting, rendered via `{{trait:spellListClass}}`. Spell levels are looked up from the `spells` registry in `data.ts`. Slot counts come from `fullCasterSlots[spellcastingLevel]`. Unpopulated slot tiers (where the caster level unlocks slots but no spells are listed) render as "choose appropriate spells".
- `Trait.spellList` (`Record<string, { uses? }>`) is for innate spellcasting, rendered via `{{trait:spellListInnate}}`, grouped by uses/day.
- `Trait.scalesSpellcasting: true` on a trait definition tells `generateTrait` to compute `spellcastingLevel` using a linear offset from the benchmark CR: `offset = benchmarkLevel - benchmarkCR`, then `round(targetCR + offset)`, clamped to `[1, 20]`. Set `spellcastingLevel` in the per-CR `traits` benchmark data (not `lockedStats`) so the scaler can find the benchmark CR.
- `{{trait:ordinalLevel}}` resolves `trait.spellcastingLevel ?? trait.level ?? statblock.level` — prefer `spellcastingLevel` for NPC spellcasters so it doesn't collide with the sidekick `level` field.
