// Copied from https://github.com/ProseMirror/prosemirror/blob/1ce4ad1f8f9028e1efa8af5d48ecb28cdca1f800/src/edit/base_commands.js#L485
function nodeAboveSelection (pm) {
  let sel = pm.selection
  let i = 0
  if (sel.node) return !!sel.from.depth && sel.from.shorten()
  for (; i < sel.head.depth && i < sel.anchor.depth; i++) {
    if (sel.head.path[i] !== sel.anchor.path[i]) break
  }
  return i === 0 ? false : sel.head.shorten(i - 1)
}

const ed_upload_image = {
  label: 'upload image',
  run (pm) {
    let pos = nodeAboveSelection(pm)
    if (!pos || pos.offset == null) return false
    const index = pos.offset
    pm.signal('ed.menu.file', index)
  },
  menuGroup: 'block(100)',
  display: {
    type: 'icon',
    text: 'Upload'
  }
}

/*
let widgetStoreDom = document.getElementById('widget-store')

baseCommands.insert_embed = {
  label: 'insert something...',
  run (pm) {
    widgetStoreDom.classList.add('show')
    // let node = nodeAboveSelection(pm)
    // if (!node) return false
    // pm.setNodeSelection(node)
  },
  menuGroup: 'block(100)',
  display: {type: 'icon', text: 'insert', style: 'font-weight: bold; vertical-align: 20%'}
  // keys: ["Esc"]
}
*/

export default {ed_upload_image}
