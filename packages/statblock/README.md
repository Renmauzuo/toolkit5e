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

The target element should contain the expected statblock HTML structure. See the HTML structure section below.

## API

### `renderStatblock(statblock, target)`

Renders a `Statblock` object into the provided element.

- `statblock` — a `Statblock` object, typically from `scaleMonster`
- `target` — the root `HTMLElement` containing the statblock markup

Populates the following elements within `target` by ID: `#monster-name`, `#monster-type`, `#armor-class`, `#hit-points`, `#speed`, `#monster-str/dex/con/int/wis/cha`, `#saving-throws`, `#skills`, `#vulnerabilities`, `#resistances`, `#immunities`, `#condition-immunities`, `#senses`, `#challenge-rating`, `#traits`, `#languages`, `#attacks`, `#bonus-actions`.

### `replaceTokensInString(str, statblock, trait)`

Resolves template tokens in a description string. Tokens use `{{tokenName}}` or `{{category:value}}` syntax.

```ts
import { replaceTokensInString } from '@toolkit5e/statblock';

replaceTokensInString('{{description}} has advantage.', statblock, trait);
// "The wolf has advantage."
```

Supported tokens include `{{description}}`, `{{pronoun:subject}}`, `{{trait:DC}}`, `{{trait:damage}}`, `{{DC:str}}`, `{{size:-1}}`, and more.

## HTML structure

Your target element needs to contain elements with the IDs that `renderStatblock` writes to. A minimal example:

```html
<div id="stat-block">
  <h1 id="monster-name"></h1>
  <p id="monster-type"></p>
  <p id="armor-class"><span></span></p>
  <p id="hit-points"><span></span></p>
  <p id="speed"><span></span></p>
  <p id="monster-str"></p>
  <p id="monster-dex"></p>
  <p id="monster-con"></p>
  <p id="monster-int"></p>
  <p id="monster-wis"></p>
  <p id="monster-cha"></p>
  <p id="saving-throws"><span></span></p>
  <p id="skills"><span></span></p>
  <p id="vulnerabilities"><span></span></p>
  <p id="resistances"><span></span></p>
  <p id="immunities"><span></span></p>
  <p id="condition-immunities"><span></span></p>
  <p id="senses"><span></span></p>
  <p id="challenge-rating"><span></span></p>
  <div id="traits"></div>
  <p id="languages"><span></span></p>
  <div id="attacks"></div>
  <div id="bonus-actions-wrapper">
    <div id="bonus-actions"></div>
  </div>
</div>
```

## License

MIT
