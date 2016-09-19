// See also, PM's default schema:
// https://github.com/ProseMirror/prosemirror/blob/86d55c3f48a0b092bb446fe5c33cc4978c2ba61c/src/model/defaultschema.js#L91-L118

import {Schema} from 'prosemirror/dist/model'

import { Doc
  , Heading
  , Paragraph
  , HorizontalRule
  , BulletList
  , OrderedList
  , ListItem
  , Text
  , HardBreak
  , EmMark
  , StrongMark
  , LinkMark } from 'prosemirror/dist/schema-basic'

import {Media} from './media'


class EdHeading extends Heading {
  // Limit h1, h2, h3
  get maxLevel () { return 3 }
}

const EdSchema = new Schema(
  { nodes:
    { doc: {type: Doc, content: '(block | topblock)+'}
    , paragraph: {type: Paragraph, content: 'inline<_>*', group: 'block'}
    // , blockquote: {type: BlockQuote, content: 'block+', group: 'topblock'}
    , ordered_list: {type: OrderedList, content: 'list_item+', group: 'block'}
    , bullet_list: {type: BulletList, content: 'list_item+', group: 'block'}
    , horizontal_rule: {type: HorizontalRule, group: 'topblock'}
    , heading: {type: EdHeading, content: 'inline<_>*', group: 'topblock'}
    , media: {type: Media, group: 'topblock'}
    // , code_block: {type: CodeBlock, content: 'text*', group: 'block'}
    , list_item: {type: ListItem, content: 'block+'}
    , text: {type: Text, group: 'inline'}
    // , image: {type: Image, group: 'inline'}
    , hard_break: {type: HardBreak, group: 'inline'}
    }
  , marks:
    { em: EmMark
    , strong: StrongMark
    , link: LinkMark
    // , code: CodeMark
    }
  }
)

export default EdSchema
