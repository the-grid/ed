import React, {createElement as el} from 'react'
import Image from './image'
import Message from 'rebass/dist/Message'
import Progress from 'rebass/dist/Progress'
import Space from 'rebass/dist/Space'
import Close from 'rebass/dist/Close'

export default function Placeholder (props, context) {
  const {store} = context
  const {id} = props.initialBlock
  const metadata = store.getPlaceholderMetadata(id)
  if (!metadata) {
    return el('div', {className: 'Placeholder'})
  }
  const {status, progress, failed} = metadata

  const theme = (failed === true ? 'error' : 'info')

  return el('div'
  , { className: `Placeholder Placeholder-${theme}`
    }
  , el(Message
    , { theme
      , style: {marginBottom: 0}
      }
    , el('span', {className: 'Placeholder-status'}, status)
    , makePreview(id, store)
    , el(Space
      , {auto: true, x: 1}
      )
    , el(Close
      , {onClick: makeCancel(store, id)}
      )
    )
  , makeProgress(progress, theme)
  )
}
Placeholder.contextTypes =
  { store: React.PropTypes.object }

function makePreview (id, store) {
  const preview = store.getCoverPreview(id)
  if (!preview) return
  return el('div'
  , { style:
      { width: 96
      , height: 72
      , display: 'inline-block'
      , margin: '0px 16px'
      , overflow: 'hidden'
      }
    }
  , el(Image, {src: preview})
  )
}

function makeProgress (progress, theme) {
  if (progress == null) return
  return el(Progress
  , { value: progress / 100
    , style: {marginTop: 16}
    , theme
    }
  )
}

function makeCancel (store, id) {
  return function () {
    store.routeChange('PLACEHOLDER_CANCEL', id)
  }
}
