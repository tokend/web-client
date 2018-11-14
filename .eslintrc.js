// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  extends: [
    'distributed-lab/vue'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  rules: {
    // 0 off, 1 warning, 2 error
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': 1,
    'no-warning-comments': [1, {
      'terms': ['hardcoded'], location: 'anywhere'
    }],
    'no-console': [1, {
      allow: ['warn', 'error']
    }],
    'no-tabs': 2,
    'max-len': [1, {
      'code': 80,
      'comments': 80,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true
    }],
    'vue/max-attributes-per-line': [1, {
      'singleline': 2,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }]
  },
  env: {
    mocha: true
  },
  globals: {
    sinon: true,
    expect: true
  }
}
