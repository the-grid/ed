import {fromDOM} from 'prosemirror/src/format'

import EdSchemaFull from '../schema/ed-schema-full'
import EdSchemaFold from '../schema/ed-schema-fold'
import {isMediaType, isHTMLType} from './types'


export default function (items, useFullSchema = true) {
  items = spaceContentWithEmptyText(items)
  let elements = itemsToEls(items)
  var container = document.createElement('div')
  elements.forEach((el) => {
    if (el) container.appendChild(el)
  })
  const schema = (useFullSchema ? EdSchemaFull : EdSchemaFold)
  return fromDOM(schema, container)
}


function itemToDOM (item) {
  let {id, type} = item
  let el
  if (isHTMLType(type)) {
    let dummy = document.createElement('div')
    dummy.innerHTML = item.html
    el = dummy.firstChild
  } else if (isMediaType(type)) {
    el = document.createElement('div')
    el.setAttribute('grid-id', id)
    el.setAttribute('grid-type', type)
  } else {
    return null
  }
  return el
}

function itemsToEls (items) {
  return items.map(itemToDOM)
}

function makeEmptyTextBlock () {
  return {
    type: 'text',
    html: '<p></p>'
  }
}

function spaceContentWithEmptyText (items) {
  let spacedItems = []
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i]
    const currentIsMedia = isMediaType(item.type)
    if (i === 0 && currentIsMedia) {
      spacedItems.push(makeEmptyTextBlock())
    }
    spacedItems.push(item)
    const next = items[i + 1]
    if (currentIsMedia) {
      if (next && isMediaType(next.type)) {
        spacedItems.push(makeEmptyTextBlock())
      }
      if (!next) {
        spacedItems.push(makeEmptyTextBlock())
      }
    }
  }
  if (spacedItems.length === 0) {
    spacedItems.push(makeEmptyTextBlock())
  }
  return spacedItems
}
