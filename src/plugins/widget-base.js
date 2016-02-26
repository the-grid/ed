function stopPropagation (event) {
  event.stopPropagation()
}

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
    this.height = 50

    // Base div container
    this.el = document.createElement('div')
    this.el.setAttribute('grid-id', options.id)
    this.initialBlock = options.initialBlock
    this.container = options.widgetContainer
    this.container.appendChild(this.el)
    // Don't let contenteditable flow get events
    this.el.addEventListener('mousedown', stopPropagation)
    this.el.addEventListener('mouseup', stopPropagation)
    this.el.addEventListener('click', stopPropagation)
    this.el.addEventListener('keydown', stopPropagation)
    this.el.addEventListener('keyup', stopPropagation)
    this.el.addEventListener('keypress', stopPropagation)
  }
  teardown () {
    this.el.parentNode.removeChild(this.el)
  }
  checkMounted (container) {
    if (this.el && this.container !== container) {
      this.container = container
      this.container.appendChild(this.el)
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
    if (this.el && this.el.firstChild) {
      return this.el.firstChild.scrollHeight
    }
    return this.height
  }
}
