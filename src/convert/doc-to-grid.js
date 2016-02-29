import {toDOM} from 'prosemirror/src/format'
import {isMediaType} from './types'

// Dumb clone, don't mutate old
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Singleton so cut / paste keeps meta
let apiContentMap = {}


export default function (domChildren, doc, lastAPI) {
  const cloneLast = clone(lastAPI)
  for (let i = 0, len = cloneLast.length; i < len; i++) {
    const block = cloneLast[i]
    apiContentMap[block.id] = block
  }

  let dom = toDOM(doc)
  let currentContent = []
  let len = dom.children.length
  for (let i = 0; i < len; i++) {
    let child = dom.children[i]
    let id = child.getAttribute('grid-id') || null
    let type = child.getAttribute('grid-type') || child.tagName.toLowerCase()
    type = translateIrregularGridTypes(type)
    let isMedia = isMediaType(type)

    let apiBlock = apiContentMap[id]
    if (!apiBlock) {
      apiBlock = isMedia ? {id, type} : {type}
    }
    // TODO massage media types that need it
    if (!isMedia) {
      apiBlock.html = child.outerHTML
    }
    currentContent[i] = apiBlock
  }

  return currentContent
}


// Ugh.
function translateIrregularGridTypes (type) {
  switch (type) {
    case 'blockquote':
      return 'quote'
    case 'p':
      return 'text'
    default:
      return type
  }
}
