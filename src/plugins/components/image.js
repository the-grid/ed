/*
* Stateless functional component - let's use this pattern as much as possible
* http://facebook.github.io/react/docs/reusable-components.html#stateless-functions
*/

require('./image.css')

import {createElement as el} from 'react'


export default function Image (props) {
  const {src, width, height} = props
  const style = {
    backgroundImage: `url(${src})`
  }
  return el('div', {className: 'Image', style})
}
