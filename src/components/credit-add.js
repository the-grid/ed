import {createElement as el} from 'react'

import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconButton from 'material-ui/lib/icon-button'
import AddIcon from 'material-ui/lib/svg-icons/content/add'


export default function CreditAdd (props) {
  const {schema, metadata} = props
  const links = makeLinks(schema, metadata)
  if (links.length > 0) {
    return el(
      IconMenu,
      {
        iconButtonElement: el(
          IconButton,
          {
            touch: true,
            tooltip: 'Add Credit',
            tooltipPosition: 'top-left'
          },
          el(AddIcon)
        ),
        anchorOrigin: {horizontal: 'right', vertical: 'top'},
        targetOrigin: {horizontal: 'right', vertical: 'top'}
      },
      links
    )
  }
}


function makeLinks (schema, metadata = {}) {
  let links = []
  if (schema.isBasedOnUrl && !metadata.isBasedOnUrl) {
    links.push(el(MenuItem, {key: 'link', primaryText: 'Add Link'}))
  }
  if (schema.author) {
    links.push(el(MenuItem, {key: 'author', primaryText: 'Add Author'}))
  }
  if (schema.publisher && !metadata.publisher) {
    links.push(el(MenuItem, {key: 'publisher', primaryText: 'Add Publisher'}))
  }
  return links
}
