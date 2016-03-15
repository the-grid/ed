import WidgetBase from './widget-base'

function postInitialBlock () {
  this.postMessage(this.initialBlock)
  delete this.initialBlock
}

function postMessage (message) {
  this.frame.contentWindow.postMessage({
    topic: 'setblock',
    payload: message
  }, '*')
}

export default class WidgetIframe extends WidgetBase {
  static type () { return 'iframe -- extend me' }
  src () { return 'about:blank' }
  constructor (options) {
    super(options)
    this.postInitialBlock = postInitialBlock.bind(this)
    this.postMessage = postMessage.bind(this)
    this.height = 1

    this.frame = document.createElement('iframe')
    this.frame.setAttribute('grid-id', options.id)
    if (options.initialBlock) {
      this.initialBlock = options.initialBlock
      this.frame.addEventListener('load', this.postInitialBlock)
    }
    this.frame.src = this.src()
    this.frame.style.border = 'none'
    this.frame.style.width = '100%'
    this.setHeight(240)
    this.el.appendChild(this.frame)
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
  setHeight (height) {
    if (this.height !== height) {
      this.height = height
      this.frame.style.height = height + 'px'
    }
  }
}
