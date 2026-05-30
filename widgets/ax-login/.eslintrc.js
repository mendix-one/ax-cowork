// Legacy (.eslintrc) format kept because @mendix/pluggable-widgets-tools lint runner
// targets ESLint 8 — flat config isn't picked up by `pluggable-widgets-tools lint`.
// Rules mirror the react-app eslint.config.js so style is consistent across the workspace.
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: { jsx: true },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react-hooks'],
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['dist', 'node_modules', 'typings'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'comma-dangle': ['error', 'always-multiline'],
  },
  overrides: [
    {
      files: ['*.editorPreview.tsx', '*.editorConfig.ts', 'prettier.config.js', '.eslintrc.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
}
