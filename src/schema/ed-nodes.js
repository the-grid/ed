import {Doc, 
  Heading, BlockQuote, Paragraph,
  BulletList, OrderedList, ListItem} from 'prosemirror/src/model'
import {NodeKind} from 'prosemirror/src/model/schema'

export const NodeKindTop = new NodeKind('ed_toplevel')
const NodeKindTopOrBlock = new NodeKind('ed_block', NodeKindTop)

// These schema modificaions change which nodes can go where
export class EdDoc extends Doc {
  get kind () { return null }
  get contains () { return NodeKindTop }
}

export class EdHeading extends Heading {
  get kind () { return NodeKindTop }
  // Limit h1, h2, h3
  get maxLevel () { return 3 }
}

export class EdBlockQuote extends BlockQuote {
  get kind () { return NodeKindTop }
  get contains () { return NodeKindTopOrBlock }
}

export class EdParagraph extends Paragraph {
  get kind () { return NodeKindTopOrBlock }
}

export class EdBulletList extends BulletList {
  get kind () { return NodeKindTopOrBlock }
}

export class EdOrderedList extends OrderedList {
  get kind () { return NodeKindTopOrBlock }
}

export class EdListItem extends ListItem {
  get contains () { return NodeKindTopOrBlock }
}
