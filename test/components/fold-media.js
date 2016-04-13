import {expect} from 'chai'

import Ed from '../../src/ed'


describe('FoldMedia', function () {
  let mount, ed

  function $ (query) {
    return ed.container.querySelector(query)
  }

  function $$ (query) {
    return ed.container.querySelectorAll(query)
  }

  describe('Content mounting and merging', function () {
    beforeEach(function (done) {
      mount = document.createElement('div')
      document.body.appendChild(mount)
      ed = new Ed(
        { container: mount
        , initialContent: []
        , onChange: function () {}
        , onShareUrl: function () {}
        , onShareFile: function () {}
        }
      )
      done()
    })
    afterEach(function () {
      ed.teardown()
    })

    it('on mount it has empty fold textarea', function () {
      const area = $('.FoldMedia textarea')
      expect(area.value).to.equal('')
    })

    it('on "add link" it has expected content', function () {
      const area = $('.FoldMedia textarea')
      area.value = 'Hello http://meemoo.org/'
      const moreButton = $$('.FoldMedia-Buttons button')[0]
      moreButton.click()
      const content = ed.getContent()

      expect(content.length).to.equal(3)
      expect(content[0].type).to.equal('placeholder')
      expect(content[0].metadata.status).to.equal('Sharing... http://meemoo.org/')
      expect(content[1].type).to.equal('text')
      expect(content[1].html).to.equal('<p>Hello</p>')
      expect(content[2].type).to.equal('text')
      expect(content[2].html).to.equal('<p></p>')
    })

    it('on "add more" it has expected content', function () {
      const area = $('.FoldMedia textarea')
      area.value = 'Hello'
      const moreButton = $$('.FoldMedia-Buttons button')[2]
      moreButton.click()
      const content = ed.getContent()

      expect(content.length).to.equal(2)
      expect(content[0].type).to.equal('h1')
      expect(content[0].html).to.equal('<h1>Hello</h1>')
      expect(content[1].type).to.equal('text')
      expect(content[1].html).to.equal('<p></p>')
    })
  })
})
