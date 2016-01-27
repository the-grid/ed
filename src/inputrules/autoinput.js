import {InputRule} from 'prosemirror/src/inputrules'
import {Pos} from 'prosemirror/src/model'
import {Media} from '../schema/media'

import uuid from 'uuid'

Media.register(
  'autoInput',
  new InputRule('startCodeMirrorBlock', /^```$/, '`', function (pm, _, pos) {
    setAs(pm, pos, this, {
      id: uuid.v4(),
      type: 'code'
    })
  })
)

// COPIED from https://github.com/ProseMirror/prosemirror/blob/39bcf5121a21dfc19c87db7670f29d3e487c5c1a/src/inputrules/autoinput.js#L85-L89
function setAs(pm, pos, type, attrs) {
  console.log(arguments)
  pm.tr
    .setBlockType(pos, pos, type, attrs)
    .delete(new Pos(pos.path, 0), pos)
    .apply()
}
