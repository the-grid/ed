import {DOMParser} from 'prosemirror-model'

import EdSchema from '../schema/ed-schema'

import {isMediaType, isHTMLType} from './types'
import determineFold from './determine-fold'
import spaceContent from './space-content'
import IframeInfo from '../plugins/iframe-info'


export default function (items) {
  const container = document.createElement('div')
  let {starred, unstarred, hasHR} = determineFold(items)
  starred = spaceContent(starred)
  let elements = itemsToEls(starred)
  elements.forEach(function (el) {
    if (el) container.appendChild(el)
  })
  if (unstarred.length > 0) {
    if (!hasHR) {
      const hr = document.createElement('hr')
      container.appendChild(hr)
    }
    unstarred = spaceContent(unstarred)
    elements = itemsToEls(unstarred)
    elements.forEach(function (el) {
      if (el) container.appendChild(el)
    })
  }
  return DOMParser.fromSchema(EdSchema).parse(container)
}


function itemToDOM (item) {
  let {id, type} = item

  let widget
  if (item.metadata && item.metadata.widget) {
    widget = item.metadata.widget
  }
  if (!widget) {
    widget = type
  }

  let el
  if (isHTMLType(type)) {
    let dummy = document.createElement('div')
    dummy.innerHTML = item.html
    el = dummy.firstChild
  } else if (isMediaType(type)) {
    el = document.createElement('div')
    el.setAttribute('grid-id', id)
    el.setAttribute('grid-type', type)
    el.setAttribute('grid-widget', widget)
    const iframe = IframeInfo[type]
    if (iframe) {
      el.setAttribute('grid-initial-height', iframe.initialHeight)
    }
  } else {
    return null
  }
  return el
}

function itemsToEls (items) {
  return items.map(itemToDOM)
}
