import {defaultSchema, Attribute, Schema} from 'prosemirror/src/model'

import uuid from 'uuid'

let makeId = () => uuid.v4()

const idAttribute = new Attribute({
  compute: makeId,
  mustRecompute: true,
  inheritable: true
})

idAttribute.parseDOM = (dom, options) => options.source != 'paste' && dom.getAttribute('data-grid-id') || makeId()
idAttribute.serializeDOM = (dom, id) => dom.setAttribute('data-grid-id', id)

let attrPred = (_, data) => data.type.prototype.isTextblock || data.type.prototype.isBlock
const GridSchema = new Schema(defaultSchema.spec.addAttribute(attrPred, 'id', idAttribute))

console.log(GridSchema)

export default GridSchema