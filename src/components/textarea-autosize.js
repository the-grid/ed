import React, {createElement as el} from 'react'
import {sans} from './rebass-theme'

const containerStyle =
  { fontFamily: sans
  , fontSize: 12
  , marginBottom: '1rem'
  }

const areaStyle =
  { fontFamily: 'inherit'
  , fontSize: 18
  , lineHeight: 1.5
  , minHeight: '1.5rem'
  , display: 'block'
  , width: '100%'
  , padding: 0
  , resize: 'none'
  , color: 'inherit'
  , border: 0
  , borderBottom: '1px solid #08e'
  , borderRadius: 0
  , outline: 'none'
  , overflow: 'hidden'
  }

function resize () {
  const { textarea } = this.refs
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

function stopPropagation (event) {
  event.stopPropagation()
}

class TextareaAutosize extends React.Component {
  constructor (props) {
    super(props)
    this.resize = resize.bind(this)
    this.state = {value: props.defaultValue}
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
    const {label, placeholder} = this.props
    const {value} = this.state

    return el('div'
    , { className: 'TextareaAutosize'
      , style: containerStyle
      }
    , el('label'
      , { onClick: stopPropagation
        , onMouseDown: stopPropagation
        , onMouseUp: stopPropagation
        , onKeyDown: stopPropagation
        , onKeyUp: stopPropagation
        , onKeyPress: stopPropagation
        }
      , label
      , el('textarea'
        , { ref: 'textarea'
          , style: areaStyle
          , value
          , placeholder
          , onChange: this.onChange.bind(this)
          , rows: 1
          , onFocus: this.resize
          , onKeyDown: this.onKeyDown.bind(this)
          }
        )
      )
    )
  }
  onKeyDown (event) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event)
    }
    if (!this.props.multiline && event.key === 'Enter') {
      event.preventDefault()
    }
  }
  onChange (event) {
    let {value} = event.target
    if (!this.props.multiline) {
      value = event.target.value = value
        .replace(/\r\n/g, ' ')
        .replace(/[\r\n]/g, ' ')
    }
    this.setState({value})
    if (this.props.onChange) {
      this.props.onChange(event)
    }
    this.resize()
  }
}
TextareaAutosize.propTypes =
  { defaultValue: React.PropTypes.string
  , defaultFocus: React.PropTypes.bool
  , label: React.PropTypes.string
  , placeholder: React.PropTypes.string
  , onChange: React.PropTypes.func
  , multiline: React.PropTypes.bool
  }
TextareaAutosize.defaultProps =
  { multiline: false
  }
export default React.createFactory(TextareaAutosize)
