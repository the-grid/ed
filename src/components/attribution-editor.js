// Copy style to head
require('./attribution-editor.css')

import React, {createElement as el} from 'react'

import Progress from 'rebass/dist/Progress'
import Message from 'rebass/dist/Message'
import Button from 'rebass/dist/Button'
import Space from 'rebass/dist/Space'

import Image from './image'
import DropdownGroup from './dropdown-group'
import CreditEditor from './credit-editor'
import ImageEditor from './image-editor'
import CreditAdd from './credit-add'
import TextareaAutosize from './textarea-autosize'

import blockMetaSchema from '../schema/block-meta'
import {isFileEvent} from '../util/drop'


class AttributionEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state =
      { block: props.initialBlock
      }

    this.boundOnDragOver = this.onDragOver.bind(this)
    this.boundOnDrop = this.onDrop.bind(this)
    this.boundOnChange = this.onChange.bind(this)
    this.boundOnMoreClick = this.onMoreClick.bind(this)
    this.boundOnUploadRequest = this.onUploadRequest.bind(this)
  }
  componentWillReceiveProps (props) {
    this.setState({block: props.initialBlock})
  }
  render () {
    const {block} = this.state
    const {type, metadata} = block
    const schema = blockMetaSchema[type] || blockMetaSchema.default

    const menus = renderMenus(type, schema, metadata, this.boundOnChange, this.boundOnMoreClick, this.boundOnUploadRequest)

    return el('div'
      , { className: 'AttributionEditor'
        , style:
          { padding: '1rem 1rem 0'
          , background: '#fff'
          , border: '1px solid #ddd'
          , borderRadius: 2
          , position: 'relative'
          }
        , onDragOver: this.boundOnDragOver
        , onDrop: this.boundOnDrop
        }
      , this.renderCover()
      , this.renderUnsalvageable()
      , this.renderProgress()
      , el('div'
        , { className: 'AttributionEditor-metadata'
          , style:
            { position: 'relative'
            }
          }
        , renderFields(schema, metadata, this.boundOnChange)
        , el('div'
          , { className: 'AttributionEditor-links'
            , style:
              { margin: '1em -1em 0'
              , position: 'relative'
              , top: 1
              }
            }
          , el(DropdownGroup, {menus})
        )
      )
      , el('div'
        , { style: {clear: 'both'} }
      )
    )
  }
  canChangeCover () {
    const {block} = this.state
    if (!block) return false
    const {type} = block
    const schema = blockMetaSchema[type] || blockMetaSchema.default
    return schema.changeCover
  }
  renderCover () {
    const {block} = this.state
    if (!block) return
    const {id, cover, metadata} = block
    const {store} = this.context
    const preview = store.getCoverPreview(id)
    if (!cover && !preview) return
    let src, width, height, title
    if (cover) {
      src = cover.src
      width = cover.width
      height = cover.height
    }
    if (metadata) {
      title = metadata.title
    }
    if (preview) {
      src = preview
    }
    if (!src) return
    let props = {src, width, height, title}
    return el('div'
    , { className: 'AttributionEditor-cover'
      , style:
        { width: '100%'
        , position: 'relative'
        , marginBottom: '1rem'
        }
      }
    , el(Image, props)
    )
  }
  renderUnsalvageable () {
    const {block} = this.state
    if (!block || !block.cover || !block.cover.unsalvageable || !this.canChangeCover()) return

    return el(Message
    , {theme: 'error'}
    , 'We were unable to find the image originally saved with this block.'
    , el(Space, {auto: true})
    , el(Button
      , { onClick: () => this.onUploadRequest()
        , rounded: true
        , color: 'error'
        , backgroundColor: 'white'
        }
      , 'Upload New Image'
      )
    )
  }
  renderProgress () {
    const {block} = this.state
    if (!block || !block.metadata) return
    const {progress, failed} = block.metadata
    if (progress == null) return

    const theme = (failed === true ? 'error' : 'info')
    return el(Progress
    , { value: progress / 100
      , style: {margin: '8px 0'}
      , theme
      }
    )
  }
  onUploadRequest () {
    const {store} = this.context
    const {id} = this.props
    store.routeChange('MEDIA_BLOCK_REQUEST_COVER_UPLOAD', id)
  }
  onChange (path, value) {
    const {store} = this.context
    const {id} = this.props
    // Send change up to store
    const block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})
    // Send change to view
    this.setState({block})
  }
  onDragOver (event) {
    if (event.dataTransfer.types[0] !== 'Files') return
    event.preventDefault()
  }
  onDrop (event) {
    if (!isFileEvent(event)) return
    if (!this.canChangeCover()) return
    event.preventDefault()
    event.stopPropagation()

    const {store} = this.context
    const {id} = this.props
    store.routeChange('MEDIA_BLOCK_DROP_FILE'
    , { id
      , file: event.dataTransfer.files[0]
      }
    )
  }
  onMoreClick (key) {
    const {store} = this.context
    const {id} = this.props

    let block, path, value

    // Send change up to store
    switch (key) {
      case 'delete':
        store.routeChange('MEDIA_BLOCK_REMOVE', id)
        return
      case 'isBasedOnUrl':
        path = ['isBasedOnUrl']
        value = ''
        block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})
        break
      case 'author':
        path = ['author']
        // TODO smarter when we support multiple
        value = [{}]
        block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})
        break
      case 'via':
        path = ['via']
        value = {}
        block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})
        break
      case 'publisher':
        path = ['publisher']
        value = {}
        block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})
        break
      default:
        return
    }
    // Send change to view
    if (block) {
      this.setState({block})
    }
  }
}
AttributionEditor.contextTypes =
  { store: React.PropTypes.object }
