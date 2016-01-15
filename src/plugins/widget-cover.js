import WidgetBase from './widget-base'

export default class WidgetCover extends WidgetBase {
  static type () { return 'cover' }
  constructor (options) {
    super()

    this.el = document.createElement('div')
    this.el.setAttribute('grid-id', options.id)
    this.initialBlock = options.initialBlock
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
