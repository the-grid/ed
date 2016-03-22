import {createElement as el} from 'react'

import NavItem from 'rebass/dist/NavItem'


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
    links.push(makeLink('author', 'Add Author', onClick))
  }
  if (schema.publisher && !metadata.publisher) {
    links.push(makeLink('publisher', 'Add Publisher', onClick))
  }
  links.push(makeLink('delete', 'Remove Block', onClick, 'warning'))
  return links
}

function makeLink (key, label, onClick, theme = 'primary') {
  return el(NavItem
  , { key
    , children: label
    , theme
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
