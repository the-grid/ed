import {expect} from 'chai'

import Ed from '../../src/ed'


describe('TapAddText', function () {
  let mount, ed
  const fixture = [
    {type: 'text', html: '<p>existing p</p>'}
  ]

  beforeEach(function (done) {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    ed = new Ed({
      container: mount,
      initialContent: fixture,
      onChange: function () {}
    })
    done()
  })
  afterEach(function () {
    ed.teardown()
    mount.parentNode.removeChild(mount)
  })

  describe('Mounting', function () {
    it('has expected pm document', function () {
      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(1)
      expect(content[0].type.name).to.equal('paragraph')
      expect(content[0].textContent).to.equal('existing p')
    })

    it('has mounted widget', function () {
      const el = ed.pluginContainer.querySelector('.EdTapAddText')
      expect(el).to.exist
    })
  })

  describe('Click', function () {
    it('adds a blank paragraph to end of doc', function (done) {
      ed.onChange = function () {
        const content = ed.pm.doc.content.content
        expect(content.length).to.equal(2)
        expect(content[0].type.name).to.equal('paragraph')
        expect(content[0].textContent).to.equal('existing p')
        expect(content[1].type.name).to.equal('paragraph')
        expect(content[1].textContent).to.equal('')
        done()
      }
      const el = ed.pluginContainer.querySelector('.EdTapAddText')
      el.click()
    })
  })
})
