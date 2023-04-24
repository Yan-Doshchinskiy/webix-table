module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:nuxt/recommended',
    '@nuxtjs/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  parser: 'vue-eslint-parser',
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never'
      }
    ],
    'no-console': 'warn',
    'no-debugger': 'warn',
    'import/prefer-default-export': 'off',
    'linebreak-style': 0,
    'no-shadow': 'off',
    'max-len': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'class-methods-use-this': 'off',
    'object-curly-spacing': ['error', 'always'],
    semi: [2, 'always'],
    '@typescript-eslint/explicit-function-return-type': ['warn'],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    'vue/component-definition-name-casing': ['error'],
    'import/no-dynamic-require': ['off'],
    'global-require': ['off'],
    'no-underscore-dangle': 'off',
    'arrow-parens': 'off',
    'require-await': 'off',
    'no-restricted-imports': ['error', 'bignumber.js'],
    '@typescript-eslint/no-unused-vars': 'warn',
    camelcase: 'off',
    'no-await-in-loop': ['warn'],
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': 'warn'
  },
  settings: {
    'import/resolver': {
      nuxt: {
        extensions: ['.ts', '.json', '.js', '.vue']
      }
    }
  }
};
