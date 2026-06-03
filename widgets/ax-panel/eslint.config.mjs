import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

// Mirrors widgets/ax-simulation/eslint.config.mjs — same rule set + prettier alignment.
export default defineConfig([
  globalIgnores(['dist', 'typings', 'tests/testProject']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, prettierConfig],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.editorPreview.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
])
