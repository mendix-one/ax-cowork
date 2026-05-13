import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { boundaries },
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite, prettierConfig],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        // Composition root — wires app together, can pull anything
        { type: 'root', mode: 'file', pattern: 'src/{main.tsx,AxApp.tsx}' },
        // Router config is a special case under acore — can pull layouts + pages
        { type: 'router', mode: 'file', pattern: 'src/acore/router/index.tsx' },
        // Kernel — everything else under acore/
        { type: 'acore', mode: 'folder', pattern: 'src/acore' },
        // Each shared/<name>/ is its own element
        { type: 'shared', mode: 'folder', pattern: 'src/shared/*' },
        // Each layouts/<name>/ is its own element
        { type: 'layout', mode: 'folder', pattern: 'src/layouts/*' },
        // Each pages/<name>/ is its own element
        { type: 'page', mode: 'folder', pattern: 'src/pages/*' },
        // Static assets
        { type: 'asset', mode: 'file', pattern: 'src/assets/**' },
        // Test setup
        { type: 'test', mode: 'folder', pattern: 'src/test' },
      ],
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'root', allow: ['root', 'acore', 'router', 'shared', 'layout', 'page', 'asset'] },
            { from: 'router', allow: ['acore', 'shared', 'layout', 'page', 'asset'] },
            { from: 'page', allow: ['acore', 'shared', 'layout', 'asset'] },
            { from: 'layout', allow: ['acore', 'shared', 'layout', 'asset'] },
            { from: 'acore', allow: ['acore', 'shared', 'asset'] },
            { from: 'shared', allow: ['shared', 'asset'] },
            { from: 'test', allow: ['acore', 'shared', 'layout', 'page', 'asset'] },
            { from: 'asset', allow: [] },
          ],
        },
      ],
    },
  },
])
