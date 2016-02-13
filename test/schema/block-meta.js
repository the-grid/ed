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

  describe('Type image', function () {
    it('gives expected html out', function () {
      const html = BlockMeta.image.makeHtml(block.metadata, block.cover)
      expect(html).to.equal(
        `<figure>` +
          `<img src="http://....jpg">` +
          `<figcaption><h1>Title</h1><p>Description</p></figcaption>` +
        `</figure>`
      )
    })
    it('gives html that survives html-flatten', function (done) {
      survivesHtmlFlatten(block, done)
    })
  })

  describe('Type video', function () {
    const video = _.cloneDeep(block)
    video.type = 'video'
    it('gives expected html out', function () {
      const html = BlockMeta.video.makeHtml(video.metadata, video.cover)
      expect(html).to.equal(
        `<figure>` +
          `<img src="http://....jpg">` +
          `<figcaption><h1>Title</h1><p>Description</p></figcaption>` +
        `</figure>`
      )
    })
    it('gives html that survives html-flatten', function (done) {
      survivesHtmlFlatten(video, done)
    })
  })
})


function survivesHtmlFlatten (block, done) {
  let blockToFlatten = _.cloneDeep(block)
  const {type} = block
  const makeHtml = BlockMeta[type].makeHtml
  blockToFlatten.html = makeHtml(block.metadata, block.cover)
  let item = {content: [blockToFlatten]}
  const expected = _.cloneDeep(blockToFlatten)

  const f = new Flatten()
  f.flattenItem(item, function (err) {
    if (err) {
      return done(err)
    }
    let flattened = item.content[0]
    expect(flattened.type).to.equal(expected.type)
    expect(flattened.metadata).to.deep.equal(expected.metadata)
    expect(flattened.cover).to.deep.equal(expected.cover)
    expect(flattened.html).to.equal(expected.html)
    done()
  })
}
