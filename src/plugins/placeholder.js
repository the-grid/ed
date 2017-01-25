/*
* Plugin to manage `empty` class for placeholder text
*/

import {Decoration, DecorationSet} from 'prosemirror-view'


function docToEmptyBlockDecorationSet (doc) {
  let decorations = []
  let pos = 0
  for (let i = 0, len = doc.content.content.length; i < len; i++) {
    const node = doc.content.content[i]
    if ((node.type.name === 'paragraph' || node.type.name === 'heading') && node.textContent === '') {
      decorations.push(Decoration.node(pos, pos + 2, {class: 'empty'}))
    }
    pos += node.nodeSize
  }
  return DecorationSet.create(doc, decorations)
}

export default {
  state: {
    init: function (config, state) {
      const {ed} = this.options.edStuff
      setTimeout(function () {
        ed.trigger('plugin.placeholder.initialized')
      }, 0)
      return docToEmptyBlockDecorationSet(state.doc)
    },
    apply: function (transaction, prevDeco, prev, state) {
      if (transaction.steps.length) {
        return docToEmptyBlockDecorationSet(state.doc)
      }
      return prevDeco
    },
  },
  props: {
    decorations (state) {
      return this.getState(state)
    },
  },
}
