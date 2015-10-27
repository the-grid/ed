import {defaultSchema, Attribute, Schema} from "prosemirror/src/model"
import {Transform} from "prosemirror/src/transform"
import {toDOM} from "prosemirror/src/serialize/dom"
import {fromDOM} from "prosemirror/src/parse/dom"

import uuid from 'uuid'

let makeId = () => uuid.v4()

const idAttribute = new Attribute({
  compute: makeId,
  mustRecompute: true,
  inheritable: true
})

idAttribute.parseDOM = (dom, options) => options.source != "paste" && dom.getAttribute("data-grid-id") || makeId()
idAttribute.serializeDOM = (dom, id) => dom.setAttribute("data-grid-id", id)

let attrPred = (_, data) => data.type.prototype.isTextblock
const GridSchema = new Schema(defaultSchema.spec.addAttribute(attrPred, "id", idAttribute))

export default GridSchema