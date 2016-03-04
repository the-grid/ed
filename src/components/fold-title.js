require('./fold-title.css')

import {createElement as el} from 'react'
import TextArea from './text-area'

export default function FoldTitle (props) {
  const {initialBlock, onChange} = props
  const title = getText(initialBlock)
  return el('div', {className: 'FoldTitle'},
    el(TextArea, {
      placeholder: 'Post Title',
      defaultValue: title
    })
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
