import {createElement as el} from 'react'

import TextareaAutosize from './textarea-autosize'
import Checkbox from 'rebass/dist/Checkbox'
import ButtonOutline from 'rebass/dist/ButtonOutline'


export default function ImageEditor (props, context) {
  const {hasCover
    , allowCoverChange
    , allowCoverRemove
    , title
    , filter
    , crop
    , overlay
    , type
    , onChange
    , onUploadRequest
    , onCoverRemove
    } = props

  let toggles = null
  if (hasCover) {
    toggles = el('div'
    , {}
    , renderToggle('filter', 'Allow filters', filter, onChange, ['coverPrefs', 'filter'])
    , renderToggle('crop', 'Allow cropping', crop, onChange, ['coverPrefs', 'crop'])
    , renderToggle('overlay', 'Allow overlay', overlay, onChange, ['coverPrefs', 'overlay'])
    )
  }

  return el('div'
  , { style:
      { padding: '1rem'
      , minWidth: 360
      }
    }
  , renderTextFields(type, title, onChange)
  , toggles
  , (allowCoverChange ? renderUploadButton(onUploadRequest) : null)
  , (allowCoverRemove ? renderRemoveButton(onCoverRemove) : null)
  )
}

function renderTextFields (type, title, onChange) {
  if (type !== 'image') return
  return renderTextField('title', 'Image Hover Title', title, onChange, ['title'], true, '')
  // TODO alt text: depends on API
  // html-flatten expects caption to be saved in html alt
}

function renderTextField (key, label, value, onChange, path, defaultFocus, placeholder) {
  return el(TextareaAutosize
  , { className: `ImageEditor-${key}`
    , label
    , defaultValue: value
    , defaultFocus
    , key: key
    , name: key
    , multiLine: true
    , style: {width: '100%'}
    , onChange: makeChange(path, onChange)
    , placeholder
    }
  )
}

function renderToggle (key, label, value, onChange, path) {
  return el(Checkbox
  , { key
    , label
    , name: key
    , checked: (value !== false)
    , onChange: makeChange(path, onChange, true)}
  )
}

function makeChange (path, onChange, checked = false) {
  return function (event) {
    const value = (checked ? event.target.checked : event.target.value)
    onChange(path, value)
  }
}

function renderUploadButton (onClick) {
  return el(ButtonOutline
  , { onClick
    , theme: 'warning'
    , style: { width: '100%' }
    }
  , 'Upload New Image'
  )
}

function renderRemoveButton (onClick) {
  return el(ButtonOutline
  , { onClick
    , theme: 'warning'
    , style:
      { width: '100%'
      , marginTop: '0.5rem'
      }
    }
  , 'Remove Image'
  )
}
