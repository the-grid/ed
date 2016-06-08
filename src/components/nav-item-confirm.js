import React, {createElement as el} from 'react'

import NavItem from 'rebass/dist/NavItem'

class NavItemConfirm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }
  render () {
    const {confirm, label, theme, style, onClick} = this.props
    const {open} = this.state

    return el(NavItem
    , { children: (open ? confirm : label)
      , onClick: (open ? onClick : this.onConfirm.bind(this))
      , theme
      , style
      }
    )
  }
  onConfirm () {
    this.setState({open: true})
  }
}
NavItemConfirm.propTypes =
  { confirm: React.PropTypes.string.isRequired
  , label: React.PropTypes.string.isRequired
  , theme: React.PropTypes.string
  , style: React.PropTypes.object
  , onClick: React.PropTypes.func.isRequired
  }
export default React.createFactory(NavItemConfirm)
