import {toDOM} from 'prosemirror/src/serialize/dom'
import {isMediaType, isHTMLType} from './types'
import uuid from 'uuid'

// Dumb clone, don't mutate old
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Singleton so cut / paste keeps meta
let apiContentMap = {}

// !!! Deduplicate ids
function domMutationDedupeIds (children, doc) {
  let ids = []
  let len = children.length
  for (let i=0; i<len; i++) {
    let child = children[i]
    let id = child.getAttribute('data-grid-id')
    if (!id || ids.indexOf(id) !== -1) {
      id = uuid.v4()
      child.setAttribute('data-grid-id', id)
      doc.content[i].attrs.id = id
    }
    ids.push(id)
  }
}

export default function (children, doc, lastAPI) {
  domMutationDedupeIds(children, doc)

  let cloneLast = clone(lastAPI)
  cloneLast.content.forEach(block => {
    apiContentMap[block.id] = block
  })

  let dom = toDOM(doc)
  let currentContent = []
  let len = dom.children.length
  for (let i=0; i<len; i++) {
    let child = dom.children[i]
    let id = child.getAttribute('data-grid-id')
    let apiBlock = apiContentMap[id]
    let type = child.tagName.toLowerCase()
    if (!apiBlock) {
      apiBlock = { id, type }
    }
    child.removeAttribute('data-grid-id')
    if (isHTMLType(type)) {
      apiBlock.html = child.outerHTML
    }
    currentContent[i] = apiBlock
  }

  cloneLast.content = currentContent

  return cloneLast
}
