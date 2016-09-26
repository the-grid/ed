import {elt} from 'prosemirror/dist/util/dom'
import {MenuItem} from 'prosemirror/dist/menu/menu'
import {focusedIndex, isCollapsed} from '../util/pm'


function run (pm) {
  const index = focusedIndex(pm)
  if (index == null) return
  pm.ed.trigger('command.menu.file', index)
}

function select (pm) {
  return isCollapsed(pm)
}

function render (pm) {
  const el = elt('div'
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
  , select
  , render
  }
)

export default menuImage
