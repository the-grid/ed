webpack = require('webpack');
var __DEV = (process.env.DEV === 'true');

var entry = {};
var plugins = [];

if (__DEV) {
  entry.demo = './demo/demo.js';
} else {
  entry.ed = './index.js'
  plugins.push( new webpack.optimize.UglifyJsPlugin() );
}

module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: './build/',
    publicPath: '/webpack-memory/',
    filename: '[name].js',
    library: 'TheGridEd',
    libraryTarget: 'var'
  },
  debug: __DEV,
  devtool: (__DEV ? 'cheap-module-eval-source-map' : null),
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /-dev-server/ },
      { 
        test: /\.js$/,
        loader: "eslint-loader", 
        exclude: /node_modules/
      },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
