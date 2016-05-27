/*
* Plugin to manage events for content hint buttons
*/

import {UpdateScheduler} from 'prosemirror/src/ui/update'
import _ from '../util/lodash'


// Functions to bind in class constructor

// Should use debounced version
function onDocChanged () {
  const doc = this.pm.doc
  let hasCover = false
  let hasFold = false
  for (let i = 0, len = doc.childCount; i < len; i++) {
    const node = doc.child(i)
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
  }
  this.ed.trigger('plugin.contenthints', {hasCover, hasFold})

  // Signal widgets initialized if first
  if (!this.initialized) {
    this.initialized = true
    this.ed.trigger('plugin.contenthints.initialized')
  }
}

// The plugin

export default class PluginContentHints {
  constructor (options) {
    this.onDocChanged = onDocChanged.bind(this)
    this.debouncedDocChanged = _.debounce(this.onDocChanged, 750)

    this.ed = options.ed
    this.pm = options.pm

    window.addEventListener('resize', this.debouncedDocChanged)
    this.updater = new UpdateScheduler(this.pm, 'change', this.debouncedDocChanged)
    this.updater.force()
  }
  teardown () {
    this.updater.detach()
    window.removeEventListener('resize', this.debouncedDocChanged)
  }
}
