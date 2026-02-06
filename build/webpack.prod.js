const base = require('./webpack.base')
const {merge} = require('webpack-merge')
const {ProgressPlugin} = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = merge(base(), {
  mode: 'production',
  optimization: {
    realContentHash: false,
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true
          },
          mangle: {
            safari10: true
          }
        },
        parallel: true,
        extractComments: false
      })
    ]
  },
  plugins: [
    new ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name][contenthash:6].css',
      chunkFilename: 'css/[id][contenthash:6].css'
    }),
    new CompressionPlugin({
      test: /\.(css|js)$/
    }),
    // new BundleAnalyzerPlugin()
  ],
  externals: {
    // lodash: '_',
    // dayjs: 'dayjs',
    // axios: 'axios',
    // echarts: 'echarts'
  }
})
