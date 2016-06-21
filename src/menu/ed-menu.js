import {MenuItem, Dropdown, undoItem, redoItem} from 'prosemirror/dist/menu/menu'
import {buildMenuItems} from 'prosemirror/dist/example-setup'
import EdSchema from '../schema/ed-schema-full'
import commands from '../commands/ed-commands'

const menuItems = buildMenuItems(EdSchema)
const { makeParagraph
  , makeHead1
  , makeHead2
  , makeHead3
  , wrapBlockQuote
  , wrapBulletList
  , wrapOrderedList
  , toggleEm
  , toggleLink
  , toggleStrong
  } = menuItems
console.log(menuItems)

const typeDropdown = new Dropdown(
  [ makeParagraph
  , makeHead1
  , makeHead2
  , makeHead3
  ]
  , {label: 'Type...'}
)

const edAddImage = new MenuItem(
  { label: 'Upload Image'
  , title: 'upload image(s) above this block'
  , run: commands.ed_upload_image.run
  , select: commands.ed_upload_image.select
  }
)

export const edBlockMenu =
  [ [ typeDropdown ]
  , [ wrapBulletList
    , wrapOrderedList
    , wrapBlockQuote
    ]
  , [ edAddImage ]
  ]

export const edInlineMenu =
  [ [ toggleEm
    , toggleLink
    , toggleStrong
    ]
  ]

export const edBarMenu = edBlockMenu
  .concat(edInlineMenu)
  .concat([[undoItem, redoItem]])
