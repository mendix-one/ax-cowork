// @ts-check
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Vendored dhtmlx-gantt source. These rules are disabled because the upstream
// library uses legacy JS patterns (var-in-for, `arguments`, `this` aliasing,
// untyped `any`) that don't match the project's modern standard. Rewriting
// vendor code by hand risks subtle behavior changes, so we accept the upstream
// style here while keeping the same baseline + Prettier config as the rest of
// the workspace.
export default tseslint.config(
  {
    ignores: ['dist', 'stubs', 'eslint.config.mjs', 'vite.config.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        PRODUCTION: 'readonly',
        VERSION: 'readonly',
        LICENSE: 'readonly',
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // indent/quotes/comma-dangle safety-net rules from first-party configs
      // are intentionally omitted here — Prettier formats the vendored source,
      // and the eslint `indent` rule disagrees with Prettier on dhtmlx's
      // deeply-nested object literals.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-useless-assignment': 'off',
      'prefer-rest-params': 'off',
    },
  },
)
