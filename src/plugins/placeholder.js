/*
* Plugin to manage `empty` class for placeholder text
*/

import _ from '../util/lodash'


// The plugin

function onDOMChanged () {
  if (!this.contentEl) return

  // Should use debounced version
  const els = this.contentEl.children
  for (let i = 0, len = els.length; i < len; i++) {
    const el = els[i]
    const tag = el.tagName
    if (tag === 'H1' || tag === 'P') {
      // if (el.textContent === '') {
      //   el.classList.add('empty')
      // } else {
      //   el.classList.remove('empty')
      // }
    }
  }

  // Signal widgets initialized if first
  // if (!this.initialized) {
  //   this.initialized = true
  //   this.ed.trigger('plugin.placeholder.initialized')
  // }
}

export default {
  state: {
    init: function () {
      this.boundOnDOMChanged = onDOMChanged.bind(this)
      this.debouncedDOMChanged = _.debounce(this.boundOnDOMChanged, 50)

      // init after editor mounted
      setTimeout(() => {
        this.contentEl = this.props.elMirror.querySelector('.ProseMirror-content')
        this.contentEl.addEventListener('compositionstart', this.debouncedDOMChanged)
        this.boundOnDOMChanged()
      }, 0)
    },
    applyAction: function (action) {
      this.debouncedDOMChanged()
    },
    destroy: function () {
      if (!this.contentEl) return
      this.contentEl.removeEventListener('compositionstart', this.debouncedDOMChanged)
    },
  },
}
