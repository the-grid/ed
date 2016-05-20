import {Media} from '../schema/media'
import uuid from 'uuid'
import {InputRule} from 'prosemirror/src/inputrules'


Media.register('autoInput', 'ed_start_code',
  new InputRule(/^```$/, '`', function (pm, _, pos) {
    insertBlock(pm, pos, this, {id: uuid.v4(), type: 'code'})
  })
)


function insertBlock (pm, pos, type, attrs) {
  const $pos = pm.doc.resolve(pos)
  const start = pos - $pos.parentOffset
  const nodePos = start - 1
  const codeNode = type.create(attrs)
  pm.tr
    // Delete the input shortcut text (like ```)
    .delete(start, pos)
    // Insert the block above the current block
    .insert(nodePos, codeNode)
    .apply()

  // Trigger event for widget system and autosave
  setTimeout(() => pm.signal('draw'), 0)
}
