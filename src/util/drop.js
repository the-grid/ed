export function isFileEvent (event) {
  if (!event) return false
  const {dataTransfer} = event
  if (!dataTransfer) return false
  const {types, files} = dataTransfer
  if (!types || types[0] !== 'Files') return false
  if (!files || !files.length) return false

  return true
}
