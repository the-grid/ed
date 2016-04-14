export function isCollapsed (pm) {
  const {anchor, head} = pm.selection
  return (anchor === head)
}

export function focusedIndex (pm) {
  return pm.doc.childBefore(pm.selection.anchor).index
}
