import {edCommands} from '../menu/ed-menu'


function makeCommands (state) {
  let commands = {}

  let keys = Object.keys(edCommands)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const item = edCommands[key]
    commands[key] = makeCommand(item, state)
  }

  return commands
}

function makeCommand (item, state) {
  let commandState = 'inactive'
  let command = item.spec
  if (command.active && command.active(state)) {
    commandState = 'active'
  }
  if (command.select && command.select(state) === false) {
    commandState = 'disabled'
  }
  return commandState
}

export default {
  state: {
    init: function (config, state) {
      const {ed} = this.options.edStuff
      if (!ed.onCommandsChanged) {
        throw new Error('Should not init this plugin without Ed onCommandsChanged option.')
      }

      const commands = makeCommands(state)
      ed.onCommandsChanged(commands)
    },
    apply: function (transaction, value, prev, state) {
      const {ed} = this.options.edStuff
      const commands = makeCommands(state)
      ed.onCommandsChanged(commands)
      return transaction
    },
  },
}
