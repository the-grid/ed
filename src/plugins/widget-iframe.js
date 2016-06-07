import WidgetBase from './widget-base'

function postInitialBlock () {
  this.postMessage('setblock', this.initialBlock)
  delete this.initialBlock

  this.initialized = true

  if (this.initialFocus) {
    this.focus()
  }
}

function onDragStart (event) {
  console.log('ds', event.dataTransfer.files.length)
  this.dropEl.style.display = 'block'
}

function onDragEnd (event) {
  this.dropEl.style.display = 'none'
}


export default class WidgetIframe extends WidgetBase {
  static type () { return 'iframe -- extend me' }
  src () { return 'about:blank' }
  constructor (options) {
    super(options)
    this.postInitialBlock = postInitialBlock.bind(this)
    this.onDragStart = onDragStart.bind(this)
    this.onDragEnd = onDragEnd.bind(this)

    this.initialFocus = options.initialFocus

    this.frame = document.createElement('iframe')
    this.frame.setAttribute('grid-id', options.id)
    if (options.initialBlock) {
      this.initialized = false
      this.initialBlock = options.initialBlock
      this.frame.addEventListener('load', this.postInitialBlock)
    }
    this.frame.src = this.src()
    this.el.appendChild(this.frame)

    this.height = 250

    this.el.style.position = 'relative'

    this.dropEl = document.createElement('div')
    this.dropEl.style.position = 'absolute'
    this.dropEl.style.top = 0
    this.dropEl.style.right = 0
    this.dropEl.style.bottom = 0
    this.dropEl.style.left = 0
    this.dropEl.style.display = 'none'
    this.dropEl.style.backgroundColor = 'red'
    this.el.appendChild(this.dropEl)

    window.addEventListener('dragover', this.onDragStart)
    window.addEventListener('dragexit', this.onDragEnd)
  }
  teardown () {
    if (this.initialBlock) {
      this.frame.removeEventListener('load', this.postInitialBlock)
    }
    // window.removeEventListener('dragstart', this.onDragStart)
    // window.removeEventListener('dragover', this.onDragStart)
    // window.removeEventListener('dragleave', this.onDragEnd)
    // window.removeEventListener('dragexit', this.onDragEnd)
    // window.removeEventListener('dragend', this.onDragEnd)
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
