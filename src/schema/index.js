import {defaultSchema, Attribute, Schema, Block} from 'prosemirror/src/model'
import uuid from 'uuid'

import {Figure} from './figure'

let makeId = () => uuid.v4()
let spec = defaultSchema.spec
spec = spec.updateNodes({
  figure: Figure
})

const idAttribute = new Attribute({
  compute: makeId,
  mustRecompute: true,
  inheritable: true
})

idAttribute.parseDOM = (dom, options) => options.source != 'paste' && dom.getAttribute('data-grid-id') || makeId()
idAttribute.serializeDOM = (dom, id) => dom.setAttribute('data-grid-id', id)

let attrPred = (_, data) => data.type.prototype.isTextblock || data.type.prototype.isBlock
spec = spec.addAttribute(attrPred, 'id', idAttribute)
const GridSchema = new Schema(spec)

console.log(GridSchema)

export default GridSchema