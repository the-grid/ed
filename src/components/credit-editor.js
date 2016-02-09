import React, {createElement as el} from 'react'
import imgflo from 'imgflo-url'

import FlatButton from 'material-ui/lib/flat-button'
import Avatar from 'material-ui/lib/avatar'
import Popover from 'material-ui/lib/popover/popover'
import TextField from 'material-ui/lib/text-field'


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
    const {imgfloConfig} = this.context

    return el('span', {},
      el(
        FlatButton,
        {
          style: {
            textTransform: 'inherit'
          },
          icon: renderAvatar(avatar, imgfloConfig),
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

CreditEditor.contextTypes = {
  imgfloConfig: React.PropTypes.object
}

export default React.createFactory(CreditEditor)


function renderAvatar (cover, imgfloConfig) {
  if (!cover || !cover.src) return
  let {src} = cover
  if (imgfloConfig) {
    const params = {
      input: src,
      width: 72
    }
    src = imgflo(imgfloConfig, 'passthrough', params)
  }
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
    (label !== 'Link' ? renderTextField('name', 'Name', name) : null),
    renderTextField('url', 'Link', url)
  )
}
