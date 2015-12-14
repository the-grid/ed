// Make media blocks unselectable, and emit click events with id

import Listen from 'bean'

export default class PluginMedia {
  constructor (ed) {
    this.ed = ed
    Listen.on(this.ed.pm.content, 'click', 'figure, div', this.handleClick)
  }
  teardown () {
    Listen.off(this.ed.pm.content, 'click', 'figure, div', this.handleClick)
  }
  handleClick (event) {
    console.log(event.currentTarget.dataset.gridId)
    event.stopPropagation()
    event.preventDefault()
  }
}