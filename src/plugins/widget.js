// Sync widget overlays with media blocks

import WidgetCode from './widget-code'

const WidgetTypes = {
  code: WidgetCode
}

function getIndexWithId (array, id) {
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i]
    if (item.id === id) {
      return i
    }
  }
  return -1
}

function getItemWithId (array, id) {
  let index = getIndexWithId(array, id)
  if (index === -1) return
  return array[index]
}

// Functions to bind in class constructor

function onDOMChanged () {
  let els = this.ed.pm.content.querySelectorAll('div[grid-type]')
  for (let i = 0, len = els.length; i < len; i++) {
    let el = els[i]
    let id = el.getAttribute('grid-id')
    let type = el.getAttribute('grid-type')
    if (!id || !type) {
      throw new Error('Bad placeholder!')
    }
    let rect = el.getBoundingClientRect()
    let rectangle = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    }
    this.checkWidget(id, type, rectangle)
  }
}

function checkWidget (id, type, rectangle) {
  if (this.widgets[id]) {
    // Move it
    this.widgets[id].move(rectangle)
  } else {
    // Make it
    this.initializeWidget(id, type, rectangle)
  }
}

function initializeWidget (id, type, rectangle) {
  if (!WidgetTypes[type]) return

  let initialBlock = getItemWithId(this.ed._content, id)

  this.widgets[id] = new WidgetTypes[type]({
    widgetContainer: this.el,
    initialRectangle: rectangle,
    initialBlock: initialBlock
  })
}

function onIframeMessage (message) {
  if (message.data.topic !== 'changed') return

  let block = message.data.payload
  if (!block || !block.id) return

  var index = getIndexWithId(this.ed._content, block.id)
  if (index === -1) return

  this.ed._content.splice(index, 1, block)
}

// The plugin

export default class PluginWidget {
  constructor (ed) {
    this.onDOMChanged = onDOMChanged.bind(this)
    this.checkWidget = checkWidget.bind(this)
    this.initializeWidget = initializeWidget.bind(this)
    this.onIframeMessage = onIframeMessage.bind(this)

    this.ed = ed
    this.widgets = {}
    this.el = document.createElement('div')
    this.el.className = 'GridEdWidgets'
    document.body.appendChild(this.el)

    this.ed.pm.on('flushed', this.onDOMChanged)
    window.addEventListener('resize', this.onDOMChanged)
    window.addEventListener('message', this.onIframeMessage)
  }
  teardown () {
    this.ed.pm.off('flushed', this.onDOMChanged)
    window.removeEventListener('resize', this.onDOMChanged)
    window.removeEventListener('message', this.onIframeMessage)

    this.el.parentNode.removeChild(this.el)
  }
}
