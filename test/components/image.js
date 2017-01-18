import {expect} from 'chai'

import Image from '../../src/components/image'

function expectImage (image, src) {
  expect(image.type).to.equal('div')
  expect(image.props.className).to.equal('Image')
  expect(image.props.children.type).to.equal('img')
  expect(image.props.children.props.src).to.equal(src)
}


describe('Image', function () {
  describe('without imageflo', function () {
    it('gives expected output', function () {
      const props = {src: 'http://a.com/b.jpg'}
      const image = Image(props)
      expectImage(image, 'http://a.com/b.jpg')
    })
  })

  describe('with imageflo', function () {
    const context =
      { imgfloConfig:
      { server: 'https://iflo.grid/',
        key: 'abc',
        secret: '123',
      },
      }

    const urlAvatar = 'https://iflo.grid/graph/abc/12ecaddb783ca3f911391be0a6f9d718/passthrough.jpg?input=http%3A%2F%2Fa.com%2Fb.jpg&width=72'
    const urlLandscape = 'https://iflo.grid/graph/abc/ef734866cd7274c6d2eecd9999df378e/passthrough.jpg?input=http%3A%2F%2Fa.com%2Fb.jpg&width=216'
    const urlPortrait = 'https://iflo.grid/graph/abc/ed6bf64e851143e44f6bafedab7cf7b1/passthrough.jpg?input=http%3A%2F%2Fa.com%2Fb.jpg&width=144'

    it('without dimensions gives expected output', function () {
      const props = {
        src: 'http://a.com/b.jpg',
      }
      const image = Image(props, context)
      expectImage(image, urlLandscape)
    })

    it('with landscape dimensions gives expected output', function () {
      const props =
        { src: 'http://a.com/b.jpg',
          width: 1000,
          height: 500,
        }
      const image = Image(props, context)
      expectImage(image, urlLandscape)
    })

    it('with small landscape dimensions gives expected output', function () {
      const props =
        { src: 'http://a.com/b.jpg',
          width: 500,
          height: 300,
        }
      const image = Image(props, context)
      expectImage(image, urlLandscape)
    })

    it('with tiny dimensions gives expected output', function () {
      const props =
        { src: 'http://a.com/b.jpg',
          width: 72,
          height: 72,
        }
      const image = Image(props, context)
      expectImage(image, urlAvatar)
    })

    it('with portrait dimensions gives expected output', function () {
      const props =
        { src: 'http://a.com/b.jpg',
          width: 500,
          height: 1000,
        }
      const image = Image(props, context)
      expectImage(image, urlPortrait)
    })
  })
})
