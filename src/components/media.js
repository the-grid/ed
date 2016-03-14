import {createElement as el} from 'react'

import Placeholder from './placeholder'
import AttributionEditor from './attribution-editor'

const Components =
  { placeholder: Placeholder
  , attribution: AttributionEditor
  }
  
export default function Media (props) {
  const {type} = props.initialBlock
  let Component = Components[type] || Components.attribution
  return el(Component, props)
}
