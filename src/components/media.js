import React, {createElement as el} from 'react'
import _ from '../util/lodash'

import Placeholder from './placeholder'
import AttributionEditor from './attribution-editor'
import rebassTheme from './rebass-theme'

const Components =
  { placeholder: Placeholder
  , attribution: AttributionEditor
  }

class Media extends React.Component {
  constructor (props) {
    super(props)

    const initialBlock = _.cloneDeep(props.initialBlock)
    const {id} = initialBlock
    this.state = {id, initialBlock}

    const {store} = props
    this.boundUpdateBlock = this.updateBlock.bind(this)
    store.on('media.update', this.boundUpdateBlock)
  }
  componentWillUnmount () {
    const {store} = this.props
    store.off('media.update', this.boundUpdateBlock)
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
    const {initialBlock, id} = this.state
    const {type} = initialBlock
    let Component = Components[type] || Components.attribution
    return el(Component
    , { initialBlock
      , id
      }
    )
  }
  updateBlock () {
    const {store} = this.props
    const {id, initialBlock} = this.state
    const block = _.cloneDeep(store.getBlock(id))
    if (_.isEqual(initialBlock, block)) {
      return
    }
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
  , imgfloConfig: React.PropTypes.object
  }
export default React.createFactory(Media)
