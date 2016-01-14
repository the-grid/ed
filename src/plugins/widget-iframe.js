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
  move (rectangle) {
    if (this.top !== rectangle.top) {
      this.el.style.top = rectangle.top + 'px'
      this.top = rectangle.top
    }
    if (this.left !== rectangle.left) {
      this.el.style.left = rectangle.left + 'px'
      this.left = rectangle.left
    }
    if (this.width !== rectangle.width) {
      this.el.style.width = rectangle.width + 'px'
      this.width = rectangle.width
    }
    if (this.height !== rectangle.height) {
      this.el.style.height = rectangle.height + 'px'
      this.height = rectangle.height
    }
  }
  show () {
    if (!this.shown) {
      this.el.style.display = 'block'
      this.shown = true
    }
  }
  hide () {
    if (this.shown) {
      this.el.style.display = 'none'
      this.shown = false
    }
  }
}
