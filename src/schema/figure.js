import {Block, Textblock, Attribute, Pos} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {wrapIn} from './utils'

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
