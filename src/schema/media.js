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
      , widget: new Attribute()
      , initialHeight: new Attribute({default: 72})
      , initialFocus: new Attribute({default: false})
      }
    )
  }
  get matchDOMTag () {
    return {'div[grid-type]': function (dom) {
      const id = dom.getAttribute('grid-id')
      const type = dom.getAttribute('grid-type')
      const widget = dom.getAttribute('grid-widget')
      const initialHeight = dom.getAttribute('grid-initial-height')
      if (id && type && isMediaType(type)) {
        return {id, type, widget, initialHeight}
      }
      return false
    }}
  }
  toDOM (node) {
    const {id, type, widget, initialHeight, initialFocus} = node.attrs
    return ['div'
    , { 'class': 'EdSchemaMedia'
      , 'grid-id': id
      , 'grid-type': type
      , 'grid-widget': widget
      , 'grid-initial-focus': initialFocus
      , 'grid-initial-height': initialHeight
      , 'style': `height: ${initialHeight}px;`
      }
    ]
  }
}
