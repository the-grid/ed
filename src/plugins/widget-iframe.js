import WidgetBase from './widget-base'

function postInitialBlock () {
  this.postMessage(this.initialBlock)
}

function postMessage (message) {
  this.el.contentWindow.postMessage({
    topic: 'setblock',
    payload: message
  }, '*')
}

export default class WidgetIframe extends WidgetBase {
  static type () { return 'iframe -- extend me' }
  src () { return 'about:blank' }
  constructor (options) {
    super()
    this.postInitialBlock = postInitialBlock.bind(this)
    this.postMessage = postMessage.bind(this)

    this.el = document.createElement('iframe')
    this.el.setAttribute('grid-id', options.id)
    if (options.initialBlock) {
      this.initialBlock = options.initialBlock
      this.el.addEventListener('load', this.postInitialBlock)
    }
    this.el.src = this.src()
    this.el.style.position = 'absolute'
    this.move(options.initialRectangle)
    options.widgetContainer.appendChild(this.el)
  }
  teardown () {
    if (this.initialBlock) {
      this.el.removeEventListener('load', this.postInitialBlock)
    }
    this.el.parentNode.removeChild(this.el)
  }
}
