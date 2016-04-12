import React, {createElement as el} from 'react'
import ReactDOM from 'react-dom'
import Media from './media'
import TextareaAutosize from './textarea-autosize'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import uuid from 'uuid'
import {extractUrl} from '../util/url'

const buttonStyle =
  { textTransform: 'uppercase'
  , borderRadius: 4
  , padding: '10px 16px'
  , margin: '0.25em 0'
  }

class FoldMedia extends React.Component {
  constructor (props) {
    super(props)
    this.state = {linkOpen: false}
  }
  render () {
    const {block} = this.props
    return el('div'
    , { className: 'FoldMedia'
      , style:
        { margin: '0 auto'
        }
      }
    , (block
      ? el(Media
        , { initialBlock: block
          , id: block.id
          , key: block.id
          }
        )
      : this.renderAddMedia()
      )
    )
  }
  renderAddMedia () {
    return el('div'
    , { className: 'FoldMedia-Add' }
    , el('div'
      , { className: 'FoldMedia-Text'
        , style:
          { maxWidth: 800
          , margin: '0 auto -1em'
          , padding: '0 0.5em'
          , fontSize: '200%'
          }
        }
      , el(TextareaAutosize
        , { placeholder: 'Text or link to start post...'
          , onKeyDown: this.shareKeyDown.bind(this)
          }
        )
      )
    , el('div'
      , { className: 'FoldMedia-Buttons'
        , style:
          { textAlign: 'center'
          , padding: '0.75em'
          }
        }
      , el(ButtonOutline
        , { style: buttonStyle
          , onClick: this.shareLink.bind(this)
          , rounded: true
          }
        , 'Add a link'
        )
      , el('span'
        , { style:
            { margin: '0 12px'
            , color: '#aaa'
            , fontSize: '.8em'
            }
          }
        , 'or'
        )
      , el(ButtonOutline
        , { style: buttonStyle
          , onClick: this.addPhoto.bind(this)
          , rounded: true
          }
        , 'Add a photo'
        )
      , el('span'
        , { style:
            { margin: '0 12px'
            , color: '#aaa'
            , fontSize: '.8em'
            }
          }
        , 'or'
        )
      , el(ButtonOutline
        , { style: buttonStyle
          , onClick: this.addMore.bind(this)
          , rounded: true
          }
        , 'Add more'
        )
      )
    )
  }
  shareKeyDown (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.shareLink(event)
    }
  }
  shareLink (event) {
    event.preventDefault()

    let value
    if (event.type === 'keydown') {
      value = event.target.value
    } else {
      const el = ReactDOM.findDOMNode(this).querySelector('textarea')
      value = el.value
    }
    if (!value) return
    value = value.trim()
    if (!value) return
    
    const extracted = extractUrl(value)
    if (!extracted) return

    const {store} = this.context
    store.routeChange('FOLD_MEDIA_SHARE', extracted)
  }
  addPhoto () {
    const {store} = this.context
    store.routeChange('FOLD_MEDIA_UPLOAD')
  }
  addMore () {
    const {store} = this.context
    store.routeChange('FOLD_MEDIA_INIT'
    , { id: uuid.v4()
      , type: 'h1'
      , metadata: {starred: true}
      , html: '<h1></h1>'
      }
    )
  }
}
FoldMedia.contextTypes = { store: React.PropTypes.object }
FoldMedia.propTypes = { block: React.PropTypes.object }
export default React.createFactory(FoldMedia)
