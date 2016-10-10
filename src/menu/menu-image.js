import crel from 'crel'
import {MenuItem} from 'prosemirror-menu'
import {focusedIndex} from '../util/pm'


function run (pm) {
  const index = focusedIndex(pm)
  if (index == null) return
  pm.ed.trigger('command.menu.file', index)
}

function render (pm) {
  const el = crel('div'
  , { class: 'EdMenuText' }
  , 'Image'
  )
  el.addEventListener('mousedown', function (event) {
    // HACK around #44
    event.stopPropagation()
    event.stopImmediatePropagation()
  })
  el.addEventListener('click', function (event) {
    run(pm)
  })
  return el
}

const menuImage = new MenuItem(
  { label: 'Image'
  , title: 'upload image(s) above this block'
  , run
  , render
  }
)

export default menuImage
