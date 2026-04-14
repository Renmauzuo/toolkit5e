# @toolkit5e/statblock

Renders a D&D 5th edition statblock into a target DOM element. Framework-agnostic — works with any setup that has access to the DOM.

## Installation

```bash
npm install @toolkit5e/statblock
```

## Usage

```ts
import { renderStatblock } from '@toolkit5e/statblock';
import { scaleMonster, monsterList } from '@toolkit5e/monster-scaler';

const statblock = scaleMonster(monsterList.wolf, '5');
renderStatblock(statblock, document.getElementById('statblock-container'));
```

The target element just needs to exist — `renderStatblock` clears it and builds all required DOM from scratch. Optional sections (saving throws, skills, resistances, languages, traits, bonus actions, etc.) are only added when the statblock has data for them.

## API

### `renderStatblock(statblock, target)`

Renders a `Statblock` object into the provided element.

- `statblock` — a `Statblock` object, typically from `scaleMonster`
- `target` — any `HTMLElement`; its contents will be replaced and its class set to `stat-block`

### `replaceTokensInString(str, statblock, trait)`

Resolves template tokens in a description string. Tokens use `{{tokenName}}` or `{{category:value}}` syntax.

```ts
import { replaceTokensInString } from '@toolkit5e/statblock';

replaceTokensInString('{{description}} has advantage.', statblock, trait);
// "The wolf has advantage."
```

Supported tokens include `{{description}}`, `{{pronoun:subject}}`, `{{trait:DC}}`, `{{trait:damage}}`, `{{DC:str}}`, `{{size:-1}}`, and more.

## License

MIT
