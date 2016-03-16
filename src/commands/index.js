import {CommandSet} from 'prosemirror/src/edit'
import edCommands from './ed-commands'
import {joinBackward} from './schema-commands'

let commands = CommandSet.default
  .add(edCommands)
  .update(
    { 'code:toggle': {menu: null}
    , joinUp: {menu: null}
    , selectParentNode: {menu: null}
    , joinBackward
    }
  )

export default commands
