import WidgetBase from './widget-base'
import ReactDOM from 'react-dom'

import Media from '../components/media'


export default class WidgetReact extends WidgetBase {
  static type () { return 'react' }
  constructor (options) {
    super(options)
    if (!this.initialBlock || !this.initialBlock.id) {
      throw new Error('WidgetReact needs to be mounted with initialBlock')
    }

    this.mount()
  }
  mount () {
    const props =
      { initialBlock: this.initialBlock,
        id: this.initialBlock.id,
        onChange: this.onChange,
        imgfloConfig: this.ed.imgfloConfig,
        store: this.ed,
        coverPrefs: this.coverPrefs
      }

    this.mounted = ReactDOM.render(new Media(props), this.el)
  }
}
