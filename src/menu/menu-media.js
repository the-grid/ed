import {MenuItem, Dropdown, icons} from 'prosemirror/dist/menu/menu'
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

  let icon
  if (type === 'quote') {
    icon = icons.blockquote
  }

  return new MenuItem(
    { label
    , title: `make new ${widgetType || type} block`
    , run
    , select
    , icon
    }
  )
}

export const menuQuote = makeMenu('Quote', 'quote')

export const menuLocation = makeMenu('Map', 'location')

export const menuCode = makeMenu('Code', 'code')

export const menuCta = makeMenu('Call To Action', 'cta')

export const menuUserhtml = makeMenu('Embed HTML', 'interactive', 'userhtml')

export const menuMedia = new Dropdown(
  [ menuLocation
  , menuCode
  , menuCta
  , menuUserhtml
  ]
  , {label: 'Add...'}
)
