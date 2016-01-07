// Sync widget overlays with media blocks

export default class PluginMedia {
  constructor (ed) {
    this.ed = ed
    this._onChange = this.onChange.bind(this)
    ed.pm.on('change', this._onChange)
  }
  teardown () {
    ed.pm.off('change', this._onChange)
  }
  onChange (event) {
    let els = this.ed.pm.content.querySelectorAll('div[grid-type]')
    for (let i = 0, len = els.length; i < len; i++) {
      let el = els[i]
      let id = el.getAttribute('grid-id')
      let type = el.getAttribute('grid-type')
      let rectangle = el.getBoundingClientRect()
      console.log(type, id, rectangle.top, rectangle.left)
    }
  }
}
