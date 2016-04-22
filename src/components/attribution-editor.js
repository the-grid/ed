// Copy style to head
require('./attribution-editor.css')

import React, {createElement as el} from 'react'
import Image from './image'
import DropdownGroup from './dropdown-group'
import CreditEditor from './credit-editor'
import CreditAdd from './credit-add'
import TextareaAutosize from './textarea-autosize'
import blockMetaSchema from '../schema/block-meta'
import rebassTheme from './rebass-theme'
import Placeholder from './placeholder'

import ButtonOutline from 'rebass/dist/ButtonOutline'
import Button from 'rebass/dist/Button'

const buttonStyle =
  { textTransform: 'uppercase'
  , borderRadius: 4
  , padding: '10px 16px'
  , margin: 'fuck'
  }

class AttributionEditor extends React.Component {
  constructor (props) {
    super(props)
    this.isCover = props.isCover
    let showTitle = true
    let titlePlaceholder = 'Title'
    let descriptionPlaceholder = 'Description'
    if (this.isCover) {
      showTitle = false
      titlePlaceholder = 'Title'
      descriptionPlaceholder = 'Description'
    }
    let block = props.initialBlock
    this.state = {
      block: block,
      showTitle,
      titlePlaceholder,
      descriptionPlaceholder,
      isLoadingURL: false,
      showLoader: false,
    }
    this.onUpdateBlockMeta = (data) => {

      const {store} = this.context

      let {
        status, progress, failed,
        cover,
      } = data

      let showLoader = false
      let didMutateBlock = false

      let block = this.state.block
      if (cover) {
        if (cover === "REMOVE") {
          delete block.cover
          didMutateBlock = true
        } else {
          let src = cover.src
          if (!src) throw new Error ('cover.src expected in updatePlaceholder() if cover used at all')
          didMutateBlock = true
          block.cover = cover
        }
        store.routeChange('MEDIA_BLOCK_UPDATE', block)
      }

      if ((typeof progress === 'number' && progress < 100) || status) {
        showLoader = true
        if (!block.metadata) block.metadata = {}
        block.metadata.status = status
        block.metadata.progress = progress
        block.metadata.failed = failed
      }
      else {
        delete block.metadata.status
        delete block.metadata.progress
        delete block.metadata.failed
      }
      this.setState({
        block,
        showLoader,
      })
      //console.log(showLoader, progress, status, metadata)
      console.log('update.block.metadata', block.id, data)
    }
  }

