import {defaultSchema, Attribute, Schema, Block} from 'prosemirror/src/model'
import uuid from 'uuid'

import {Figure, FigCaption} from './figure'
import {Media} from './media'

let makeId = () => uuid.v4()

let spec = defaultSchema.spec
spec = spec.updateNodes({
  figure: Figure,
  figcaption: FigCaption,
  media: Media
})

const idAttribute = new Attribute({
  compute: makeId
})

idAttribute.parseDOM = (dom, options) => dom.getAttribute('data-grid-id') || makeId()
idAttribute.serializeDOM = (dom, id) => dom ? dom.setAttribute('data-grid-id', id) : ''

let attrPred = (_, data) => data.type.prototype.isTextblock || data.type.prototype.isBlock
spec = spec.addAttribute(attrPred, 'id', idAttribute)
const GridSchema = new Schema(spec)

console.log(GridSchema)

export default GridSchema