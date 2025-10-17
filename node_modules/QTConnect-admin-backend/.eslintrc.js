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
    // Code style rules
    'no-console': 'on',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'class-methods-use-this': 'off',
    'max-len': ['error', { code: 120, ignoreComments: true }],
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-constructor': 'error',
    'no-useless-return': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'object-shorthand': 'error',
    'prefer-destructuring': ['error', {
      array: true,
      object: true
    }, {
      enforceForRenamedProperties: false
    }],
    // Import rules
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always'
    }],
    // JSDoc rules
    'jsdoc/require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
        FunctionExpression: true
      }
    }],
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-description': 'error',
    'jsdoc/require-returns-type': 'error',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'error',
    'jsdoc/valid-types': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-unused-expressions': 'off',
        'jsdoc/require-jsdoc': 'off'
      }
    }
  ]
};
