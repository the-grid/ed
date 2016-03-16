import React, {createElement as el} from 'react'
import Message from 'rebass/dist/Message'
import Progress from 'rebass/dist/Progress'
import Space from 'rebass/dist/Space'
import Close from 'rebass/dist/Close'

export default function Placeholder (props, context) {
  const {store} = context
  const {metadata, id} = props.initialBlock
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
    , el(Space
      , {auto: true, x: 1}
      )
    , el(Close
      , {onClick: makeCancel(store, id)}
      )
    )
  , makeProgress(progress)
  )
}
Placeholder.contextTypes =
  { store: React.PropTypes.object }

function makeProgress (progress) {
  if (progress == null) return
  return el(Progress
  , { value: progress / 100
    , theme: 'info'
    , style: {marginTop: 16}
    }
  )
}

function makeCancel (store, id) {
  return function () {
    store.routeChange('PLACEHOLDER_CANCEL', id)
  }
}
