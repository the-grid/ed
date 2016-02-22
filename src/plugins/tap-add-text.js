/*
 * Plugin adds a blank div under doc.
 * On tap add and focus new paragraph to end.
 */

import {Pos} from 'prosemirror/src/model/pos'
import {TextSelection} from 'prosemirror/src/edit/selection'

function addText () {
  const size = this.ed.pm.doc.size
  const pos = new Pos([size], 0)
  const selection = new TextSelection(pos, pos)
  this.ed.insertBlocks(size, {
    type: 'text',
    html: '<p></p>'
  })
  this.ed.pm.setSelection(selection)
  this.ed.pm.focus()
}


export default class ShareUrl {
  constructor (ed) {
    this.addText = addText.bind(this)
    this.ed = ed

    // Element setup
    this.el = document.createElement('div')
    this.el.className = 'EdTapAddText'
    this.el.style.height = '15rem'
    this.el.addEventListener('click', this.addText)
    this.ed.pluginContainer.appendChild(this.el)
  }
  teardown () {
    this.el.removeEventListener('click', this.addText)
    this.el.parentNode.removeChild(this.el)
  }
}
