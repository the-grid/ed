import {createElement as el} from 'react'

import NavItem from 'rebass/dist/NavItem'
import NavItemConfirm from './nav-item-confirm'


export default function CreditAdd (props) {
  const {schema, metadata, onClick, removable} = props
  return el('div'
  , { style: {} }
  , makeLinks(schema, metadata, onClick, removable)
  )
}


function makeLinks (schema, metadata = {}, onClick, removable=true) {
  let links = []
  if (schema.isBasedOnUrl && metadata.isBasedOnUrl == null) {
    links.push(makeLink('isBasedOnUrl', 'Add Source Link', onClick))
  }
  // TODO allow multiple authors?
  if (schema.author && (!metadata.author || !metadata.author[0])) {
    links.push(makeLink('author', 'Add Author', onClick))
  }
  if (schema.publisher && !metadata.publisher) {
    links.push(makeLink('publisher', 'Add Publisher', onClick))
  }
  if (removable) links.push(makeLink('delete', 'Delete Content', onClick, true))
  return links
}

function makeLink (key, label, onClick, confirm = false) {
  const Component = (confirm ? NavItemConfirm : NavItem)
  return el(Component
  , { key
    , children: label
    , label
    , confirm: (confirm ? 'Are you sure?' : null)
    , theme: (confirm ? 'warning' : 'primary')
    , style: { display: 'block' }
    , onClick: makeClick(key, onClick)
    }
  )
}

function makeClick (key, onClick) {
  return function () {
    onClick(key)
  }
}
