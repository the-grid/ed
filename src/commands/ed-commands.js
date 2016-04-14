import {elt} from 'prosemirror/src/dom'

let lastSpace = 0

const commands = {
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
            const {index} = pm.doc.childBefore(pm.selection.anchor)
            if (index == null) return false
            pm.signal('ed.menu.file', index)
          })
          return el
        }
      }
    }
  }
  , doubleSpacePeriod: {
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
