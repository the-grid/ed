export default class WidgetIframe {
  static type () { return 'iframe -- extend me' }
  src () { return 'about:blank' }
  constructor (options) {
    this.el = document.createElement('iframe')
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
    this.el.parentNode.removeChild(this.el)
  }
}
