// Disable backspace from under media block to delete
// Modified from prosemirror/src/edit/base_commands.js

import {findSelectionFrom} from 'prosemirror/src/edit/selection'

/*eslint-disable */
export const joinBackward = {
  label: "Join with the block above",
  run(pm) {
    let {head, empty} = pm.selection
    if (!empty) return false

    let $head = pm.doc.resolve(head)
    if ($head.parentOffset > 0) return false

    // Find the node before this one
    let before, cut
    for (let i = $head.depth - 1; !before && i >= 0; i--) if ($head.index(i) > 0) {
      cut = $head.before(i + 1)
      before = $head.node(i).child($head.index(i) - 1)
    }

    // If there is no node before this, try to lift
    if (!before)
      return pm.tr.lift(head, head, true).apply(pm.apply.scroll)

    // If the node below has no content and the node above is
    // selectable, delete the node below and select the one above.
    if (before.type.contains == null && before.type.selectable && $head.parent.content.size == 0) {
      let tr = pm.tr.delete(cut, cut + $head.parent.nodeSize).apply(pm.apply.scroll)
      pm.setNodeSelection(cut - before.nodeSize)
      return tr
    }

    // ADDED If the node is media, suppress delete
    if (before.type.name === 'media')
      return

    // If the node doesn't allow children, delete it
    if (before.type.contains == null)
      return pm.tr.delete(cut - before.nodeSize, cut).apply(pm.apply.scroll)

    // Apply the joining algorithm
    return deleteBarrier(pm, cut)
  },
  keys: ["Backspace(30)", "Mod-Backspace(30)"]
}

function deleteBarrier(pm, cut) {
  let $cut = pm.doc.resolve(cut), before = $cut.nodeBefore, after = $cut.nodeAfter
  if (before.type.canContainContent(after.type)) {
    let tr = pm.tr.join(cut)
    if (tr.steps.length && before.content.size == 0 && !before.sameMarkup(after))
      tr.setNodeType(cut - before.nodeSize, after.type, after.attrs)
    if (tr.apply(pm.apply.scroll) !== false)
      return
  }

  let conn
  if (after.isTextblock && (conn = before.type.findConnection(after.type))) {
    let tr = pm.tr, end = cut + after.nodeSize
    tr.step("ancestor", cut, end, {types: [before.type, ...conn],
                                   attrs: [before.attrs, ...conn.map(() => null)]})
    tr.join(end + 2 * conn.length + 2, 1, true)
    tr.join(cut)
    if (tr.apply(pm.apply.scroll) !== false) return
  }

  let selAfter = findSelectionFrom(pm.doc, cut, 1)
  return pm.tr.lift(selAfter.from, selAfter.to, true).apply(pm.apply.scroll)
}
/*eslint-enable */


// import {Media} from '../schema/media'

// // Copied from https://github.com/ProseMirror/prosemirror/blob/1ce4ad1f8f9028e1efa8af5d48ecb28cdca1f800/src/edit/base_commands.js#L485
// function nodeAboveSelection (pm) {
//   let sel = pm.selection
//   let i = 0
//   if (sel.node) return !!sel.from.depth && sel.from.shorten()
//   for (; i < sel.head.depth && i < sel.anchor.depth; i++) {
//     if (sel.head.path[i] !== sel.anchor.path[i]) break
//   }
//   return i === 0 ? false : sel.head.shorten(i - 1)
// }

// Media.register('command', 'ed_codewidget_insert', {
//   label: 'code block',
//   run (pm) {
//     // console.log('code!')
//     let pos = nodeAboveSelection(pm)
//     pm.tr.replaceWith(pos, pos, pm.schema.node(this, {
//       id: uuid.v4(),
//       type: 'code'
//     })).apply()
//   },
//   menuGroup: 'block(200)',
//   display: {
//     type: 'icon',
//     width: 896,
//     height: 1024,
//     path: 'M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z'
//   }
// })
