import {Block, Textblock, Attribute} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {parseWrap, wrapIn} from './utils'

export function makeMediaDom (attrs) {
  let {title, description} = attrs
  let element = elt('div', {},
    elt('p', {}, (description || ''))
  )
  return element
}

export class Media extends Block {}
Media.register('parseDOM', {tag: 'div', parse: parseWrap})
Media.prototype.serializeDOM = wrapIn('div')