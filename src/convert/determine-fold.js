export default function determineFold (items) {
  let starred = []
  let unstarred = []
  let hasHR = false
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i]
    if (!item) {
      continue
    }
    if (item.type === 'hr') {
      hasHR = true
    }
    if (item.metadata && item.metadata.starred) {
      starred.push(item)
      continue
    }
    unstarred.push(item)
  }
  return {starred, unstarred, hasHR}
}
