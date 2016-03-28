import {expect} from 'chai'

import determineFold from '../../src/convert/determine-fold'

describe('determineFold', function () {
  describe('with media fold', function () {
    const fixture =
      [
        { type: 'h1'
        , html: '<h1>heading 1</h1>'
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
        [ { type: 'h1'
          , html: '<h1>heading 1</h1>'
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

  describe('with title fold', function () {
    const fixture =
      [ { type: 'h1'
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
        { type: 'h1'
        , html: '<h1>heading 1</h1>'
        , metadata: {starred: true}
        }
      , content:
        [ { id: 'image-0000'
          , type: 'image'
          , cover: {src: 'https://fo.co/i.jpg'}
          }
        , {type: 'text', html: '<p>paragraph 0</p>'}
        , {type: 'list', html: '<ul><li>li 1</li></ul>'}
        , {id: 'image-0001', type: 'image'}
        , {type: 'text', html: '<p>paragraph 1</p>'}
        ]
      }

    it('correctly finds heading', function () {
      const folded = determineFold(fixture)
      expect(folded).to.deep.equal(expected)
    })
  })

  describe('with placeholder fold', function () {
    const fixture =
      [ { id: '000', type: 'placeholder' }
      , { type: 'h1', html: '<h1>heading 1</h1>' }
      , { type: 'text', html: '<p>paragraph 0</p>' }
      , { type: 'text', html: '<p>paragraph 1</p>' }
      ]
    const expected =
      { media:
        { id: '000', type: 'placeholder' }
      , content:
        [ { type: 'h1', html: '<h1>heading 1</h1>' }
        , { type: 'text', html: '<p>paragraph 0</p>' }
        , { type: 'text', html: '<p>paragraph 1</p>' }
        ]
      }

    it('correctly finds heading', function () {
      const folded = determineFold(fixture)
      expect(folded).to.deep.equal(expected)
    })
  })

  describe('with local (blob/data) image preview', function () {
    const fixture =
      [ { id: '0000', type: 'image' }
      , { type: 'h1', html: '<h1>heading 1</h1>' }
      , { type: 'text', html: '<p>paragraph 0</p>' }
      , { type: 'text', html: '<p>paragraph 1</p>' }
      ]
    const previews = {'0000': 'blob://...'}
    const expected =
      { media:
        { id: '0000', type: 'image' }
      , content:
        [ { type: 'h1', html: '<h1>heading 1</h1>' }
        , { type: 'text', html: '<p>paragraph 0</p>' }
        , { type: 'text', html: '<p>paragraph 1</p>' }
        ]
      }

    it('correctly finds fold media', function () {
      const folded = determineFold(fixture, previews)
      expect(folded).to.deep.equal(expected)
    })
  })
})
