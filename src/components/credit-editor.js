import React, {createElement as el} from 'react'
import FlatButton from 'material-ui/lib/flat-button'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'

function renderAvatar (cover) {
  if (!cover || !cover.src) return
  
  // TODO imgflo it
  const {src} = cover
  return el(Avatar, {src})
}

class CreditEditor extends React.Component {
  render () {
    const {name, label, url, avatar} = this.props
    
    return el(
      FlatButton, {
        style: {
          textTransform: 'inherit'
        },
        icon: renderAvatar(avatar),
        label: name || label,
        labelPosition: 'after'
      }
    )
  }
}

export default React.createFactory(CreditEditor)
