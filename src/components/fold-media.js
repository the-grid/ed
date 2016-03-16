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
      { helpOpen: false
      , linkOpen: false
      }
    if (props.initialBlock) {
      this.state.block = props.initialBlock
      this.state.id = props.initialBlock.id
    }
    const {store} = context
    store.on('fold.media.change', (block) => {
      this.setState({block})
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
    , ( block
      ? el(Media, {initialBlock: block, id: block.id})
      : this.renderAddMedia()
      )
    )
  }
  renderAddMedia () {
    const {helpOpen, linkOpen} = this.state

    return el('div'
    , {}
    , el(ButtonOutline
      , { style: { marginRight: -1 }
        , onClick: this.addTitle.bind(this)
        }
      , 'Add title'
      )
    , el(ButtonOutline
      , { style: { marginRight: -1 }
        , onClick: this.toggleLink.bind(this)
        }
      , 'Share link'
      )
    , el(ButtonOutline
      , { style: { marginRight: -1 }
        , onClick: this.addPhoto.bind(this)
        }
      , 'Upload photo'
      )
    , el(ButtonOutline
      , { onClick: this.toggleHelp.bind(this)
        }
      , '?'
      )
    , el(Panel
      , { style:
          { display: (linkOpen ? 'block' : 'none')
          , marginTop: -1
          }
        , theme: 'info'
        }
      , this.renderShareLink()
      )
    , el(Panel
      , { style:
          { display: (helpOpen ? 'block' : 'none')
          , marginTop: -1
          }
        , theme: 'info'
        }
      , 'Welcome to your post editor. ' +
        'Above the line is the primary representation ' +
        'of your post. Below the line is the rest of ' +
        'the post that will show on the post page.'
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
