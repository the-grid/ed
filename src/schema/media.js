require('./media.css')

import {Block, Attribute} from 'prosemirror/src/model'

export class Media extends Block {
  static get kinds () { return 'block' }
  get isBlock () { return true }
  get locked () { return true }
  get contains () { return null }
  get canBeEmpty () { return true }
  get attrs () {
    return {
      id: new Attribute(),
      type: new Attribute()
    }
  }
}
Media.register('parseDOM', 'div', {
  tag: 'div',
  rank: 9999,
  parse: function (dom, state) {
    const id = dom.getAttribute('grid-id')
    if (!id) {
      throw new Error('Can not parse Media div without id')
    }
    const type = dom.getAttribute('grid-type')
    if (!type) {
      throw new Error('Can not parse Media div without type')
    }
    state.insert(this, {
      id,
      type
    })
  }
})
Media.prototype.serializeDOM = (node, s) => {
  const {id, type} = node.attrs
  if (!id) {
    throw new Error('Can not serialize Media div without id')
  }
  if (!type) {
    throw new Error('Can not serialize Media div without type')
  }
  return s.elt('div',
    {
      'class': 'EdSchemaMedia',
      'grid-id': id,
      'grid-type': type,
      'contenteditable': 'false'
    }
  )
}
