import React, {createElement as el} from 'react'
import TextareaAutosize from './textarea-autosize'
import ButtonOutline from 'rebass/dist/ButtonOutline'

export default function Title (props, context) {
  const {initialBlock} = props
  const {store} = context

  const dummy = document.createElement('div')
  dummy.innerHTML = initialBlock.html
  const title = dummy.textContent

  return el('div'
  , { className: 'Title'
    , style: {
      fontSize: '250%'
    }
    }
  , el('div'
      , {
        style: {
          float: 'right',
          top: 9,
          position: 'relative',
          color: '#ccc',
          lineHeight: .5,
          fontWeight: '100',
          fontSize: '.5em',
          cursor: 'pointer'
        }
      }
      , '✕'
    )
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
