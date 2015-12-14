const MEDIA_TYPES = [
  'image', 'video', 'audio', 'article', 
  'location', 'share', 'interactive', 'placeholder'
]
const HTML_TYPES = [
  'text', 'p', 'code',
  'quote', 'blockquote',
  'list', 'ol', 'ul',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
]

function contains (array, string) {
  return (array.indexOf(string) !== -1)
}

export function isMediaType (type) {
  return contains( MEDIA_TYPES, type )
}

export function isHTMLType (type) {
  return contains( HTML_TYPES, type )
}