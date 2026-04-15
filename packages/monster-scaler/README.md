# @toolkit5e/monster-scaler

Scales D&D 5th edition monsters to any challenge rating. Given a monster template and a target CR, it interpolates and extrapolates stats to produce a complete statblock appropriate for that CR.

## Installation

```bash
npm install @toolkit5e/monster-scaler
```

## Usage

```ts
import { scaleMonster, monsterList } from '@toolkit5e/monster-scaler';

const statblock = scaleMonster(monsterList.wolf, '5');
// statblock.name === 'Dire Wolf' (nearest named benchmark)
// statblock.str, statblock.hitDice, statblock.attacks, etc. all scaled to CR 5
```

### With options

```ts
// Scale a variant
const shark = scaleMonster(monsterList.shark, '3', { variant: 'packHunter' });

// Scale a humanoid of any race
const commoner = scaleMonster(monsterList.commoner, '2', { race: 1 }); // 1 = dwarf

// Make a legendary version (3 or 5 resistances)
const legendaryWolf = scaleMonster(monsterList.wolf, '8', { legendary: 3 });
```

## API

### `scaleMonster(template, targetCR, options?)`

Scales a monster template to the target CR and returns a fully derived `Statblock`.

- `template` — a `MonsterTemplate` from `monsterList` or your own
- `targetCR` — CR as a string: `'0'`, `'0.5'`, `'1'`, `'5'`, `'20'`, etc.
- `options.variant` — key of the variant to use, if the template has variants
- `options.race` — index into the `races` array from `@toolkit5e/base`, for humanoid templates with `race: 'any race'`
- `options.legendary` — `3` or `5`: adds Legendary Resistance, auto-generates legendary actions (Detect, Move, and per-attack actions with costs derived from DPR fraction), and populates `statblock.legendaryActions` and `statblock.legendaryResistances`

### `monsterList`

A record of built-in monster templates keyed by ID:

```ts
import { monsterList } from '@toolkit5e/monster-scaler';

Object.keys(monsterList);
// ['ape', 'awakenedPlant', 'baboon', 'badger', 'bat', 'bear', 'camel',
//  'commoner', 'crocodile', 'dolphinDelighter', 'dryad', 'elephant',
//  'fireElemental', 'giantSpider', 'horse', 'killerWhale', 'naiad',
//  'quetzalcoatlus', 'saberToothedTiger', 'shadow', 'shark', 'trex', 'wolf']
```

### How scaling works

Each template defines stat "keyframes" at one or more CRs. To scale to a target CR, the scaler:

1. Finds the nearest keyframes above and below the target
2. Compares each keyframe stat to the average stat for that CR
3. Applies the same ratio or offset to the average stat at the target CR
4. Falls back to extrapolation when only one direction has a keyframe

This means a wolf with above-average strength for CR 0.25 will have above-average strength at CR 10 — the relative character of the creature is preserved.

## Custom templates

You can define your own templates using the `MonsterTemplate` type:

```ts
import { scaleMonster } from '@toolkit5e/monster-scaler';
import { typeBeast, alignmentUnaligned, reachMedium, damageTypePiercing } from '@toolkit5e/base';
import type { MonsterTemplate } from '@toolkit5e/monster-scaler';

const myMonster: MonsterTemplate = {
  type: typeBeast,
  alignment: alignmentUnaligned,
  lockedStats: {
    slug: 'my-monster',
    attacks: {
      bite: { reach: reachMedium, damageType: damageTypePiercing, name: 'Bite' }
    }
  },
  stats: {
    1: { name: 'My Monster', hitDice: 3, speed: 30, size: 3, str: 14, dex: 12, con: 12, int: 4, wis: 10, cha: 5,
         attacks: { bite: { damageDice: 1, damageDieSize: 6 } } }
  }
};

const scaled = scaleMonster(myMonster, '5');
```

## License

MIT
