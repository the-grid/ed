import {expect} from 'chai'

import {mountApp, unmountApp} from '../../src/ed'


describe('PluginPlaceholder', function () {
  let mount, ed
  const fixture =
    [ {type: 'h1', html: '<h1></h1>', metadata: {starred: true}},
     {type: 'text', html: '<p>Text</p>', metadata: {starred: true}},
     {type: 'text', html: '<p></p>', metadata: {starred: true}}
    ]

  beforeEach(function (done) {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    ed = mountApp(mount
    , { initialContent: fixture,
      onChange: function () {},
      onShareUrl: function () {},
      onShareFile: function () {},
      onRequestCoverUpload: function () {}
    }
    )
    ed._store.on('plugin.placeholder.initialized', done)
  })
  afterEach(function () {
    unmountApp(mount)
    mount.parentNode.removeChild(mount)
  })

  describe('Content mounting and merging', function () {
    it('has classes for placeholders', function () {
      const els = ed.pm.content.children
      expect(els[0].classList.contains('empty')).to.be.true
      expect(els[1].classList.contains('empty')).to.be.false
      expect(els[2].classList.contains('empty')).to.be.true
    })
  })
})
