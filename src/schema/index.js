import {defaultSchema, Schema} from 'prosemirror/src/model'

import {Media} from './media'

// Extend default schema with custom types
let spec = defaultSchema.spec
spec = spec.update({
  media: Media,
  code_block: null,
  horizontal_rule: null
})

const GridSchema = new Schema(spec)
export default GridSchema
