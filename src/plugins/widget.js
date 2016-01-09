// Sync widget overlays with media blocks

import WidgetCode from './widget-code'

const WidgetTypes = {
  code: WidgetCode
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

  let initialBlock = this.ed.getBlock(id)

  this.widgets[id] = new WidgetTypes[type]({
    widgetContainer: this.el,
    initialRectangle: rectangle,
    initialBlock: initialBlock
  })
}

function onIframeMessage (message) {
  if (message.data.topic !== 'changed') return

  let block = message.data.payload
  this.ed.updateMediaBlock(block)
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
