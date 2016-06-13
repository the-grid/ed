import React, {createElement as el} from 'react'
import ButtonOutline from 'rebass/dist/ButtonOutline'

export const buttonStyle =
  { textTransform: 'uppercase'
  , borderRadius: 4
  , padding: '10px 16px'
  , margin: '0.25em 0.5em'
  }

export const containerStyle =
  { margin: '0 auto'
  , position: 'relative'
  , textAlign: 'center'
  , padding: '0.75em'
  }

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
    , { className: 'AddCover'
      , style: containerStyle
      }
    , this.renderAddImage()
    )
  }
  renderAddImage () {
    return el(ButtonOutline
    , { style: buttonStyle
      , onClick: this.boundAddImage
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
