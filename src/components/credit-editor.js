import React, {createElement as el} from 'react'
import imgflo from 'imgflo-url'

import TextareaAutosize from './textarea-autosize'

import Avatar from 'rebass/dist/Avatar'


export default function CreditEditor (props, context) {
  const {name, label, url, avatar, onChange, onlyUrl, path} = props

  return el('div'
  , { style:
      { padding: '1rem 1rem 0 1rem'
      , minWidth: 360
      }
    }
  , renderAvatar(avatar, context.imgfloConfig)
  , renderLabel(label)
  , (onlyUrl
    ? renderBasedOnUrl(url, onChange, path)
    : renderFields(name, label, url, avatar, onChange, path)
    )
  )
}
CreditEditor.contextTypes = {imgfloConfig: React.PropTypes.object}


function renderAvatar (avatar, imgfloConfig) {
  if (!avatar || !avatar.src) return
  let {src} = avatar
  if (imgfloConfig) {
    const params =
      { input: src
      , width: 72
      }
    src = imgflo(imgfloConfig, 'passthrough', params)
  }
  return el(Avatar,
    { key: 'avatar'
    , style: {float: 'right'}
    , src
    }
  )
}

function renderLabel (label) {
  return el('div'
  , {style: {marginBottom: '0.5rem'}}
  , label
  )
}

function renderFields (name, label, url, avatar, onChange, path) {
  return (
    [ renderTextField('name', 'Name', name, onChange, path.concat(['name']), true)
    , renderTextField('url', 'Link', url, onChange, path.concat(['url']), false)
    ]
  )
}

function renderBasedOnUrl (value, onChange, path) {
  return renderTextField('url', '', value, onChange, path, true)
}

function renderTextField (key, label, value, onChange, path, defaultFocus = false) {
  return el(TextareaAutosize
  , { className: `AttributionEditor-${key}`
    , label
    , defaultValue: value
    , defaultFocus
    , key: key
    , name: key
    , multiLine: true
    , style: {width: '100%'}
    , onChange: makeChange(path, onChange)
    }
  )
}

function makeChange (path, onChange) {
  return function (event) {
    const {value} = event.target
    onChange(path, value)
  }
}
