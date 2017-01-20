require('./media.css')

import ReactDOM from 'react-dom'
import {NodeSelection} from 'prosemirror-state'

import {isMediaType} from '../convert/types'
import Widget from '../components/widget'


export class MediaNodeView {
  constructor (node, view, getPos, store, imgfloConfig, coverPrefs, widgetPath) {
    // console.log('MediaNodeView constructor')
    this.node = node
    this.view = view
    this.getPos = getPos
    this.ed = store

    const {id} = node.attrs
    const initialBlock = this.ed.getBlock(id)

    if (!initialBlock) {
      throw new Error('Block not found in content: ' + id)
    }

    const props = {
      initialBlock,
      id,
      imgfloConfig,
      store,
      coverPrefs,
      widgetPath,
      nodeView: this,
    }
    this.dom = document.createElement('div')
    this.dom.className = 'EdSchemaMedia'
    this.dom.contentEditable = false
    this.dom.spellcheck = false
    this.select = function (event) {
      console.log(event)
      view.dispatch(
        view.state.tr.setSelection(
          NodeSelection.create(
            view.state.doc, getPos()
          )
        )
      )
    }
    this.mounted = ReactDOM.render(new Widget(props), this.dom)
  }
  update (node, decorations) {
    // console.log('MediaNodeView update')
    if (node.type !== this.node.type || node.attrs.id !== this.node.attrs.id) {
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
