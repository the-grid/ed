require('./label-text.css')

import React, {createElement as el} from 'react'


function resize () {
  const { area } = this.refs
  area.style.height = 'auto'
  area.style.height = area.scrollHeight + 'px'
}

class LabelText extends React.Component {
  constructor () {
    super()
    this.resize = resize.bind(this)
  }
  componentDidMount () {
    this.resize()
  }
  componentDidUpdate () {
    this.resize()
  }
  render () {
    const {label, text} = this.props
    return el('label', {className: 'LabelText'},
      el('div', {className: 'LabelText-label'},
        label
      ),
      el('textarea', {
        className: 'LabelText-textarea',
        ref: 'area',
        defaultValue: text
      })
    )
  }
}

export default React.createFactory(LabelText)
