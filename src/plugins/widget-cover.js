import AttributionEditor from './components/attribution-editor'
import WidgetBase from './widget-base'
import ReactDOM from 'react-dom'

function onChange (block) {
  console.log(block)
}

export default class WidgetCover extends WidgetBase {
  static type () { return 'cover' }
  constructor (options) {
    super(options)
    this.onChange = onChange.bind(this)

    let props = {
      initialBlock: this.initialBlock,
      onChange: this.onChange
    }

    let component = new AttributionEditor(props)
    ReactDOM.render(component, this.el)
  }
}
