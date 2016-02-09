require('./widget.css')

import {createElement as el} from 'react'

// import WidgetCode from './widget-code'
import WidgetDefault from './widget-default'

const WidgetTypes = {
  // code: WidgetCode,
  default: WidgetDefault
}


export default function WidgetMover (props) {
  const {id, type, rectangle, initialBlock} = props

  const Widget = WidgetTypes[type] || WidgetTypes.default

  return el(
    'div',
    {
      className: 'Widget',
      key: id,
      style: rectangle
    },
    el(Widget, {initialBlock})
  )
}
