import { test, getTSParsers } from '../utils';

import { RuleTester } from 'eslint';

const ruleTester = new RuleTester();
const rule = require('rules/prefer-node-builtin-imports');

const preferNotUsingProtocol = ['never'];
const useNewerParser = { ecmaVersion: 2021 };
ruleTester.run('prefer-node-builtin-imports', rule, {
  valid: [
    test({ code: 'import unicorn from "unicorn";' }),
    test({ code: 'import fs from "./fs";' }),
    test({ code: 'import fs from "unknown-builtin-module";' }),
    test({ code: 'import fs from "node:fs";' }),
    test({
      code: `
      async function foo() {
        const fs = await import(fs);
      }`,
      parserOptions: useNewerParser,
    }),
    test({
      code: `
      async function foo() {
      const fs = await import(0);
      }`,
      parserOptions: useNewerParser,
    }),
    test({
      code: `
      async function foo() {
        const fs = await import(\`fs\`);
      }`,
      parserOptions: useNewerParser,
    }),
    test({ code: 'import "punycode/";' }),
    test({ code: 'const fs = require("node:fs");' }),
    test({ code: 'const fs = require("node:fs/promises");' }),
    test({ code: 'const fs = require(fs);' }),
    test({ code: 'const fs = notRequire("fs");' }),
    test({ code: 'const fs = foo.require("fs");' }),
    test({ code: 'const fs = require.resolve("fs");' }),
    test({ code: 'const fs = require(`fs`);' }),
    test({
      code: 'const fs = require?.("fs");',
      parserOptions: useNewerParser,
    }),
    test({ code: 'const fs = require("fs", extra);' }),
    test({ code: 'const fs = require();' }),
    test({ code: 'const fs = require(...["fs"]);' }),
    test({ code: 'const fs = require("unicorn");' }),
    test({
      code: 'import fs from "fs";',
      options: preferNotUsingProtocol,
    }),
    test({
      code: 'const fs = require("fs");',
      options: preferNotUsingProtocol,
    }),
    test({
      code: 'const fs = require("fs/promises");',
      options: preferNotUsingProtocol,
    }),
  ],
  invalid: [
    test({
      code: 'import fs from "fs";',
      output: 'import fs from "node:fs";',
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs' } },
      ],
    }),
    test({
      code: 'export {promises} from "fs";',
      output: 'export {promises} from "node:fs";',
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs' } },
      ],
    }),
    test({
      code: `
      async function foo() {
        const fs = await import('fs');
      }`,
      output: `
      async function foo() {
        const fs = await import('node:fs');
      }`,
      parserOptions: useNewerParser,
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs' } },
      ],
    }),
    test({
      code: 'import fs from "fs/promises";',
      output: 'import fs from "node:fs/promises";',
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs/promises' } },
      ],
    }),
    test({
      code: 'export {default} from "fs/promises";',
      output: 'export {default} from "node:fs/promises";',
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs/promises' } },
      ],
    }),
    test({
      code: `
        async function foo() {
          const fs = await import('fs/promises');
        }`,
      output: `
        async function foo() {
          const fs = await import('node:fs/promises');
        }`,
      parserOptions: useNewerParser,
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs/promises' } },
      ],
    }),
    test({
      code: 'import {promises} from "fs";',
      output: 'import {promises} from "node:fs";',
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs' } },
      ],
    }),
    test({
      code: 'export {default as promises} from "fs";',
      output: 'export {default as promises} from "node:fs";',
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs' } },
      ],
    }),
    test({
      code: `
        async function foo() {
        const fs = await import("fs/promises");
      }`,
      output: `
        async function foo() {
        const fs = await import("node:fs/promises");
      }`,
      parserOptions: useNewerParser,
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs/promises' } },
      ],
    }),
    test({
      code: 'import "buffer";',
      output: 'import "node:buffer";',
      errors: [
        {
          messageId: 'preferNodeBuiltinImports',
          data: { moduleName: 'buffer' },
        },
      ],
    }),
    test({
      code: 'import "child_process";',
      output: 'import "node:child_process";',
      errors: [
        {
          messageId: 'preferNodeBuiltinImports',
          data: { moduleName: 'child_process' },
        },
      ],
    }),
    test({
      code: 'import "timers/promises";',
      output: 'import "node:timers/promises";',
      errors: [
        {
          messageId: 'preferNodeBuiltinImports',
          data: { moduleName: 'timers/promises' },
        },
      ],
    }),
    test({
      code: 'const {promises} = require("fs")',
      output: 'const {promises} = require("node:fs")',
      errors: [
        { messageId: 'preferNodeBuiltinImports', data: { moduleName: 'fs' } },
      ],
    }),
    test({
      code: 'const fs = require("fs/promises")',
      output: 'const fs = require("node:fs/promises")',
      errors: [
        {
          messageId: 'preferNodeBuiltinImports',
          data: { moduleName: 'fs/promises' },
        },
      ],
    }),
  ],
});
