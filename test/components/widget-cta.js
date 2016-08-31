import {expect} from 'chai'

import {extractLink} from '../../src/components/widget-cta'


describe('WidgetCta', function () {
  describe('extract iframe src', function () {
    it('gives expected tag and link with iframe html string', function () {
      const extract = extractLink('<iframe src="https://embed..."></iframe>')
      expect(extract).to.deep.equal({tag: 'iframe', link: 'https://embed...'})
    })
    it('gives expected tag and link with iframe html string with other text', function () {
      const extract = extractLink('abc <iframe src="https://embed..."></iframe> abc')
      expect(extract).to.deep.equal({tag: 'iframe', link: 'https://embed...'})
    })
    it('gives expected tag and link, case-insensitive', function () {
      const extract = extractLink('<IFRAME SRc="https://embed..."></IFRAME>')
      expect(extract).to.deep.equal({tag: 'iframe', link: 'https://embed...'})
    })
  })
  describe('extract a href', function () {
    it('gives expected tag and link with `a` html string', function () {
      const extract = extractLink('<a href="https://pay...">buy now</a>')
      expect(extract).to.deep.equal({tag: 'a', link: 'https://pay...'})
    })
    it('gives expected tag and link with `a` html string with other text', function () {
      const extract = extractLink('abc <a href="https://pay...">buy now</a> abc')
      expect(extract).to.deep.equal({tag: 'a', link: 'https://pay...'})
    })
    it('gives expected tag and link, case-insensitive', function () {
      const extract = extractLink('<A hREf="https://pay...">buy now</A>')
      expect(extract).to.deep.equal({tag: 'a', link: 'https://pay...'})
    })
  })
  describe('extract first link', function () {
    it('gives first `a` with both in html string', function () {
      const extract = extractLink('<a href="https://pay...">buy now</a> fff <iframe src="https://embed..."></iframe>')
      expect(extract).to.deep.equal({tag: 'a', link: 'https://pay...'})
    })
    it('gives first iframe with both in html string', function () {
      const extract = extractLink('<iframe src="https://embed..."></iframe> fff <a href="https://pay...">buy now</a>')
      expect(extract).to.deep.equal({tag: 'iframe', link: 'https://embed...'})
    })
  })
  describe('extract from @qfox\' weird cases', function () {
    it('gives expected with spaces', function () {
      const extract = extractLink('< iframe src = "https://embed..."></iframe>')
      expect(extract).to.deep.equal({tag: 'iframe', link: 'https://embed...'})
    })
    it('gives expected with no quotes', function () {
      const extract = extractLink('<iframe src=https://embed... other="hmm"></iframe>')
      expect(extract).to.deep.equal({tag: 'iframe', link: 'https://embed...'})
    })
    it('gives expected with spaces and no quotes', function () {
      const extract = extractLink('<  iframe  src   =   https://embed... other="hmm"></iframe>')
      expect(extract).to.deep.equal({tag: 'iframe', link: 'https://embed...'})
    })
  })
  describe('extract without http in link', function () {
    it('gives null', function () {
      const extract = extractLink('<iframe src="/foo"></iframe>')
      expect(extract).to.be.null
    })
  })
  describe('extract without a or iframe', function () {
    it('gives null', function () {
      const extract = extractLink('abc <img src="http://img..." /> 123')
      expect(extract).to.be.null
    })
  })
})
