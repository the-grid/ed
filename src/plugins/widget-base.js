export default class WidgetBase {
  static type () { return 'base -- extend me' }
  constructor (options) {
    this.ed = options.ed
    this.type = options.type

    // Cache these so we don't hit DOM unless needed
    this.shown = true
    this.top = 0
    this.left = 0
    this.width = 1
    this.height = 1

    // Base div container
    this.el = document.createElement('div')
    this.el.setAttribute('grid-id', options.id)
    this.initialBlock = options.initialBlock
    this.el.style.position = 'absolute'
    this.move(options.initialRectangle)
    options.widgetContainer.appendChild(this.el)
  }
  teardown () {
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
  getHeight () {
    if (this.el.firstChild) {
      return this.el.firstChild.scrollHeight
    }
    return 25
  }
}
