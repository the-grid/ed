import {expect} from 'chai'

import Ed from '../src/ed'


describe('Ed', function () {
  let mount
  beforeEach(function () {
    mount = document.createElement('div')
    document.body.appendChild(mount)
  })
  afterEach(function () {
    mount.parentNode.removeChild(mount)
  })

  it('on mount it has expected editable html structure', function (done) {
    const fixture = [
      {type: 'h1', html: `<h1>Title</h1>`},
      {type: 'text', html: `<p>Text 1</p>`},
      {type: 'text', html: `<p>Text 2</p>`}
    ]
    const expected =
      `<h1 pm-container="true" pm-offset="0"><span pm-offset="0" pm-leaf="5">Title</span></h1>` +
      `<p pm-container="true" pm-offset="1"><span pm-offset="0" pm-leaf="6">Text 1</span></p>` +
      `<p pm-container="true" pm-offset="2"><span pm-offset="0" pm-leaf="6">Text 2</span></p>`

    const ed = new Ed({
      container: mount,
      initialContent: fixture
    })
    ed.pm.on('draw', function () {
      expect(ed.pm.content.innerHTML).to.equal(expected)
      done()
    })
  })
})
