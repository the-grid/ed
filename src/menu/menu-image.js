import crel from 'crel'
import {MenuItem} from 'prosemirror-menu'
import {focusedIndex} from '../util/pm'
import {key} from '../plugins/store-ref'


function run (state, onAction) {
  const index = focusedIndex(state)
  if (index == null) return
  const {ed} = key.get(state).options.edStuff
  ed.trigger('command.menu.file', index)
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
    run(pm.state)
  })
  return el
}

const menuImage = new MenuItem(
  { label: 'Image',
    title: 'upload image(s) above this block',
    run,
    render,
  }
)

export default menuImage
