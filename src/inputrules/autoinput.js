import {InputRule} from 'prosemirror/src/inputrules'
import {Pos} from 'prosemirror/src/model'
import {Media} from '../schema/media'

import uuid from 'uuid'


Media.register('autoInput', 'replaceWithCodeWidget',
  new InputRule(/^```$/, '`', function (pm, _, pos) {
    setAs(pm, pos, this, {id: uuid.v4(), type: 'code'})
  })
)

function setAs (pm, pos, type, attrs) {
  pm.tr
    .delete(new Pos(pos.path, 0), pos)
    .setBlockType(pos, pos, type, attrs)
    .apply()
}
