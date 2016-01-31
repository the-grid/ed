// Copied from https://github.com/ProseMirror/prosemirror/blob/1ce4ad1f8f9028e1efa8af5d48ecb28cdca1f800/src/edit/base_commands.js#L485
export function nodeAboveSelection (pm) {
  let sel = pm.selection
  let i = 0
  if (sel.node) return !!sel.from.depth && sel.from.shorten()
  for (; i < sel.head.depth && i < sel.anchor.depth; i++) {
    if (sel.head.path[i] !== sel.anchor.path[i]) break
  }
  return i === 0 ? false : sel.head.shorten(i - 1)
}
