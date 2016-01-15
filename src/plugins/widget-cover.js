import WidgetBase from './widget-base'

export default class WidgetCover extends WidgetBase {
  static type () { return 'cover' }
  constructor (options) {
    super(options)
  }
}
