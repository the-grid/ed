import React, {createElement as el} from 'react'

import FlatButton from 'material-ui/lib/flat-button'
import Avatar from 'material-ui/lib/avatar'
import Popover from 'material-ui/lib/popover/popover'
import TextField from 'material-ui/lib/text-field'


function renderAvatar (cover) {
  if (!cover || !cover.src) return

  // TODO imgflo it
  const {src} = cover
  return el(Avatar, {src})
}

function renderTextField (key, label, value) {
  return el(TextField, {
    className: `AttributionEditor-${key}`,
    floatingLabelText: label,
    defaultValue: value,
    ref: key,
    key: key,
    style: {width: '100%'}
  })
}

function renderFields (name, label, url, avatar) {
  return el('div', 
    {style: {
      padding: '1rem',
      width: 360
    }},
    (label != 'Link' ? renderTextField('name', 'Name', name) : null),
    renderTextField('url', 'Link', url)
  )
}

class CreditEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      open: false,
      anchorEl: null
    }
    this.handleClick = (event) => {
      this.setState({
        open: true,
        anchorEl: event.currentTarget
      })
    }
    this.handleRequestClose = () => {
      this.setState({
        open: false
      })
    }
  }
  
  componentDidUpdate (_, prevState) {
    // Focus on open
    if (!prevState.open && this.state.open) {
      if (this.refs.name) {
        this.refs.name.focus()
      } else if (this.refs.url) {
        this.refs.url.focus()
      }
    }
  }

  render () {
    const {name, label, url, avatar} = this.props

    return el('span', {},
      el(
        FlatButton,
        {
          style: {
            textTransform: 'inherit'
          },
          icon: renderAvatar(avatar),
          label: name || label,
          labelPosition: 'after',
          onClick: this.handleClick
        }
      ),
      el(
        Popover,
        {
          open: this.state.open,
          anchorEl: this.state.anchorEl,
          onRequestClose: this.handleRequestClose,
          zDepth: 2
        },
        renderFields(name, label, url, avatar)
      )
    )
  }
}

export default React.createFactory(CreditEditor)
