/*
* Plugin to manage `empty` class for placeholder text
*/

import {UpdateScheduler} from 'prosemirror/src/ui/update'
import _ from '../util/lodash'


// Functions to bind in class constructor

// Should use debounced version
function onDOMChanged () {
  const els = this.pm.content.children
  for (let i = 0, len = els.length; i < len; i++) {
    const el = els[i]
    const tag = el.tagName
    if (tag === 'H1' || tag === 'P') {
      if (el.textContent === '') {
        el.classList.add('empty')
      } else {
        el.classList.remove('empty')
      }
    }
  }

  // Signal widgets initialized if first
  if (!this.initialized) {
    this.initialized = true
    this.ed.trigger('plugin.placeholder.initialized')
  }
}

// The plugin

export default class PluginPlaceholder {
  constructor (options) {
    this.onDOMChanged = onDOMChanged.bind(this)
    this.debouncedDOMChanged = _.debounce(this.onDOMChanged, 50)

    this.ed = options.ed
    this.pm = options.pm

    window.addEventListener('resize', this.debouncedDOMChanged)
    this.updater = new UpdateScheduler(this.pm, 'draw flush', this.debouncedDOMChanged)
    this.updater.force()
  }
  teardown () {
    this.updater.detach()
    window.removeEventListener('resize', this.debouncedDOMChanged)
  }
}
