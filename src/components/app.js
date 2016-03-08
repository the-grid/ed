require('./app.css')

import React, {createElement as el} from 'react'

import determineFold from '../convert/determine-fold'

import rebassTheme from './rebass-theme'
import Editable from './editable'
import FoldMedia from './fold-media'

class App extends React.Component {
  constructor (props) {
    super(props)
    const {initialContent} = this.props
    const {media, content} = determineFold(initialContent)
    this.state = {media, content}
  }
  setState () {
    throw new Error('Can not setState of App')
  }
  getChildContext () {
    return {
      imgfloConfig: this.props.imgfloConfig
      , rebass: rebassTheme
    }
  }
  render () {
    return el('div'
    , {className: 'Ed'}
    , el('div'
      , {className: 'Ed-Media'}
      , this.renderMedia()
      )
    , el('div'
      , {className: 'Ed-FoldSeparator'}
      , el('hr')
      )
    , el('div'
      , {className: 'Ed-Content'}
      , this.renderContent()
      )
    )
  }
  renderMedia () {
    const {onChange} = this.props
    const {media} = this.state
    if (!media) return
    return el(FoldMedia
    , { initialBlock: media
      , onChange
      }
    )
  }
  renderMediaAdd () {
    const {media} = this.state
    if (media) return
    return el('button', {}
    , 'Add Media'
    )
  }
  renderContent () {
    const {menuBar, menuTip
      , onChange, onShareFile, onShareUrl
      , onEditableInit} = this.props
    const {content} = this.state
    return el(Editable
    , { initialContent: content
      , isFold: false
      , menuBar
      , menuTip
      , onChange
      , onShareFile
      , onShareUrl
      , onEditableInit
      }
    )
  }
}
App.childContextTypes =
  { imgfloConfig: React.PropTypes.object
  , rebass: React.PropTypes.object
  }
App.propTypes =
  { initialContent: React.PropTypes.array.isRequired
  , onChange: React.PropTypes.func.isRequired
  , menuBar: React.PropTypes.bool
  , menuTip: React.PropTypes.bool
  , imgfloConfig: React.PropTypes.object
  }
export default React.createFactory(App)
