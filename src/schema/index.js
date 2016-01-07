import {defaultSchema, Schema} from 'prosemirror/src/model'
import uuid from 'uuid'

import {Media} from './media'


// Extend default schema with custom types

let spec = defaultSchema.spec
spec = spec.update({
  media: Media
})

const GridSchema = new Schema(spec)
console.log(GridSchema)
export default GridSchema
