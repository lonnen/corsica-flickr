module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-param-reassign': 'off',
    'no-console': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
