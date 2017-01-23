import {expect} from 'chai'
import {mountApp, unmountApp} from '../../src/ed'


describe('PluginWidget + featureFlags', function () {
  let mount, commands
  const fixture =
    [ {type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true}}
    , { id: '0000'
      , type: 'cta'
      , metadata: {starred: true}
      }
    ]

  describe('without feature flags', function () {
    beforeEach(function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)
      mountApp(mount
      , { initialContent: fixture
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        , onRequestCoverUpload: function () {}
        , featureFlags: {}
        , onCommandsChanged: function (c) { commands = c }
        , onMount:
            function (p) {
              done()
            }
        }
      )
    })
    afterEach(function () {
      unmountApp(mount)
      mount.parentNode.removeChild(mount)
    })

    it('does not have the class', function () {
      const els = document.body.querySelectorAll('div[grid-id="0000"]')
      expect(els.length).to.equal(2)
      const el = document.body.querySelector('.FlaggedWidget')
      expect(el).to.not.exist
    })

    it('has command enabled', function () {
      expect(commands.ed_add_cta).to.equal('inactive')
    })
  })

  describe('with feature flags', function () {
    beforeEach(function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)
      mountApp(mount
      , { initialContent: fixture
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        , onRequestCoverUpload: function () {}
        , featureFlags: { edCta: false }
        , onCommandsChanged: function (c) { commands = c }
        , onMount:
            function (p) {
              done()
            }
        }
      )
    })
    afterEach(function () {
      unmountApp(mount)
      mount.parentNode.removeChild(mount)
    })

    it('has the class', function () {
      const els = document.body.querySelectorAll('div[grid-id="0000"]')
      expect(els.length).to.equal(2)
      const el = document.body.querySelector('.FlaggedWidget')
      expect(el).to.exist
    })

    it('has command flagged', function () {
      expect(commands.ed_add_cta).to.equal('flagged')
    })
  })
})
