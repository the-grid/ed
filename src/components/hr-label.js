import {createElement as el} from 'react'

export default function HrLabel (props) {
  const {label} = props

  return el('div'
  , {className: 'HrLabel'
    , style:
        { width: '100vw'
        , borderBottom: '1px solid #ddd'
        , margin: '20px 0 20px'
        , clear: 'both'
        , height: 1
        , textAlign: 'center'
        , fontSize: '.8em'
        }
      }
    , el('div'
      , { style:
          { width: 'auto'
          , display: 'inline-block'
          , padding: '0 10px'
          , left: 0
          , right: 0
          , position: 'relative'
          , margin: 'auto'
          , color: '#bbb'
          , top: -10
          , textAlign: 'center'
          , background: '#fff'
          }
        }
      , label
    )
  )
}
