import {expect} from 'chai'
import {mountApp, unmountApp} from '../../src/ed'


describe('PluginWidget', function () {
  let mount, ed
  const fixture = [
    {type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true}},
    { id: '0001',
      type: 'placeholder',
      metadata: {starred: true},
    },
    {type: 'text', html: '<p>Text</p>', metadata: {starred: true}},
    { id: '0000',
      type: 'placeholder',
      metadata: {starred: true},
    },
    {type: 'text', html: '<p>Text</p>', metadata: {starred: true}},
  ]

  beforeEach(function (done) {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    ed = mountApp(mount, {
      initialContent: fixture,
      onChange: function () {},
      onShareUrl: function () {},
      onShareFile: function () {},
      onRequestCoverUpload: function () {},
      onMount: function (p) {
        done()
      },
    }
    )
    ed.updateProgress('0001', {status: 'Status'})
    ed.updateProgress('0000', {status: 'Status'})
  })
  afterEach(function () {
    unmountApp(mount)
    mount.parentNode.removeChild(mount)
  })

  describe('Content mounting and merging', function () {
    it('has expected pm document', function () {
      const content = ed.pm.editor.state.doc.content.content
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
      const widget = ed.pm.editor.content.querySelector('.Placeholder')
      const status = widget.querySelector('.Placeholder-status')
      expect(widget).to.exist
      expect(status).to.exist
      expect(status.textContent).to.equal('Status')
    })

    it('updates placeholder widget status via updateProgress', function (done) {
      ed._store.on('media.update.id', function () {
        const status = ed.pm.editor.content.querySelector('.Placeholder-status')
        expect(status.textContent).to.equal('Status changed')
        done()
      })
      ed.updateProgress('0001', {status: 'Status changed'})
    })

    it('updates placeholder widget progress via updateProgress', function (done) {
      const progress = ed.pm.editor.content.querySelector('.Progress')
      expect(progress).to.not.exist
      ed._store.on('media.update.id', function () {
        const progress = ed.pm.editor.content.querySelector('.Progress')
        expect(progress).to.exist
        done()
      })
      ed.updateProgress('0001', {progress: 50})
    })

    it('updates placeholder widget failed true via updateProgress', function (done) {
      const el = ed.pm.editor.content.querySelector('.Placeholder')
      ed._store.on('media.update.id', function () {
        expect(el.classList.contains('Placeholder-error')).to.be.true
        done()
      })
      expect(el.classList.contains('Placeholder-error')).to.be.false
      ed.updateProgress('0001', {failed: true})
    })

    it('changes widget type via setContent', function () {
      ed.setContent([
        { id: '0000',
          type: 'image',
        },
      ])

      // PM doc
      const content = ed.pm.editor.state.doc.content.content
      expect(content[3].textContent).to.equal('')
      expect(content[3].type.name).to.equal('media')
      expect(content[3].attrs.id).to.equal('0000')
      expect(content[3].attrs.type).to.equal('image')

      // React widget
      const el = ed.pm.editor.content.querySelector('.AttributionEditor-image')
      expect(el).to.exist
    })
  })
})
