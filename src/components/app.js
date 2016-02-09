import {createElement as el} from 'react'
import Widget from './widget'

export default function App (props) {
  const {widgets} = props
  return el(
    'div',
    {className: 'App'},
    widgets.map(Widget)
  )
}
