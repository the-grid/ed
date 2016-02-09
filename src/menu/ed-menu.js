import {MenuCommandGroup, Dropdown, inlineGroup, blockGroup, historyGroup} from 'prosemirror/src/menu/menu'

const textblockMenu = new Dropdown(
  {
    label: "Type...",
    activeLabel: true,
    class: "ProseMirror-textblock-dropdown"
  },
  [
    new MenuCommandGroup("textblock"),
    new MenuCommandGroup("textblockHeading")
  ]
)

const custom = [
  // 'ed_upload_image'
]

export const inlineMenu = [
  inlineGroup,
  textblockMenu,
  blockGroup
]

export const blockMenu = [
  textblockMenu,
  blockGroup
]

export const barMenu = [
  inlineGroup,
  textblockMenu,
  blockGroup,
  historyGroup
]

export function trimDefaultMenus (pm) {
  delete pm.commands.selectParentNode.spec.menu
}
