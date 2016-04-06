require('./app.css')

import React, {createElement as el} from 'react'

import FoldMedia from './fold-media'
import HrLabel from './hr-label'
import Editable from './editable'
import rebassTheme from './rebass-theme'

function isEditableShown (media, content) {
  const emptyContent = (content && content.length === 0)
  return (media != null || !emptyContent)
}


class App extends React.Component {
  constructor (props) {
    super(props)

    const {initialMedia, initialContent} = props
    this.state =
      { media: initialMedia
      , editableShown: isEditableShown(initialMedia, initialContent)
      }

    const {store} = props
    store.on('fold.media.change', (block) => {
      this.setState(
        { media: block
        // Funny to use initialContent here, but... state...
        , editableShown: isEditableShown(block, initialContent)
        }
      )
    })
  }
  getChildContext () {
    const {store, imgfloConfig} = this.props
    return (
      { imgfloConfig: imgfloConfig
      , rebass: rebassTheme
      , store: store
      }
    )
  }
  render () {
    return el('div'
    , {className: 'Ed'}
    , el('div'
      , { className: 'Ed-Media'
        , style: { zIndex: 2 }
        }
      , this.renderMedia()
      )
    , this.renderDivider()
    , this.renderContent()
    )
  }
  renderMedia () {
    const {media} = this.state
    const {onChange} = this.props
    return el(FoldMedia
    , { block: media
      , onChange
      }
    )
  }
  renderDivider () {
    const {editableShown} = this.state

    return el('div'
    , { className: 'Ed-Divider'
      , style:
        { display: (editableShown ? 'block' : 'none')
        }
      }
    , el(HrLabel
      , { label: 'Above this line goes on your home page. Below this line gets its own page.' }
      )
    )
  }
  renderContent () {
    const {editableShown} = this.state

    const { initialContent
      , menuBar, menuTip
      , onChange, onShareFile, onShareUrl} = this.props

    return el('div'
    , { className: 'Ed-Content'
      , style:
        { zIndex: 1
        , display: (editableShown ? 'block' : 'none')
        }
      }
    , el(Editable
      , { initialContent
        , menuBar
        , menuTip
        , onChange
        , onShareFile
        , onShareUrl
        }
      )
    )
  }
}
App.childContextTypes =
  { imgfloConfig: React.PropTypes.object
  , store: React.PropTypes.object
  , rebass: React.PropTypes.object
  }
App.propTypes =
  { initialContent: React.PropTypes.array.isRequired
  , initialMedia: React.PropTypes.object
  , onChange: React.PropTypes.func.isRequired
  , menuBar: React.PropTypes.bool
  , menuTip: React.PropTypes.bool
  , imgfloConfig: React.PropTypes.object
  , store: React.PropTypes.object.isRequired
  }
export default React.createFactory(App)
