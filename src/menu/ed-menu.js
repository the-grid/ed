const inline = [
  'strong:toggle',
  'em:toggle',
  'link:unset',
  'link:set'
]

const block = [
  'textblockType',
  'blockquote:wrap',
  'bullet_list:wrap',
  'ordered_list:wrap',
  'lift'
]

const custom = [
  // 'insert',
  'image:insert',
  'ed_upload_image'
  // 'ed_codewidget_insert'
]

export const inlineMenu = [
  inline,
  block
]

export const blockMenu = [
  block,
  custom
]

export const barMenu = [
  inline,
  block,
  custom
]
