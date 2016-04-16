export function focusedIndex (pm) {
  const selection = pm.selection
  if (!selection || selection.anchor == null) return
  return pm.doc.childBefore(pm.selection.anchor).index
}
