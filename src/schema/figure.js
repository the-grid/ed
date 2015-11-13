import {Block, Attribute} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'

export function makeFigureDom (attrs) {
  let {src, title, description} = attrs
  if (!src) return
  let element = elt('figure', {contenteditable: false, spellcheck: false},
    elt('img', {src}),
    elt('figcaption', {},
      elt('h1', {}, (title || '')),
      elt('p', {}, (description || ''))
    )
  )
  return element
}

export class Figure extends Block {}
Figure.attributes = {
  src: new Attribute('src'),
  title: new Attribute('title'),
  description: new Attribute('description')
}

Figure.register('parseDOM', {
  tag: 'figure',
  rank: 25,
  parse: (dom, context, nodeType) => {
    let src = dom.querySelector('img').src
    let title = dom.querySelector('h1').innerHTML
    let description = dom.querySelector('p').innerHTML
    if (!src) return false
    context.insert(nodeType.create({src, title, description}))
  }
})
Figure.prototype.serializeDOM = node => makeFigureDom(node.attrs)

export class FigCaption extends Block {}
FigCaption.register('parseDOM', {tag: 'figcaption', rank: 1})
