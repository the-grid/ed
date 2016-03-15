import {createElement as el} from 'react'
import Message from 'rebass/dist/Message'
import Progress from 'rebass/dist/Progress'

export default function Placeholder (props) {
  const {metadata} = props.initialBlock
  if (!metadata) {
    return el('div', {className: 'Placeholder'})
  }
  const {status, progress} = metadata

  return el('div'
  , {className: 'Placeholder'}
  , el(Message
    , { className: 'Placeholder-status'
      , theme: 'info'
      , style: {marginBottom: 0}
      }
    , status
    )
  , makeProgress(progress)
  )
}

function makeProgress (progress) {
  if (progress == null) return
  return el(Progress
  , { value: progress/100
    , theme: 'info'
    , style: {marginTop: 16}
    }
  )
}
