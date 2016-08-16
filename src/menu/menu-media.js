import {MenuItem, Dropdown} from 'prosemirror/dist/menu/menu'
import {focusedIndex, isCollapsed} from '../util/pm'

function select (pm) {
  return isCollapsed(pm)
}

function makeMenu (label, type, widgetType) {
  function run (pm) {
    const index = focusedIndex(pm)
    if (index == null) return
    pm.ed.routeChange('ADD_MEDIA', {index, type, widgetType})
  }

  return new MenuItem(
    { label
    , title: `make new ${widgetType || type} block`
    , run
    , select
    }
  )
}

export const menuLocation = makeMenu('Map', 'location')

export const menuCode = makeMenu('Code', 'code')

export const menuUserhtml = makeMenu('Embed HTML', 'interactive', 'userhtml')

export const menuMedia = new Dropdown(
  [ menuLocation
  , menuCode
  , menuUserhtml
  ]
  , {label: 'Add...'}
)
