require('./media.css')

import ReactDOM from 'react-dom'

import {isMediaType} from '../convert/types'
import Widget from '../components/widget'


export class MediaNodeView {
  constructor (node, view, getPos, store, imgfloConfig, coverPrefs, widgetPath) {
    this.node = node
    this.view = view
    this.getPos = getPos
    this.ed = store

    const {id} = node.attrs

    const props = {
      initialBlock: this.ed.getBlock(id),
      id,
      imgfloConfig,
      store,
      coverPrefs,
      widgetPath,
    }
    this.dom = document.createElement('div')
    this.dom.className = 'EdSchemaMedia'
    this.dom.contentEditable = false
    this.mounted = ReactDOM.render(new Widget(props), this.dom)
  }
  stopEvent (event) {
    if (event instanceof DragEvent) {
      // PM handles dragging blocks
      return false
    }
    return true
  }
  destroy () {
    ReactDOM.unmountComponentAtNode(this.dom)
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
      ]
    },
  }
