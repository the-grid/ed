/*
* Plugin to sync widget overlays with media blocks
*/

require('./widget.css')

import _ from '../util/lodash'
import {UpdateScheduler} from 'prosemirror/src/ui/update'

// WidgetTypes keys correspond with PM media block's grid-type attribute

import WidgetIframe from './widget-iframe'
import WidgetReact from './widget-react'

const WidgetTypes =
  { code: WidgetIframe
  , location: WidgetIframe
  , react: WidgetReact
  }

// Functions to bind in class constructor

// Should use debounced version
function onDOMChanged () {
  // Mount or move widget overlays
  const els = this.pm.content.children
  let inDoc = []
  let heightChanges = []
  let idDuplicates = []
  for (let i = 0, len = els.length; i < len; i++) {
    const el = els[i]
    const id = el.getAttribute('grid-id')
    if (!id) {
      // Not a media block
      continue
    }
    const type = el.getAttribute('grid-type')
    if (!type) {
      throw new Error('Bad placeholder!')
    }
    if (inDoc.indexOf(id) !== -1) {
      idDuplicates.push(id)
    }
    inDoc.push(id)
    const rectangle =
      { top: el.offsetTop
      , left: el.offsetLeft
      , width: el.offsetWidth
      , height: el.offsetHeight
      }
    // HACK paste iframe, queue cached height for placeholder
    if (rectangle.height === 0 && this.widgets[id] && this.widgets[id].height) {
      heightChanges.push(
        { id: id
        , height: this.widgets[id].height
        }
      )
    }
    const initialFocus = (el.getAttribute('grid-initial-focus') === 'true')
    this.checkWidget(id, type, rectangle, initialFocus)
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

  // Measure inner heights of widgets
  for (let i = 0, len = inDOM.length; i < len; i++) {
    const id = inDOM[i]
    const widget = this.widgets[id]
    if (!widget.shown) continue
    const innerHeight = widget.getHeight()
    if (innerHeight !== widget.height) {
      heightChanges.push(
        { id: id
        , height: innerHeight
        }
      )
    }
  }
  if (heightChanges.length) {
    // Will trigger a redraw / this onDOMChanged again
    this.editableView.updatePlaceholderHeights(heightChanges)
  }

  // Copy & pasted
  if (idDuplicates.length) {
    this.ed.routeChange('DEDUPE_IDS')
    return
  }

  // Signal widgets initialized if first
  if (!this.initialized) {
    this.initialized = true
    this.ed.trigger('plugin.widget.initialized')
  }
}

function checkWidget (id, type, rectangle, initialFocus) {
  let widget = this.widgets[id]
  if (widget && widget.type !== type) {
    // Remove it
    widget.teardown()
    // Will be overwritten in initializeWidget
    widget = null
  }
  if (widget) {
    // Move it
    widget.move(rectangle)
  } else {
    // Make it
    this.initializeWidget(id, type, rectangle, initialFocus)
  }
}

function initializeWidget (id, type, rectangle, initialFocus) {
  let Widget = WidgetTypes[type] || WidgetTypes.react

  let initialBlock = this.ed.getBlock(id)

  if (!initialBlock) {
    initialBlock = this.initializeBlock(id, type)
  }

  if (!initialBlock) {
    throw new Error('Block does not exist in content')
  }

  this.widgets[id] = new Widget(
    { ed: this.ed
    , id
    , type
    , initialBlock
    , widgetContainer: this.el
    , initialRectangle: rectangle
    , initialFocus
    , widgetPath: this.widgetPath
    }
  )

  this.pm.signal('ed.plugin.widget.one.initialized', id)
}

function initializeBlock (id, type) {
  const block =
    { id
    , type
    , html: ''
    , metadata: {}
    }
  this.ed._initializeContent([block])
  return this.ed.getBlock(id)
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
      this.ed.routeChange('MEDIA_BLOCK_UPDATE', block)
      break
    case 'height':
      if (isNaN(message.data.payload)) throw new Error('Iframe height message with non-numeric payload')
      this.editableView.updatePlaceholderHeights([
        { id: message.data.id
        , height: message.data.payload
        }
      ])
      break
    case 'cursor':
    default:
      break
  }
}


// The plugin

export default class PluginWidget {
  constructor (options) {
    this.onDOMChanged = onDOMChanged.bind(this)
    this.debouncedDOMChanged = _.debounce(this.onDOMChanged, 50)
    this.checkWidget = checkWidget.bind(this)
    this.initializeWidget = initializeWidget.bind(this)
    this.onIframeMessage = onIframeMessage.bind(this)
    this.initializeBlock = initializeBlock.bind(this)

    this.initialized = false

    this.ed = options.ed
    this.editableView = options.editableView
    this.pm = options.pm
    this.widgetPath = options.widgetPath

    this.widgets = {}
    this.el = document.createElement('div')
    this.el.className = 'EdPlugins-Widgets'
    options.container.appendChild(this.el)

    this.updater = new UpdateScheduler(this.pm, 'draw flush', this.debouncedDOMChanged)
    this.updater.force()
    this.interval = window.setInterval(this.debouncedDOMChanged, 1000)
    window.addEventListener('resize', this.debouncedDOMChanged)
    window.addEventListener('message', this.onIframeMessage)
  }
  teardown () {
    this.updater.detach()
    window.clearInterval(this.interval)
    window.removeEventListener('resize', this.debouncedDOMChanged)
    window.removeEventListener('message', this.onIframeMessage)

    this.el.parentNode.removeChild(this.el)
  }
}
