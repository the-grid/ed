import {CommandSet} from 'prosemirror/src/edit'
//import {setOption} from 'prosemirror/src/edit/options'
import {baseCommands} from './base-commands'
//import './schema-commands'
export let commands = CommandSet.default.add(baseCommands)
