import {fromDOM} from 'prosemirror/src/format'

import {isMediaType, isHTMLType} from './types'
import EdSchemaFull from '../schema/ed-schema-full'
import determineFold from './determine-fold'
import spaceContent from './space-content'


export default function (items, schema = EdSchemaFull) {
  const container = document.createElement('div')
  let {starred, unstarred} = determineFold(items)
  starred = spaceContent(starred)
  let elements = itemsToEls(starred)
  elements.forEach(function (el) {
    if (el) container.appendChild(el)
  })
  if (unstarred.length > 0) {
    const hr = document.createElement('hr')
    container.appendChild(hr)
    unstarred = spaceContent(unstarred)
    elements = itemsToEls(unstarred)
    elements.forEach(function (el) {
      if (el) container.appendChild(el)
    })
  }
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
