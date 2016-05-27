require('./app.css')

import React, {createElement as el} from 'react'

import AddCover from './add-cover'
import AddFold from './add-fold'
import Editable from './editable'
import rebassTheme from './rebass-theme'


class App extends React.Component {
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
    , el(AddCover, {})
    , this.renderContent()
    , el(AddFold, {})
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
