const isUrlRegex = /^https?:\/\/[^\s]+\.[^\s]+$/

export function isUrl (text) {
  return text.match(isUrlRegex)
}