  componentDidUpdate() {
    this.deleteIfEmpty()
  }
  deleteIfEmpty() {
    if (this.props.isCover) return true
    const {store} = this.context
    let block = this.state.block
    let metadata = block.metadata
    let cover = block.cover
    if (!metadata) metadata = {}
    if (!cover) cover = {}
    if (!cover.src && !metadata.title && !metadata.description) return store.routeChange('MEDIA_BLOCK_REMOVE', block.id)
  }
  componentWillMount() {
    let id = this.state.block.id
    const {store} = this.context
    store.on('update.block.metadata.'+id, this.onUpdateBlockMeta)
  }
  componentWillUnmount() {
    let id = this.state.block.id
    const {store} = this.context
    store.off('update.block.metadata.'+id, this.onUpdateBlockMeta)
  }
  getChildContext () {
    return (
      { imgfloConfig: this.props.imgfloConfig
      , store: (this.context.store || this.props.store)
      , rebass: rebassTheme
      }
    )
  }
  render () {

    const {block} = this.state
    const {type, metadata} = block
    const schema = blockMetaSchema[type] || blockMetaSchema.default

    const menus = this.renderMenus(schema, metadata, this.onChange.bind(this), this.onMoreClick.bind(this))

    return el(
      'div'
      , { className: 'AttributionEditor' }
      , el('div'
        , { className: 'AttributionEditor-cover'
          , style:
            { width: '100%'
            , zIndex: '1'
            , position: 'relative'
            , textAlign: 'center'
            }
          }
        , this.renderCover()
        , this.renderLoader()
      )
      , el(
        'div'
        , { className: 'AttributionEditor-metadata'
          , style:
            { width: '90%'
            , margin: '-48px auto 36px'
            , padding: '1.5em 3em 0'
            , background: '#fff'
            , border: '1px solid #ddd'
            , opacity: '.96'
            , transition: '.1s all ease-out'
            , zIndex: '2'
            , position: 'relative'
            , borderRadius: 2
            }
          }
        , this.renderFields(schema, metadata, this.onChange.bind(this))
        , el(
          'div'
          , { className: 'AttributionEditor-links'
            , style:
              { margin: '2em -3em 0'
              , position: 'relative'
              , top: 1
              }
            }
          , el(DropdownGroup, {menus})
        )
      )
      , el(
        'div'
        , { style: {clear: 'both'} }
      )
    )
  }
  renderFields(schema, metadata = {}, onChange) {
    let fields = []
    if (schema.title) {
      fields.push(renderTextField('title', this.state.titlePlaceholder, metadata.title, onChange))
    }
    if (schema.description) {
      fields.push(renderTextField('description', this.state.descriptionPlaceholder, metadata.description, onChange))
    }
    return fields
  }
  renderMenus(schema, metadata = {}, onChange, onMoreClick) {
    let menus = []
    if (schema.isBasedOnUrl && metadata.isBasedOnUrl != null) {
      menus.push(
        renderCreditEditor(true, 'isBasedOnUrl', 'Link', {url: metadata.isBasedOnUrl}, onChange, ['isBasedOnUrl'])
      )
    }
    if (schema.author && metadata.author && metadata.author[0]) {
      menus.push(
        renderCreditEditor(false, 'author.0', 'Author', metadata.author[0], onChange, ['author', 0])
      )
    }
    if (schema.publisher && metadata.publisher) {
      menus.push(
        renderCreditEditor(false, 'publisher', 'Publisher', metadata.publisher, onChange, ['publisher'])
      )
    }
    menus.push(
      el(CreditAdd
      , { schema
        , metadata
        , label: '...'
        , onClick: onMoreClick
        , removable: !this.isCover
        }
      )
    )
    return menus
  }
  renderLoader() {
    if (!this.state.showLoader) return null
    let props = {
      initialBlock: this.state.block
    }
    return Placeholder(props, this.context, false)
  }
  renderEmptyCover(id) {
    return el('div'
      , {className:"cover-buttons"}
      , el(ButtonOutline
        , { key: 'upload-cover-photo'
          , style: buttonStyle
          , onClick: this.addPhoto.bind(this,id)
          , rounded: true
          }
        , 'Upload Cover Photo' )
    )
  }
  removeMedia (id) {
    //const el = ReactDOM.findDOMNode(this).querySelector('textarea')
    //const value = el.value.trim()
    const {store} = this.context
    store.routeChange('FOLD_MEDIA_COVER_REMOVE', {id:id})
  }
  addPhoto (id) {
    //const el = ReactDOM.findDOMNode(this).querySelector('textarea')
    //const value = el.value.trim()
    const {store} = this.context
    store.routeChange('FOLD_MEDIA_UPLOAD_AND_REPLACE', {id:id})
  }
  renderCover () {
    const {block} = this.state
    const {id, cover} = block
    if (!block) return this.renderEmptyCover(id)
    const store = (this.context.store || this.props.store)
    const preview = store.getCoverPreview(id)
    if (!cover && !preview) return this.renderEmptyCover(id)
    let src, width, height
    if (cover) {
      src = cover.src
      width = cover.width
      height = cover.height
    }
    if (preview) {
      src = preview
    }
    if (!src) return
    let props = {src, width, height, key:'image'}
    return el('div'
      , {}
      , el('div'
          , {className:"cover-buttons"}
          , el(Button
            , { key: 'change-cover-photo'
              , style: buttonStyle
              , onClick: this.addPhoto.bind(this,id)
              , rounded: true
              }
            , 'Change Cover Photo' )
          , el(Button
            , { key: 'remove-cover-photo'
              , style: buttonStyle
              , onClick: this.removeMedia.bind(this,id)
              , rounded: true
              }
            , 'Remove Cover Photo' )
        )
      , el(Image, props)

    )

  }
  onChange (path, value) {
    const store = (this.context.store || this.props.store)
    const {id} = this.props
    // Send change up to store
    const block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})

    // Send change to view
    this.setState({block})
  }
  onMoreClick (key) {
    const store = (this.context.store || this.props.store)
    const {id} = this.props

    let block, path, value

    // Send change up to store
    switch (key) {
      case 'delete':
        store.routeChange('MEDIA_BLOCK_REMOVE', id)
        return
      case 'isBasedOnUrl':
        path = [key]
        value = ''
        block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})
        break
      case 'author':
        path = [key]
        // TODO smarter when we support multiple
        value = [{}]
        block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})
        break
      case 'publisher':
        path = [key]
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
  , imgfloConfig: React.PropTypes.object
  , store: React.PropTypes.object
  }
export default React.createFactory(AttributionEditor)


function makeChange (path, onChange) {
  return function (event) {
    const {value} = event.target
    onChange(path, value)
  }
}

function renderTextField (key, placeholderText, value, onChange) {
  return el(TextareaAutosize
  , { className: `AttributionEditor-${key}`
    , placeholder: placeholderText
    , defaultValue: value
    , key: key
    , onChange: makeChange([key], onChange)
    , style: {width: '100%'}
    }
  )
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
