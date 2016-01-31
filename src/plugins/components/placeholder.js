require('./placeholder.css')

import {createElement as el} from 'react'


export default function Placeholder (props) {
  const {metadata} = props.initialBlock
  const status = metadata ? metadata.status : ''

  return el(
    'div',
    {className: 'Placeholder'},
    el(
      'p',
      {className: 'Placeholder-status'},
      status
    )
  )
}