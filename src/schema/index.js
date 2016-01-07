import {defaultSchema, Attribute, Schema, Block} from 'prosemirror/src/model'
import {iFrame, CodeMirror} from './iframe'

import {Media} from './media'
import {Embed} from './embed'


// Extend default schema with custom types

let spec = defaultSchema.spec
spec = spec.update({
  iframe: iFrame,
  media: Media,
  CodeMirror: CodeMirror
})

const GridSchema = new Schema(spec)
console.log(GridSchema)
export default GridSchema
