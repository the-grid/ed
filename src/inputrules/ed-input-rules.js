// Added as plugin

import {inputRules, allInputRules} from 'prosemirror-inputrules'
import {buildInputRules, buildKeymap} from 'prosemirror-example-setup'
import {keymap} from 'prosemirror-keymap'
import {baseKeymap} from 'prosemirror-commands'
import EdSchemaFull from '../schema/ed-schema-full'
// import inputCode from './input-code'
// import iosDoubleSpace from './ios-double-space'


const edRules = buildInputRules(EdSchemaFull)

// edRules.push(inputCode)

// const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
// if (isIOS) {
//   edRules.push(iosDoubleSpace)
// }

const rules = allInputRules.concat(edRules)

export const edInputRules = inputRules({rules})

export const edBaseKeymap = keymap(baseKeymap)
export const edKeymap = keymap(buildKeymap(EdSchemaFull))
