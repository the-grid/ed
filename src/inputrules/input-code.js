import {InputRule} from 'prosemirror/dist/inputrules'
import uuid from 'uuid'

const inputCode =
  new InputRule(/^```$/, '`', function (pm, _, pos) {
    insertBlock(pm, pos, pm.schema.nodes.media
    , { id: uuid.v4()
      , type: 'code'
      , initialFocus: true
      }
    )
  })

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

  // Hide tooltip
  pm.content.blur()
}

export default inputCode
