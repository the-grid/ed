export function isDragFileEvent (event) {
  if (!event) return false
  const {dataTransfer} = event
  if (!dataTransfer) return false
  const {types} = dataTransfer
  if (!types) return false
  for (let i = 0, len = types.length; i < len; i++) {
    const type = types[i]
    if (type === 'Files') {
      return true
    }
  }
  return false
}

export function isDropFileEvent (event) {
  if (!event) return false
  const {dataTransfer} = event
  if (!dataTransfer) return false
  const {files} = dataTransfer
  if (!isDragFileEvent(event)) return false
  if (!files || !files.length) return false

  return true
}
