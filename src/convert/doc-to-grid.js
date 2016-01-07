import {toDOM} from 'prosemirror/src/format'
import {isMediaType, isHTMLType} from './types'
import uuid from 'uuid'

// Dumb clone, don't mutate old
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Singleton so cut / paste keeps meta
let apiContentMap = {}

export default function (domChildren, doc, lastAPI) {
  let cloneLast = clone(lastAPI)
  cloneLast.forEach(block => {
    apiContentMap[block.id] = block
  })

  let dom = toDOM(doc)
  let currentContent = []
  let len = dom.children.length
  for (let i=0; i<len; i++) {
    let child = dom.children[i]
    let id = child.getAttribute('grid-id') || null
    let type = child.getAttribute('grid-type') || child.tagName.toLowerCase()
    let isMedia = (!!id)

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
