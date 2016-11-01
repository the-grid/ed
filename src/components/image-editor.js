import {createElement as el} from 'react'

import Checkbox from 'rebass/dist/Checkbox'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import ButtonConfirm from './button-confirm'


export default function ImageEditor (props, context) {
  const {hasCover
    , allowCoverChange
    , allowCoverRemove
    , siteCoverPrefs
    , filter
    , crop
    , overlay
    , onChange
    , onUploadRequest
    , onCoverRemove
    } = props

  let toggles = null
  if (hasCover) {
    toggles = el('div'
    , {}
    , renderToggle('filter', 'Allow filters', filter, onChange, ['metadata', 'coverPrefs', 'filter'], siteCoverPrefs.filter)
    , renderToggle('crop', 'Allow cropping', crop, onChange, ['metadata', 'coverPrefs', 'crop'], siteCoverPrefs.crop)
    , renderToggle('overlay', 'Allow overlay', overlay, onChange, ['metadata', 'coverPrefs', 'overlay'], siteCoverPrefs.overlay)
    )
  }

  return el('div'
  , { style:
  { padding: '1rem',
    width: 288,
    maxWidth: '100%'
  }
  }
  , toggles
  , (allowCoverChange ? renderUploadButton(onUploadRequest) : null)
  , (allowCoverRemove ? renderRemoveButton(onCoverRemove) : null)
  )
}

function renderToggle (key, label, value, onChange, path, siteAllow) {
  const readOnly = (siteAllow === false)
  return el(Checkbox
  , { key,
    label: label + (readOnly ? ' (off site-wide)' : ''),
    name: key,
    checked: (siteAllow !== false && value !== false),
    style: (readOnly ? {opacity: 0.5} : {}),
    readOnly,
    disabled: readOnly,
    onChange: makeChange(path, onChange, true)
  }
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
  , { onClick,
    theme: 'warning',
    style: { width: '100%' }
  }
  , 'Upload New Image'
  )
}

function renderRemoveButton (onClick) {
  return el(ButtonConfirm
  , { onClick,
    label: 'Remove Image',
    confirm: 'Remove Image: Are you sure?',
    theme: 'warning',
    style:
    { width: '100%',
      marginTop: '0.5rem'
    }
  }
  )
}
