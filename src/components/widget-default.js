// Copy style to head
require('./widget-default.css')

import React, {createElement as el} from 'react'
import Image from './image'
import CreditEditor from './credit-editor'
import CreditAdd from './credit-add'

import TextField from 'material-ui/lib/text-field'

import blockMetaSchema from '../schema/block-meta'


class WidgetDefault extends React.Component {
  render () {
    const {imgfloConfig, initialBlock} = this.props
    const {type, cover, metadata} = initialBlock
    const schema = blockMetaSchema[type] || blockMetaSchema.default
    const coverEl = schema.cover ? renderCover(cover, imgfloConfig) : null

    return el('div', {className: 'WidgetDefault'},
      coverEl,
      el('div', {className: 'WidgetDefault-metadata'},
        renderFields(schema, metadata)
      ),
      el('div', {className: 'WidgetDefault-links'},
        renderLinks(schema, metadata),
        CreditAdd({schema, metadata})
      )
    )
  }
}
export default React.createFactory(WidgetDefault)


function renderCover (cover, imgfloConfig) {
  if (!cover) return
  let {src, width, height} = cover
  if (!src) return
  let props = {src, width, height, imgfloConfig}
  return el(
    'div',
    {className: 'WidgetDefault-cover'},
    el(Image, props)
  )
}

function renderCreditEditor (key, label, item) {
  return el(CreditEditor, {
    className: `WidgetDefault-${key}`,
    key: key,
    label: label,
    name: item.name,
    url: item.url,
    avatar: item.avatar
  })
}

function renderTextField (key, label, value, multiLine = true) {
  return el(TextField, {
    className: `WidgetDefault-${key}`,
    floatingLabelText: label,
    defaultValue: value,
    key: key,
    multiLine: multiLine,
    rowsMax: 5,
    style: {width: '100%'}
  })
}

function renderFields (schema, metadata = {}) {
  let fields = []
  if (schema.title) {
    fields.push(renderTextField('title', 'Title', metadata.title))
  }
  if (schema.description) {
    fields.push(renderTextField('description', 'Description', metadata.description))
  }
  return fields
}

function renderLinks (schema, metadata = {}) {
  let links = []
  if (schema.isBasedOnUrl && metadata.isBasedOnUrl) {
    links.push(renderCreditEditor('isBasedOnUrl', 'Link', {url: metadata.isBasedOnUrl}))
  }
  if (schema.author && metadata.author && metadata.author[0]) {
    links.push(renderCreditEditor('author.0', 'Author', metadata.author[0]))
  }
  if (schema.publisher && metadata.publisher) {
    links.push(renderCreditEditor('publisher', 'Publisher', metadata.publisher))
  }
  return links
}
