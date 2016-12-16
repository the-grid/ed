// See also, PM's default schema:
// https://github.com/ProseMirror/prosemirror/blob/86d55c3f48a0b092bb446fe5c33cc4978c2ba61c/src/model/defaultschema.js#L91-L118

import {Schema} from 'prosemirror-model'

import {nodes, marks} from 'prosemirror-schema-basic'
import {orderedList as ordered_list, bulletList as bullet_list, listItem as list_item} from 'prosemirror-schema-list'
import {media} from './media'

let { paragraph, heading, horizontal_rule, text, hard_break } = nodes
let {em, strong, link} = marks

heading.group = 'topblock'
horizontal_rule.group = 'topblock'
media.group = 'topblock'


const EdSchema = new Schema(
  { nodes:
  { doc: {content: '(block | topblock)+'},
    paragraph,
    ordered_list,
    bullet_list,
    horizontal_rule,
    heading,
    media,
    list_item,
    text,
    hard_break,
  },
    marks:
    { em,
      strong,
      link,
    },
  }
)

export default EdSchema
