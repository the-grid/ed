/*
* Stateless functional component - let's use this pattern as much as possible
* http://facebook.github.io/react/docs/reusable-components.html#stateless-functions
*/

require('./image.css')

import React, {createElement as el} from 'react'
import imgflo from 'imgflo-url'


export default function Image (props, context) {
  let {src} = props
  const {width, height} = props
  if (context.imgfloConfig) {
    const params = {
      input: src,
      width: getSize(width, height)
    }
    src = imgflo(context.imgfloConfig, 'passthrough', params)
  }
  const style = {
    backgroundImage: `url(${src})`
  }
  return el('div', {className: 'Image', style})
}
Image.contextTypes = {
  imgfloConfig: React.PropTypes.object
}


// Proxy via imgflo with width multiple of 360
function getSize (width, height) {
  let size = 360
  if (width && (width >= 720)) {
    size = 720
  }
  if (height && height > width) {
    size = 360
  }
  return size
}
