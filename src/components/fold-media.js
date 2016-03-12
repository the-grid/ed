import {createElement as el} from 'react'
import AttributionEditor from './attribution-editor'

export default function FoldMedia (props) {
  const {initialBlock} = props
  let id
  if (initialBlock) {
    id = initialBlock.id
  }
  return el('div'
  , { className: 'FoldMedia'
    , style:
      { margin: '0 auto'
      , padding: '1rem'
      , maxWidth: 800
      }
    }
  , (initialBlock
    ? el(AttributionEditor, {initialBlock, id})
    : '(TODO add media ui / signal here)'
    )
  , renderHelp()
  )
}

function renderHelp () {
  return el('button'
  , { className: 'Ed-Help'
    , title: 'Welcome to your post editor.\n' +
      'Everything above the "fold" line will show in your main page feed, ' +
      'while everything below the line will show in the post\'s page.'
    , children: '?'
    }
  )
}
