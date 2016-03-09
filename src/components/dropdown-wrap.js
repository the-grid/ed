import React, {createElement as el} from 'react'
import ReactDOM from 'react-dom'

import DropdownMenu from 'rebass/dist/DropdownMenu'
import Dropdown from 'rebass/dist/Dropdown'
import ButtonOutline from 'rebass/dist/ButtonOutline'


class DropdownWrap extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.openMenu = () => {
      this.setState({
        open: true
      })
    }
    this.closeMenu = () => {
      this.setState({
        open: false
      })
    }
  }

  componentDidUpdate (_, prevState) {
    // Focus on open
    if (!prevState.open && this.state.open) {
      const el = ReactDOM.findDOMNode(this).querySelector('textarea')
      if (el) {
        el.focus()
      }
    }
  }

  render () {
    const {buttonText, buttonIcon, menuKids, menuWidth} = this.props

    return el(Dropdown
      , { style:
          { display: 'inline-block' }
        }
      , el(ButtonOutline
        , { onClick: this.openMenu
          , theme: 'secondary'
          , inverted: false
          , style: {marginLeft: -1}
          }
        , el('span'
          , { style:
              { maxWidth: '15rem'
              , verticalAlign: 'middle'
              , display: 'inline-block'
              , whiteSpace: 'pre'
              , overflow: 'hidden'
              , textOverflow: 'ellipsis'
              }
            }
          , buttonText
          )
        , buttonIcon
        )
      , el(DropdownMenu
        , { open: this.state.open
          , right: true
          , onDismiss: this.closeMenu
        }
        , el('div'
          , { style:
              { textAlign: 'left'
              , width: menuWidth
              }
            }
          , menuKids
          )
        )
      )
  }
}
DropdownWrap.propTypes =
  { buttonText: React.PropTypes.string
  , buttonIcon: React.PropTypes.node
  , menuKids: React.PropTypes.node
  , menuWidth: React.PropTypes.number
  }
DropdownWrap.defaultProps = { menuWidth: 360 }
export default React.createFactory(DropdownWrap)
