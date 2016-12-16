import {expect} from 'chai'

import GridToDoc from '../../src/convert/grid-to-doc'


describe('GridToDoc', function () {
  describe('with full schema', function () {
    const fixture =
      [ {id: 'image-0000', type: 'image', metadata: {starred: true}},
       {type: 'h1', html: '<h1>heading 1</h1>', metadata: {starred: true}},
       {type: 'text', html: '<p>paragraph 1</p>', metadata: {starred: true}},
       {type: 'h2', html: '<h2>heading 2</h2>'},
       {type: 'h3', html: '<h3>heading 3</h3>'},
       {id: 'quote-0000', type: 'quote', html: '<blockquote>bq</blockquote>'},
       {id: 'video-0000', type: 'video'},
      ]

    const expected =
      { 'type': 'doc',
        'content':
        [ { 'type': 'paragraph' },
          { 'type': 'media',
            'attrs':
            { 'id': 'image-0000',
              'type': 'image',
              'widget': 'image',
              initialHeight: 72,
              initialFocus: false,
            },
          },
          { 'type': 'heading',
            'attrs': {'level': 1},
            'content': [{'type': 'text', 'text': 'heading 1'}],
          },
          { 'type': 'paragraph',
            'content': [{'type': 'text', 'text': 'paragraph 1'}],
          },
          { 'type': 'horizontal_rule',
          },
          { 'type': 'heading',
            'attrs': {'level': 2},
            'content': [{'type': 'text', 'text': 'heading 2'}],
          },
          { 'type': 'heading',
            'attrs': {'level': 3},
            'content': [{'type': 'text', 'text': 'heading 3'}],
          },
          { 'type': 'media',
            'attrs':
            { 'id': 'quote-0000',
              'type': 'quote',
              'widget': 'quote',
              initialHeight: 72,
              initialFocus: false,
            },
          },
         { 'type': 'paragraph' },
          { 'type': 'media',
            'attrs':
            { 'id': 'video-0000',
              'type': 'video',
              'widget': 'video',
              initialHeight: 72,
              initialFocus: false,
            },
          },
         { 'type': 'paragraph' },
        ],
      }

    it('correctly converts Grid content to Doc', function () {
      const doc = GridToDoc(fixture).toJSON()
      expect(doc).to.deep.equal(expected)
    })
  })
  describe('with no starred blocks', function () {
    const fixture =
      [ {id: 'image-0000', type: 'image', metadata: {starred: false}},
       {id: 'video-0000', type: 'video', metadata: {starred: false}},
      ]

    const expected =
      { 'type': 'doc',
        'content':
        [ { 'type': 'paragraph' },
         { 'type': 'horizontal_rule' },
         { 'type': 'paragraph' },
          { 'type': 'media',
            'attrs':
            { 'id': 'image-0000',
              'type': 'image',
              'widget': 'image',
              initialHeight: 72,
              initialFocus: false,
            },
          },
          { 'type': 'paragraph' },
          { 'type': 'media',
            'attrs':
            { 'id': 'video-0000',
              'type': 'video',
              'widget': 'video',
              initialHeight: 72,
              initialFocus: false,
            },
          },
         { 'type': 'paragraph' },
        ],
      }

    it('spaces with empty paragraphs', function () {
      const doc = GridToDoc(fixture).toJSON()
      expect(doc).to.deep.equal(expected)
    })
  })
})
