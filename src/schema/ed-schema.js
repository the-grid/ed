// See also, PM's default schema:
// https://github.com/ProseMirror/prosemirror/blob/86d55c3f48a0b092bb446fe5c33cc4978c2ba61c/src/model/defaultschema.js#L91-L118

import {Schema} from 'prosemirror-model'

import {nodes, marks} from 'prosemirror-schema-basic'
import {orderedList, bulletList, listItem} from 'prosemirror-schema-list'
import {media} from './media'

let {paragraph, heading, horizontal_rule, text, hard_break} = nodes
let {em, strong, link} = marks

function add(obj, props) {
  let copy = {}
  for (let prop in obj) copy[prop] = obj[prop]
  for (let prop in props) copy[prop] = props[prop]
  return copy
}

const EdSchema = new Schema({
  nodes: {
    doc: {content: '(block | topblock)+'},
    paragraph,
    ordered_list: add(orderedList, {content: 'list_item+', group: 'block'}),
    bullet_list: add(bulletList, {content: 'list_item+', group: 'block'}),
    list_item: add(listItem, {content: 'paragraph block*'}),
    horizontal_rule: add(horizontal_rule, {group: 'topblock'}),
    heading: add(heading, {group: 'topblock'}),
    media: add(media, {group: 'topblock'}),
    text,
    hard_break,
  },
  marks: {
    em,
    strong,
    link,
  },
})

export default EdSchema
