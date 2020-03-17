module.exports = {
  presets: ['@vue/app'],
  plugins: [
    'syntax-dynamic-import',
    '@babel/proposal-unicode-property-regex',
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    '@babel/plugin-transform-modules-commonjs',
  ],
}
