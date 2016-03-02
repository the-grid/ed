import {expect} from 'chai'

import determineFold from '../../src/util/determine-fold'

describe('determineFold', function () {
  describe('with basic content', function () {
    const fixture = [
      {
        type: 'h1',
        html: '<h1>heading 1</h1>',
        metadata: {starred: true}
      },
      {id: 'image-0000', type: 'image'},
      {type: 'text', html: '<p>paragraph 0</p>'},
      {type: 'list', html: '<ul><li>li 1</li></ul>'},
      {id: 'image-0001', type: 'image'},
      {type: 'text', html: '<p>paragraph 1</p>'}
    ]
    const expected = {
      title: {
        type: 'h1',
        html: '<h1>heading 1</h1>',
        metadata: {starred: true}
      },
      media: {id: 'image-0000', type: 'image'},
      fold: [
        {type: 'text', html: '<p>paragraph 0</p>'},
        {type: 'list', html: '<ul><li>li 1</li></ul>'}
      ],
      rest: [
        {id: 'image-0001', type: 'image'},
        {type: 'text', html: '<p>paragraph 1</p>'}
      ]
    }

    it('correctly finds fold', function () {
      const folded = determineFold(fixture)
      expect(folded).to.deep.equal(expected)
    })
  })

  describe('with unstarred h1', function () {
    const fixture = [
      {type: 'text', html: '<p>paragraph 0</p>'},
      {type: 'h1', html: '<h1>heading 1</h1>'},
      {type: 'list', html: '<ul><li>li 1</li></ul>'},
      {type: 'text', html: '<p>paragraph 1</p>'}
    ]
    const expected = {
      title: null,
      media: null,
      fold: [
        {type: 'text', html: '<p>paragraph 0</p>'}
      ],
      rest: [
        {type: 'h1', html: '<h1>heading 1</h1>'},
        {type: 'list', html: '<ul><li>li 1</li></ul>'},
        {type: 'text', html: '<p>paragraph 1</p>'}
      ]
    }

    it('does not change fold / full order', function () {
      const folded = determineFold(fixture)
      expect(folded).to.deep.equal(expected)
    })
  })
})
