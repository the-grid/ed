import {defaultSchema, Schema} from 'prosemirror/src/model'
import {EdDoc,
  EdBlockQuote, EdParagraph,
  EdBulletList, EdOrderedList, EdListItem} from './ed-nodes.js'

// Extend default schema with custom types
let spec = defaultSchema.spec
spec = spec.update({
  doc: EdDoc,
  heading: null,
  blockquote: EdBlockQuote,
  paragraph: EdParagraph,
  bullet_list: EdBulletList,
  ordered_list: EdOrderedList,
  list_item: EdListItem,
  code_block: null,
  horizontal_rule: null
})

const EdSchemaFold = new Schema(spec)
export default EdSchemaFold
