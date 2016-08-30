import { Dropdown
  , undoItem
  , redoItem
  , liftItem
  } from 'prosemirror/dist/menu/menu'
import { buildMenuItems } from 'prosemirror/dist/example-setup'
import EdSchema from '../schema/ed-schema-full'
import menuImage from './menu-image'
import { menuMedia
  , menuCode
  , menuLocation
  , menuUserhtml
  , menuCta
  } from './menu-media'

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

// Disable these menus on media block selection
function enableIsText (pm) {
  if (pm.selection && pm.selection.node && !pm.selection.node.isTextblock) {
    return false
  }
  return this.run(pm, false)
}
makeParagraph.spec.select = enableIsText
makeHead1.spec.select = enableIsText
makeHead2.spec.select = enableIsText
makeHead3.spec.select = enableIsText


export const edCommands =
  { 'strong:toggle': toggleStrong
  , 'em:toggle': toggleEm
  , 'link:toggle': toggleLink
  , 'paragraph:make': makeParagraph
  , 'heading:make1': makeHead1
  , 'heading:make2': makeHead2
  , 'heading:make3': makeHead3
  , 'bullet_list:wrap': wrapBulletList
  , 'ordered_list:wrap': wrapOrderedList
  , 'blockquote:wrap': wrapBlockQuote
  , 'lift': liftItem
  , 'undo': undoItem
  , 'redo': redoItem
  , 'ed_upload_image': menuImage
  , 'ed_add_code': menuCode
  , 'ed_add_location': menuLocation
  , 'ed_add_userhtml': menuUserhtml
  , 'ed_add_cta': menuCta
  }

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
  , [ menuMedia ]
  ]

export const edInlineMenu =
  [ [ toggleEm
    , toggleLink
    , toggleStrong
    ]
  ]

export const edBarMenu = edInlineMenu
  .concat(edBlockMenu)
  .concat([[undoItem, redoItem]])
