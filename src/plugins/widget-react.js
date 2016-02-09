import WidgetBase from './widget-base'
import ReactDOM from 'react-dom'

import Placeholder from '../components/placeholder'
import AttributionEditor from '../components/attribution-editor'

const Components = {
  placeholder: Placeholder,
  attribution: AttributionEditor
}

export default class WidgetReact extends WidgetBase {
  static type () { return 'react' }
  constructor (options) {
    super(options)
    this.onChange = onChange.bind(this)

    const props = {
      initialBlock: this.initialBlock,
      onChange: this.onChange,
      imgfloConfig: this.ed.imgfloConfig
    }

    const {type} = this.initialBlock
    let Component = Components[type] || Components.attribution
    this.mounted = ReactDOM.render(new Component(props), this.el)
  }
}

function onChange (path, value) {
  // Mutate block
  let block = this.initialBlock
  let parent = this.initialBlock.metadata
  for (let i = 0, length = path.length; i < length - 1; i++) {
    parent = parent[path[i]]
  }
  parent[path[path.length - 1]] = value

  // Send change up
  this.ed.updateMediaBlock(block)

  // Send change down
  this.mounted.setState({block})
}
