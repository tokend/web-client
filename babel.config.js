module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    'syntax-dynamic-import',
    '@babel/proposal-unicode-property-regex',
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
  ],
}
