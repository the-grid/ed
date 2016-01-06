import {Block, Inline, Textblock, Attribute, Pos} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {wrapIn} from './utils'

// From Grid
// TODO convert just img blocks to figure; leave figure blocks
export function makeFigureDom (attrs) {
  let {src, title, description} = attrs
  if (!src) return
  //let wrapper= document.createElement('div')
  //wrapper.innerHTML= '<iframe id="player" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1&origin=http://example.com" frameborder="0"></iframe>'
  //wrapper.innerHTML= '<h2>BOODOODOODOD</h2>'
  //wrapper.innerHTML= '<figure><img src="'+ src +'"></figure>'
  //let element = wrapper.firstChild
  
  let element = elt("iframe", {
    src: "http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1&origin=http://example.com",
    type: "text/html",
    width: 650,
    height: 390
  })
  
  //let element = elt('figure', {},
  //  elt('img', {src,'data-test':'hello'}),
  //  elt('figcaption', {},
  //    elt('h1', {}, (title || '')),
  //    elt('p', {}, (description || ''))
  //  )
  //)
  return element
}


export class Figure extends Block {}

Figure.register('parseDOM', {tag: 'figure', parse: 'block'})

Figure.prototype.serializeDOM = wrapIn('figure')

Figure.prototype.isNotEditable = true

// Select on click
Figure.prototype.clicked = (_, path, dom, coords) => Pos.from(path)


 
export class FigCaption extends Block {}

FigCaption.register('parseDOM', {tag: 'figcaption', parse: 'block'})

FigCaption.prototype.serializeDOM = wrapIn('figcaption')

// Select on click
FigCaption.prototype.clicked = (_, path, dom, coords) => Pos.from(path)



export class iFrame extends Block {
  
  get attrs() {
    return {
      src: new Attribute({default: "http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1&origin=http://example.com"}),
      type: new Attribute({default: "text/html"}),
      width: new Attribute({default: 800}),
      height: new Attribute({default: 390 * 800/640})
    }
  }
  
}
iFrame.register('parseDOM', {tag: 'iframe', parse: 'block'})
iFrame.prototype.serializeDOM = (node, s) => s.elt("iframe", {
  src: node.attrs.src,
  type: node.attrs.type,
  width: node.attrs.width,
  height: node.attrs.height
})
iFrame.prototype.isNotEditable = false