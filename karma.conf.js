var path = require('path')

process.env.KARMA = 'true'
var webpackConf = require('./webpack.config.js')


module.exports = function (config) {
  var cfg = {
    browsers: [ 'Chrome' ],
    files: [
      './test/index.js'
    ],
    frameworks: [ 'chai', 'mocha' ],
    plugins: [
      'karma-chrome-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],
    preprocessors: {
      'test/index.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'dots', 'mocha' ],
    singleRun: true,
    webpack: webpackConf,
    webpackMiddleware: {
      noInfo: true
    }
  }
  
  if (process.env.TRAVIS) {
    cfg.customLaunchers = {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
    cfg.browsers = ['Chrome_travis_ci']
  }
  
  config.set(cfg)
}
