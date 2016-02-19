require('./placeholder.css')

import {createElement as el} from 'react'
import LinearProgress from 'material-ui/lib/linear-progress';


export default function Placeholder (props) {
  const {metadata} = props.initialBlock
  const status = metadata.status || ''
  const value = metadata.progress
  const mode = metadata.progress != null ? 'determinate' : 'indeterminate'

  return el(
    'div',
    {className: 'Placeholder'},
    el(
      'h4',
      {className: 'Placeholder-status'},
      status
    ),
    el(
      LinearProgress,
      {mode, value}
    )
  )
}
