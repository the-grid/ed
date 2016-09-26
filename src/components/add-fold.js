import React, {createElement as el} from 'react'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import {buttonStyle} from './add-cover'

class AddFold extends React.Component {
  constructor (props, context) {
    super(props)

    this.state = {hasFold: false}

    this.boundUpdateHints = this.updateHints.bind(this)
    this.boundAddFold = this.addFold.bind(this)

    const {store} = context
    store.on('plugin.contenthints', this.boundUpdateHints)
  }
  componentWillUnmount () {
    const {store} = this.context
    store.off('plugin.contenthints', this.boundUpdateHints)
  }
  render () {
    const {hasFold} = this.state
    if (hasFold) return null

    return el(ButtonOutline
    , { id: 'AddFold'
      , style: buttonStyle
      , onClick: this.boundAddFold
      , rounded: true
      }
    , 'Make Full Post'
    )
  }
  addFold () {
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
