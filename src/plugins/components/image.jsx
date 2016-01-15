/*
* Stateless functional component - let's use this pattern as much as possible
* http://facebook.github.io/react/docs/reusable-components.html#stateless-functions
*/

import React from 'react'

export default function Image (props) {
  let {src, width, height} = props
  let style = {
    width: '100%',
    height: '100px',
    backgroundImage: `url(${src})`,
    backgroundSize: 'contain',
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat'
  }
  return (
    <div style={style}></div>
  )
}
