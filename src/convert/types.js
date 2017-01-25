// const MEDIA_TYPES =
//   [ 'article'
//   , 'audio'
//   , 'code'
//   , 'image'
//   , 'interactive'
//   , 'location'
//   , 'placeholder'
//   , 'quote'
//   , 'share'
//   , 'video'
//   , 'cta'
//   ]
const HTML_TYPES = [
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'list',
  'ol',
  'p',
  'text',
  'ul',
]

function contains (array, string) {
  return (array.indexOf(string) !== -1)
}


export function isMediaType (type) {
  // return contains(MEDIA_TYPES, type)
  return !isHTMLType(type)
}

export function isHTMLType (type) {
  return contains(HTML_TYPES, type)
}
