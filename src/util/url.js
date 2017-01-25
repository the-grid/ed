const isUrlRegex = /^https?:\/\/[^\s]+\.[^\s]+$/
const findUrlRegex = /https?:\/\/[^\s]+\.[^\s]+/
const isUrlLikeRegex = /^\S+\.\S+$/

export function isUrl (text) {
  if (!text) return false
  return text.match(isUrlRegex)
}

export function isUrlOrBlank (text) {
  return (isUrl(text) || text === '')
}

export function findUrl (text) {
  return text.match(findUrlRegex)
}

export function extractUrl (text) {
  const urlCheck = findUrl(text)
  if (!urlCheck) return
  const url = urlCheck[0]
  const rest = text.replace(url, '').trim()
  return {url, rest}
}

export function isUrlLike (text) {
  return (text.search(isUrlLikeRegex) !== -1)
}
