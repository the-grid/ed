import {MenuItem, icons} from 'prosemirror-menu'
import {focusedIndex, indexToPos} from '../util/pm'

import EdSchema from '../schema/ed-schema'


function makeMenu (label, type, widgetType) {
  function run (state, onAction) {
    // debugger
    const index = focusedIndex(state)
    if (index == null) return

    // HACK
    const ed = state.config.pluginsByKey['store$'].props.store
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
