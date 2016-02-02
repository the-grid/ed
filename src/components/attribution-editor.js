// Copy style to head
require('./attribution-editor.css')

import React, {createElement as el} from 'react'
import Image from './image'


function renderCover (cover) {
  if (!cover) return
  let {src, width, height} = cover
  if (!src) return
  let props = {src, width, height}
  return el(
    'div',
    {className: 'AttributionEditor-cover'},
    el(Image, props)
  )
}

class AttributionEditor extends React.Component {
  render () {
    const {cover, metadata} = this.props.initialBlock
    const title = metadata ? metadata.title : ''
    const description = metadata ? metadata.description : ''

    return el(
      'div',
      {className: 'AttributionEditor'},
      renderCover(cover),
      el(
        'div',
        {className: 'AttributionEditor-metadata'},
        el('h1', {className: 'AttributionEditor-title'}, title),
        el('p', {className: 'AttributionEditor-description'}, description)
      )
    )
  }
}

export default React.createFactory(AttributionEditor)
