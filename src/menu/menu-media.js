import {MenuItem, Dropdown} from 'prosemirror/dist/menu/menu'
import {focusedIndex, isCollapsed} from '../util/pm'

function select (pm) {
  return isCollapsed(pm)
}

function makeMenu (type, label) {
  function run (pm) {
    const index = focusedIndex(pm)
    if (index == null) return
    pm.ed.routeChange('ADD_MEDIA', {index, type})
  }

  return new MenuItem(
    { label
    , title: `make new ${type} block`
    , run
    , select
    }
  )
}

export const menuCode = makeMenu('code', 'Code')

export const menuLocation = makeMenu('location', 'Map')

export const menuMedia = new Dropdown(
  [ menuCode
  , menuLocation
  ]
  , {label: 'Add...'}
)
