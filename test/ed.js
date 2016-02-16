import {expect} from 'chai'

import Ed from '../src/ed'


describe('Ed', function () {
  let mount, ed
  const fixture = [
    {type: 'h1', html: '<h1>Title</h1>'},
    {type: 'text', html: '<p>Text 1</p>'},
    {type: 'text', html: '<p>Text 2</p>'}
  ]
  beforeEach(function (done) {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    ed = new Ed({
      container: mount,
      initialContent: fixture
    })
    ed.pm.on('draw', function () {
      done()
    })
  })
  afterEach(function () {
    mount.parentNode.removeChild(mount)
  })

  it('on mount it has expected editable html structure', function () {
    const children = ed.pm.content.children
    expect(children[0].textContent).to.equal('Title')
    expect(children[0].nodeName).to.equal('H1')
    expect(children[1].textContent).to.equal('Text 1')
    expect(children[1].nodeName).to.equal('P')
    expect(children[2].textContent).to.equal('Text 2')
    expect(children[2].nodeName).to.equal('P')
  })
})
