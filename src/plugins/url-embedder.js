import {Block, Textblock, Attribute, Pos} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {InputRule} from "prosemirror/src/inputrules"
import {Tooltip} from "prosemirror/src/menu/tooltip"

const menuItems = [
  {
    name:"add link",
    render: function () {
      let icon = elt("a", {class:"", title: name}, "Add Link" )        
      let item = elt("div", {style: "cursor: pointer"}, icon, name)
      return item
    }
  }, 
  {
    name:"loading",
    render: function () {
      let wrapper = document.createElement('div')
      wrapper.innerHTML = `<svg class="logo-loader" width="48" height="48" data-reactid=".0.3.0.0.0">
        <path d="M 24 24 L 32 24 L 32 32 L 16 32 L 16 16 L 40 16 L 40 40 L 8 40 L 8 8 L 40 8" stroke="rgba(0, 0, 0, .125)" fill="none" stroke-width="2" stroke-linecap="square" data-reactid=".0.3.0.0.0.0"></path>
        <path class="logo-loader-path" d="M 24 24 L 32 24 L 32 32 L 16 32 L 16 16 L 40 16 L 40 40 L 8 40 L 8 8 L 40 8" stroke="#fff266" fill="none" stroke-width="2" stroke-linecap="square" style="transition: stroke-dashoffset 3000ms linear; stroke-dasharray: 211.2px, 211.2px; stroke-dashoffset: -4435.2px;" data-reactid=".0.3.0.0.0.1"></path>
      </svg>`
      let item = wrapper.firstChild
      return item
    }
  }
]

import Bean from 'bean'

export default class UrlEmbedderPlugin {
  
  constructor (ed) {
    this.ed = ed
    this.setup(ed.pm)
  }
  
  setup (pm) {
    let tooltip = new Tooltip(pm, "below"), open
    pm.content.addEventListener("keydown", () => { tooltip.close(); open = null })
    pm.content.addEventListener("mousedown", () => { tooltip.close(); open = null })
    pm.on("change", text => {
      
      if (!/[\[\w]/.test(text)) return
      let pos = pm.selection.head, line = ""
      for (let i = pm.doc.path(pos.path).iter(0, pos.offset), child; child = i.next().value;) {
        if (child.isText) line += child.text
        else line = ""
      }
      let urlPos = line.lastIndexOf("http", pos.offset)      
      if (urlPos !== 0) return
      let url = line.substr(urlPos).trim().split(' ')[0]
      if (url.length !== line.length) return
      let completions = menuItems
      // let completions = menuItems.filter(name => name.indexOf(word) == 0)
      if (completions.length) showCompletions(completions, pos.move(-(url.length)), pos, urlPos, url)
    })

    function showCompletions(menuItems, from, to, urlPos, url) {
      function applyCompletion(name) {
        pm.tr.delete(from, to).insertInline(from, dinoSchema.node("dino", {type: name})).apply()
        tooltip.close()
      }      
      let items = menuItems.map(menuItem => {        
        let {name,render} = menuItem
        let item = render()
        item.addEventListener("mousedown", e => {
          e.preventDefault()
          applyCompletion(name)
        })
        return item
      })
      let coords = pm.coordsAtPos(from)
      tooltip.open(elt("div", null, items), {left: coords.left, top: coords.bottom})
      open = () => applyCompletion(menuItems[0])
    }
  }
  
  teardown () {
    Bean.off(this.ed.pm.content, 'click', 'figure, div', this.handleClick)
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



