module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: '2.6.5'
      }
    ]
  ],
  plugins: ['transform-vue-jsx']
}
