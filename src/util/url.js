const isUrlRegex = /^https?:\/\/[^\s]+\.[^\s]+$/
const findUrlRegex = /https?:\/\/[^\s]+\.[^\s]+/

export function isUrl (text) {
  return text.match(isUrlRegex)
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
