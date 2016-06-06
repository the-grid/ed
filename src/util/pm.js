export function focusedIndex (pm) {
  const selection = pm.selection
  if (!selection) return
  if (selection.anchor != null) {
    return pm.doc.childBefore(selection.anchor).index
  }
  if (selection.to != null) {
    return pm.doc.childBefore(selection.to).index
  }
}

export function isCollapsed (pm) {
  const {anchor, head} = pm.selection
  if (anchor == null) return false
  return (anchor === head)
}

export function indexToPos (doc, index) {
  let pos = 0
  for (let i = 0; i < index; i++) {
    const node = doc.maybeChild(i)
    if (!node) continue
    pos += node.nodeSize
  }
  return pos
}

export function indexOfId (doc, id) {
  for (let i = 0, len = doc.childCount; i < len; i++) {
    const node = doc.child(i)
    if (!node.attrs || !node.attrs.id) {
      continue
    }
    if (node.attrs.id === id) {
      return i
    }
  }
  return -1
}

export function posToIndex (doc, pos) {
  return doc.childBefore(pos).index
}
