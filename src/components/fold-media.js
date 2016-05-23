require('./fold-media.css')

import React, {createElement as el} from 'react'
import Media from './media'
import ButtonOutline from 'rebass/dist/ButtonOutline'

const buttonStyle =
  { textTransform: 'uppercase'
  , borderRadius: 4
  , padding: '10px 16px'
  , margin: '0.25em 0.5em'
  }

class FoldMedia extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return el('div'
    , { className: 'FoldMedia'
      , style:
        { margin: '0 auto'
        , position: 'relative'
        }
      }
    , this.renderAddMedia()
    )
  }
  renderAddMedia () {
    return el('div'
    , { className: 'FoldMedia-Add' }
    , el('div'
      , { className: 'FoldMedia-Buttons'
        , style:
          { textAlign: 'center'
          , padding: '0.75em'
          }
        }
      , this.renderAddImage()
      // , this.renderAddFold()
      )
    )
  }
  renderAddImage () {
    const {hasCover} = this.props
    if (hasCover) return

    return el(ButtonOutline
    , { style: buttonStyle
      , onClick: this.addImage.bind(this)
      , rounded: true
      }
    , 'Add an Image'
    )
  }
  addImage () {
    const {store} = this.context
    store.routeChange('FOLD_MEDIA_UPLOAD')
  }
  renderAddFold () {
    const {hasUnstarred} = this.props
    if (hasUnstarred) return

    return el(ButtonOutline
    , { style: buttonStyle
      , onClick: this.addFold.bind(this)
      , rounded: true
      }
    , 'Make Full Post'
    )
  }
  addFold () {
    const {store} = this.context
    store.routeChange('ADD_FOLD_DELIMITER')
  }
}
FoldMedia.contextTypes = { store: React.PropTypes.object }
FoldMedia.propTypes =
  { hasCover: React.PropTypes.bool
  , hasUnstarred: React.PropTypes.bool
  }
export default React.createFactory(FoldMedia)
