import {MenuItem, icons} from 'prosemirror-menu'
import {focusedIndex} from '../util/pm'
import {key} from '../plugins/store-ref'


function makeMenu (label, type, widgetType) {
  function run (state, onAction) {
    const index = focusedIndex(state)
    if (index == null) return
    const {ed} = key.get(state).options.edStuff
    ed.routeChange('ADD_MEDIA', {index, type, widgetType})
  }

  let icon
  if (type === 'quote') {
    icon = icons.blockquote
  }

  return new MenuItem(
    { label,
      title: `make new ${widgetType || type} block`,
      run,
      icon,
    }
  )
}

export const menuQuote = makeMenu('Quote', 'quote')

export const menuLocation = makeMenu('Map', 'location')

export const menuCode = makeMenu('Code', 'code')

export const menuCta = makeMenu('Call To Action', 'cta')

export const menuUserhtml = makeMenu('Embed HTML', 'interactive', 'userhtml')
