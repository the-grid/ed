import {expect} from 'chai'
import {mountApp, unmountApp} from '../../src/ed'


describe('PluginWidget', function () {
  let mount, ed, plugin
  const fixture =
    [ {type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true}}
    , { id: '0001'
      , type: 'placeholder'
      , metadata: {status: 'Status', starred: true}
      }
    , {type: 'text', html: '<p>Text</p>', metadata: {starred: true}}
    , { id: '0000'
      , type: 'placeholder'
      , metadata: {status: 'Status', starred: true}
      }
    , {type: 'text', html: '<p>Text</p>', metadata: {starred: true}}
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
      }
    )
  })
  afterEach(function () {
    unmountApp(mount)
    mount.parentNode.removeChild(mount)
  })

  describe('Content mounting and merging', function () {
    it('has expected pm document', function () {
      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(5)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[1].attrs.id).to.equal('0001')
      expect(content[1].attrs.type).to.equal('placeholder')
      expect(content[2].textContent).to.equal('Text')
      expect(content[2].type.name).to.equal('paragraph')
      expect(content[3].textContent).to.equal('')
      expect(content[3].type.name).to.equal('media')
      expect(content[3].attrs.id).to.equal('0000')
      expect(content[3].attrs.type).to.equal('placeholder')
      expect(content[4].textContent).to.equal('Text')
      expect(content[4].type.name).to.equal('paragraph')
    })

    it('has mounted widget', function () {
      const widget = plugin.widgets['0000']
      const status = widget.el.querySelector('.Placeholder-status')
      expect(widget).to.exist
      expect(widget.type).to.equal('placeholder')
      expect(widget.el.firstChild.classList.contains('Placeholder')).to.be.true
      expect(status.textContent).to.equal('Status')
    })

    it('updates placeholder widget status via setContent', function (done) {
      ed._store.on('media.update', function () {
        const widget = plugin.widgets['0000']
        const status = widget.el.querySelector('.Placeholder-status')
        expect(widget.type).to.equal('placeholder')
        expect(status.textContent).to.equal('Status changed')
        done()
      })
      ed.setContent([
        { id: '0000'
        , type: 'placeholder'
        , metadata: {status: 'Status changed'}
        }
      ])
    })

    it('updates placeholder widget failed via setContent', function (done) {
      const widget = plugin.widgets['0000']
      const el = widget.el.querySelector('.Placeholder')
      ed._store.on('media.update', function () {
        expect(el.classList.contains('Placeholder-error')).to.be.true
        done()
      })
      expect(el.classList.contains('Placeholder-error')).to.be.false
      ed.setContent([
        { id: '0000'
        , type: 'placeholder'
        , metadata: {failed: true}
        }
      ])
    })

    it('updates placeholder widget status via updatePlaceholder', function (done) {
      ed._store.on('media.update', function () {
        const widget = plugin.widgets['0000']
        const status = widget.el.querySelector('.Placeholder-status')
        expect(widget.type).to.equal('placeholder')
        expect(status.textContent).to.equal('Status changed')
        done()
      })
      ed.updatePlaceholder('0000', {status: 'Status changed'})
    })

    it('updates placeholder widget failed true via updatePlaceholder', function (done) {
      const widget = plugin.widgets['0000']
      const el = widget.el.querySelector('.Placeholder')
      ed._store.on('media.update', function () {
        expect(el.classList.contains('Placeholder-error')).to.be.true
        done()
      })
      expect(el.classList.contains('Placeholder-error')).to.be.false
      ed.updatePlaceholder('0000', {failed: true})
    })

    it('changes widget type via setContent', function (done) {
      // Widget change is async
      ed._store.on('plugin.widget.one.initialized', function (id) {
        expect(id).to.equal('0000')

        const widget = plugin.widgets['0000']
        expect(widget).to.exist
        expect(widget.type).to.equal('image')
        expect(widget.el.firstChild.className).to.equal('AttributionEditor')
        done()
      })

      ed.setContent([
        { id: '0000'
        , type: 'image'
        }
      ])

      // PM placeholder change is sync
      const content = ed.pm.doc.content.content
      expect(content[3].textContent).to.equal('')
      expect(content[3].type.name).to.equal('media')
      expect(content[3].attrs.id).to.equal('0000')
      expect(content[3].attrs.type).to.equal('image')
    })
  })
})
