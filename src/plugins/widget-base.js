export default class WidgetBase {
  static type () { return 'base -- extend me' }
  constructor (options) {
    this.ed = options.ed
    this.type = options.type

    // Cache these so we don't hit DOM unless needed
    this.shown = true

    // Base div container
    this.el = document.createElement('div')
    this.id = options.id
    this.initialBlock = options.initialBlock
    options.widgetContainer.appendChild(this.el)
    
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


function stopPropagation (event) {
  event.stopPropagation()
}