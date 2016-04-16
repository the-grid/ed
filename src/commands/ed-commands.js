import {elt} from 'prosemirror/src/dom'
import {focusedIndex} from '../util/pm'

let lastSpace = 0
let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

let commands = {
  ed_upload_image: {
    label: 'upload image to post'
    , run: function () {
    }
    , menu: {
      group: 'ed_block'
      , display: {
        render: function (command, pm) {
          const el = elt('div'
            , {
              style: {cursor: 'pointer'}
            }
            , 'Upload Image'
            )
            el.addEventListener('mousedown', function (event) {
              // HACK around #44
              event.stopPropagation()
            })
            el.addEventListener('click', function (event) {
              event.stopPropagation()
              const index = focusedIndex(pm)
              if (index == null) return
              pm.signal('ed.menu.file', index)
            })
            return el
          }
      }
    }
  }
}

if (isIOS) {
  commands.doubleSpacePeriod = {
    keys: ['Space(1)']
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
