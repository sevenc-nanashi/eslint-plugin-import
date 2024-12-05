'use strict';

const { builtinModules } = require('module');
const { default: docsUrl } = require('../docsUrl');

const DO_PREFER_MESSAGE_ID = 'preferNodeBuiltinImports';
const NEVER_PREFER_MESSAGE_ID = 'neverPreferNodeBuiltinImports';
const messages = {
  [DO_PREFER_MESSAGE_ID]: 'Prefer `node:{{moduleName}}` over `{{moduleName}}`.',
  [NEVER_PREFER_MESSAGE_ID]: 'Prefer `{{moduleName}}` over `node:{{moduleName}}`.',
};

function replaceStringLiteral(
  fixer,
  node,
  text,
  relativeRangeStart,
  relativeRangeEnd,
) {
  const firstCharacterIndex = node.range[0] + 1;
  const start = Number.isInteger(relativeRangeEnd)
    ? relativeRangeStart + firstCharacterIndex
    : firstCharacterIndex;
  const end = Number.isInteger(relativeRangeEnd)
    ? relativeRangeEnd + firstCharacterIndex
    : node.range[1] - 1;

  return fixer.replaceTextRange([start, end], text);
}

const isStringLiteral = (node) => node.type === 'Literal' && typeof node.value === 'string';

const isStaticRequireWith1Param = (node) => !node.optional
  && node.callee.type === 'Identifier'
  && node.callee.name === 'require'
  && node.arguments[0]
  // check for only 1 argument
  && !node.arguments[1];

function checkAndReport(src, ctx) {
  const { value } = src;

  if (ctx.options[0] === 'never') {
    if (!value.startsWith('node:')) { return; }
    const actualModuleName = value.slice(5);
    if (!builtinModules.includes(actualModuleName)) { return; }

    ctx.report({
      node: src,
      messageId: NEVER_PREFER_MESSAGE_ID,
      data: { moduleName: actualModuleName },
      /** @param {import('eslint').Rule.RuleFixer} fixer */
      fix(fixer) {
        return replaceStringLiteral(fixer, src, '', 0, 5);
      },
    });

  } else {
    if (!builtinModules.includes(value)) { return; }
    if (value.startsWith('node:')) { return; }

    ctx.report({
      node: src,
      messageId: DO_PREFER_MESSAGE_ID,
      data: { moduleName: value },
      /** @param {import('eslint').Rule.RuleFixer} fixer */
      fix(fixer) {
        return replaceStringLiteral(fixer, src, 'node:', 0, 0);
      },
    });
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer using the `node:` protocol when importing Node.js builtin modules.',
      recommended: true,
      category: 'Best Practices',
      url: docsUrl('prefer-node-builin-imports'),
    },
    fixable: 'code',
    schema: [
      {
        enum: ["always", "never"],
      },
    ],
    messages,
  },
  create(ctx) {
    return {
      CallExpression(node) {
        if (!isStaticRequireWith1Param(node)) {
          return;
        }

        if (!isStringLiteral(node.arguments[0])) {
          return;
        }

        return checkAndReport(node.arguments[0], ctx);
      },
      ExportNamedDeclaration(node) {
        if (!isStringLiteral) { return; }

        return checkAndReport(node.source, ctx);
      },
      ImportDeclaration(node) {
        if (!isStringLiteral) { return; }

        return checkAndReport(node.source, ctx);
      },
      ImportExpression(node) {
        if (!isStringLiteral) { return; }

        return checkAndReport(node.source, ctx);
      },
    };
  },
};
