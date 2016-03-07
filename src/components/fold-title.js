require('./fold-title.css')

import {createElement as el} from 'react'
import TextareaAutosize from './textarea-autosize'

export default function FoldTitle (props) {
  const {initialBlock} = props
  const title = getText(initialBlock)
  return el('div', {className: 'FoldTitle'},
    el(TextareaAutosize
    , { placeholder: 'Post Title'
      , defaultValue: title
      }
    )
  )
}

function getText (block) {
  if (block && block.html) {
    const dummy = document.createElement('div')
    dummy.innerHTML = block.html
    return dummy.textContent
  }
  return null
}
