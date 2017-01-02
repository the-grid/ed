/*
* Plugin to manage `empty` class for placeholder text
*/

import {PluginKey} from 'prosemirror-state'
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
    key: new PluginKey('placeholder'),
    init: function (config, state) {
      return docToEmptyBlockDecorationSet(state.doc)
    },
    applyAction: function (action, prevDecorations, prev, state) {
      if (action.type === 'transform') {
        return docToEmptyBlockDecorationSet(state.doc)
      }
      return prevDecorations
    },
  },
  props: {
    decorations (state) {
      return this.getState(state)
    },
  },
}
