import {fromDOM} from 'prosemirror/src/format'

import {isMediaType, isHTMLType} from './types'
import spaceContentWithEmptyText from './space-content'

import EdSchemaFull from '../schema/ed-schema-full'


export default function (items, schema = EdSchemaFull) {
  items = spaceContentWithEmptyText(items)
  let elements = itemsToEls(items)
  var container = document.createElement('div')
  elements.forEach((el) => {
    if (el) container.appendChild(el)
  })
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
