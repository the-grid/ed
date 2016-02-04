import {createElement as el} from 'react'

import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconButton from 'material-ui/lib/icon-button'
import AddIcon from 'material-ui/lib/svg-icons/content/add'

export default function CreditAdd (props) {
  const {schema, metadata = {}} = props
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
  if (links.length > 0) {
    console.log(links)
    return el(
      IconMenu,
      {
        iconButtonElement: el(IconButton, null, el(AddIcon)),
        anchorOrigin: {horizontal: 'right', vertical: 'top'},
        targetOrigin: {horizontal: 'right', vertical: 'top'}
      },
      links
    )
  }
}
