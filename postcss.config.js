module.exports = {
  plugins: {
    'postcss-preset-env': {},
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],
      // 包含不需要被转换
      selectorBlackList: ['-nr'],
      unitPrecision: 3,
      replace: true,
      exclude: /node_modules/i
    }
  },
  parser: 'postcss-scss'
}
