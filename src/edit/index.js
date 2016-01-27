import {CommandSet} from 'prosemirror/src/edit'
import edCommands from './ed-commands'

console.log(edCommands)

export let commands = CommandSet.default.add(edCommands)
