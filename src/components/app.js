require('./app.css')

import React, {createElement as el} from 'react'

import FoldMedia from './fold-media'
import HrLabel from './hr-label'
import Editable from './editable'
import rebassTheme from './rebass-theme'

class App extends React.Component {
  constructor (props) {
    super(props)
    
    const {initialMedia, initialContent} = props
    this.state = 
      { media: initialMedia
      , editableShown: (initialMedia || initialContent)
      }

    const {store} = props
    store.on('fold.media.change', (block) => {
      this.setState({media: block})
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
    if (!editableShown) return
    
    return el(HrLabel
    , { label: 'Above this line goes on your home page. Below this line gets its own page.' }
    )
  }
  renderContent () {
    const {editableShown} = this.state
    if (!editableShown) return

    const { initialContent
      , menuBar, menuTip
      , onChange, onShareFile, onShareUrl} = this.props

    return el('div'
    , { className: 'Ed-Content'
      , style: { zIndex: 1 }
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
