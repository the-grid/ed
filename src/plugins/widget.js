// Sync widget overlays with media blocks

import WidgetCode from './widget-code'

const WidgetTypes = {
  code: WidgetCode
}

// Functions to bind in class constructor

function onDOMChanged () {
  // Mount or move widget overlays
  let els = this.ed.pm.content.querySelectorAll('div[grid-type]')
  let inDoc = []
  for (let i = 0, len = els.length; i < len; i++) {
    let el = els[i]
    let id = el.getAttribute('grid-id')
    let type = el.getAttribute('grid-type')
    if (!id || !type) {
      throw new Error('Bad placeholder!')
    }
    inDoc.push(id)
    let rect = el.getBoundingClientRect()
    let rectangle = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    }
    this.checkWidget(id, type, rectangle)
  }

  // Hide or show widgets
  let inDOM = Object.keys(this.widgets)
  for (let i = 0, len = inDOM.length; i < len; i++) {
    let key = inDOM[i]
    let widget = this.widgets[key]
    if (inDoc.indexOf(key) !== -1) {
      widget.show()
    } else {
      widget.hide()
    }
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

  let initialBlock = this.ed.getBlock(id)

  this.widgets[id] = new WidgetTypes[type]({
    id: id,
    widgetContainer: this.el,
    initialRectangle: rectangle,
    initialBlock: initialBlock
  })
}

function onIframeMessage (message) {
  let fromId = message.source.frameElement.getAttribute('grid-id')
  switch (message.data.topic) {
    case 'changed':
      let block = message.data.payload
      // FIXME should `data.id` be part of every message?
      if (fromId !== block.id) return
      this.ed.updateMediaBlock(block)
      break
    case 'height':
    case 'cursor':
    default:
      break
  }
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
    this.el.className = 'EdPlugins-Widgets'
    this.ed.pluginContainer.appendChild(this.el)

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
