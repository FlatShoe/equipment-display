const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const resolve = dir => {
  return path.join(__dirname, '..', dir)
}
const envMap = {
  production: 'prod',
  development: 'dev',
  test: 'test'
}
let env
if (envMap[process.env.NODE_ENV]) {
  env = require(resolve(`configs/${envMap[process.env.NODE_ENV]}.env.js`))
} else {
  env = require(resolve('configs/dev.env.js'))
}

module.exports = () => {
  const styleLoader =
    env.NODE_ENV === 'development'
      ? 'vue-style-loader'
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../'
          }
        }

  return {
    entry: './src/main.js',
    output: {
      filename: 'js/bundle[name][contenthash].js',
      chunkFilename: 'js/chunk[name][contenthash].js',
      path: resolve('dist')
    },
    module: {
      noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
      rules: [
        {
          test: /\.css$/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: false
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: false
              }
            },
            'sass-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/,
          type: 'asset',
          generator: {
            filename: 'image/[name].[hash:8][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024
            }
          },
          exclude: [resolve('src/assets/svg-sprite')]
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: [resolve('src/assets/svg-sprite')],
          options: {
            symbolId: 'icon-[name]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'media/[name].[hash:8][ext]'
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.m?jsx?$/,
          exclude: /node_modules/,
          use: ['thread-loader', 'babel-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html'
      }),
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              ignore: ['**/.DS_Store', '**/index.html']
            },
            to: 'public'
          }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(env)
      })
    ],
    resolve: {
      fallback: {
        stream: 'stream-browserify'
      },
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': resolve('src')
      },
      extensions: ['.js', '.vue', '.json']
    }
  }
}
