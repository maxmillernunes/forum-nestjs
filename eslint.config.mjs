import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'eslint.config.mjs',
      'test/**',
      '**/*spec.ts',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',

      // --- Prettier formatting ---
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'all',
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          bracketSpacing: true,
          arrowParens: 'always',
        },
      ],
    },
  },
]
