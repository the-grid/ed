import {createElement as el} from 'react'

import NavItem from 'rebass/dist/NavItem'


export default function CreditAdd (props) {
  const {schema, metadata} = props
  return el('div'
  , { style: {} }
  , makeLinks(schema, metadata)
  )
}


function makeLinks (schema, metadata = {}) {
  let links = []
  if (schema.isBasedOnUrl && !metadata.isBasedOnUrl) {
    links.push(makeLink('link', 'Add Source Link'))
  }
  // TODO allow multiple authors?
  if (schema.author && (!metadata.author || !metadata.author[0])) {
    links.push(makeLink('author', 'Add Author'))
  }
  if (schema.publisher && !metadata.publisher) {
    links.push(makeLink('publisher', 'Add Publisher'))
  }
  links.push(makeLink('delete', 'Remove Block', 'warning'))
  return links
}

function makeLink (key, label, theme = 'primary') {
  return el(NavItem
  , { key
    , children: label
    , theme
    }
  )
}
