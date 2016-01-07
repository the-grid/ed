import uuid from 'uuid'

import {defaultSchema, Attribute, Schema, Block} from 'prosemirror/src/model'
export {defaultSchema, Attribute, Schema, Block}
import {Figure, FigCaption} from './figure'
export {Figure, FigCaption}
import {iFrame, CodeMirror} from './iframe'
export {iFrame, CodeMirror}
import {Media} from './media'
export {Media}
import {Embed} from './embed'
export {Embed}


// Extend default schema with custom types

let spec = defaultSchema.spec
spec = spec.update({
  figure: Figure,
  figcaption: FigCaption,
  media: Media,
  iframe: iFrame,
  //embed:Embed
  CodeMirror: CodeMirror
})

// Block id
// TODO: make these for top-level blocks only



let makeId = () => uuid.v4()

const idAttribute = new Attribute({
  
  default: ''
    
  //compute: makeId // WARNING: this causes selection of blockquotes to break??
  
})

idAttribute.parseDOM = (dom, options) => dom.getAttribute('data-grid-id') || makeId()
idAttribute.serializeDOM = (dom, id) => {
  dom ? dom.setAttribute('data-grid-id', id) : ''
} 

let idPred = (_, data) => data.type.prototype.isTextblock || data.type.prototype.isBlock

// TODO: FUCK, API CHANGE
// spec = spec.addAttribute(idPred, 'data-grid-id', idAttribute)

// Non-editable blocks

const editableAttribute = new Attribute({
  default: 'false'
})
editableAttribute.parseDOM = (dom, options) => dom.getAttribute('contenteditable') || 'false'
editableAttribute.serializeDOM = (dom, editable) => dom ? dom.setAttribute('contenteditable', editable) : null

let editablePred = (_, data) => data.type.prototype.isNotEditable

// TODO: FUCK, API CHANGE
//spec = spec.addAttribute(editablePred, 'contenteditable', editableAttribute)

//

export const schema = new Schema(spec)
console.log(schema)
export default schema
