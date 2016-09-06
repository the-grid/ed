import {expect} from 'chai'

import {mountApp, unmountApp} from '../src/ed'


describe('Ed', function () {
  let mount, ed

  describe('Required mounting options', function () {
    beforeEach(function () {
      mount = document.createElement('div')
      document.body.appendChild(mount)
    })
    afterEach(function () {
      unmountApp(mount)
      mount.parentNode.removeChild(mount)
    })

    it('throws without container', function () {
      function no_container () {
        ed = mountApp(null, null)
      }
      expect(no_container).to.throw('Missing container')
    })
    it('throws without props', function () {
      function no_props () {
        ed = mountApp(mount, null)
      }
      expect(no_props).to.throw('Missing props')
    })
    it('throws without props.initialContent', function () {
      function no_initialContent () {
        ed = mountApp(mount
        , { initialContent: null
          , onChange: function () {}
          , onShareUrl: function () {}
          , onShareFile: function () {}
          , onRequestCoverUpload: function () {}
          }
        )
      }
      expect(no_initialContent).to.throw('Missing props.initialContent')
    })
    it('throws without props.onChange', function () {
      function no_onChange () {
        ed = mountApp(mount
        , { initialContent: []
          , onChange: null
          , onShareUrl: function () {}
          , onShareFile: function () {}
          , onRequestCoverUpload: function () {}
          }
        )
      }
      expect(no_onChange).to.throw('Missing props.onChange')
    })
    it('throws without props.onShareUrl', function () {
      function no_onShareUrl () {
        ed = mountApp(mount
        , { initialContent: []
          , onChange: function () {}
          , onShareUrl: null
          , onShareFile: function () {}
          , onRequestCoverUpload: function () {}
          }
        )
      }
      expect(no_onShareUrl).to.throw('Missing props.onShareUrl')
    })
    it('throws without props.onShareFile', function () {
      function no_onShareFile () {
        ed = mountApp(mount
        , { initialContent: []
          , onChange: function () {}
          , onShareUrl: function () {}
          , onShareFile: null
          , onRequestCoverUpload: function () {}
          }
        )
      }
      expect(no_onShareFile).to.throw('Missing props.onShareFile')
    })
    it('throws without props.onRequestCoverUpload', function () {
      function no_onRequestCoverUpload () {
        ed = mountApp(mount
        , { initialContent: []
          , onChange: function () {}
          , onShareUrl: function () {}
          , onShareFile: function () {}
          , onRequestCoverUpload: null
          }
        )
      }
      expect(no_onRequestCoverUpload).to.throw('Missing props.onRequestCoverUpload')
    })
    it('calls props.onMount', function (done) {
      ed = mountApp(mount
      , { initialContent: []
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        , onRequestCoverUpload: function () {}
        , onMount: function () { done() }
        }
      )
    })
  })

  describe('Content mounting and merging', function () {
    const fixture =
      [ {type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true}}
      , {type: 'text', html: '<p>Text 1</p>', metadata: {starred: true}}
      , {type: 'text', html: '<p>Text 2</p>', metadata: {starred: true}}
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
        }
      )
      done()
    })
    afterEach(function () {
      unmountApp(mount)
      mount.parentNode.removeChild(mount)
    })

    it('on mount it has expected editable html structure', function () {
      const children = ed.pm.content.children
      expect(children.length).to.equal(3)
      expect(children[0].textContent).to.equal('Title')
      expect(children[0].nodeName).to.equal('H1')
      expect(children[1].textContent).to.equal('Text 1')
      expect(children[1].nodeName).to.equal('P')
      expect(children[2].textContent).to.equal('Text 2')
      expect(children[2].nodeName).to.equal('P')
    })

    it('it has expected pm document', function () {
      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(3)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('Text 1')
      expect(content[1].type.name).to.equal('paragraph')
      expect(content[2].textContent).to.equal('Text 2')
      expect(content[2].type.name).to.equal('paragraph')
    })

    it('inject placeholder blocks via setContent', function () {
      ed.setContent(
        [ {type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true}}
        , {id: '0000', type: 'placeholder', metadata: {starred: true}}
        , {id: '0001', type: 'placeholder', metadata: {starred: true}}
        , {type: 'text', html: '<p>Text 1</p>', metadata: {starred: true}}
        , {type: 'text', html: '<p>Text 2</p>', metadata: {starred: true}}
        ]
      )
      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(5)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[1].attrs.id).to.equal('0000')
      expect(content[1].attrs.type).to.equal('placeholder')
      expect(content[2].textContent).to.equal('')
      expect(content[2].type.name).to.equal('media')
      expect(content[2].attrs.id).to.equal('0001')
      expect(content[2].attrs.type).to.equal('placeholder')
      expect(content[3].textContent).to.equal('Text 1')
      expect(content[3].type.name).to.equal('paragraph')
      expect(content[4].textContent).to.equal('Text 2')
      expect(content[4].type.name).to.equal('paragraph')
    })

    it('does not overwrite current metadata with stale', function () {
      // Inject new image block
      ed.setContent(
        [ {id: '0000', type: 'image', metadata: {starred: true, title: 'the title'}}
        ]
      )
      let content = ed.getContent()
      expect(content.length).to.equal(4)
      expect(content[0].type).to.equal('image')
      expect(content[0].metadata.title).to.equal('the title')
      // Set stale data, like from API
      ed.setContent(
        [ {id: '0000', type: 'image', metadata: {starred: true, title: 'stale'}}
        ]
      )
      content = ed.getContent()
      expect(content[0].metadata.title).to.equal('the title')
    })

    it('inject placeholder blocks via insertPlaceholders', function () {
      const ids = ed.insertPlaceholders(1, 2)
      expect(ids.length).to.equal(2)

      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(5)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[1].attrs.id).to.equal(ids[0])
      expect(content[1].attrs.type).to.equal('placeholder')
      expect(content[2].textContent).to.equal('')
      expect(content[2].type.name).to.equal('media')
      expect(content[2].attrs.id).to.equal(ids[1])
      expect(content[2].attrs.type).to.equal('placeholder')
      expect(content[3].textContent).to.equal('Text 1')
      expect(content[3].type.name).to.equal('paragraph')
      expect(content[4].textContent).to.equal('Text 2')
      expect(content[4].type.name).to.equal('paragraph')
    })

    it('replace text with placeholder block', function () {
      ed._store._replaceBlock(1,
        { id: '0000'
        , type: 'placeholder'
        , metadata: {starred: true}
        }
      )

      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(3)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[1].attrs.id).to.equal('0000')
      expect(content[1].attrs.type).to.equal('placeholder')
      expect(content[2].textContent).to.equal('Text 2')
      expect(content[2].type.name).to.equal('paragraph')
    })

    it('replace placeholder with image block, should correctly merge', function () {
      ed._store._replaceBlock(1,
        { id: '0000'
        , type: 'placeholder'
        , metadata: {starred: true}
        }
      )
      ed.setContent([
        {id: '0000'
        , type: 'image'
        , metadata: {starred: true}
        }
      ])

      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(3)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[1].attrs.id).to.equal('0000')
      expect(content[1].attrs.type).to.equal('image')
      expect(content[2].textContent).to.equal('Text 2')
      expect(content[2].type.name).to.equal('paragraph')
    })

    it('replace multiple placeholders, should correctly merge', function () {
      const ids = ed.insertPlaceholders(1, 2)
      ed.setContent(
        [ {id: ids[0], type: 'image', metadata: {starred: true}}
        , {id: ids[1], type: 'image', metadata: {starred: true}}
        ]
      )

      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(5)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[1].attrs.type).to.equal('image')
      expect(content[1].attrs.id).to.equal(ids[0])
      expect(content[2].textContent).to.equal('')
      expect(content[2].type.name).to.equal('media')
      expect(content[2].attrs.type).to.equal('image')
      expect(content[2].attrs.id).to.equal(ids[1])
      expect(content[3].textContent).to.equal('Text 1')
      expect(content[3].type.name).to.equal('paragraph')
      expect(content[4].textContent).to.equal('Text 2')
      expect(content[4].type.name).to.equal('paragraph')
    })

    it('cancels placeholder', function () {
      const ids = ed.insertPlaceholders(1, 1)
      ed._store._placeholderCancel(ids[0])

      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(3)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('Text 1')
      expect(content[1].type.name).to.equal('paragraph')
      expect(content[2].textContent).to.equal('Text 2')
      expect(content[2].type.name).to.equal('paragraph')
    })

    describe('Getting content', function () {
      it('outputs content with placeholders', function () {
        const ids = ed.insertPlaceholders(1, 1)
        const content = ed.getContent()
        const expected =
          [ { type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true} }
          , { id: ids[0]
            , type: 'placeholder'
            , metadata: {starred: true}
            }
          , { type: 'text', html: '<p>Text 1</p>', metadata: {starred: true} }
          , { type: 'text', html: '<p>Text 2</p>', metadata: {starred: true} }
          ]
        expect(content).to.deep.equal(expected)
      })

      it('outputs content with replaced placeholders', function () {
        const ids = ed.insertPlaceholders(1, 2)
        ed.setContent(
          [ { id: ids[0]
            , type: 'image'
            , cover: {src: '...a.jpg'}
            }
          , { id: ids[1]
            , type: 'image'
            , cover: {src: '...b.jpg'}
            }
          ]
        )
        const content = ed.getContent()
        const expected =
          [ { type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true} }
          , { id: ids[0]
            , type: 'image'
            , cover: {src: '...a.jpg'}
            , metadata: {starred: true}
            , html: '<img src="...a.jpg">'
            }
          , { id: ids[1]
            , type: 'image'
            , cover: {src: '...b.jpg'}
            , metadata: {starred: true}
            , html: '<img src="...b.jpg">'
            }
          , { type: 'text', html: '<p>Text 1</p>', metadata: {starred: true} }
          , { type: 'text', html: '<p>Text 2</p>', metadata: {starred: true} }
          ]
        expect(content).to.deep.equal(expected)
      })

      it('does not have cancelled placeholder', function () {
        const ids = ed.insertPlaceholders(1, 1)
        ed._store._placeholderCancel(ids[0])
        const content = ed.getContent()
        const expected =
          [ { type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true} }
          , { type: 'text', html: '<p>Text 1</p>', metadata: {starred: true} }
          , { type: 'text', html: '<p>Text 2</p>', metadata: {starred: true} }
          ]
        expect(content).to.deep.equal(expected)
      })

      it('does not have removed block', function () {
        const ids = ed.insertPlaceholders(1, 1)
        ed._store._removeMediaBlock(ids[0])
        const content = ed.getContent()
        const expected =
          [ { type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true} }
          , { type: 'text', html: '<p>Text 1</p>', metadata: {starred: true} }
          , { type: 'text', html: '<p>Text 2</p>', metadata: {starred: true} }
          ]
        expect(content).to.deep.equal(expected)
      })

      it('does not change cover src with encoded url query params', function () {
        const ids = ed.insertPlaceholders(1, 1)
        ed.setContent(
          [ { id: ids[0]
            , type: 'image'
            , cover: {src: 'https://.../noop.jpeg?input=https%3A%2F%2F...%2Fa.jpeg'}
            }
          ]
        )
        const content = ed.getContent()
        const expected =
          [ { type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true} }
          , { id: ids[0]
            , type: 'image'
            , cover: {src: 'https://.../noop.jpeg?input=https%3A%2F%2F...%2Fa.jpeg'}
            , metadata: {starred: true}
            , html: '<img src="https://.../noop.jpeg?input=https%3A%2F%2F...%2Fa.jpeg">'
            }
          , { type: 'text', html: '<p>Text 1</p>', metadata: {starred: true} }
          , { type: 'text', html: '<p>Text 2</p>', metadata: {starred: true} }
          ]
        expect(content).to.deep.equal(expected)
      })
    })
  })

  describe('The Fold', function () {
    const fixture =
      [ {id: '0000', type: 'image', metadata: {starred: true}}
      , {type: 'text', html: '<p>Text 1</p>'}
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
        }
      )
      done()
    })
    afterEach(function () {
      unmountApp(mount)
      mount.parentNode.removeChild(mount)
    })

    describe('Mounting', function () {
      it('splits content correctly', function () {
        const content = ed.getContent()
        const expected =
          [ { id: '0000'
            , type: 'image'
            , metadata: { starred: true }
            , html: '<img>'
            }
          , { type: 'text', html: '<p>Text 1</p>', metadata: {starred: false} }
          ]
        expect(content).to.deep.equal(expected)
      })

      it('gives correct fold index', function () {
        const fold = ed.indexOfFold()
        expect(fold).to.equal(1)
      })
    })
  })

  describe('Command interface', function () {
    let mount, ed
    const fixture =
      [ {type: 'h1', html: '<h1>Title</h1>', metadata: {starred: true}}
      , {type: 'text', html: '<p><a href="moo">link</a></p>', metadata: {starred: true}}
      ]

    afterEach(function () {
      unmountApp(mount)
      mount.parentNode.removeChild(mount)
    })

    it('returns commands on mount', function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)

      function onCommandsChanged (commands) {
        expect(commands['heading:make1']).to.equal('disabled')
        expect(commands['paragraph:make']).to.equal('inactive')
        done()
      }

      ed = mountApp(mount
      , { initialContent: fixture
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        , onRequestCoverUpload: function () {}
        , onCommandsChanged
        }
      )
    })

    it('correctly executes command', function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)

      function onMount () {
        ed.execCommand('paragraph:make')
        const content = ed.getContent()
        expect(content[0].type).to.equal('text')
        done()
      }

      ed = mountApp(mount
      , { initialContent: fixture
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        , onRequestCoverUpload: function () {}
        , onMount
        }
      )
    })

    it('correctly triggers onShareFile', function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)

      function onMount () {
        setTimeout(function () {
          ed.execCommand('ed_upload_image')
        }, 100)
      }

      function onShareFile (index) {
        expect(index).to.equal(0)
        done()
      }

      ed = mountApp(mount
      , { initialContent: fixture
        , onChange: function () {}
        , onShareUrl: function () {}
        , onRequestCoverUpload: function () {}
        , onShareFile
        , onMount
        }
      )
    })
  })
})
