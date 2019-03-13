const CleanWebpackPlugin = require('clean-webpack-plugin')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

function getTemplate(target, view) {
  const absTarget = path.resolve(__dirname, target)
  if (fs.existsSync(path.join(absTarget, view, 'index.pug'))) { return `pug-loader?pretty!${path.join(absTarget, view, 'index.pug')}` }
  if (fs.existsSync(path.join(absTarget, view, 'index.html'))) { return path.join(absTarget, view, 'index.html') }
  return undefined
}

const { NODE_ENV, USE_REACT } = process.env
const TARGET = '.'
const isProduction = NODE_ENV === 'production'
if (!TARGET) throw new Error('Must set env variable TARGET but is', TARGET)
const SOURCE_DIRNAME = 'src'
const VIEW_DIRNAME = 'view'
const OUTPUT_DIRNAME = 'dist'
const STATIC_DIRNAME = 'static'
const TEMPLATE = getTemplate(TARGET, VIEW_DIRNAME)

const plugins = [
  new CleanWebpackPlugin([path.join(TARGET, OUTPUT_DIRNAME)], {
    roor: path.resolve(__dirname, TARGET),
    verbose: true,
  }),
  new HtmlWebpackPlugin(Object.assign({
    minify: false,
  }, TEMPLATE ? { template: TEMPLATE } : { title: 'Development' }))
]

if (NODE_ENV === 'production') {
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: `./${TARGET}/${SOURCE_DIRNAME}/main.js`,
  output: {
    path: path.resolve(__dirname, TARGET, OUTPUT_DIRNAME),
    filename: '[name]-[hash].js',
  },
  resolve: USE_REACT ? {
    symlinks: false,
  } : {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      // Not necessary unless you consume a module using `createClass`
      'create-react-class': 'preact-compat/lib/create-react-class',
      // Not necessary unless you consume a module requiring `react-dom-factories`
      'react-dom-factories': 'preact-compat/lib/react-dom-factories'
    },
    symlinks: false,
  },
  devServer: {
    contentBase: [
      path.resolve(__dirname, TARGET, STATIC_DIRNAME),
      path.resolve(__dirname, TARGET, VIEW_DIRNAME)
    ],
    hot: true,
    watchContentBase: true,
  },
  devtool: isProduction ? false : 'eval-source-map',
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              targets: {
                browsers: ['>1%', 'ie >= 9']
              }
            }]
          ],
          plugins: [
            'syntax-dynamic-import',
            'transform-react-jsx',
            'transform-class-properties',
            'transform-object-rest-spread'
          ]
        }
      }
    },
    {
      test: /\.(sass|scss)$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            hmr: !isProduction,
          }
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: !isProduction,
            localIdentName: '[name]_[local]-[hash:base64:6]',
            importLoaders: 2,
            modules: true,
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: !isProduction,
            plugins: [
              require('autoprefixer')({
                browsers: ['>1%', 'ie >= 9']
              })
            ]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: !isProduction,
            sourceMapContents: false,
          }
        },
      ]
    },
    {
      test: /\.(jpe?g|png|gif|svg|mp4)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            /*
              Use `file-loader` as default fallback.
              Options below are for `file-loader`.
              For example: 
              Give `import picture from '../static/picture.png'`
              The `picture` will be resolve into 
            */
            publicPath: `https://storage.googleapis.com/twreporter-infographics/embedded-items`,
            name: '[path][name].[ext]',
            emitFile: false,
          },
        }
      ]
    }]
  },
  plugins,
}

module.exports = config
