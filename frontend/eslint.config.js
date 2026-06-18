import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint' // 1. Import the TypeScript ESLint utility

export default tseslint.config(
    { ignores: ['dist'] },
    {
      // 2. Extend files array to include .ts and .tsx
      files: ['**/*.{js,jsx,ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        // 3. Let typescript-eslint automatically handle the parser for TS files
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...js.configs.recommended.rules,
        ...reactHooks.configs.recommended.rules,
        'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
    // 4. Append the recommended TypeScript rule configurations
    ...tseslint.configs.recommended,
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        // 5. Safely turn off no-undef because TypeScript's compiler tracks this natively
        'no-undef': 'off',
      }
    }
)