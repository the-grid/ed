import {InputRule} from 'prosemirror/dist/inputrules'
// import uuid from 'uuid'
import {focusedIndex} from '../util/pm'

const inputCode =
  new InputRule(/^```$/, '`', function (pm, _, pos) {
    const index = focusedIndex(pm)
    if (index == null) return
    clearNode(pm, pos)
    pm.ed.routeChange('ADD_MEDIA', {index, type: 'code'})
  })

function clearNode (pm, pos) {
  const $pos = pm.doc.resolve(pos)
  const start = pos - $pos.parentOffset
  // Delete the input shortcut text (like ```)
  pm.tr
    .delete(start, pos)
    .apply()
}

export default inputCode
