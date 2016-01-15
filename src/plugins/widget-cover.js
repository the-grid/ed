import WidgetBase from './widget-base'

export default class WidgetCover extends WidgetBase {
  static type () { return 'cover' }
  constructor (options) {
    super(options)
    
    let {cover} = this.initialBlock
    if (cover && cover.src) {
      this.cover = document.createElement('div')
      this.cover.style.background = `url(${cover.src})`
      this.cover.style.backgroundRepeat = 'no-repeat'
      this.cover.style.backgroundSize = 'contain'
      this.cover.style.width = '50%'
      this.cover.style.height = '100%'
      this.el.appendChild(this.cover)
    }
  }
}
