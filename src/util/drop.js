export function isDragFileEvent (event) {
  if (!event) return false
  const {dataTransfer} = event
  if (!dataTransfer) return false
  let types
  try {
    types = dataTransfer.types
  } catch (error) {
    return false
  }
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
  let files
  try {
    files = dataTransfer.files
  } catch (error) {
    return false
  }
  if (!isDragFileEvent(event)) return false
  if (!files || !files.length) return false

  return true
}
