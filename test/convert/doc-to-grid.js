import {expect} from 'chai'

import {Node} from 'prosemirror/dist/model/node'

import DocToGrid from '../../src/convert/doc-to-grid'
import EdSchemaFull from '../../src/schema/ed-schema-full'


describe('DocToGrid', function () {
  describe('with full schema', function () {
    const content =
      [ {type: 'h1', html: '<h1>heading 1</h1>', metadata: {starred: true}}
      , {id: 'image-0000', type: 'image', metadata: {starred: true}}
      , {type: 'text', html: '<p>paragraph 1</p>', metadata: {starred: true}}
      , { type: 'hr', html: '<hr>', metadata: { starred: false } }
      , {type: 'h2', html: '<h2>heading 2</h2>', metadata: { starred: false }}
      , {type: 'h3', html: '<h3>heading 3</h3>', metadata: { starred: false }}
      , {id: 'video-0000', type: 'video', metadata: {starred: false}}
      ]
    const map = {}
    for (let i = 0, len = content.length; i < len; i++) {
      const block = content[i]
      if (block.id) {
        map[block.id] = block
      }
    }
    const doc =
      { 'type': 'doc'
      , 'content':
        [ { 'type': 'heading'
          , 'attrs': {'level': 1}
          , 'content': [{'type': 'text', 'text': 'heading 1'}]
          }
        , { 'type': 'media'
          , 'attrs':
            { 'id': 'image-0000'
            , 'type': 'image'
            , 'widget': 'image'
            , 'height': 50
            }
          }
        , { 'type': 'paragraph'
          , 'content': [{'type': 'text', 'text': 'paragraph 1'}]
          }
        , { 'type': 'horizontal_rule'
          }
        , { 'type': 'heading'
          , 'attrs': {'level': 2}
          , 'content': [{'type': 'text', 'text': 'heading 2'}]
          }
        , { 'type': 'heading'
          , 'attrs': {'level': 3}
          , 'content': [{'type': 'text', 'text': 'heading 3'}]
          }
        , { 'type': 'media'
          , 'attrs':
            { 'id': 'video-0000'
            , 'type': 'video'
            , 'widget': 'video'
            , 'height': 50
            }
          }
        ]
      }

    it('correctly converts full Doc to Grid content', function () {
      const node = Node.fromJSON(EdSchemaFull, doc)
      const contentOut = DocToGrid(node, map)
      expect(contentOut).to.deep.equal(content)
    })
    it('strips non-whitelisted keys out of blocks (and makes image html)', function () {
      let map =
        { 'image-0000':
          { id: 'image-0000'
          , type: 'image'
          , metadata: {starred: true}
          , foo: 'Wat.'
          , cover:
            { src: 'https://...'
            , width: 10
            , height: 10
            , saliency: 'fff'
            }
          }
        }
      let doc =
        { 'type': 'doc'
        , 'content':
          [ { 'type': 'media'
            , 'attrs':
              { 'id': 'image-0000'
              , 'type': 'image'
              , 'widget': 'image'
              , 'height': 50
              }
            }
          ]
        }
      let expected =
        [ { id: 'image-0000'
          , type: 'image'
          , html: '<img src="https://...">'
          , metadata: {starred: true}
          , cover:
            { src: 'https://...'
            , width: 10
            , height: 10
            }
          }
        ]

      const node = Node.fromJSON(EdSchemaFull, doc)
      const contentOut = DocToGrid(node, map)
      expect(contentOut).to.deep.equal(expected)
    })
  })
})
