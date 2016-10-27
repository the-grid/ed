// Added as plugin

import inputRules, {textblockTypeInputRule} from 'prosemirror/dist/inputrules'
import {buildInputRules} from 'prosemirror/dist/example-setup'
import EdSchema from '../schema/ed-schema-full'
import inputCode from './input-code'
import iosDoubleSpace from './ios-double-space'

import { HorizontalRule } from 'prosemirror/dist/schema-basic'


const edRules = buildInputRules(EdSchema)
edRules.push(inputCode)

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
if (isIOS) {
  edRules.push(iosDoubleSpace)
}

const hrRule = textblockTypeInputRule(/^—-/, '—', EdSchema.nodes.horizontal_rule)
edRules.push(hrRule)

const rules = inputRules.allInputRules.concat(edRules)

const EdInputRules = inputRules.inputRules.config({rules})

export default EdInputRules
