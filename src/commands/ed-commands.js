import {elt} from 'prosemirror/src/dom'

const ed_upload_image =
  { label: 'upload image to post'
  , run: function () {}
  , menu:
    { group: 'ed_block'
    , display:
      { render: function (command, pm) {
        const el = elt('div'
          , { style:
              { cursor: 'pointer' }
            }
          , 'Upload Image'
          )
        el.addEventListener('mousedown', function (event) {
            // HACK around #44
            event.stopPropagation()
          })
        el.addEventListener('click', function (event) {
            event.stopPropagation()
            const {index} = pm.doc.childBefore(pm.selection.anchor)
            if (index == null) return false
            pm.signal('ed.menu.file', index)
          })
        return el
      }
      }
    }
  }

export default {ed_upload_image}
