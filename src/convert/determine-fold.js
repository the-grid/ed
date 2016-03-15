import {isMediaType} from './types'

export default function determineFold (items) {
  let media = null
  let content = []
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i]
    const {type, cover, metadata} = item
    if (!media && isMediaType(type) && cover && cover.src) {
      media = item
      continue
    }
    if (!media && type === 'h1' && metadata && metadata.starred) {
      media = item
      continue
    }
    if (!media && type === 'placeholder') {
      media = item
      continue
    }
    content.push(item)
  }
  return {media, content}
}