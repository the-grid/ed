const MEDIA_TYPES = [
  'article',
  'audio',
  'code',
  'image',
  'interactive',
  'location',
  'placeholder',
  'share',
  'video'
]
const HTML_TYPES = [
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'list',
  'ol',
  'p',
  'quote',
  'text',
  'ul'
]
const HEAD_TYPES = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6'
]
const FOLD_TYPES = [
  'blockquote',
  'list',
  'ol',
  'p',
  'quote',
  'text',
  'ul'
]

function contains (array, string) {
  return (array.indexOf(string) !== -1)
}

export function isMediaType (type) {
  return contains(MEDIA_TYPES, type)
}

export function isHTMLType (type) {
  return contains(HTML_TYPES, type)
}

export function isHeadType (type) {
  return contains(HEAD_TYPES, type)
}

export function isFoldType (type) {
  return contains(FOLD_TYPES, type)
}
