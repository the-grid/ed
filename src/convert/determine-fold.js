import {isMediaType} from './types'

export default function determineFold (items) {
  let media = null
  let content = []
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i]
    const {type, cover} = item
    if (!media && isMediaType(type) && cover && cover.src) {
      media = item
      continue
    }
    content.push(item)
  }
  return {media, content}
}
