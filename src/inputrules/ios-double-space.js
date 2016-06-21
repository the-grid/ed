import {InputRule} from 'prosemirror/dist/inputrules'

let lastSpace = 0
function check (pm, match, pos) {
  const now = Date.now()
  if (now - lastSpace < 200) {
    lastSpace = 0
    var sel = pm.selection
    if (!sel.empty) return false
    let before = pm.doc.resolve(sel.head).nodeBefore
    if (!before.isText || before.text.charAt(before.text.length - 1) !== ' ') return false
    return pm
      .tr
      .replaceWith(sel.head - 2
        , sel.head
        , pm.schema.text('. ', before.marks)
      )
      .apply()
  } else {
    lastSpace = now
    return false
  }
}

const iosDoubleSpace = new InputRule(/\s/, ' ', check)

export default iosDoubleSpace
