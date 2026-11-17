import config from '@tpluscode/eslint-config'

const dirname = new URL('.', import.meta.url).pathname

export default [
  {
    ignores: [
      '**/*.d.ts',
      '**/*.js',
      '!eslint.config.js',
      'coverage/**',
    ],
  },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: dirname,
      },
    },
  },
]
