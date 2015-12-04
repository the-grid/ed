import {Block, Textblock, Attribute} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {parseWrap, wrapIn} from './utils'

// From Grid
// TODO convert just img blocks to figure; leave figure blocks
export function makeFigureDom (attrs) {
  let {src, title, description} = attrs
  if (!src) return
  let element = elt('figure', {},
    elt('img', {src}),
    elt('figcaption', {},
      elt('h1', {}, (title || '')),
      elt('p', {}, (description || ''))
    )
  )
  return element
}

// Schema
export class Figure extends Block {}
Figure.register('parseDOM', {tag: 'figure', parse: parseWrap})
Figure.prototype.serializeDOM = wrapIn('figure')

export class FigCaption extends Block {}
FigCaption.register('parseDOM', {tag: 'figcaption', parse: parseWrap})
FigCaption.prototype.serializeDOM = wrapIn('figcaption')
