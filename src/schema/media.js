require('./media.css')

import {Block, Attribute} from 'prosemirror/src/model'
import {NodeKindTop} from './ed-nodes'

export class Media extends Block {
  get kind () { return NodeKindTop }
  get contains () { return null }
  get isBlock () { return true }
  get locked () { return true }
  get canBeEmpty () { return true }
  get draggable () { return true }
  get attrs () {
    return (
      { id: new Attribute()
      , type: new Attribute()
      , height: new Attribute({default: 50})
      }
    )
  }
}
Media.register('parseDOM', 'div'
, { tag: 'div'
  , rank: 9999
  , parse: function (dom, state) {
    const id = dom.getAttribute('grid-id')
    const type = dom.getAttribute('grid-type')
    if (!id || !type) {
      return false
    }
    state.insert(this, {id, type})
  }
  }
)
Media.prototype.serializeDOM = (node, s) => {
  const {id, type, height} = node.attrs
  if (!id) {
    throw new Error('Can not serialize Media div without id')
  }
  if (!type) {
    throw new Error('Can not serialize Media div without type')
  }
  return s.elt('div'
  , { class: 'EdSchemaMedia'
    , 'grid-id': id
    , 'grid-type': type
    , style: `height: ${height};`
    }
  )
}
