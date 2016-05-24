require('./app.css')

import React, {createElement as el} from 'react'

import FoldMedia from './fold-media'
import Editable from './editable'
import rebassTheme from './rebass-theme'

function hasCover (content) {
  for (let i = 0, len = content.length; i < len; i++) {
    const block = content[i]
    if (block.type === 'image' && block.metadata && !block.metadata.isBasedOnUrl) {
      return true
    }
  }
  return false
}

function hasUnstarred (content) {
  for (let i = 0, len = content.length; i < len; i++) {
    const block = content[i]
    if (block.metadata && !block.metadata.starred) {
      return true
    }
  }
  return false
}


class App extends React.Component {
  constructor (props) {
    super(props)

    const {initialContent} = props
    this.state =
      { hasCover: hasCover(initialContent)
      , hasUnstarred: hasUnstarred(initialContent)
      }
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
    , this.renderMedia()
    , this.renderContent()
    )
  }
  renderMedia () {
    const {hasCover, hasUnstarred} = this.state
    if (hasCover && hasUnstarred) return

    return el('div'
    , { className: 'Ed-Media'
      , style: { zIndex: 2 }
      }
    , el(FoldMedia
      , { hasCover
        , hasUnstarred
        }
      )
    )
  }
  renderContent () {
    const { initialContent
      , menuBar, menuTip
      , onChange, onShareFile, onShareUrl
      , onCommandsChanged } = this.props

    return el('div'
    , { className: 'Ed-Content'
      , style:
        { zIndex: 1
        }
      }
    , el(Editable
      , { initialContent
        , menuBar
        , menuTip
        , onChange
        , onShareFile
        , onShareUrl
        , onCommandsChanged
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
  , onChange: React.PropTypes.func.isRequired
  , menuBar: React.PropTypes.bool
  , menuTip: React.PropTypes.bool
  , imgfloConfig: React.PropTypes.object
  , store: React.PropTypes.object.isRequired
  }
export default React.createFactory(App)
