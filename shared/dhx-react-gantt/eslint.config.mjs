// @ts-check
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Vendored dhtmlx-gantt React wrapper. See shared/dhx-gantt/eslint.config.mjs
// for the rationale behind disabling these rules — the upstream code uses
// untyped `any` extensively to interop with the imperative dhtmlx core.
export default tseslint.config(
  {
    ignores: ['dist', 'scripts', 'eslint.config.mjs', 'rollup.config.dts.js', 'vite.config.js'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // See shared/dhx-gantt/eslint.config.mjs for rationale on omitting
      // the indent/quotes/comma-dangle safety net (Prettier owns formatting).
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-useless-assignment': 'off',
    },
  },
)
