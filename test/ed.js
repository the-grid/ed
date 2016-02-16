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
    expect(children.length).to.equal(3)
    expect(children[0].textContent).to.equal('Title')
    expect(children[0].nodeName).to.equal('H1')
    expect(children[1].textContent).to.equal('Text 1')
    expect(children[1].nodeName).to.equal('P')
    expect(children[2].textContent).to.equal('Text 2')
    expect(children[2].nodeName).to.equal('P')
  })

  it('it has expected pm document', function () {
    const content = ed.pm.doc.content.content
    expect(content.length).to.equal(3)
    expect(content[0].textContent).to.equal('Title')
    expect(content[0].type.name).to.equal('heading')
    expect(content[1].textContent).to.equal('Text 1')
    expect(content[1].type.name).to.equal('paragraph')
    expect(content[2].textContent).to.equal('Text 2')
    expect(content[2].type.name).to.equal('paragraph')
  })
  
  it('replace text with placeholder block', function () {
    ed.replaceBlock(1, {
      id: '0000',
      type: 'placeholder'
    })
    const content = ed.pm.doc.content.content
    expect(content.length).to.equal(3)
    expect(content[0].textContent).to.equal('Title')
    expect(content[0].type.name).to.equal('heading')
    expect(content[1].textContent).to.equal('')
    expect(content[1].type.name).to.equal('media')
    expect(content[1].attrs.type).to.equal('placeholder')
    expect(content[2].textContent).to.equal('Text 2')
    expect(content[2].type.name).to.equal('paragraph')
  })

  it('replace placeholder with image block, should correctly merge', function () {
    ed.replaceBlock(1, {
      id: '0000',
      type: 'placeholder'
    })
    ed.setContent([{
      id: '0000',
      type: 'image'
    }])
    const content = ed.pm.doc.content.content
    expect(content.length).to.equal(3)
    expect(content[0].textContent).to.equal('Title')
    expect(content[0].type.name).to.equal('heading')
    expect(content[1].textContent).to.equal('')
    expect(content[1].type.name).to.equal('media')
    expect(content[1].attrs.type).to.equal('image')
    expect(content[2].textContent).to.equal('Text 2')
    expect(content[2].type.name).to.equal('paragraph')
  })
})
