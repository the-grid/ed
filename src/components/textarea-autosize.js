import React, {createElement as el} from 'react'
import {systemStack} from './rebass-theme'

const style =
  { fontFamily: systemStack
  , fontSize: 'inherit'
  , lineHeight: 1.5
  , minHeight: 'none'
  , display: 'block'
  , width: '100%'
  , padding: 0
  , resize: 'none'
  , color: 'inherit'
  , backgroundColor: 'transparent'
  , border: 0
  , borderBottom: '1px gray solid'
  , borderRadius: 0
  , outline: 'none'
  , overflow: 'hidden'
  }

function resize () {
  const { textarea } = this.refs
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}


class TextareaAutosize extends React.Component {
  constructor () {
    super()
    this.resize = resize.bind(this)
  }
  componentDidMount () {
    this.resize()
    if (this.props.defaultValue === '') {
      this.refs.textarea.focus()
    }
  }
  componentDidUpdate () {
    this.resize()
  }
  render () {
    const {label, placeholder, defaultValue} = this.props

    return el('label'
    , { className: 'TextareaAutosize'
      , style: {fontFamily: systemStack}
      }
    , label
    , el('textarea'
      , { ref: 'textarea'
        , style
        , defaultValue
        , placeholder
        , onChange: this.resize
        , rows: 1
        }
      )
    )
  }
}
TextareaAutosize.contextTypes = {
  rebass: React.PropTypes.object
}
export default React.createFactory(TextareaAutosize)
