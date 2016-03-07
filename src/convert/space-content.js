import {isMediaType} from './types'


export default function spaceContent (items) {
  let spacedItems = []
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i]
    const currentIsMedia = isMediaType(item.type)
    if (i === 0 && currentIsMedia) {
      spacedItems.push(makeEmptyTextBlock())
    }
    spacedItems.push(item)
    const next = items[i + 1]
    if (currentIsMedia) {
      if (next && isMediaType(next.type)) {
        spacedItems.push(makeEmptyTextBlock())
      }
      if (!next) {
        spacedItems.push(makeEmptyTextBlock())
      }
    }
  }
  if (spacedItems.length === 0) {
    spacedItems.push(makeEmptyTextBlock())
  }
  return spacedItems
}


function makeEmptyTextBlock () {
  return {type: 'text', html: '<p></p>'}
}
