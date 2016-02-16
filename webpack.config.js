var webpack = require('webpack')
var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var packageWidgets = require('./package.json').widgets

var __DEV = (process.env.DEV === 'true')
var __DEMO = (process.env.DEMO === 'true')

var entry = {}
var plugins = []
var loaders = [
  {
    test: /\.js$/, 
    loader: 'babel-loader', 
    include: [
      path.resolve(__dirname, 'demo'),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules', 'prosemirror')
    ]
  },
  { test: /\.css$/, loader: 'style?singleton!raw' },
  { test: /\.json$/, loader: 'json-loader' }
]

if (__DEV || __DEMO) {
  entry.demo = './demo/demo.js'
} else {
  entry.ed = './src/ed.js'
}

if (__DEV) {
  entry.test = './test/index.js'
  loaders.push({
    test: /\.js$/, 
    loader: 'mocha-loader!babel-loader',
    include: [
      path.resolve(__dirname, 'test')
    ]
  })
}

if (!__DEV) {
  plugins.push(new webpack.optimize.UglifyJsPlugin())
  var copyPatterns = []

  if (__DEMO) {
    copyPatterns.push({
      from: 'index.html',
      to: 'index.html'
    })
  } else {
    copyPatterns.push({
      from: 'targets/web.html',
      to: 'index.html'
    })
  }
  // Copy iframe widgets to dist, whitelisted files and directories only
  Object.keys(packageWidgets).forEach(function (key) {
    var widget = packageWidgets[key]
    widget.include.forEach(function (include) {
      copyPatterns.push({
        from: 'node_modules/' + key + include,
        to: 'node_modules/' + key + include
      })
    })
  })
  plugins.push(new CopyWebpackPlugin(copyPatterns))
}

module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: './dist/',
    publicPath: '/webpack/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    library: 'TheGridEd'
  },
  debug: __DEV,
  devtool: (__DEV ? 'cheap-module-eval-source-map' : 'source-map'),
  module: {
    loaders: loaders
  },
  resolve: {
    extensions: ['', '.js', '.json', '.css']
  }
}
