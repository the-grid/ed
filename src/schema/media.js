require('./media.css')

import {Block, Attribute} from 'prosemirror/dist/model'
import {isMediaType} from '../convert/types'

export class Media extends Block {
  get isBlock () { return true }
  get isInline () { return false }
  get isLeaf () { return true }
  get locked () { return true }
  get draggable () { return true }
  get attrs () {
    return (
      { id: new Attribute()
      , type: new Attribute()
      , height: new Attribute({default: 50})
      , initialFocus: new Attribute({default: false})
      }
    )
  }
  get matchDOMTag () {
    return {'div[grid-type]': function (dom) {
      const id = dom.getAttribute('grid-id')
      const type = dom.getAttribute('grid-type')
      if (id && type && isMediaType(type)) {
        return {id, type}
      }
      return false
    }}
  }
  toDOM (node) {
    const {id, type, height, initialFocus} = node.attrs
    return ['div'
    , { 'class': 'EdSchemaMedia'
      , 'grid-id': id
      , 'grid-type': type
      , 'grid-initial-focus': initialFocus
      , 'style': `height: ${height}px;`
      }
    ]
  }
}
