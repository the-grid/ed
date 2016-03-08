require('./placeholder.css')

import {createElement as el} from 'react'


export default function Placeholder (props) {
  const {metadata} = props.initialBlock
  if (!metadata) {
    return el('div', {className: 'Placeholder'})
  }
  const status = metadata.status || ''
  // const value = metadata.progress
  // const mode = metadata.progress != null ? 'determinate' : 'indeterminate'

  return el(
    'div',
    {className: 'Placeholder'},
    el(
      'h4',
      {className: 'Placeholder-status'},
      status
    )
  )
}
