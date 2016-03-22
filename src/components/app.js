require('./app.css')

import React, {createElement as el} from 'react'

import rebassTheme from './rebass-theme'
import Editable from './editable'
import FoldMedia from './fold-media'

class App extends React.Component {
  setState () {
    throw new Error('Can not setState of App')
  }
  getChildContext () {
    const {store, imgfloConfig} = this.props
    return {
      imgfloConfig: imgfloConfig
      , rebass: rebassTheme
      , store: store
    }
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
      , el('div'
        , { style: { 
          width: '100vw',
          borderBottom: '1px solid #ddd',
          margin: '20px 0 20px',
          clear: 'both',
          height: 1,
          textAlign: 'center',
          fontSize: '.8em'
        }}
        , el('div', {
            style: {
              width: 'auto',
              display: 'inline-block',
              padding: '0 10px',
              left: 0,
              right: 0,
              position: 'relative',
              margin: 'auto',
              color: '#bbb',
              top: -10,
              textAlign: 'center',
              background: '#fff'
            }
          } 
          , 'Above this line goes on your home page. Below this line gets its own page.'
        )
      )
      , el('div'
        , { className: 'Ed-Content'
          , style: { zIndex: 1 }
          }
        , this.renderContent()
      )
    )
  }
  renderMedia () {
    const {initialMedia, onChange} = this.props
    return el(FoldMedia
    , { initialBlock: initialMedia
      , onChange
      }
    )
  }
  renderContent () {
    const { initialContent
      , menuBar, menuTip
      , onChange, onShareFile, onShareUrl} = this.props

    return el(Editable
    , { initialContent
      , menuBar
      , menuTip
      , onChange
      , onShareFile
      , onShareUrl
      }
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
