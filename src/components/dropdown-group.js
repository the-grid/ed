import React, {createElement as el} from 'react'

class DropdownGroup extends React.Component {
  constructor () {
    super()
    this.state = {
      open: null
    }
  }
  render () {
    const {children} = this.props

    return el(
      'div'
      , {className: 'DropdownGroup'}
      , children
    )
  }
}
export default React.createFactory(DropdownGroup)
