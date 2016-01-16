// Copy style to head
require('./attribution-editor.css')

import React from 'react'
import Image from './Image'


function renderCover (cover) {
  if (!cover) return
  let {src, width, height} = cover
  if (!src) return
  let props = {src, width, height}
  return (
    <div className='AttributionEditor-cover'>
      <Image {...props} />
    </div>
  )
}

class AttributionEditor extends React.Component {
  render () {
    console.log(this.props)
    const {cover, metadata} = this.props.initialBlock

    return (
      <div className='AttributionEditor'>
        {renderCover(cover)}
        <div className='AttributionEditor-metadata'>
          {JSON.stringify(metadata, null, 2)}
        </div>
      </div>
    )
  }
}

export default React.createFactory(AttributionEditor)
