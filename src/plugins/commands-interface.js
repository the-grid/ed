import {UpdateScheduler} from 'prosemirror/src/ui/update'
import {resolveGroup, Dropdown} from 'prosemirror/src/menu/menu'
import {barMenu} from '../menu/ed-menu'

export default class CommandsInterface {
  constructor (options) {
    const {ed, pm} = options
    if (!ed.onCommandsChanged) {
      throw new Error('Should not init this plugin without Ed onCommandsChanged option.')
    }
    this.ed = ed
    this.pm = pm

    // Schedule updates for available commands
    this.updater = new UpdateScheduler(pm
      , 'selectionChange blur focus commandsChanged'
      , this.update.bind(this)
    )
    this.updater.force()
  }
  teardown () {
    this.updater.detach()
  }
  update () {
    let commands = {}

    for (let i = 0; i < barMenu.length; i++) {
      const items = resolveGroup(this.pm, barMenu[i])
      for (let j = 0; j < items.length; j++) {
        const item = items[j]

        if (item instanceof Dropdown) {
          for (let k = 0, len = item.content.length; k < len; k++) {
            const dropdownItems = resolveGroup(this.pm, item.content[k])
            for (let l = 0, len = dropdownItems.length; l < len; l++) {
              commands[dropdownItems[l].commandName] = this.makeCommand(dropdownItems[l])
            }
          }
          continue
        }

        commands[items[j].commandName] = this.makeCommand(items[j])
      }
    }

    this.ed.onCommandsChanged(commands)
  }
  makeCommand (item) {
    let state = 'inactive'
    let command = item.command(this.pm)
    if (command.active && command.active(this.pm)) {
      state = 'active'
    }
    if (command.select && command.select(this.pm) === false) {
      state = 'disabled'
    }
    return state
  }
}
