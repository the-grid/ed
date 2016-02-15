import WidgetIframe from './widget-iframe'

export default class WidgetCode extends WidgetIframe {
  static type () { return 'code' }
  src () { return './node_modules/@the-grid/ced/editor/index.html' }
}
