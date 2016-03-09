import {createElement as el} from 'react'
import {sans} from './rebass-theme'

export default function Placeholder (props) {
  const {metadata} = props.initialBlock
  if (!metadata) {
    return el('div', {className: 'Placeholder'})
  }
  const status = metadata.status || ''
  // const value = metadata.progress
  // const mode = metadata.progress != null ? 'determinate' : 'indeterminate'

  return el('div'
  , {className: 'Placeholder'}
  , el('div'
    , { className: 'Placeholder-status'
      , style:
        { fontFamily: sans
        , textAlign: 'center'
        }
      }
      , status
    )
  )
}
