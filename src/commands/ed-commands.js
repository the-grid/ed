import {nodeAboveSelection} from '../util/pm'

const ed_upload_image = {
  label: 'upload image',
  run (pm) {
    let pos = nodeAboveSelection(pm)
    if (!pos || pos.offset == null) return false
    const index = pos.offset
    pm.signal('ed.menu.file', index)
  },
  group: 'block',
  rank: 100,
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
