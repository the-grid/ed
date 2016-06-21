// Added as plugin

import inputRules from 'prosemirror/dist/inputrules'
import {buildInputRules} from 'prosemirror/dist/example-setup'
import EdSchema from '../schema/ed-schema-full'
import inputCode from './input-code'

const edRules = buildInputRules(EdSchema)
edRules.push(inputCode)

const rules = inputRules.allInputRules.concat(edRules)

const EdInputRules = inputRules.inputRules.config({rules})

export default EdInputRules
