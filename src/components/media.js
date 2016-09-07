import React, {createElement as el} from 'react'
import _ from '../util/lodash'

import Placeholder from './placeholder'
import AttributionEditor from './attribution-editor'
import WidgetCta from './widget-cta'
import WidgetUnsupported from './widget-unsupported'
import rebassTheme from './rebass-theme'

const Components =
  { placeholder: Placeholder
  , cta: WidgetCta
  , image: AttributionEditor
  , video: AttributionEditor
  , article: AttributionEditor
  , interactive: AttributionEditor
  , unsupported: WidgetUnsupported
  }


class Media extends React.Component {
  constructor (props) {
    super(props)

    const {initialBlock} = props
    const {id} = initialBlock
    this.state = {id, initialBlock}

    const {store} = props
    this.boundUpdateBlock = this.updateBlock.bind(this)
    this.boundUpdateBlockAll = this.updateBlockAll.bind(this)
    store.on('media.update.id', this.boundUpdateBlock)
    store.on('media.update', this.boundUpdateBlockAll)
  }
  componentWillUnmount () {
    const {store} = this.props
    store.off('media.update.id', this.boundUpdateBlock)
    store.off('media.update', this.boundUpdateBlockAll)
  }
  getChildContext () {
    return (
      { imgfloConfig: (this.context.imgfloConfig || this.props.imgfloConfig)
      , store: (this.context.store || this.props.store)
      , rebass: rebassTheme
      }
    )
  }
  render () {
    const {coverPrefs} = this.props
    const {initialBlock, id} = this.state
    const {type} = initialBlock
    let Component = Components[type] || Components.unsupported
    return el(Component
    , { initialBlock
      , id
      , coverPrefs
      }
    )
  }
  updateBlock (updateId) {
    const {id} = this.state
    if (id !== updateId) {
      return
    }
    const {store} = this.props
    const initialBlock = store.getBlock(id)
    if (!initialBlock) return
    this.setState({initialBlock})
  }
  updateBlockAll () {
    const {store} = this.props
    const {id, initialBlock} = this.state
    const block = store.getBlock(id)
    if (!block) return
    // Needed to speed up ed.setContent
    // and not render every block every time
    if (_.isEqual(initialBlock, block)) return
    this.setState({initialBlock: block})
  }
}
Media.contextTypes =
  { imgfloConfig: React.PropTypes.object
  , store: React.PropTypes.object
  }
Media.childContextTypes =
  { imgfloConfig: React.PropTypes.object
  , rebass: React.PropTypes.object
  , store: React.PropTypes.object
  }
Media.propTypes =
  { initialBlock: React.PropTypes.object.isRequired
  , store: React.PropTypes.object.isRequired
  , coverPrefs: React.PropTypes.object.isRequired
  , imgfloConfig: React.PropTypes.object
  }
export default React.createFactory(Media)
