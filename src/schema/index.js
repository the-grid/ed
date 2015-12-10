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

let idPred = (_, data) => data.type.prototype.isTextblock || data.type.prototype.isBlock
spec = spec.addAttribute(idPred, 'id', idAttribute)

const editableAttribute = new Attribute({
  default: 'false'
})
editableAttribute.parseDOM = (dom, options) => dom.getAttribute('contenteditable') || 'false'
editableAttribute.serializeDOM = (dom, _) => dom ? dom.setAttribute('contenteditable', 'false') : 'false'

let editablePred = (_, data) => data.type.prototype.isNotEditable
spec = spec.addAttribute(editablePred, 'contenteditable', editableAttribute)

const GridSchema = new Schema(spec)
console.log(GridSchema)
export default GridSchema