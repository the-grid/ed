import {expect} from 'chai'
import {mountApp, unmountApp} from '../../src/ed'


describe('PluginWidgetIframe', function () {
  let mount, ed, plugin
  const fixture = [
    { id: '0000'
    , type: 'code'
    , html: '<code>hello world;</code>'
    , metadata: {starred: true}
    }
  , { type: 'text', html: '<p>Text</p>', metadata: {starred: true} }
  ]

  beforeEach(function (done) {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    ed = mountApp(mount
    , { initialContent: fixture
      , onChange: function () {}
      , onShareUrl: function () {}
      , onShareFile: function () {}
      , onRequestCoverUpload: function () {}
      , onMount:
          function (p) {
            plugin = p
            done()
          }
      , widgetPath: '../node_modules/'
      // , ref:
      //   function (app) {
      //     ed = app
      //     console.log(ed)
      //   }
      }
    )
  })
  afterEach(function (done) {
    ed._store.on('plugin.widget.one.detach', function () {
      done()
    })
    unmountApp(mount)
    mount.parentNode.removeChild(mount)
  })

  describe('Content mounting and merging', function () {
    it('has expected pm document', function () {
      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(3)
      expect(content[0].textContent).to.equal('')
      expect(content[0].type.name).to.equal('paragraph')
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[2].textContent).to.equal('Text')
      expect(content[2].type.name).to.equal('paragraph')
    })

    it('has mounted widget', function () {
      const widget = plugin.widgets['0000']
      expect(widget).to.exist
      expect(widget.type).to.equal('code')
      const iframe = widget.el.querySelector('iframe')
      expect(iframe).to.exist
      expect(iframe.src).to.contain('/node_modules/@the-grid/ced/editor/index.html')
    })

    it('calls detach and removes message listener', function () {
      // tested in afterEach
    })
  })
})
