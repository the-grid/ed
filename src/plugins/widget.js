/*
* Plugin to sync widget overlays with media blocks
*/

require('./widget.css')

import _ from '../util/lodash'

// WIDGET_TYPES keys correspond with PM media block's grid-widget attribute

import WidgetIframe from './widget-iframe'
import WidgetReact from './widget-react'

const WIDGET_TYPES =
  { code: WidgetIframe
  , location: WidgetIframe
  , userhtml: WidgetIframe
  , placeholder: WidgetReact
  , cta: WidgetReact
  , default: WidgetReact
  }

// Functions to bind in class constructor

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
      if (isNaN(message.data.payload)) {
        throw new Error('Iframe height message with non-numeric payload')
      }
      this.scheduledHeightUpdates.push(
        { id: message.data.id
        , height: message.data.payload
        }
      )
      this.triggerUpdate()
      break
    case 'cursor':
    default:
      break
  }
}


// The plugin

export default class PluginWidget {
  constructor (pm, options) {
    this.onIframeMessage = onIframeMessage.bind(this)
    this.initializeBlock = initializeBlock.bind(this)
    this.boundReadDOM = this.readDOM.bind(this)
    this.boundTriggerUpdate = this.triggerUpdate.bind(this)
    this.debouncedTriggerUpdate = _.debounce(this.boundTriggerUpdate, 50)

    this.initialized = false

    this.ed = options.ed
    this.editableView = options.editableView
    this.pm = pm
    this.widgetPath = options.widgetPath
    this.coverPrefs = options.coverPrefs || {}
    this.featureFlags = options.featureFlags || {}

    this.widgets = {}
    this.el = document.createElement('div')
    this.el.className = 'EdPlugins-Widgets'
    options.container.appendChild(this.el)
    this.scheduledHeightUpdates = []

    // Seems to work better to read first, despite docs:
    // http://prosemirror.net/version/0.8.0.html#ProseMirror.scheduleDOMUpdate
    const {draw} = this.pm.on
    this.updater = this.pm.updateScheduler([draw], this.boundReadDOM)
    this.updater.force()
    this.interval = window.setInterval(this.debouncedTriggerUpdate, 1000)
    window.addEventListener('resize', this.debouncedTriggerUpdate)
    window.addEventListener('message', this.onIframeMessage)
  }
  detach () {
    this.updater.detach()
    window.clearInterval(this.interval)
    window.removeEventListener('resize', this.debouncedTriggerUpdate)
    window.removeEventListener('message', this.onIframeMessage)

    this.el.parentNode.removeChild(this.el)

    this.ed.trigger('plugin.widget.one.detach')
  }
  triggerUpdate () {
    const update = () => this.updater.force()
    setTimeout(update, 0)
  }
  readDOM () {
    // Should read DOM, not write
    let inDOM = Object.keys(this.widgets)
    let inDoc = []

    let toInit = []
    let toMove = []
    let toHide = []
    let toShow = []
    let toUndupe = []
    let toChangeHeight = this.scheduledHeightUpdates
    this.scheduledHeightUpdates = []

    const els = this.pm.content.children
    for (let i = 0, len = els.length; i < len; i++) {
      const el = els[i]
      const id = el.getAttribute('grid-id')
      if (!id) {
        // Not a media block
        continue
      }
      const type = el.getAttribute('grid-type')
      const widgetType = el.getAttribute('grid-widget')
      if (!type || !widgetType) {
        throw new Error('Bad placeholder div!')
      }
      if (inDoc.indexOf(id) !== -1) {
        toUndupe.push(id)
      }
      inDoc.push(id)
      const rectangle =
        { top: el.offsetTop
        , left: el.offsetLeft
        , width: el.offsetWidth
        , height: el.offsetHeight
        }
      const widget = this.widgets[id]
      let needsReInit = false
      if (widget && widget.type !== type) {
        // Need to re-initialize new widget type
        widget.detach()
        needsReInit = true
      }
      // Queue init
      if (!widget || needsReInit) {
        const initialFocus = (el.getAttribute('grid-initial-focus') === 'true')
        toInit.push({id, type, widgetType, rectangle, initialFocus})
        continue
      }
      if (!widget.shown) continue
      // Queue move
      toMove.push({id, rectangle})
      // Queue height
      const innerHeight = widget.getHeight()
      if (innerHeight !== widget.height) {
        toChangeHeight.push(
          { id: id
          , height: innerHeight
          }
        )
      }
      // HACK paste iframe, queue cached height for placeholder
      // if (rectangle.height === 0 && this.widgets[id] && this.widgets[id].height) {
      //   toChangeHeight.push(
      //     { id: id
      //     , height: this.widgets[id].height
      //     }
      //   )
      // }
    }

    // Queue hide or show widgets
    for (let i = 0, len = inDOM.length; i < len; i++) {
      const id = inDOM[i]
      if (inDoc.indexOf(id) !== -1) {
        toShow.push(id)
      } else {
        toHide.push(id)
      }
    }

    return () => this.writeDOM(toInit, toMove, toHide, toShow, toUndupe, toChangeHeight)
  }
  writeDOM (toInit, toMove, toHide, toShow, toUndupe, toChangeHeight) {
    if (toUndupe.length) {
      this.ed.routeChange('DEDUPE_IDS')
      return
    }
    toInit.forEach((config) => this.writeWidgetInit(config))
    toMove.forEach((config) => this.writeWidgetMove(config))
    toHide.forEach((config) => this.writeWidgetHide(config))
    toShow.forEach((config) => this.writeWidgetShow(config))
    toChangeHeight.forEach((config) => this.writePlaceholderHeight(config))
    if (!this.initialized) {
      this.initialized = true
      this.ed.trigger('plugin.widget.initialized', this)
    }
    if (toInit.length || toChangeHeight.length) {
      // Loop to remeasure and move
      return this.boundReadDOM
    }
  }
  writeWidgetInit ({id, type, widgetType, rectangle, initialFocus}) {
    let Widget = WIDGET_TYPES[widgetType] || WIDGET_TYPES.default

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
      , widgetType
      , initialBlock
      , widgetContainer: this.el
      , initialRectangle: rectangle
      , initialFocus
      , widgetPath: this.widgetPath
      , coverPrefs: this.coverPrefs
      , featureFlags: this.featureFlags
      }
    )

    this.ed.trigger('plugin.widget.one.initialized', id)
  }
  writeWidgetMove ({id, rectangle}) {
    this.widgets[id].move(rectangle)
  }
  writeWidgetHide (id) {
    this.widgets[id].hide()
  }
  writeWidgetShow (id) {
    this.widgets[id].show()
  }
  writePlaceholderHeight ({id, height}) {
    // TODO pm.tr interface
    const placeholder = this.pm.content.querySelector(`.EdSchemaMedia[grid-id="${id}"]`)
    placeholder.style.height = height + 'px'
  }

}
