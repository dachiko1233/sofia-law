import js from '@eslint/js';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

// Flat config (ESLint 10). TypeScript 7.0's native compiler is not yet
// supported by typescript-eslint (https://github.com/typescript-eslint/typescript-eslint/issues/10940),
// so we parse TS/TSX with @babel/eslint-parser — this lints syntax, React Hooks
// and Fast Refresh rules without depending on the TS compiler API. Type-level
// checks (unused vars, undefined identifiers, type errors) are enforced by
// `tsc -b` in the build script instead.
//
// JSX is enabled only for .tsx (via @babel/plugin-syntax-jsx); .ts stays
// JSX-free so generic arrows / type assertions (`<T>`) parse unambiguously.
const plugins = {
  'react-hooks': reactHooks,
  'react-refresh': reactRefresh,
};

const rules = {
  ...reactHooks.configs.recommended.rules,
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  // tsc (noUnusedLocals / noUnusedParameters) owns these; the base rules
  // misfire on type-only syntax, so disable them for TS files.
  'no-unused-vars': 'off',
  'no-undef': 'off',
  // New in eslint-plugin-react-hooks v7. It flags the intentional
  // reset-on-navigation (Header mobile menu) and show-on-mount (CookieBanner)
  // effects, which are correct here. The core correctness rules
  // (rules-of-hooks, exhaustive-deps) stay on.
  'react-hooks/set-state-in-effect': 'off',
};

const languageOptions = (babelPlugins) => ({
  parser: babelParser,
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-typescript'],
      plugins: babelPlugins,
    },
  },
  globals: {
    ...globals.browser,
    ...globals.node,
  },
});

export default [
  { ignores: ['dist', 'node_modules', 'coverage', '**/*.d.ts', '**/*.tsbuildinfo'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: languageOptions([]),
    plugins,
    rules,
  },
  {
    files: ['**/*.tsx'],
    languageOptions: languageOptions(['@babel/plugin-syntax-jsx']),
    plugins,
    rules,
  },
];
