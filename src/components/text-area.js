import React, {createElement as el} from 'react'


const style = {
  // fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 1.5,
  minHeight: 'none',
  display: 'block',
  width: '100%',
  padding: 0,
  resize: 'none',
  color: 'inherit',
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: 0,
  outline: 'none',
  overflow: 'hidden'
}

function resize () {
  const { textarea } = this.refs
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}


class TextArea extends React.Component {
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
    
    return el('label', {className: 'TextArea'},
      label,
      el('textarea', {
        ref: 'textarea',
        style,
        defaultValue,
        placeholder,
        onChange: this.resize,
        rows: 1
      })
    )
  }
}
export default React.createFactory(TextArea)
