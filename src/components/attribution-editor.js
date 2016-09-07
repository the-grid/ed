// Copy style to head
require('./attribution-editor.css')

import React, {createElement as el} from 'react'

import Progress from 'rebass/dist/Progress'
import Message from 'rebass/dist/Message'
import Button from 'rebass/dist/Button'
import Space from 'rebass/dist/Space'
import {widgetStyle} from './rebass-theme'

import Image from './image'
import DropdownGroup from './dropdown-group'
import CreditEditor from './credit-editor'
import ImageEditor from './image-editor'
import CreditAdd from './credit-add'
import TextareaAutosize from './textarea-autosize'
import {Play as PlayIcon} from './icons'

import blockMetaSchema from '../schema/block-meta'
import {isDragFileEvent, isDropFileEvent} from '../util/drop'


class AttributionEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state =
      { block: props.initialBlock
      , showDropIndicator: false
      }

    this.boundOnDragOver = this.onDragOver.bind(this)
    this.boundOnDragEnter = this.onDragEnter.bind(this)
    this.boundOnDragLeave = this.onDragLeave.bind(this)
    this.boundOnDrop = this.onDrop.bind(this)
    this.boundOnChange = this.onChange.bind(this)
    this.boundOnMoreClick = this.onMoreClick.bind(this)
    this.boundOnUploadRequest = this.onUploadRequest.bind(this)
    this.boundOnCoverRemove = this.onCoverRemove.bind(this)
    this.boundHideDropIndicator = this.hideDropIndicator.bind(this)
    this.hideDropIndicatorTimeout = null
  }
  componentWillReceiveProps (props) {
    this.setState({block: props.initialBlock})
  }
  componentWillUnmount () {
    clearTimeout(this.hideDropIndicatorTimeout)
  }
  render () {
    const {coverPrefs} = this.props
    const {block} = this.state
    const {type, metadata, cover} = block
    const schema = blockMetaSchema[type] || blockMetaSchema.default

    const menus = renderMenus(type, schema, metadata, cover, this.boundOnChange, this.boundOnMoreClick, this.boundOnUploadRequest, this.boundOnCoverRemove, coverPrefs)

    return el('div'
      , { className: 'AttributionEditor'
        , style: widgetStyle
        , onDragOver: this.boundOnDragOver
        , onDragEnter: this.boundOnDragEnter
        , onDragLeave: this.boundOnDragLeave
        , onDrop: this.boundOnDrop
        }
      , this.renderPlay()
      , this.renderCover()
      , this.renderUnsalvageable()
      , this.renderFailed()
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
      , this.renderDropIndicator()
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
    if (!block || !block.cover || !block.cover.unsalvageable) return

    let upload = null
    if (this.canChangeCover()) {
      upload = el(Button
      , { onClick: this.boundOnUploadRequest
        , rounded: true
        , color: 'error'
        , backgroundColor: 'white'
        }
      , 'Upload New Image'
      )
    }

    return el(Message
    , {theme: 'error'}
    , 'We were unable to find the image originally saved with this block.'
    , el(Space, {auto: true})
    , upload
    )
  }
  renderFailed () {
    const {id} = this.props
    const {store} = this.context
    const meta = store.getProgressInfo(id)
    if (!meta || !meta.failed) return

    let upload = null
    if (this.canChangeCover()) {
      upload = el(Button
      , { onClick: this.boundOnUploadRequest
        , rounded: true
        , color: 'error'
        , backgroundColor: 'white'
        }
      , 'Upload Image'
      )
    }

    return el(Message
    , {theme: 'error'}
    , 'Upload failed, please try again'
    , el(Space, {auto: true})
    , upload
    )
  }
  renderProgress () {
    const {id} = this.props
    const {store} = this.context
    const meta = store.getProgressInfo(id)
    if (!meta) return
    const {progress, failed} = meta
    if (progress == null) return

    const color = (failed === true ? 'error' : 'info')
    return el(Progress
    , { value: progress / 100
      , style: {margin: '8px 0'}
      , color
      }
    )
  }
  renderPlay () {
    const {block} = this.state
    if (!block || !block.type || !block.metadata || !block.metadata.isBasedOnUrl) return
    const {type} = block
    if (['interactive', 'video', 'audio'].indexOf(type) < 0) return

    return el('div'
    , { style:
        { textAlign: 'right'
        , position: 'relative'
        , top: '-0.5rem'
        }
      }
    , el('a'
      , { href: block.metadata.isBasedOnUrl
        , target: '_blank'
        , rel: 'noreferrer noopener'
        , style:
          { textDecoration: 'inherit'
          , textTransform: 'uppercase'
          }
        }
        , type + ' '
        , el(PlayIcon)
      )
    )
  }
  renderDropIndicator () {
    const {showDropIndicator} = this.state
    if (!showDropIndicator) return

    return el('div'
    , { style:
        { position: 'absolute'
        , display: 'flex'
        , justifyContent: 'center'
        , alignItems: 'center'
        , top: 0
        , left: 0
        , width: '100%'
        , height: '100%'
        , textAlign: 'center'
        , fontSize: 36
        , fontWeight: 600
        , color: '#0088EE'
        , padding: '1rem'
        , backgroundColor: 'rgba(255, 255, 255, 0.9)'
        , border: '12px #0088EE solid'
        }
      }
    , 'Drop to replace this image'
    )
  }
  onUploadRequest () {
    const {store} = this.context
    const {id} = this.props
    store.routeChange('MEDIA_BLOCK_REQUEST_COVER_UPLOAD', id)
  }
  onCoverRemove () {
    const {store} = this.context
    const {id} = this.props
    // Send change up to store
    const block = store.routeChange('MEDIA_BLOCK_COVER_REMOVE', id)
    // Send change to view
    this.setState({block})
  }
  onChange (path, value) {
    const {store} = this.context
    const {id} = this.props
    // Send change up to store
    const block = store.routeChange('MEDIA_BLOCK_UPDATE_FIELD', {id, path, value})
    // Send change to view
    this.setState({block})
  }
  onDragOver (event) {
    event.preventDefault()
    clearTimeout(this.hideDropIndicatorTimeout)
  }
  onDragEnter (event) {
    if (!isDragFileEvent(event)) return
    event.preventDefault()
    const {showDropIndicator} = this.state
    if (showDropIndicator) return
    if (!this.canChangeCover()) return
    clearTimeout(this.hideDropIndicatorTimeout)
    this.setState({showDropIndicator: true})
  }
  onDragLeave (event) {
    event.preventDefault()
    const {showDropIndicator} = this.state
    if (!showDropIndicator) return
    // HACK since children fire drag leave/enter events
    this.hideDropIndicatorTimeout = setTimeout(this.boundHideDropIndicator, 100)
  }
  hideDropIndicator () {
    this.setState({showDropIndicator: false})
  }
  onDrop (event) {
    if (!isDropFileEvent(event)) return
    event.preventDefault()
    if (!this.canChangeCover()) return
    event.stopPropagation()

    const {store} = this.context
    const {id} = this.props
    store.routeChange('MEDIA_BLOCK_DROP_FILE'
    , { id
      , file: event.dataTransfer.files[0]
      }
    )
    this.setState({showDropIndicator: false})
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
        path = ['metadata', 'isBasedOnUrl']
        value = ''
        block = store.routeChange('MEDIA_BLOCK_UPDATE_FIELD', {id, path, value})
        break
      case 'author':
        path = ['metadata', 'author']
        // TODO smarter when we support multiple
        value = [{}]
        block = store.routeChange('MEDIA_BLOCK_UPDATE_FIELD', {id, path, value})
        break
      case 'via':
        path = ['metadata', 'via']
        value = {}
        block = store.routeChange('MEDIA_BLOCK_UPDATE_FIELD', {id, path, value})
        break
      case 'publisher':
        path = ['metadata', 'publisher']
        value = {}
        block = store.routeChange('MEDIA_BLOCK_UPDATE_FIELD', {id, path, value})
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
  , coverPrefs: React.PropTypes.object.isRequired
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
    , onChange: makeChange(['metadata', key], onChange)
    , style: {width: '100%'}
    }
  )
}

