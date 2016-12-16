// If we need more icons we can follow https://github.com/jxnblk/react-geomicons/blob/master/src/geomicon.js

import React, {createElement as el} from 'react'


// path from https://github.com/jxnblk/geomicons-open/blob/master/src/play.js
export function Play (props) {
  const {fill, width, height} = props
  return el('svg'
  , { viewBox: '0 0 32 32',
    fill,
    width,
    height,
  }
  , el('path'
    , { d: 'M4 4 L28 16 L4 28 z',
    }
    )
  )
}
Play.defaultProps =
{ fill: 'currentColor',
  width: '0.9em',
  height: '0.9em',
}
Play.propTypes =
{ fill: React.PropTypes.string,
  width: React.PropTypes.oneOfType(
    [ React.PropTypes.string,
      React.PropTypes.number,
    ]
    ),
  height: React.PropTypes.oneOfType(
    [ React.PropTypes.string,
      React.PropTypes.number,
    ]
    ),
}
