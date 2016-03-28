import React, {createElement as el} from 'react'
import Media from './media'
import TextareaAutosize from './textarea-autosize'
import Button from 'rebass/dist/Button'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import Panel from 'rebass/dist/Panel'
import uuid from 'uuid'

class FoldMedia extends React.Component {
  constructor (props, context) {
    super(props)
    this.state =
      { linkOpen: false }
    if (props.initialBlock) {
      this.state.block = props.initialBlock
      this.state.id = props.initialBlock.id
    }
    const {store} = context
    store.on('fold.media.change', (block) => {
      let id
      if (block) {
        id = block.id
      }
      this.setState({block, id})
    })
  }
  render () {
    const {block} = this.state
    return el('div'
    , { className: 'FoldMedia'
      , style:
        { margin: '0 auto'
        , padding: '1rem'
        , maxWidth: 800
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
    const {linkOpen} = this.state

    return el('div'
    , {}
    , el(ButtonOutline
      , { style: { marginRight: -1 }
        , onClick: this.addTitle.bind(this)
        }
      , 'Add title'
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
      , { style: { marginRight: -1 }
        , onClick: this.toggleLink.bind(this)
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
      , { style: { marginRight: -1 }
        , onClick: this.addPhoto.bind(this)
        }
      , 'Add a photo'
      )
    , ' '
    , el(Panel
      , { style:
          { display: (linkOpen ? 'block' : 'none')
          , marginTop: -1
          }
        , theme: 'info'
        }
      , this.renderShareLink()
      )
    )
  }
  renderShareLink () {
    const {linkOpen} = this.state
    if (!linkOpen) return

    return el('form'
    , { onSubmit: this.shareLink.bind(this) }
    , el(TextareaAutosize
      , { label: 'URL'
        , defaultFocus: true
        , placeholder: 'https://...'
        , onKeyDown: this.shareKeyDown.bind(this)
        , style: { borderBottom: '1px solid' }
        }
      )
    , el(Button
      , { type: 'submit' }
      , 'Share')
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
    }
    if (event.type === 'submit') {
      const el = event.target.querySelector('textarea')
      value = el.value
    }
    value = value.trim()
    if (!value) return

    const {store} = this.context
    store.routeChange('FOLD_MEDIA_SHARE', value)
  }
  addPhoto () {
    const {store} = this.context
    store.routeChange('FOLD_MEDIA_UPLOAD')
  }
  addTitle () {
    const {store} = this.context
    store.routeChange('FOLD_MEDIA_INIT'
    , { id: uuid.v4()
      , type: 'h1'
      , metadata: {starred: true}
      , html: '<h1></h1>'
      }
    )
  }
  toggleHelp () {
    const helpOpen = !this.state.helpOpen
    this.setState({helpOpen})
  }
  toggleLink () {
    const linkOpen = !this.state.linkOpen
    this.setState({linkOpen})
  }
}
FoldMedia.contextTypes = { store: React.PropTypes.object }
FoldMedia.propTypes = { initialBlock: React.PropTypes.object }
export default React.createFactory(FoldMedia)
