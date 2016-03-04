require('./fold-media.css')

import {createElement as el} from 'react'
import AttributionEditor from './attribution-editor'

export default function FoldMedia (props) {
  const {initialBlock, onChange} = props
  return el('div', {className: 'FoldMedia'},
    el(AttributionEditor, {initialBlock, onChange})
  )
}
