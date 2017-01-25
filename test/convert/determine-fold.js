import {expect} from 'chai'

import determineFold from '../../src/convert/determine-fold'

describe('determineFold', function () {
  describe('with media fold', function () {
    const fixture =
      [ { id: 'image-0000',
        type: 'image',
        metadata: {starred: true},
      },
      { type: 'h1',
        html: '<h1>heading 1</h1>',
        metadata: {starred: true},
      },
      { type: 'text',
        html: '<p>paragraph 0</p>',
        metadata: {starred: true},
      },
       {type: 'list', html: '<ul><li>li 1</li></ul>'},
       {id: 'image-0001', type: 'image'},
       {type: 'text', html: '<p>paragraph 1</p>'},
      ]
    const expected =
      { starred:
      [ { id: 'image-0000',
        type: 'image',
        metadata: {starred: true},
      },
      { type: 'h1',
        html: '<h1>heading 1</h1>',
        metadata: {starred: true},
      },
      { type: 'text',
        html: '<p>paragraph 0</p>',
        metadata: {starred: true},
      },
      ],
        unstarred:
        [ {type: 'list', html: '<ul><li>li 1</li></ul>'},
         {id: 'image-0001', type: 'image'},
         {type: 'text', html: '<p>paragraph 1</p>'},
        ],
        hasHR: false,
      }

    it('correctly splits content', function () {
      const folded = determineFold(fixture)
      expect(folded).to.deep.equal(expected)
    })
  })
})
