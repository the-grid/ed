import {elt} from 'prosemirror/src/dom'
import {Tooltip} from 'prosemirror/src/ui/tooltip'

const menuItems = [
  {
    name: 'add link',
    render: function () {
      let icon = elt('a', {class: '', title: name}, 'Add Link')
      let item = elt('div', {style: 'cursor: pointer'}, icon, name)
      return item
    }
  },
  {
    name: 'loading',
    render: function () {
      let wrapper = document.createElement('div')
      wrapper.innerHTML = `<svg class="logo-loader" width="48" height="48">
        <path d="M 24 24 L 32 24 L 32 32 L 16 32 L 16 16 L 40 16 L 40 40 L 8 40 L 8 8 L 40 8" stroke="rgba(0, 0, 0, .125)" fill="none" stroke-width="2" stroke-linecap="square"></path>
        <path class="logo-loader-path" d="M 24 24 L 32 24 L 32 32 L 16 32 L 16 16 L 40 16 L 40 40 L 8 40 L 8 8 L 40 8" stroke="#fff266" fill="none" stroke-width="2" stroke-linecap="square" style="transition: stroke-dashoffset 3000ms linear; stroke-dasharray: 211.2px, 211.2px; stroke-dashoffset: -4435.2px;"></path>
      </svg>`
      let item = wrapper.firstChild
      return item
    }
  }
]

export default class UrlEmbedder {

  constructor (ed) {
    this.ed = ed
    this.setup(ed.pm)
    this.activeLineNumber = -1
    this.activeLineOffset = -1
    this.onFlushed = () => {
      this.checkCurrentSelection()
    }
  }

  setup (pm) {
    this.tooltip = new Tooltip(pm.wrapper, 'left')
    pm.content.addEventListener('mousedown', () => {
      this.hide()
    })
    pm.on('change', text2 => {
      this.update()
    })
  }

  update () {
    let pm = this.ed.pm
    let tooltip = this.tooltip
    let text = pm.selection
    let showCompletions = (menuItems, from, to, urlPos, url) => {
      function applyCompletion(name) {
        // pm.tr.delete(from, to).insertInline(from, dinoSchema.node('dino', {type: name})).apply()
        tooltip.close()
      }      
      let items = menuItems.map(menuItem => {
        let {name, render} = menuItem
        let item = render()
        item.addEventListener('mousedown', e => {
          e.preventDefault()
          applyCompletion(name)
        })
        return item
      })
      let coords = pm.coordsAtPos(from)
      this.show(elt('div', null, items), {left: coords.left, top: coords.bottom})
    }

    if (!/[\[\w]/.test(text)) {
      return this.hide()
    }
    let pos = pm.selection.head, line = ''
    for (let i = pm.doc.path(pos.path).iter(0, pos.offset), child; child = i.next().value;) {
      if (child.isText) line += child.text
      else line = ''
    }

    let urlPos = line.lastIndexOf('http', pos.offset)
    if (urlPos !== 0) {
      return this.hide()
    }
    let url = line.substr(urlPos).trim().split(' ')[0]
    if (url.length !== line.length) {
      return this.hide()
    }
    let completions = menuItems
    // let completions = menuItems.filter(name => name.indexOf(word) == 0)
    if (completions.length) {
      showCompletions(completions, pos.move(-(url.length)), pos, urlPos, url)
    } else {
      return this.hide()
    }
  }

  checkCurrentSelection () {
    if (this.activeLineNumber !== this.ed.pm.selection.head.path[0]) {
      this.hide()
    }
  }

  show (el, pos) {
    this.activeLineNumber = this.ed.pm.selection.head.path[0]
    this.activeLineOffset = this.ed.pm.selection.head.offset
    console.log(this.activeLineNumber)
    console.log(this.activeLineOffset)
    this.tooltip.open(el, pos)
    this.ed.pm.on('flushed', this.onFlushed)
  }

  hide () {
    this.ed.pm.off('flushed', this.onFlushed)
    this.activeLineNumber = -1
    this.activeLineOffset = -1
    this.tooltip.close()
  }

  teardown () {
    // TODO
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
