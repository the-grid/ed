import {expect} from 'chai'

import BlockMeta from '../../src/schema/block-meta'


describe('BlockMeta', function () {
  it('has expected types', function () {
    expect(BlockMeta).to.have.all.keys([
      'image', 'video', 'quote', 'default'
    ])
  })
})
