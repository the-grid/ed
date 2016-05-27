import React, {createElement as el} from 'react'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import {buttonStyle, containerStyle} from './add-cover'

class AddFold extends React.Component {
  constructor (props, context) {
    super(props)

    this.state = {hasFold: false}

    const {store} = context
    this.boundUpdateHints = this.updateHints.bind(this)
    store.on('plugin.contenthints', this.boundUpdateHints)
  }
  componentWillUnmount () {
    const {store} = this.context
    store.off('plugin.contenthints', this.boundUpdateHints)
  }
  render () {
    const {hasFold} = this.state
    if (hasFold) return null

    return el('div'
    , { className: 'AddFold'
      , style: containerStyle
      }
    , this.renderAddImage()
    )
  }
  renderAddImage () {
    return el(ButtonOutline
    , { style: buttonStyle
      , onClick: this.addImage.bind(this)
      , rounded: true
      }
    , 'Make Full Post'
    )
  }
  addImage () {
    const {store} = this.context
    store.routeChange('ADD_FOLD_DELIMITER')
    this.setState({hasFold: true})
  }
  updateHints (hints) {
    const {hasFold} = hints
    this.setState({hasFold})
  }
}
AddFold.contextTypes = { store: React.PropTypes.object }
export default React.createFactory(AddFold)
