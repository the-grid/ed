/*
* Plugin to sync widget overlays with media blocks
*/

require('./widget.css')

import _ from '../util/lodash'
import {UpdateScheduler} from 'prosemirror/src/ui/update'

// WidgetTypes keys correspond with PM media block's grid-type attribute

import WidgetCode from './widget-code'
import WidgetReact from './widget-react'

const WidgetTypes = {
  code: WidgetCode,
  react: WidgetReact
}

// Functions to bind in class constructor

// Should use debounced version
function onDOMChanged () {
  // Mount or move widget overlays
  const els = this.ed.pm.content.querySelectorAll('div[grid-type]')
  let inDoc = []
  for (let i = 0, len = els.length; i < len; i++) {
    const el = els[i]
    const id = el.getAttribute('grid-id')
    const type = el.getAttribute('grid-type')
    if (!id || !type) {
      throw new Error('Bad placeholder!')
    }
    inDoc.push(id)
    this.checkWidget(id, type, el)
  }

  // Hide or show widgets
  let inDOM = Object.keys(this.widgets)
  for (let i = 0, len = inDOM.length; i < len; i++) {
    const id = inDOM[i]
    const widget = this.widgets[id]
    if (inDoc.indexOf(id) !== -1) {
      widget.show()
    } else {
      widget.hide()
    }
  }

  // Signal widgets initialized if first
  if (!this.initialized) {
    this.initialized = true
    this.ed.pm.signal('ed.plugin.widget.initialized')
  }
}

function checkWidget (id, type, el) {
  let widget = this.widgets[id]
  if (widget && widget.type !== type) {
    // Remove it
    widget.teardown()
    // Will be overwritten in initializeWidget
    widget = null
  }
  if (widget) {
    // Check that widget container is still parent
    // For cut and paste, delete and undo
    widget.checkMounted(el)
  } else {
    // Make it
    this.initializeWidget(id, type, el)
  }
}

function initializeWidget (id, type, el) {
  let Widget = WidgetTypes[type] || WidgetTypes.react

  let initialBlock = this.ed.getBlock(id)

  this.widgets[id] = new Widget({
    ed: this.ed,
    id,
    type,
    widgetContainer: el,
    initialBlock: initialBlock
  })

  this.ed.pm.signal('ed.plugin.widget.one.initialized', id)
}

function onIframeMessage (message) {
  if (!message || !message.source || !message.source.frameElement) return
  const fromId = message.source.frameElement.getAttribute('grid-id')
  if (!fromId) return
  const messageId = message.data.id
  if (!messageId) throw new Error('Iframe widget message missing message.data.id')
  if (fromId !== messageId) throw new Error('Iframe message id does not match frame id')
  switch (message.data.topic) {
    case 'changed':
      let block = message.data.payload
      if (fromId !== block.id) throw new Error('Iframe block id does not match frame id')
      this.ed.updateMediaBlock(block)
      break
    case 'height':
      const {id, payload} = message.data
      if (isNaN(payload)) throw new Error('Iframe height message with non-numeric payload')
      this.widgets[id].setHeight(payload)
      break
    case 'cursor':
    default:
      break
  }
}

function updatePlaceholders () {
  const ids = Object.keys(this.widgets)
  for (let i = 0, length = ids.length; i < length; i++) {
    const id = ids[i]
    const widget = this.widgets[ids[i]]
    if (widget.type === 'placeholder') {
      const block = this.ed.getBlock(id)
      widget.initialBlock = block
      widget.mount()
    }
  }
}

// The plugin

export default class PluginWidget {
  constructor (ed) {
    this.onDOMChanged = onDOMChanged.bind(this)
    this.debouncedDOMChanged = _.debounce(this.onDOMChanged, 50)
    this.checkWidget = checkWidget.bind(this)
    this.initializeWidget = initializeWidget.bind(this)
    this.onIframeMessage = onIframeMessage.bind(this)
    this.updatePlaceholders = updatePlaceholders.bind(this)

    this.initialized = false

    this.ed = ed
    this.widgets = {}
    this.el = document.createElement('div')
    this.el.className = 'EdPlugins-Widgets'
    this.ed.pluginContainer.appendChild(this.el)

    this.updater = new UpdateScheduler(this.ed.pm, 'draw flush', this.debouncedDOMChanged)
    this.updater.force()
    this.ed.pm.on('ed.content.changed', this.updatePlaceholders)
    window.addEventListener('resize', this.debouncedDOMChanged)
    window.addEventListener('message', this.onIframeMessage)
  }
  teardown () {
    this.updater.detach()
    this.ed.pm.off('ed.content.changed', this.updatePlaceholders)
    window.removeEventListener('resize', this.debouncedDOMChanged)
    window.removeEventListener('message', this.onIframeMessage)

    this.el.parentNode.removeChild(this.el)
  }
}
