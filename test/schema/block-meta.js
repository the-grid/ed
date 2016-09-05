import {expect} from 'chai'
import Flatten from 'html-flatten'
import _ from '../../src/util/lodash'

import BlockMeta from '../../src/schema/block-meta'


describe('BlockMeta', function () {
  it('has expected types', function () {
    expect(BlockMeta).to.have.all.keys([
      'image', 'video', 'quote', 'article', 'cta', 'default'
    ])
  })

  describe('Type image', function () {
    const image =
      { type: 'image'
      , metadata:
        { title: 'Title'
        , caption: 'Description yö'
        }
      , cover:
        { src: 'http://....jpg'
        }
      }

    it('gives expected html out', function () {
      const html = BlockMeta.image.makeHtml(image)
      expect(html).to.equal(
        '<img src="http://....jpg" title="Title" alt="Description y&ouml;">'
      )
    })
    it('gives html that survives html-flatten', function (done) {
      survivesHtmlFlatten(image, done)
    })
  })

  describe('Type article', function () {
    const article =
      { type: 'article'
      , metadata:
        { title: 'Title yö'
        , description: 'Description'
        }
      , cover:
        { src: 'http://....jpg'
        }
      }

    it('gives expected html out', function () {
      const html = BlockMeta.article.makeHtml(article)
      expect(html).to.equal(
        '<article>' +
          '<img src="http://....jpg">' +
          '<h1>Title y&ouml;</h1>' +
          '<p>Description</p>' +
        '</article>'
      )
    })
    it('gives html that survives html-flatten', function (done) {
      survivesHtmlFlatten(article, done)
    })
  })

  describe('Type cta', function () {
    const cta =
      { type: 'cta'
      , metadata:
        { label: 'label yö'
        , url: 'http://fff'
        }
      }

    it('gives expected html out', function () {
      const html = BlockMeta.cta.makeHtml(cta)
      expect(html).to.equal(
        '<a href="http://fff" data-role="cta">label y&ouml;</a>'
      )
    })
    it('gives html that survives html-flatten', function (done) {
      survivesHtmlFlatten(cta, done)
    })
  })
})

function survivesHtmlFlatten (block, done) {
  let blockToFlatten = _.cloneDeep(block)
  const {type} = block
  const makeHtml = BlockMeta[type].makeHtml
  blockToFlatten.html = makeHtml(block)
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
