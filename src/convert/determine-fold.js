import {isMediaType, isHeadType, isFoldType} from './types'

export default function determineFold (items) {
  let title = null
  let media = null
  let fold = []
  let rest = []
  let foldHit = false
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i]
    const {type, metadata} = item
    if (!media && isMediaType(type)) {
      media = item
      continue
    }
    if (!foldHit) {
      if (!title && isHeadType(type) && metadata && metadata.starred) {
        title = item
        continue
      }
      if (isFoldType(type)) {
        fold.push(item)
        continue
      } else {
        foldHit = true
        rest.push(item)
        continue
      }
    }
    rest.push(item)
    continue
  }
  return {title, media, fold, rest}
}
