module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'jest/globals': true,
    'node': true
  },
  // https://eslint.org/docs/rules/no-process-env
  'globals': {
    'process': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  // https://github.com/yannickcr/eslint-plugin-react/pull/2114/commits/40f25659b9c801131bb0abed2030fdc54d88a074
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    'allowImportExportEverywhere': true,
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'react', 'jest'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'no-console': 0,
    'react/prop-types': 0
  }
}
