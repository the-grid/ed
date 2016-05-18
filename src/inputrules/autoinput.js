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
    // delete the ```
    .delete(start, pos)
    // insert the code block above the current block
    .insert(nodePos, codeNode)
    .apply()
}
