import {fromDOM} from 'prosemirror/src/format'

import GridSchema from '../schema/'
import {makeMediaDom} from '../schema/media'
import {isMediaType, isHTMLType} from './types'

function itemToDOM (item) {
  let {id, type, html, cover, metadata} = item
  let el
  if ( isHTMLType(type) ) {
    let dummy = document.createElement('div')
    dummy.innerHTML = item.html
    el = dummy.firstChild
  } else if ( isMediaType(type) ) {
    let title = metadata ? metadata.title : ''
    let description = metadata ? metadata.description : ''
    description = description || `${type} block placeholder`
    el = makeMediaDom({title, description})
  } else {
    return null
  }
  el.setAttribute('data-grid-id', id)
  return el
}

function itemsToEls (items) {
  return items.map(itemToDOM)
}

export default function (items) {
  let elements = itemsToEls(items)
  var container = document.createElement('div')
  elements.forEach((el) => {
    if (el) container.appendChild(el)
  })
  return fromDOM(GridSchema, container)
}
