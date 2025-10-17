module.exports = {
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      process: 'readonly',
      require: 'readonly',
      module: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      console: 'readonly',
      Buffer: 'readonly',
      global: 'readonly',
      setTimeout: 'readonly',
      setInterval: 'readonly',
      clearTimeout: 'readonly',
      clearInterval: 'readonly',
      describe: 'readonly',
      it: 'readonly',
      test: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly'
    }
  },
  plugins: {
    jsdoc: require('eslint-plugin-jsdoc')
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
    'no-console': 'on',
    'no-unused-vars': 'on',
    'class-methods-use-this': 'off',
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
    'no-var': 'off',
    'prefer-const': 'off',
    'prefer-arrow-callback': 'off',
    'arrow-spacing': 'off',
    'no-duplicate-imports': 'off',
    'no-useless-constructor': 'off',
    'no-useless-return': 'off',
    'prefer-template': 'off',
    'template-curly-spacing': 'off',
    'object-shorthand': 'off',
    'prefer-destructuring': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/order': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-description': 'off'
  }
};
