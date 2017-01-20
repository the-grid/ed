import React, {createElement as el} from 'react'

import ButtonOutline from 'rebass/dist/ButtonOutline'
import {pseudoFixedStyle} from '../util/browser'
function stopPropagation (event) { event.stopPropagation() }


class Modal extends React.Component {
  constructor (props) {
    super(props)

    this.onKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()
        props.onClose()
      }
    }
  }
  render () {
    const {onClose, child} = this.props

    let bgStyle = pseudoFixedStyle()
    bgStyle.backgroundColor = 'rgba(128,128,128,0.8)'
    bgStyle.zIndex = 4
    bgStyle.overflowY = 'auto'

    return el('div',
      {
        className: 'Modal-bg',
        style: bgStyle,
        onClick: onClose,
        onKeyDown: this.onKeyDown,
      },
      el('div',
        {
          className: 'Modal-container',
          style: {
            padding: '1rem',
            backgroundColor: 'white',
            maxWidth: 720,
            margin: '1rem auto 4rem',
            border: '1px solid silver',
            borderRadius: 2,
          },
          onClick: stopPropagation,
        },
        el('div',
          {
            style: {
              textAlign: 'right',
              marginBottom: '1rem',
            },
          },
          el(ButtonOutline,
            {
              onClick: onClose,
            },
            'Close'
          ),
        ),
        child
      )
    )
  }
}
Modal.propTypes = {
  onClose: React.PropTypes.func,
  child: React.PropTypes.node,
}
export default React.createFactory(Modal)
