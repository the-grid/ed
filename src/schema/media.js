import {Block, Textblock, Attribute} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'

export function makeMediaDom (attrs) {
  let {title, description} = attrs
  let element = elt('div', {},
    elt('h1', {}, (title || '')),
    elt('p', {}, (description || ''))
  )
  return element
}

export class Media extends Block {}
Media.attributes = {
  title: new Attribute('title'),
  description: new Attribute('description')
}

Media.register('parseDOM', {
  tag: 'div',
  rank: 1,
  parse: (dom, context, nodeType) => {
    let title = dom.querySelector('h1')
    title = title ? title.innerHTML : ''
    let description = dom.querySelector('p')
    description = description ? description.innerHTML : ''
    context.insert(nodeType.create({title, description}))
  }
})
Media.prototype.serializeDOM = node => makeMediaDom(node.attrs)
