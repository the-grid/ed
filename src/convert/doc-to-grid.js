import {toDOM} from 'prosemirror/src/format'
import {isMediaType} from './types'

export default function (doc, apiContentMap) {
  const dom = toDOM(doc)
  let currentContent = []
  for (let i = 0, len = dom.children.length; i < len; i++) {
    const child = dom.children[i]
    const id = child.getAttribute('grid-id') || null
    let type = child.getAttribute('grid-type') || child.tagName.toLowerCase()
    type = translateIrregularGridTypes(type)
    const isMedia = isMediaType(type)

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
