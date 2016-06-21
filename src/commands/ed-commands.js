import {elt} from 'prosemirror/dist/util/dom'
import {focusedIndex, isCollapsed} from '../util/pm'

let commands = {}
let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

function triggerUpload (pm) {
  const index = focusedIndex(pm)
  if (index == null) return
  pm.ed.trigger('command.menu.file', index)
}

commands.ed_upload_image =
  { label: 'upload image to post'
  , run: triggerUpload
  , select (pm) {
    return isCollapsed(pm)
  }
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
              event.stopImmediatePropagation()
            })
            el.addEventListener('click', function (event) {
              triggerUpload(pm)
            })
            return el
          }
      }
    }
  }

if (isIOS) {
  let lastSpace = 0
  commands.doubleSpacePeriod =
    { keys: ['Space(1)']
    , run: function (pm) {
      var now = Date.now()
      if (now - lastSpace < 200) {
        lastSpace = 0
        var sel = pm.selection
        if (!sel.empty) return false
        let before = pm.doc.resolve(sel.head).nodeBefore
        if (!before.isText || before.text.charAt(before.text.length - 1) !== ' ') return false
        return pm.tr.replaceWith(sel.head - 1, sel.head, pm.schema.text('. ', before.marks)).apply()
      } else {
        lastSpace = now
        return false
      }
    }
  }
}

export default commands
