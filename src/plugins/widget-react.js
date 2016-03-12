import WidgetBase from './widget-base'
import ReactDOM from 'react-dom'

import Placeholder from '../components/placeholder'
import AttributionEditor from '../components/attribution-editor'

const Components =
  { placeholder: Placeholder
  , attribution: AttributionEditor
  }


export default class WidgetReact extends WidgetBase {
  static type () { return 'react' }
  constructor (options) {
    super(options)
    if (!this.initialBlock) {
      throw new Error('WidgetReact needs to be mounted with initialBlock')
    }

    this.mount()
  }
  mount () {
    const props =
      { initialBlock: this.initialBlock
      , id: this.initialBlock.id
      , onChange: this.onChange
      , imgfloConfig: this.ed.imgfloConfig
      , store: this.ed
      }

    const {type} = this.initialBlock
    let Component = Components[type] || Components.attribution
    this.mounted = ReactDOM.render(new Component(props), this.el)
  }
}
