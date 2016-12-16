require('./media.css')

import {isMediaType} from '../convert/types'

export const media =
  { isLeaf: true,
    draggable: true,
    attrs:
    { id: {},
      type: {},
      widget: {},
      initialHeight: {default: 72},
      initialFocus: {default: false},
    },
    parseDOM:
    [ { tag: 'div[grid-type]',
      getAttrs (dom) {
        const id = dom.getAttribute('grid-id')
        const type = dom.getAttribute('grid-type')
        const widget = dom.getAttribute('grid-widget')
        const initialHeight = dom.getAttribute('grid-initial-height')
        if (id && type && isMediaType(type)) {
          return {id, type, widget, initialHeight}
        }
        return false
      },
    } ],
    toDOM (node) {
      const {id, type, widget, initialHeight, initialFocus} = node.attrs
      return ['div',
        { 'class': 'EdSchemaMedia',
          'grid-id': id,
          'grid-type': type,
          'grid-widget': widget,
          'grid-initial-focus': initialFocus,
          'grid-initial-height': initialHeight,
          'style': `height: ${initialHeight}px;`,
        },
      ]
    },
  }
