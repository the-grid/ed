import {isMediaType} from './types'


export default function spaceContent (items) {
  let spacedItems = items.slice()
  if (spacedItems.length === 0) {
    spacedItems.push(makeEmptyTextBlock())
  }
  return spacedItems
}


function makeEmptyTextBlock () {
  return {type: 'text', html: '<p></p>'}
}
