import {CommandSet} from 'prosemirror/src/edit'
import edCommands from './ed-commands'

export let commands = CommandSet.default.add(edCommands)
