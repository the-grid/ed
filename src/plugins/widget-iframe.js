import WidgetBase from './widget-base'
import IframeInfo from './iframe-info'

function preventDefault (event) {
  event.preventDefault()
}

function postInitialBlock () {
  this.postMessage('setblock', this.initialBlock)
  delete this.initialBlock

  this.initialized = true

  if (this.initialFocus) {
    this.focus()
  }

  // Swallow file drop on iframe widgets
  this.frame.contentWindow.addEventListener('dragover', preventDefault)
  this.frame.contentWindow.addEventListener('drop', preventDefault)
}


export default class WidgetIframe extends WidgetBase {
  static type () { return 'iframe -- extend me' }
  src () { return 'about:blank' }
  constructor (options) {
    super(options)

    const widget = IframeInfo[options.widgetType]
    if (!widget) {
      throw new Error('No iframe widget of that type')
    }

    this.postInitialBlock = postInitialBlock.bind(this)

    this.initialFocus = options.initialFocus

    this.frame = document.createElement('iframe')
    this.frame.setAttribute('grid-id', options.id)
    if (options.initialBlock) {
      this.initialized = false
      this.initialBlock = options.initialBlock
      this.frame.addEventListener('load', this.postInitialBlock)
    }
    this.frame.src = options.widgetPath + widget.src
    this.el.appendChild(this.frame)

    this.height = widget.initialHeight
  }
  teardown () {
    if (this.initialBlock) {
      this.frame.removeEventListener('load', this.postInitialBlock)
    }
    super.teardown()
  }
  getHeight () {
    // Don't measure from outside: iframes report own height
    return this.height
  }
  postMessage (topic, payload) {
    this.frame.contentWindow.postMessage({topic, payload}, '*')
  }
  focus () {
    if (!this.frame || !this.initialized) return
    this.postMessage('focus')
  }
}
