import React from 'react'
import Image from './Image'

function renderCover (cover) {
  if (!cover) return
  let {src, width, height} = cover
  if (!src) return

  let props = {src, width, height}
  return (
    <Image {...props} />
  )
}

class AttributionEditor extends React.Component {
  render () {
    console.log(this.props)
    let {cover, metadata} = this.props.initialBlock
    
    return (
      <div>
        {renderCover(cover)}
        <div>
          {JSON.stringify(metadata)}
        </div>
      </div>
    )
  }
}

export default React.createFactory(AttributionEditor)
