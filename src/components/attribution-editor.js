// Copy style to head
require('./attribution-editor.css')

import React, {createElement as el} from 'react'
import Image from './image'
import LabelText from './label-text'

import blockMetaSchema from '../schema/block-meta'


function renderCover (cover, imgfloConfig) {
  if (!cover) return
  let {src, width, height} = cover
  if (!src) return
  let props = {src, width, height, imgfloConfig}
  return el(
    'div',
    {className: 'AttributionEditor-cover'},
    el(Image, props)
  )
}

function renderFields (schema, metadata = {}) {
  let fields = []
  if (schema.title) {
    fields.push(
      el(LabelText, {
        className: 'AttributionEditor-title', 
        label: 'title',
        text: metadata.title
      })
    )
  }
  if (schema.description) {
    fields.push(
      el(LabelText, {
        className: 'AttributionEditor-description',
        label: 'description',
        text: metadata.description
      })
    )
  }
  return fields
}

class AttributionEditor extends React.Component {
  render () {
    const {imgfloConfig, initialBlock} = this.props
    const {type, cover, metadata} = initialBlock
    const schema = blockMetaSchema[type] || blockMetaSchema.default
    const coverEl = schema.cover ? renderCover(cover, imgfloConfig) : null

    return el('div', {className: 'AttributionEditor'},
      coverEl,
      el('div', {className: 'AttributionEditor-metadata'},
        renderFields(schema, metadata)
      )
    )
  }
}

export default React.createFactory(AttributionEditor)
