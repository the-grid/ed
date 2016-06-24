import React, {createElement as el} from 'react'

import ButtonOutline from 'rebass/dist/ButtonOutline'

class ButtonConfirm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
    this.boundOnConfirm = this.onConfirm.bind(this)
  }
  render () {
    const {confirm, label, theme, style, onClick} = this.props
    const {open} = this.state

    return el(ButtonOutline
    , { children: (open ? confirm : label)
      , onClick: (open ? onClick : this.boundOnConfirm)
      , theme
      , style
      }
    )
  }
  onConfirm () {
    this.setState({open: true})
  }
}
ButtonConfirm.propTypes =
  { confirm: React.PropTypes.string.isRequired
  , label: React.PropTypes.string.isRequired
  , theme: React.PropTypes.string
  , style: React.PropTypes.object
  , onClick: React.PropTypes.func.isRequired
  }
export default React.createFactory(ButtonConfirm)
