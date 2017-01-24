// If we need more icons we can follow https://github.com/jxnblk/react-geomicons/blob/master/src/geomicon.js

import React, {createElement as el} from 'react'

// paths from https://github.com/jxnblk/geomicons-open/blob/master/src/play.js
const PATHS = {
  play: 'M4 4 L28 16 L4 28 z',
  link: 'M0 16 A8 8 0 0 1 8 8 L14 8 A8 8 0 0 1 22 16 L18 16 A4 4 0 0 0 14 12 L8 12 A4 4 0 0 0 4 16 A4 4 0 0 0 8 20 L10 24 L8 24 A8 8 0 0 1 0 16z M22 8 L24 8 A8 8 0 0 1 32 16 A8 8 0 0 1 24 24 L18 24 A8 8 0 0 1 10 16 L14 16 A4 4 0 0 0 18 20 L24 20 A4 4 0 0 0 28 16 A4 4 0 0 0 24 12z',
}


export default function Icon (props) {
  const {fill, width, height, icon} = props
  return el('svg'
  , { viewBox: '0 0 32 32',
    fill,
    width,
    height,
    style: {verticalAlign: 'middle'}
  }
  , el('path'
    , { d: PATHS[icon],
    }
    )
  )
}
Icon.defaultProps = {
  fill: 'currentColor',
  width: '1em',
  height: '1em',
}
Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  fill: React.PropTypes.string,
  width: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  height: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
}