function renderMenus (type, schema, metadata = {}, cover, onChange, onMoreClick, onUploadRequest, onCoverRemove, siteCoverPrefs) {
  let menus = []
  if (schema.isBasedOnUrl && metadata.isBasedOnUrl != null) {
    menus.push(
      renderCreditEditor(true, 'isBasedOnUrl', 'Link', {url: metadata.isBasedOnUrl}, onChange, ['metadata', 'isBasedOnUrl'])
    )
  }
  // TODO support >1 author
  if (schema.author && metadata.author && metadata.author[0]) {
    menus.push(
      renderCreditEditor(false, 'author.0', 'Credit', metadata.author[0], onChange, ['metadata', 'author', 0])
    )
  }
  if (schema.via && metadata.via) {
    menus.push(
      renderCreditEditor(false, 'via', 'Via', metadata.via, onChange, ['metadata', 'via'])
    )
  }
  if (schema.publisher && metadata.publisher) {
    menus.push(
      renderCreditEditor(false, 'publisher', 'Publisher', metadata.publisher, onChange, ['metadata', 'publisher'])
    )
  }
  if (cover || schema.changeCover) {
    const hasCover = (cover != null)
    const allowCoverChange = schema.changeCover
    const allowCoverRemove = (cover && schema.removeCover)
    menus.push(
      renderImageEditor(hasCover, allowCoverChange, allowCoverRemove, type, metadata.title, metadata.coverPrefs, onChange, onUploadRequest, onCoverRemove, siteCoverPrefs)
    )
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

function renderImageEditor (hasCover, allowCoverChange, allowCoverRemove, type, title, coverPrefs = {}, onChange, onUploadRequest, onCoverRemove, siteCoverPrefs) {
  const {filter, crop, overlay} = coverPrefs
  return el(ImageEditor
  , { hasCover
    , allowCoverChange
    , allowCoverRemove
    , title
    , siteCoverPrefs
    , filter
    , crop
    , overlay
    , onChange
    , onUploadRequest
    , onCoverRemove
    , type
    , name: 'Image'
    , label: 'Image'
    }
  )
}
