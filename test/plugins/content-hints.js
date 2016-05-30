import {expect} from 'chai'

import Ed from '../../src/ed'


describe('PluginContentHints', function () {
  describe('With hints', function () {
    let mount, ed
    const fixture =
      [ {type: 'h1', html: '<h1></h1>', metadata: {starred: true}}
      , {type: 'text', html: '<p>Text</p>', metadata: {starred: true}}
      , {type: 'text', html: '<p></p>', metadata: {starred: true}}
      ]

    beforeEach(function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)
      ed = new Ed(
        { container: mount
        , initialContent: fixture
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        , onRequestCoverUpload: function () {}
        }
      )
      ed.on('plugin.contenthints.initialized', done)
    })
    afterEach(function () {
      ed.teardown()
      mount.parentNode.removeChild(mount)
    })

    it('has buttons for content hints', function () {
      const foldEl = mount.querySelector('.AddFold')
      expect(foldEl).to.exist
      const coverEl = mount.querySelector('.AddCover')
      expect(coverEl).to.exist
    })
  })

  describe('Without fold hint', function () {
    let mount, ed
    const fixture =
      [ {type: 'h1', html: '<h1></h1>', metadata: {starred: true}}
      , {type: 'text', html: '<p>Text</p>', metadata: {starred: true}}
      , {type: 'text', html: '<p></p>', metadata: {starred: false}}
      ]

    beforeEach(function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)
      ed = new Ed(
        { container: mount
        , initialContent: fixture
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        , onRequestCoverUpload: function () {}
        }
      )
      ed.on('plugin.contenthints.initialized', done)
    })
    afterEach(function () {
      ed.teardown()
      mount.parentNode.removeChild(mount)
    })

    it('does not have button for fold hint', function () {
      const foldEl = mount.querySelector('.AddFold')
      expect(foldEl).to.not.exist
      const coverEl = mount.querySelector('.AddCover')
      expect(coverEl).to.exist
    })
  })

  describe('Without cover hint', function () {
    let mount, ed
    const fixture =
      [ {type: 'h1', html: '<h1></h1>', metadata: {starred: true}}
      , {type: 'text', html: '<p>Text</p>', metadata: {starred: true}}
      , {type: 'placeholder', metadata: {starred: true}}
      ]

    beforeEach(function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)
      ed = new Ed(
        { container: mount
        , initialContent: fixture
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        , onRequestCoverUpload: function () {}
        }
      )
      ed.on('plugin.contenthints.initialized', done)
    })
    afterEach(function () {
      ed.teardown()
      mount.parentNode.removeChild(mount)
    })

    it('does not have button for cover hint', function () {
      const foldEl = mount.querySelector('.AddFold')
      expect(foldEl).to.exist
      const coverEl = mount.querySelector('.AddCover')
      expect(coverEl).to.not.exist
    })
  })
})
