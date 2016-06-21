/*
* Plugin to manage events for content hint buttons
*/

import _ from '../util/lodash'


// The plugin

export default class PluginContentHints {
  constructor (pm, options) {
    this.boundOnDocChanged = this.onDocChanged.bind(this)
    this.debouncedDocChanged = _.debounce(this.boundOnDocChanged, 500)

    this.pm = pm
    this.ed = options.ed

    window.addEventListener('resize', this.debouncedDocChanged)
    this.updater = pm.updateScheduler([pm.on.change], this.debouncedDocChanged)
    this.updater.force()
  }
  detach () {
    this.updater.detach()
    window.removeEventListener('resize', this.debouncedDocChanged)
  }
  onDocChanged () {
    // Should use debounced version
    const doc = this.pm.doc
    let hasCover = false
    let hasFold = false
    doc.forEach(function (node, offset, index) {
      const {name} = node.type
      if (name === 'media') {
        const {type} = node.attrs
        if (type === 'image' || type === 'placeholder') {
          hasCover = true
        }
      }
      if (name === 'horizontal_rule') {
        hasFold = true
      }
    })
    this.ed.trigger('plugin.contenthints', {hasCover, hasFold})

    // Signal widgets initialized if first
    if (!this.initialized) {
      this.initialized = true
      this.ed.trigger('plugin.contenthints.initialized')
    }
  }
}
