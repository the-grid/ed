import {defaultSchema, Schema,
  Doc, Heading, BlockQuote, Paragraph,
  BulletList, OrderedList} from 'prosemirror/src/model'
import {NodeKind} from 'prosemirror/src/model/schema'

import {Media} from './media'

export const NodeKindTop = new NodeKind('ed_toplevel')
const NodeKindTopOrBlock = new NodeKind('ed_toplevel_or_block', NodeKindTop, NodeKind.block)

// These schema modificaions change which nodes can go where
class EdDoc extends Doc {
  get kind () { return null }
  get contains () { return NodeKindTop }
}

class EdHeading extends Heading {
  get kind () { return NodeKindTop }
  // Limit h1, h2, h3
  get maxLevel () { return 3 }
}

class EdBlockQuote extends BlockQuote {
  get kind () { return NodeKindTop }
}

class EdParagraph extends Paragraph {
  get kind () { return NodeKindTopOrBlock }
}

class EdBulletList extends BulletList {
  get kind () { return NodeKindTopOrBlock }
}

class EdOrderedList extends OrderedList {
  get kind () { return NodeKindTopOrBlock }
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
