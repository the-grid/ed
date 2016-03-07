import React, {createElement as el} from 'react'
import {systemStack} from './rebass-theme'

const containerStyle =
  { fontFamily: systemStack
  , marginBottom: '1rem'
  }

const areaStyle =
  { fontFamily: 'inherit'
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
    if (this.props.defaultFocus === true) {
      this.refs.textarea.focus()
    }
  }
  componentDidUpdate () {
    this.resize()
  }
  render () {
    const {label, placeholder, defaultValue} = this.props

    return el('div'
    , { className: 'TextareaAutosize'
      , style: containerStyle
      }
    , el('label'
      , {}
      , label
      , el('textarea'
        , { ref: 'textarea'
          , style: areaStyle
          , defaultValue
          , placeholder
          , onChange: this.onChange.bind(this)
          , rows: 1
          }
        )
      )
    )
  }
  onChange (event) {
    this.props.onChange(event)
    this.resize()
  }
}
TextareaAutosize.contextTypes = {
  rebass: React.PropTypes.object
}
TextareaAutosize.propTypes =
  { defaultValue: React.PropTypes.string
  , defaultFocus: React.PropTypes.bool
  , label: React.PropTypes.string
  , placeholder: React.PropTypes.string
  , onChange: React.PropTypes.func
  }
export default React.createFactory(TextareaAutosize)
