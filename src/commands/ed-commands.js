import {nodeAboveSelection, onBlankLine} from '../util/pm'

const ed_upload_image =
  { label: 'On new line, choose an image to upload to your post'
  , run (pm) {
    let pos = nodeAboveSelection(pm)
    if (!pos || pos.offset == null) return false
    const index = pos.offset
    pm.signal('ed.menu.file', index)
  }
  , select (pm) {
    return onBlankLine(pm)
  }
  , menu:
    { group: 'ed_block'
    , rank: 100
    , class: 'EdMenuText'
    , display:
      { type: 'label'
      , label: 'Upload Image'
      }
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
