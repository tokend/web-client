// https://eslint.org/docs/user-guide/configuring

module.exports = {
  plugins: [ "my-eslint-plugin" ],
  rules: {
    // 0 off, 1 warning, 2 error
    "my-eslint-plugin/no-template-literals": 1,
  },
  env: {
    mocha: true,
  },
  globals: {
    sinon: true,
    expect: true,
  },
}
