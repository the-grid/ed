var path = require('path')

process.env.KARMA = 'true'
var webpackConf = require('./webpack.config.js')


module.exports = function (config) {
  var cfg =
    { browsers: ['Chrome', 'Firefox']
    , files: ['./test/index.js']
    , frameworks: ['chai', 'mocha']
    , plugins:
      [ 'karma-browserstack-launcher'
      , 'karma-chrome-launcher'
      , 'karma-chai'
      , 'karma-firefox-launcher'
      , 'karma-mocha'
      , 'karma-mocha-reporter'
      , 'karma-sourcemap-loader'
      , 'karma-webpack'
      ]
    , preprocessors: 
      { 'test/index.js': ['webpack', 'sourcemap']
      }
    , reporters: ['mocha']
    , singleRun: true
    , webpack: webpackConf
    , webpackMiddleware: { noInfo: true }
    , browserDisconnectTimeout: 10*1000
    , browserDisconnectTolerance: 1
    , browserNoActivityTimeout: 60*1000
    , captureTimeout: 2*60*1000
    }

  if (process.env.TRAVIS) {
    cfg.customLaunchers =
      { Chrome_travis_ci:
        { base: 'Chrome'
        , flags: ['--no-sandbox']
        }
      }
    cfg.browsers = ['Chrome_travis_ci', 'Firefox']
  }

  // if (process.env.BROWSERSTACK_USERNAME && process.env.BROWSERSTACK_ACCESSKEY) {
  //   cfg.browserStack =
  //     { username: process.env.BROWSERSTACK_USERNAME
  //     , accessKey: process.env.BROWSERSTACK_ACCESSKEY
  //     }
  //   if (!cfg.customLaunchers) cfg.customLaunchers = {}
  //   cfg.customLaunchers.iOS8 =
  //     { base: 'BrowserStack'
  //     , device: 'iPhone 6'
  //     , os: 'ios'
  //     , os_version: '8.3'
  //     }
  //   cfg.browsers.push('iOS8')

  //   cfg.customLaunchers.iOS9 =
  //     { base: 'BrowserStack'
  //     , device: 'iPhone 6S'
  //     , os: 'ios'
  //     , os_version: '9.0'
  //     }
  //   cfg.browsers.push('iOS9')

  //   cfg.customLaunchers.Android4 =
  //     { base: 'BrowserStack'
  //     , device: 'Samsung Galaxy S5'
  //     , os: 'android'
  //     , os_version: '4.4'
  //     }
  //   cfg.browsers.push('Android4')

  //   // cfg.customLaunchers.Android5 =
  //   //   { base: 'BrowserStack'
  //   //   , device: 'Google Nexus 5'
  //   //   , os: 'android'
  //   //   , os_version: '5.0'
  //   //   }
  //   // cfg.browsers.push('Android5')
  // }

  config.set(cfg)
}
