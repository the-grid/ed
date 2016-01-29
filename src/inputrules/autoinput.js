import {InputRule} from 'prosemirror/src/inputrules'
import {Media} from '../schema/media'

import uuid from 'uuid'

Media.register(
  'autoInput',
  new InputRule('replaceWithCodeWidget', /^```$/, '`', function (pm, _, pos) {
    pm.tr.replaceWith(pos, pos, pm.schema.node(this, {
      id: uuid.v4(),
      type: 'code'
    })).apply()
  })
)
