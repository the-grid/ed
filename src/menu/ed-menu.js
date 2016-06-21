import {Dropdown, undoItem, redoItem, liftItem} from 'prosemirror/dist/menu/menu'
import {buildMenuItems} from 'prosemirror/dist/example-setup'
import EdSchema from '../schema/ed-schema-full'
import menuImage from './menu-image'

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

const typeDropdown = new Dropdown(
  [ makeParagraph
  , makeHead1
  , makeHead2
  , makeHead3
  ]
  , {label: 'Type...'}
)

export const edBlockMenu =
  [ [ typeDropdown ]
  , [ wrapBulletList
    , wrapOrderedList
    , wrapBlockQuote
    , liftItem
    ]
  , [ menuImage ]
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
