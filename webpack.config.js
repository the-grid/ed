webpack = require('webpack')
path = require('path')
var __DEV = (process.env.DEV === 'true')
var __DEMO = (process.env.DEMO === 'true')

var entry = {}
var plugins = []

if (__DEV || __DEMO) {
  entry.demo = './demo/demo.js'
} else {
  entry.ed = './src/index.js'
  // plugins.push( new webpack.optimize.UglifyJsPlugin() )
}

module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: './lib/',
    publicPath: '/webpack/',
    filename: '[name].js',
    library: 'TheGridEd'
  },
  debug: __DEV,
  devtool: (__DEV ? 'cheap-module-eval-source-map' : null),
  module: {
    loaders: [
      {
        test: /\.js$/, 
        loader: 'babel-loader', 
        include: [
          path.resolve(__dirname, 'demo'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules', 'prosemirror')
        ],
      },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
}
