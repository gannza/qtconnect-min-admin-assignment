module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'airbnb-base',
    'plugin:jsdoc/recommended'
  ],
  plugins: ['jsdoc'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    jsdoc: {
      mode: 'typescript',
      tagNamePreference: {
        param: 'param',
        returns: 'returns',
        augments: 'extends'
      }
    }
  },
  rules: {
    // Only type checking rules
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'error',
    'jsdoc/valid-types': 'error',
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-returns-type': 'error',
    'jsdoc/no-undefined-types': 'error',
    // Disable other rules for type checking
    'no-console': 'off',
    'no-unused-vars': 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': 'off',
    'max-len': 'off',
    'indent': 'off',
    'quotes': 'off',
    'semi': 'off',
    'comma-dangle': 'off',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'space-before-function-paren': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-description': 'off'
  }
};
