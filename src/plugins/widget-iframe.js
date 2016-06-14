import WidgetBase from './widget-base'

const Widgets =
  { code:
      { src: '@the-grid/ced/editor/index.html'
      , initialHeight: 50
      }
  , location:
      { src: '@the-grid/ed-location/index.html'
      , initialHeight: 320
      }
  }


function postInitialBlock () {
  this.postMessage('setblock', this.initialBlock)
  delete this.initialBlock

  this.initialized = true

  if (this.initialFocus) {
    this.focus()
  }
}

export default class WidgetIframe extends WidgetBase {
  static type () { return 'iframe -- extend me' }
  src () { return 'about:blank' }
  constructor (options) {
    super(options)

    const widget = Widgets[options.type]
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
