export function focusedIndex (pm) {
  const selection = pm.selection
  if (!selection) return
  if (selection.anchor != null) {
    return pm.doc.childBefore(selection.anchor).index
  }
  if (selection.to != null) {
    console.log(pm.doc.childBefore(selection.to))
    return pm.doc.childBefore(selection.to).index
  }
}

export function isCollapsed (pm) {
  const {anchor, head} = pm.selection
  if (anchor == null) return false
  return (anchor === head)
}
