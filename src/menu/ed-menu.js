import {MenuCommandGroup, Dropdown, inlineGroup, blockGroup, historyGroup} from 'prosemirror/src/menu/menu'

const textblockMenu = new Dropdown(
  {
    label: 'Type...',
    activeLabel: true,
    class: 'ProseMirror-textblock-dropdown'
  },
  [
    new MenuCommandGroup('textblock'),
    new MenuCommandGroup('textblockHeading')
  ]
)

const edMenuGroup = new MenuCommandGroup('ed_block')

export const inlineMenu = [
  inlineGroup,
  textblockMenu,
  blockGroup
]

export const blockMenu = [
  textblockMenu,
  blockGroup,
  edMenuGroup
]

export const barMenu = [
  inlineGroup,
  textblockMenu,
  blockGroup,
  edMenuGroup,
  historyGroup
]
