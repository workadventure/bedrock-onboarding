module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir : __dirname,
      sourceType: 'module',
    },
    plugins: [
        "@typescript-eslint/eslint-plugin",
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      'plugin:@typescript-eslint/recommended',
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:import/recommended",
      "plugin:import/typescript",
    ],
    root: true,
    env: {
      node: true,
    },
    ignorePatterns: ['.eslintrc.cjs'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      "@typescript-eslint/no-unused-vars": [
        "error", { "args": "none", "caughtErrors": "all", "varsIgnorePattern": "_exhaustiveCheck" }
      ],
      "import/order": "error",
  
      "no-async-promise-executor": "error",
      "no-await-in-loop": "error",
      "no-promise-executor-return": "error",
      "require-atomic-updates": "error",
      "prefer-promise-reject-errors": "error",
      "@typescript-eslint/triple-slash-reference": "off"
    },
    "settings": {
      "typescript": true,
      "node": true
    }
  };