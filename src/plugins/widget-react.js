import WidgetBase from './widget-base'
import ReactDOM from 'react-dom'

import Placeholder from './components/placeholder'
import AttributionEditor from './components/attribution-editor'

const Components = {
  placeholder: Placeholder,
  attribution: AttributionEditor
}

function onChange (block) {
  console.log(block)
}

export default class WidgetReact extends WidgetBase {
  static type () { return 'react' }
  constructor (options) {
    super(options)
    this.onChange = onChange.bind(this)

    const props = {
      initialBlock: this.initialBlock,
      onChange: this.onChange
    }

    const {type} = this.initialBlock
    let Component = Components[type] || Components.attribution
    ReactDOM.render(new Component(props), this.el)
  }
}
