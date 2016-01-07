import {Block, Attribute} from 'prosemirror/src/model'

// iFrame

export class iFrame extends Block {

  get contains () { return 'inline' }
  get canBeEmpty () { return true }

  get attrs () {
    return {
      'data-embed-type': new Attribute({default: 'default'}),
      'onload': new Attribute({default: ''}),
      src: new Attribute({default: ''}),
      type: new Attribute({default: 'text/html'}),
      width: new Attribute({default: 800}),
      height: new Attribute({default: 390 * 800 / 640})
    }
  }

  serializeDOM (node, s) {
    let embedType = node.attrs['data-embed-type']
    return s.elt('iframe', {
      class: ['embed-type-' + embedType],
      src: node.attrs.src,
      type: node.attrs.type,
      width: node.attrs.width,
      height: node.attrs.height,
      onload: node.attrs.onload,
      'data-embed-type': embedType
    })
  }
}
iFrame.register('parseDOM',
  {
    tag: 'iframe',
    parse: function (dom, state) {
      state.insert(this, {
        src: dom.getAttribute('src') || null,
        'data-embed-type': dom.dataset.embedType
      })
    }
  }
)

// CodeMirror
export class CodeMirror extends iFrame {}
