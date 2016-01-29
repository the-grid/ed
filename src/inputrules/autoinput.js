import {InputRule} from 'prosemirror/src/inputrules'
import {Media} from '../schema/media'

import uuid from 'uuid'

Media.register('autoInput', 'replaceWithCodeWidget',
  new InputRule(/^```$/, '`', function (pm, _, pos) {
    pm.tr.replaceWith(pos, pos, pm.schema.node(this, {
      id: uuid.v4(),
      type: 'code'
    })).apply()
  })
)

// import {Pos} from 'prosemirror/src/model'

// Media.register('autoInput', 'replaceWithCodeWidget',
//   new InputRule(/^```$/, '`', function (pm, _, pos) {
//     setAs(pm, pos, this, {
//       id: uuid.v4(),
//       type: 'code'
//     })
//   })
// )

// function setAs (pm, pos, type, attrs) {
//   pm.tr.setBlockType(pos, pos, type, attrs)
//        .delete(new Pos(pos.path, 0), pos)
//        .apply()
// }
