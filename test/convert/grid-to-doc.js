import {expect} from 'chai'

import GridToDoc from '../../src/convert/grid-to-doc'


describe('GridToDoc', function () {
  describe('with full schema', function () {
    const fixture =
      [ {type: 'h1', html: '<h1>heading 1</h1>'}
      , {type: 'h2', html: '<h2>heading 2</h2>'}
      , {type: 'h3', html: '<h3>heading 3</h3>'}
      , {id: 'image-0000', type: 'image'}
      , {type: 'quote', html: '<blockquote>bq</blockquote>'}
      , {id: 'video-0000', type: 'video'}
      , {type: 'text', html: '<p>paragraph 1</p>'}
      ]

    const expected =
      { 'type': 'doc'
      , 'content':
        [ { 'type': 'heading'
          , 'attrs': {'level': 1}
          , 'content': [{'type': 'text', 'text': 'heading 1'}]
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
            { 'id': 'image-0000'
            , 'type': 'image'
            , 'height': 50
            }
          }
        , { 'type': 'blockquote'
          , 'content':
            [ { 'type': 'paragraph'
              , 'content': [{'type': 'text', 'text': 'bq'}]
              }
            ]
          }
        , { 'type': 'media'
          , 'attrs':
            { 'id': 'video-0000'
            , 'type': 'video'
            , 'height': 50
            }
          }
        , { 'type': 'paragraph'
          , 'content': [{'type': 'text', 'text': 'paragraph 1'}]
          }
        ]
      }

    it('correctly converts Grid content to Doc', function () {
      const doc = GridToDoc(fixture)
      expect(doc.toJSON()).to.deep.equal(expected)
    })
  })
  describe('with subsequent media blocks', function () {
    const fixture =
      [ {id: 'image-0000', type: 'image'}
      , {id: 'video-0000', type: 'video'}
      ]

    const expected =
      { 'type': 'doc'
      , 'content':
        [ { 'type': 'paragraph' }
        , { 'type': 'media'
          , 'attrs':
            { 'id': 'image-0000'
            , 'type': 'image'
            , 'height': 50
            }
          }
        , { 'type': 'paragraph' }
        , { 'type': 'media'
          , 'attrs':
            { 'id': 'video-0000'
            , 'type': 'video'
            , 'height': 50
            }
          }
        , { 'type': 'paragraph' }
        ]
      }

    it('spaces them with empty paragraphs', function () {
      const doc = GridToDoc(fixture)
      expect(doc.toJSON()).to.deep.equal(expected)
    })
  })
})
