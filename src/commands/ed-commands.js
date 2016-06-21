let commands = {}
let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream


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
