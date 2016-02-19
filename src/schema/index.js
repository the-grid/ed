import {defaultSchema, Schema,
  Doc, Heading, BlockQuote, Paragraph,
  BulletList, OrderedList} from 'prosemirror/src/model'

import {Media} from './media'


// These schema modificaions change which nodes can go where
class EdDoc extends Doc {
  get contains () { return 'ed_toplevel' }
}

class EdHeading extends Heading {
  static get kinds () { return 'ed_toplevel' }
  // Limit h1, h2, h3
  get maxLevel () { return 3 }
}

class EdBlockQuote extends BlockQuote {
  static get kinds () { return 'ed_toplevel' }
}

class EdParagraph extends Paragraph {
  static get kinds () { return 'ed_toplevel block' }
}

class EdBulletList extends BulletList {
  static get kinds () { return 'ed_toplevel block' }
}

class EdOrderedList extends OrderedList {
  static get kinds () { return 'ed_toplevel block' }
}

// Extend default schema with custom types
let spec = defaultSchema.spec
spec = spec.update({
  doc: EdDoc,
  heading: EdHeading,
  blockquote: EdBlockQuote,
  paragraph: EdParagraph,
  bullet_list: EdBulletList,
  ordered_list: EdOrderedList,
  media: Media,
  code_block: null,
  horizontal_rule: null
})

const GridSchema = new Schema(spec)
export default GridSchema
