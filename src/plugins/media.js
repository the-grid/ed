// Make media blocks (figure, div) unselectable
// Emit click events with id

import Bean from 'bean'

export default class PluginMedia {
  constructor (ed) {
    this.ed = ed
    // FIXME Better way to bind to this?
    this._handleClick = this.handleClick.bind(this)
    Bean.on(this.ed.pm.content, 'click', 'figure, div', this._handleClick)
  }
  teardown () {
    Bean.off(this.ed.pm.content, 'click', 'figure, div', this._handleClick)
  }
  handleClick (event) {
    event.preventDefault()
    event.stopPropagation()

    let block = event.currentTarget.dataset.gridId
    if (block) {
      this.ed.onPluginEvent('plugin.media.click', {block})
    }
  }
}
