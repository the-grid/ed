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