AttributionEditor.childContextTypes =
  { imgfloConfig: React.PropTypes.object
  , rebass: React.PropTypes.object
  , store: React.PropTypes.object
  }
AttributionEditor.propTypes =
  { initialBlock: React.PropTypes.object.isRequired
  , id: React.PropTypes.string.isRequired
  }
export default React.createFactory(AttributionEditor)


function makeChange (path, onChange) {
  return function (event) {
    const {value} = event.target
    onChange(path, value)
  }
}

function renderFields (schema, metadata = {}, onChange) {
  let fields = []
  if (schema.title) {
    fields.push(renderTextField('title', 'TITLE', metadata.title, onChange))
  }
  if (schema.description) {
    fields.push(renderTextField('description', 'DESCRIPTION', metadata.description, onChange))
  }
  if (schema.caption) {
    fields.push(renderTextField('caption', 'CAPTION', metadata.caption, onChange))
  }
  return fields
}

function renderTextField (key, label, value, onChange) {
  return el(TextareaAutosize
  , { className: `AttributionEditor-${key}`
    , placeholder: `Enter ${key}`
    , defaultValue: value
    , key: key
    , onChange: makeChange([key], onChange)
    , style: {width: '100%'}
    }
  )
}

function renderMenus (type, schema, metadata = {}, onChange, onMoreClick, onUploadRequest) {
  let menus = []
  if (schema.isBasedOnUrl && metadata.isBasedOnUrl != null) {
    menus.push(
      renderCreditEditor(true, 'isBasedOnUrl', 'Link', {url: metadata.isBasedOnUrl}, onChange, ['isBasedOnUrl'])
    )
  }
  // TODO support >1 author
  if (schema.author && metadata.author && metadata.author[0]) {
    menus.push(
      renderCreditEditor(false, 'author.0', 'Credit', metadata.author[0], onChange, ['author', 0])
    )
  }
  if (schema.via && metadata.via) {
    menus.push(
      renderCreditEditor(false, 'via', 'Via', metadata.via, onChange, ['via'])
    )
  }
  if (schema.publisher && metadata.publisher) {
    menus.push(
      renderCreditEditor(false, 'publisher', 'Publisher', metadata.publisher, onChange, ['publisher'])
    )
  }
  if (schema.changeCover) {
    menus.push(renderImageEditor(type, metadata.title, metadata.coverPrefs, onChange, onUploadRequest))
  }
  menus.push(
    el(CreditAdd
    , { schema
      , metadata
      , label: '...'
      , onClick: onMoreClick
      }
    )
  )
  return menus
}

function renderCreditEditor (onlyUrl, key, label, item, onChange, path) {
  return el(CreditEditor
  , { className: `AttributionEditor-${key}`
    , key: key
    , label: label
    , name: item.name
    , url: item.url
    , avatar: item.avatar
    , path: path || [key]
    , onChange
    , onlyUrl
    }
  )
}

function renderImageEditor (type, title, coverPrefs = {}, onChange, onUploadRequest) {
  const {filter, crop, overlay} = coverPrefs
  return el(ImageEditor
  , { title
    , filter
    , crop
    , overlay
    , onChange
    , onUploadRequest
    , type
    , name: 'Image'
    , label: 'Image'
    }
  )
}
