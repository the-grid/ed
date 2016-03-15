import React, {createElement as el} from 'react'
import TextareaAutosize from './textarea-autosize'

export default function Title (props, context) {
  const {initialBlock} = props
  const {store} = context

  const dummy = document.createElement('div')
  dummy.innerHTML = initialBlock.html
  const title = dummy.textContent

  return el('div'
  , { className: 'Title'
    , style: {fontSize: '250%'}
    }
  , el(TextareaAutosize
    , { label: 'Title'
      , defaultValue: title
      , defaultFocus: true
      , onChange: function (event) {
        const block = initialBlock
        block.html = `<h1>${event.target.value}</h1>`
        store.routeChange('FOLD_MEDIA_CHANGE', block)
      }
      }
    )
  )
}
Title.contextTypes = { store: React.PropTypes.object }
