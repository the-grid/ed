import {edCommands} from '../menu/ed-menu'

export default class CommandsInterface {
  constructor (pm, options) {
    const {ed} = options
    if (!ed.onCommandsChanged) {
      throw new Error('Should not init this plugin without Ed onCommandsChanged option.')
    }
    this.pm = pm
    this.ed = ed

    // Schedule updates for available commands
    this.updater = pm.updateScheduler(
      [ pm.on.selectionChange
      ]
      , this.update.bind(this)
    )
    this.updater.force()
  }
  detach () {
    this.updater.detach()
  }
  update () {
    let commands = {}

    let keys = Object.keys(edCommands)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const item = edCommands[key]
      commands[key] = this.makeCommand(item)
    }

    this.ed.onCommandsChanged(commands)
  }
  makeCommand (item) {
    let state = 'inactive'
    let command = item.spec
    if (command.active && command.active(this.pm)) {
      state = 'active'
    }
    if (command.select && command.select(this.pm) === false) {
      state = 'disabled'
    }
    if (command.class === 'flaggedFeature') {
      state = 'flagged'
    }
    return state
  }
}
