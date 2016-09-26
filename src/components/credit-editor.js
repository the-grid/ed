import React, {createElement as el} from 'react'
import imgflo from 'imgflo-url'

import TextareaAutosize from './textarea-autosize'
import {isUrlOrBlank} from '../util/url'

import Avatar from 'rebass/dist/Avatar'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import ButtonConfirm from './button-confirm'


export default function CreditEditor (props, context) {
  const {name, label, url, avatar, onChange, onlyUrl, path} = props

  return el('div'
  , { style:
      { padding: '1rem'
      , width: 360
      , maxWidth: '100%'
      }
    }
  , renderAvatar(avatar, context.imgfloConfig)
  , (onlyUrl ? '' : renderLabel(label))
  , (onlyUrl
    ? renderBasedOnUrl(url, onChange, path)
    : renderFields(name, url, avatar, onChange, path)
    )
  , renderRemove(onChange, path)
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

function renderRemove (onChange, path) {
  return el(ButtonConfirm
  , { onClick: makeRemove(onChange, path)
    , style: {float: 'right'}
    , theme: 'warning'
    , title: 'delete attribution from block'
    , label: 'Remove'
    , confirm: 'Remove: Are you sure?'
    }
  )
}

function renderLabel (label) {
  return el('div'
  , {style: {marginBottom: '0.5rem'}}
  , label
  )
}

function renderFields (name, url, avatar, onChange, path) {
  return (
    [ renderTextField('name', 'Name', name, onChange, path.concat(['name']), true)
    , renderTextField('url', 'Link', url, onChange, path.concat(['url']), false, isUrlOrBlank, 'https...')
    ]
  )
}

function renderBasedOnUrl (value, onChange, path) {
  return renderTextField('url', 'Link', value, onChange, path, true, isUrlOrBlank, 'https...')
}

function renderTextField (key, label, value, onChange, path, defaultFocus, validator, placeholder) {
  return el(TextareaAutosize
  , { className: `AttributionEditor-${key}`
    , label
    , defaultValue: value
    , defaultFocus
    , key: key
    , name: key
    , multiLine: true
    , style: {width: '100%'}
    , onChange: makeChange(onChange, path)
    , validator
    , placeholder
    }
  )
}

function makeChange (onChange, path) {
  return function (event) {
    const {value} = event.target
    onChange(path, value)
  }
}

function makeRemove (onChange, path) {
  return function () {
    onChange(path, undefined)
  }
}
