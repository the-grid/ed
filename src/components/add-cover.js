import React, {createElement as el} from 'react'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import {containerClassName} from './add-x-style'


class AddCover extends React.Component {
  constructor (props, context) {
    super(props)

    this.state = {hasCover: false}

    this.boundUpdateHints = this.updateHints.bind(this)
    this.boundAddImage = this.addImage.bind(this)

    const {store} = context
    store.on('plugin.contenthints', this.boundUpdateHints)
  }
  componentWillUnmount () {
    const {store} = this.context
    store.off('plugin.contenthints', this.boundUpdateHints)
  }
  render () {
    const {hasCover} = this.state
    if (hasCover) return null

    return el('div'
    , { className: 'AddCover ' + containerClassName }
    , this.renderAddImage()
    )
  }
  renderAddImage () {
    return el(ButtonOutline
    , { onClick: this.boundAddImage
      , rounded: true
      }
    , 'Add Image'
    )
  }
  addImage () {
    const {store} = this.context
    store.routeChange('ADD_IMAGE_TOP')
  }
  updateHints (hints) {
    const {hasCover} = hints
    this.setState({hasCover})
  }
}
AddCover.contextTypes = { store: React.PropTypes.object }
export default React.createFactory(AddCover)
