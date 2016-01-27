import {defaultSchema, Schema} from 'prosemirror/src/model'
import {iFrame, CodeMirror} from './iframe'

import {Media} from './media'

// Extend default schema with custom types
let spec = defaultSchema.spec
spec = spec.update({
  iframe: iFrame,
  media: Media,
  CodeMirror: CodeMirror
  code_block: null
})

const GridSchema = new Schema(spec)
console.log(GridSchema)
export default GridSchema
