require('./media.css')

import ReactDOM from 'react-dom'

import {isMediaType} from '../convert/types'
import Media from '../components/media'


function wrapDOM (dom) {
  let dummy = document.createElement('div')
  dummy.textContent = '\u200b'
  dummy.style.height = 0
  let wrap = document.createElement('div')
  wrap.appendChild(dummy.cloneNode(true))
  wrap.appendChild(dom)
  wrap.appendChild(dummy)
  return wrap
}

export class MediaNodeView {
  constructor (node, view, getPos, ed) {
    this.node = node
    this.view = view
    this.getPos = getPos
    this.ed = ed

    const {type, widget, id} = node.attrs

    const props = {
      initialBlock: this.ed.getBlock(id),
      id,
      // onChange: this.onChange,
      // imgfloConfig: this.ed.imgfloConfig,
      store: ed,
      // coverPrefs: this.coverPrefs,
    }
    this.dom = document.createElement('div')
    this.dom.contentEditable = false
    this.mounted = ReactDOM.render(new Media(props), this.dom)
    console.log(this, this.mounted)
  }
}

export const media =
  { isLeaf: true,
    draggable: true,
    attrs: {
      id: {},
      type: {},
      widget: {},
    },
    parseDOM: [{
      tag: 'div[grid-type]',
      getAttrs (dom) {
        const id = dom.getAttribute('grid-id')
        const type = dom.getAttribute('grid-type')
        const widget = dom.getAttribute('grid-widget')
        if (id && type && isMediaType(type)) {
          return {id, type, widget}
        }
        return false
      },
    }],
    toDOM (node) {
      const {id, type, widget} = node.attrs

      return [
        'div',
        { 'class': 'EdSchemaMedia',
          'grid-id': id,
          'grid-type': type,
          'grid-widget': widget,
        },
        [
          'div',
          { 'class': 'EdSchemaMedia--type' },
          type,
        ],
      ]
    },
  }
