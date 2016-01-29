import {defaultSchema, Schema, Heading} from 'prosemirror/src/model'

import {Media} from './media'

class Heading1to3 extends Heading {
  get maxLevel() { return 3 }
}

// Extend default schema with custom types
let spec = defaultSchema.spec
spec = spec.update({
  media: Media,
  code_block: null,
  horizontal_rule: null,
  heading: Heading1to3
})

const GridSchema = new Schema(spec)
export default GridSchema
