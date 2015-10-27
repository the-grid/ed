import {Transform} from "prosemirror/src/transform"
import {toDOM} from "prosemirror/src/serialize/dom"

// Dumb clone, don't mutate old
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Singleton so cut / paste keeps meta
let apiContentMap = {}

// Translate ProseMirror node.type to tag name

export default function (doc, lastAPI) {
  let cloneLast = clone(lastAPI)
  cloneLast.content.forEach( (block) => {
    apiContentMap[block.id] = block
  })

  let dom = toDOM(doc)
  let currentContent = []
  let len = dom.children.length
  for (let i=0; i<len; i++) {
    let child = dom.children[i]
    let id = child.getAttribute('data-grid-id') || uuid.v4()
    let apiBlock = apiContentMap[id]
    if (!apiBlock) {
      apiBlock = { id: id }
    }
    apiBlock.html = child.outerHTML
    currentContent[i] = apiBlock
  }

  cloneLast.content = currentContent

  return cloneLast
}