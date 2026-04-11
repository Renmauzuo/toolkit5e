# toolkit5e

npm packages for D&D 5th edition tooling.

## Packages

| Package | Description |
|---|---|
| [`@toolkit5e/base`](packages/base/README.md) | Shared types, constants, data, and utilities |
| [`@toolkit5e/monster-scaler`](packages/monster-scaler/README.md) | Scale monsters to any challenge rating |
| [`@toolkit5e/statblock`](packages/statblock/README.md) | Render a visual statblock into a DOM element |

## Publishing

1. Run `npm run build` and verify everything compiles
2. Run `npm install` to update the lock file if dependencies changed
3. Commit and push all changes — **do not manually bump version numbers**
4. Create a GitHub release tagged with the new version (e.g. `1.0.1`)

The release triggers a GitHub Actions workflow that sets the version from the tag, builds the packages, and publishes them to npm. The `version` fields in `package.json` always reflect the last published version — the workflow updates them at publish time.
