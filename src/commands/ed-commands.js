import {elt} from 'prosemirror/src/dom'
import {focusedIndex} from '../util/pm'

function triggerUpload (pm) {
  const index = focusedIndex(pm)
  if (index == null) return
  pm.signal('ed.menu.file', index)  
}

const ed_upload_image =
  { label: 'upload image to post'
  , run: triggerUpload
  , menu:
    { group: 'ed_block'
    , display:
      { render:
          function (command, pm) {
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
              triggerUpload(pm)
            })
            return el
          }
      }
    }
  }

export default {ed_upload_image}
