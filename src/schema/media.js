import {Block, Textblock, Attribute, Pos} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {wrapIn} from './utils'

export function makeMediaDom (attrs) {
  let {title, description} = attrs
  let element = elt('div', {},
    elt('p', {}, (description || ''))
  )
  return element
}

export class Media extends Block {}

Media.register('parseDOM', {tag: 'div', parse: 'block'})

Media.prototype.serializeDOM = wrapIn('div')

Media.prototype.isNotEditable = true

// Select on click
Media.prototype.clicked = (_, path, dom, coords) => {
  console.log("Media Clicked")
  Pos.from(path)
}