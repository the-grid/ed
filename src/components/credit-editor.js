import React, {createElement as el} from 'react'
import ReactDOM from 'react-dom'
import imgflo from 'imgflo-url'

// import FlatButton from 'material-ui/lib/flat-button'
// import Avatar from 'material-ui/lib/avatar'
// import Popover from 'material-ui/lib/popover/popover'
// import TextField from 'material-ui/lib/text-field'

import {Dropdown, DropdownMenu, Panel, PanelHeader
  , ButtonOutline, Arrow, Avatar} from 'rebass'

import TextareaAutosize from './textarea-autosize'


class CreditEditor extends React.Component {

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
    const {name, label, url, avatar, onChange, onlyUrl, path} = this.props

    return el(Dropdown
      , {
        style: {display: 'inline-block'}
      }
      , el(ButtonOutline
        , { onClick: this.openMenu
          , theme: 'secondary'
          , inverted: false
          , title: label
          , style: {marginLeft: -1}
          }
        , (name || label)
        , el(Arrow, {direction: 'down'})
      )
      , el(DropdownMenu
        , { open: this.state.open
          , right: true
          , onDismiss: this.closeMenu
        }
        , el(Panel
          , { theme: 'secondary'
            , style:
              { textAlign: 'left'
              , marginBottom: 0
              , width: 360
              }
            }
          , this.renderAvatar()
          , (
            onlyUrl
            ? renderBasedOnUrl(url, onChange, path, this.fieldOnEnterKeyDown)
            : renderFields(name, label, url, avatar, onChange, path, this.fieldOnEnterKeyDown)
          )
        )
      )
    )
  }
  renderAvatar () {
    const {avatar} = this.props
    const {imgfloConfig} = this.context
    if (!avatar || !avatar.src) return
    let {src} = avatar
    if (imgfloConfig) {
      const params =
        { input: src
        , width: 72
        }
      src = imgflo(imgfloConfig, 'passthrough', params)
    }
    return el(Avatar,
      { style: {float: 'right'}
      , src
      }
    )
  }
}
CreditEditor.contextTypes =
  { imgfloConfig: React.PropTypes.object
  }
CreditEditor.propTypes =
  { path: React.PropTypes.array.isRequired
  , onChange: React.PropTypes.func.isRequired
  , onlyUrl: React.PropTypes.bool.isRequired
  }
export default React.createFactory(CreditEditor)


function renderFields (name, label, url, avatar, onChange, path, onEnterKeyDown) {
  return (
    [ renderTextField('name', 'Name', name, onChange, path.concat(['name']), onEnterKeyDown)
    , renderTextField('url', 'Link', url, onChange, path.concat(['url']), onEnterKeyDown)
    ]
  )
}

function renderBasedOnUrl (value, onChange, path, onEnterKeyDown) {
  return renderTextField('url', 'Link', value, onChange, path, onEnterKeyDown)
}

function renderTextField (key, label, value, onChange, path, onEnterKeyDown) {
  return el(TextareaAutosize
  , { className: `AttributionEditor-${key}`
    , label
    , defaultValue: value
    , key: key
    , name: key
    , multiLine: true
    , style: {width: '100%'}
    , onChange: makeChange(path, onChange)
    , onEnterKeyDown
    }
  )
}

function makeChange (path, onChange) {
  return function (event) {
    onChange(path, event.target.value)
  }
}
