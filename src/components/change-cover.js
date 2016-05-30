import React, {createElement as el} from 'react'
import ButtonOutline from 'rebass/dist/ButtonOutline'

class ChangeCover extends React.Component {
  render () {
    return el('div'
    , { className: 'ChangeCover'
      , style:
        { position: 'absolute'
        , top: '1rem'
        , right: '1rem'
        }
      }
    , this.renderButton()
    )
  }
  renderButton () {
    return el(ButtonOutline
    , { style:
        { backgroundColor: 'rgba(255, 255, 255, 0.75)'
        }
      , onClick: this.requestCover.bind(this)
      , rounded: true
      }
    , 'Change Cover'
    )
  }
  requestCover () {
    const {store} = this.context
    const {id} = this.props
    store.routeChange('MEDIA_BLOCK_REQUEST_COVER_UPLOAD', id)
  }
}
ChangeCover.contextTypes = { store: React.PropTypes.object }
ChangeCover.propTypes =
  { id: React.PropTypes.string.isRequired
  }
export default React.createFactory(ChangeCover)
