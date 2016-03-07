import {expect} from 'chai'

import determineFold from '../../src/convert/determine-fold'

describe('determineFold', function () {
  describe('with basic content', function () {
    const fixture =
      [
        { type: 'h1'
        , html: '<h1>heading 1</h1>'
        , metadata: {starred: true}
        }
      , { id: 'image-0000'
        , type: 'image'
        , cover: {src: 'https://fo.co/i.jpg'}
        }
      , {type: 'text', html: '<p>paragraph 0</p>'}
      , {type: 'list', html: '<ul><li>li 1</li></ul>'}
      , {id: 'image-0001', type: 'image'}
      , {type: 'text', html: '<p>paragraph 1</p>'}
      ]
    const expected =
      { media:
        { id: 'image-0000'
        , type: 'image'
        , cover: {src: 'https://fo.co/i.jpg'}
        }
      , content:
      [
          { type: 'h1'
          , html: '<h1>heading 1</h1>'
          , metadata: {starred: true}
          }
        , {type: 'text', html: '<p>paragraph 0</p>'}
        , {type: 'list', html: '<ul><li>li 1</li></ul>'}
        , {id: 'image-0001', type: 'image'}
        , {type: 'text', html: '<p>paragraph 1</p>'}
      ]
      }

    it('correctly finds media', function () {
      const folded = determineFold(fixture)
      expect(folded).to.deep.equal(expected)
    })
  })
})
