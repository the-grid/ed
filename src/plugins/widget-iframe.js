function postInitialBlock () {
  this.postMessage(this.initialBlock)
}

function postMessage (message) {
  this.el.contentWindow.postMessage({
    topic: 'setblock',
    payload: message
  }, '*')
}

export default class WidgetIframe {
  static type () { return 'iframe -- extend me' }
  src () { return 'about:blank' }
  constructor (options) {
    this.postInitialBlock = postInitialBlock.bind(this)
    this.postMessage = postMessage.bind(this)

    this.el = document.createElement('iframe')
    if (options.initialBlock) {
      this.initialBlock = options.initialBlock
      this.el.addEventListener('load', this.postInitialBlock)
    }
    this.el.src = this.src()
    this.el.width = 640
    this.el.height = 320
    this.el.style.position = 'absolute'
    this.el.style.top = options.initialRectangle.top + 'px'
    this.el.style.left = options.initialRectangle.left + 'px'
    options.widgetContainer.appendChild(this.el)
  }
  move (rectangle) {
    this.el.style.top = rectangle.top + 'px'
    this.el.style.left = rectangle.left + 'px'
  }
  teardown () {
    if (options.initialBlock) {
      this.el.removeEventListener('load', this.postInitialBlock)
    }
    this.el.parentNode.removeChild(this.el)
  }
}
