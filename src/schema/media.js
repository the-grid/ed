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

export class Media extends Block {
  static get kinds() { return 'doc media' }
}
Media.register('parseDOM', {tag: 'div', parse: 'block'})
Media.prototype.serializeDOM = wrapIn('div')
