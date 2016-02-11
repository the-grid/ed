import {expect} from 'chai'

import BlockMeta from '../../src/schema/block-meta'
import Flatten from 'html-flatten'
import _ from '../../src/util/lodash'

const block = {
  type: 'image',
  metadata: {
    title: 'Title',
    description: 'Description'
  },
  cover: {
    src: 'http://....jpg'
  }
}

describe('BlockMeta', function () {

  it('has all expected types', function () {
    expect(BlockMeta).to.have.all.keys([
      'image', 'video', 'quote', 'article', 'default'
    ])
  })

  it('gives expected html out for image', function () {
    const html = BlockMeta.image.makeHtml(block.metadata, block.cover)
    expect(html).to.equal(
      `<figure>` +
        `<img src="http://....jpg">` +
        `<figcaption><h1>Title</h1><p>Description</p></figcaption>` +
      `</figure>`
    )
  })

  it('gives html that survives html-flatten', function (done) {
    let blockToFlatten = _.clone(block)
    blockToFlatten.html = BlockMeta.image.makeHtml(block.metadata, block.cover)
    let item = {content: [blockToFlatten]}
    const expected = _.cloneDeep(blockToFlatten)

    const f = new Flatten()
    f.flattenItem(item, function (err) {
      if (err) {
        return done(err)
      }
      let flattened = item.content[0]
      expect(flattened.metadata).to.deep.equal(expected.metadata)
      expect(flattened.cover).to.deep.equal(expected.cover)
      expect(flattened.html).to.equal(expected.html)
      done()
    })
  })

})
