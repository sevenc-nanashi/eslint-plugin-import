# import/prefer-node-builtin-imports

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Reports when there is no `node:` protocol for builtin modules.

```ts
import path from "node:path";
```

## Rule Details

This rule enforces that builtins node imports are using `node:` protocol. It resolved the conflict of a module (npm-installed) in `node_modules` overriding the built-in module. Besides that, it is also clear that a built-in Node.js module is imported.

## Options

The rule accepts a single string option which may be one of:

 - `'always'` - enforces that builtins node imports are using `node:` protocol.
 - `'never'` - enforces that builtins node imports are not using `node:` protocol.

By default the rule will use the `'always'` option.

## Examples

### `'always'`

❌ Invalid

```ts
import fs from "fs";
export { promises } from "fs";
// require
const fs = require("fs/promises");
```

✅ Valid

```ts
import fs from "node:fs";
export { promises } from "node:fs";
// require
const fs = require("node:fs/promises");
```

### `'never'`

❌ Invalid

```ts
import fs from "node:fs";
export { promises } from "node:fs";
// require
const fs = require("node:fs/promises");
```

✅ Valid

```ts
import fs from "fs";
export { promises } from "fs";
// require
const fs = require("fs/promises");
```

## When Not To Use It

If you are using browser or Bun or Deno since this rule doesn't do anything with them.
