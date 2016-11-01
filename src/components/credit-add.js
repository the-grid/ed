import {createElement as el} from 'react'

import NavItem from 'rebass/dist/NavItem'
import NavItemConfirm from './nav-item-confirm'


export default function CreditAdd (props) {
  const {schema, metadata, onClick} = props
  return el('div'
  , { style: {} }
  , makeLinks(schema, metadata, onClick)
  )
}


function makeLinks (schema, metadata = {}, onClick) {
  let links = []
  if (schema.isBasedOnUrl && metadata.isBasedOnUrl == null) {
    links.push(makeLink('isBasedOnUrl', 'Add Source Link', onClick))
  }
  // TODO allow multiple authors?
  if (schema.author && (!metadata.author || !metadata.author[0])) {
    links.push(makeLink('author', 'Add Credit', onClick))
  }
  if (schema.via && !metadata.via) {
    links.push(makeLink('via', 'Add Via', onClick))
  }
  if (schema.publisher && !metadata.publisher) {
    links.push(makeLink('publisher', 'Add Publisher', onClick))
  }
  links.push(makeLink('delete', 'Remove Block', onClick, true))
  return links
}

function makeLink (key, label, onClick, confirm = false) {
  const Component = (confirm ? NavItemConfirm : NavItem)
  return el(Component
  , { key,
    children: label,
    label,
    confirm: (confirm ? 'Are you sure?' : null),
    theme: (confirm ? 'warning' : 'primary'),
    style: { display: 'block' },
    onClick: makeClick(key, onClick)
  }
  )
}

function makeClick (key, onClick) {
  return function () {
    onClick(key)
  }
}
