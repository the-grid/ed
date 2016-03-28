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


class AttributionEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      block: props.initialBlock
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      block: nextProps.initialBlock
    })
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
    const {type, cover, metadata} = block
    const schema = blockMetaSchema[type] || blockMetaSchema.default

    const menus = renderMenus(schema, metadata, this.onChange.bind(this), this.onMoreClick.bind(this))

    return el(
      'div'
      , { className: 'AttributionEditor' }
      , renderCover(cover)
      , el(
        'div'
        , { className: 'AttributionEditor-metadata' }
        , renderFields(schema, metadata, this.onChange.bind(this))
      )
      , el(
        'div'
        , { className: 'AttributionEditor-links' }
        , el(DropdownGroup, {menus})
      )
      , el(
        'div'
        , { style: {clear: 'both'} }
      )
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

function renderCover (cover) {
  if (!cover) return
  let {src, width, height} = cover
  if (!src) return
  let props = {src, width, height}
  return el(
    'div'
    , {className: 'AttributionEditor-cover'}
    , el(Image, props)
  )
}

function renderFields (schema, metadata = {}, onChange) {
  let fields = []
  if (schema.title) {
    fields.push(renderTextField('title', 'Title', metadata.title, onChange))
  }
  if (schema.description) {
    fields.push(renderTextField('description', 'Description', metadata.description, onChange))
  }
  return fields
}

function renderTextField (key, label, value, onChange) {
  return el(TextareaAutosize, {
    className: `AttributionEditor-${key}`
    , label
    , defaultValue: value
    , key: key
    , onChange: makeChange([key], onChange)
    , style: {width: '100%'}
  })
}

function renderMenus (schema, metadata = {}, onChange, onMoreClick) {
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
      }
    )
  )
  return menus
}

function renderCreditEditor (onlyUrl, key, label, item, onChange, path) {
  return el(CreditEditor,
    { className: `AttributionEditor-${key}`
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
