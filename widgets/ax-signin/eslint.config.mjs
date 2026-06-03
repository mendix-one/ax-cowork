import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

// Mirrors react-app/eslint.config.js (same rule set + prettier alignment), minus the
// react-app-only pieces: no eslint-plugin-boundaries (that enforces react-app's layer
// architecture) and no react-refresh (Vite-only; the widget's editorPreview/editorConfig
// intentionally export non-components). Replaces the @mendix/pluggable-widgets-tools
// eslintrc base so widget code follows the same conventions as the rest of the repo.
export default defineConfig([
  globalIgnores(['dist', 'typings', 'tests/testProject']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, prettierConfig],
    languageOptions: {
      // browser at runtime; node for the require()/CommonJS bits in the Studio Pro preview files.
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
    // Mendix's getPreviewCss() API returns the widget CSS via require() — allow it here.
    files: ['src/**/*.editorPreview.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
])
