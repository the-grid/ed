import {createElement as el} from 'react'
import Message from 'rebass/dist/Message'

export default function Placeholder (props) {
  const {metadata} = props.initialBlock
  if (!metadata) {
    return el('div', {className: 'Placeholder'})
  }
  const status = metadata.status || ''
  // const value = metadata.progress
  // const mode = metadata.progress != null ? 'determinate' : 'indeterminate'

  return el('div'
  , {className: 'Placeholder'}
  , el(Message
    , { className: 'Placeholder-status'
      , theme: 'info'
      , style: {marginBottom: 0}
      }
    , status
    )
  )
}
