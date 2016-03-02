import {defaultSchema, Schema} from 'prosemirror/src/model'
import {EdDoc,
  EdHeading, EdBlockQuote, EdParagraph,
  EdBulletList, EdOrderedList, EdListItem} from './ed-nodes.js'
import {Media} from './media'

// Extend default schema with custom types
let spec = defaultSchema.spec
spec = spec.update({
  doc: EdDoc,
  heading: EdHeading,
  blockquote: EdBlockQuote,
  paragraph: EdParagraph,
  bullet_list: EdBulletList,
  ordered_list: EdOrderedList,
  list_item: EdListItem,
  media: Media,
  code_block: null,
  horizontal_rule: null
})

const EdSchemaFull = new Schema(spec)
export default EdSchemaFull
