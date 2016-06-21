/*
* Plugin to manage `empty` class for placeholder text
*/

import _ from '../util/lodash'


// The plugin

export default class PluginPlaceholder {
  constructor (pm, options) {
    this.boundOnDOMChanged = this.onDOMChanged.bind(this)
    this.debouncedDOMChanged = _.debounce(this.boundOnDOMChanged, 50)

    this.pm = pm
    this.ed = options.ed

    this.updater = pm.updateScheduler([pm.on.change], this.debouncedDOMChanged)
    this.pm.content.addEventListener('compositionstart', this.debouncedDOMChanged)
    this.updater.force()
  }
  detach () {
    this.updater.detach()
    this.pm.content.removeEventListener('compositionstart', this.debouncedDOMChanged)
  }
  onDOMChanged () {
    // Should use debounced version
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
}
