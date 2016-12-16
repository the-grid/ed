require('./media.css')

import {isMediaType} from '../convert/types'

export const media =
  { isLeaf: true,
    draggable: true,
    attrs:
    { id: {},
      type: {},
      widget: {},
    },
    parseDOM:
    [ { tag: 'div[grid-type]',
      getAttrs (dom) {
        const id = dom.getAttribute('grid-id')
        const type = dom.getAttribute('grid-type')
        const widget = dom.getAttribute('grid-widget')
        if (id && type && isMediaType(type)) {
          return {id, type, widget}
        }
        return false
      },
    } ],
    toDOM (node) {
      const {id, type, widget} = node.attrs
      return ['div',
        { 'class': 'EdSchemaMedia',
          'grid-id': id,
          'grid-type': type,
          'grid-widget': widget,
        },
        [ 'div',
          { 'class': 'type' },
          type
        ],
      ]
    },
  }
