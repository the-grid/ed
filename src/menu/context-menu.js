import {Pos} from 'prosemirror/src/model'
import {defineOption} from 'prosemirror/src/edit'
import {elt, insertCSS} from 'prosemirror/src/dom'
import {Tooltip} from 'prosemirror/src/ui/tooltip'
import {UpdateScheduler} from 'prosemirror/src/ui/update'

import {Menu, TooltipDisplay, menuGroups} from 'prosemirror/src/menu/menu'

const classPrefix = 'ProseMirror-tooltipmenu'

// :: union<bool, Object> #path=tooltipMenu #kind=option
//
// When given a truthy value, enables the tooltip menu module for this
// editor. This menu shows up when there is a selection, and
// optionally in certain other circumstances, providing
// context-relevant commands.
//
// By default, the tooltip will show inline menu commands (registered
// with the [`menuGroup`](#CommandSpec.menuGroup) command property)
// when there is an inline selection, and block related commands when
// there is a node selection on a block.
//
// The module can be configured by passing an object. These properties
// are recognized:
//
// **`showLinks`**`: bool = true`
//   : Causes a tooltip with the link target to show up when the
//     cursor is inside of a link (without a selection).
//
// **`selectedBlockMenu`**: bool = false`
//   : When enabled, and a whole block is selected or the cursor is
//     inside an empty block, the block menu gets shown.
//
// **`inlineGroups`**`: [string] = ["inline"]`
//   : The menu groups to show when displaying the menu for inline
//     content.
//
// **`inlineItems`**`: [union<string, [string]>]`
//   : Instead of using menu groups, this can be used to completely
//     override the set of commands shown for inline content. If
//     nested arrays are used, separators will be shown between items
//     from different arrays.
//
// **`blockGroups`**`: [string] = ["block"]`
//   : The menu groups to show when displaying the menu for block
//     content.
//
// **`blockItems`**`: [union<string, [string]>]`
//   : Overrides the commands shown for block content.


//defineOption("tooltipMenu", false, function(pm, value) {
//  if (pm.mod.tooltipMenu) pm.mod.tooltipMenu.detach()
//  pm.mod.tooltipMenu = value ? new TooltipMenu(pm, value) : null
//})

function getItems (pm, items) {
  return Array.isArray(items) ? items.map(getItems.bind(null, pm)) : pm.commands[items]
}

// WARNING, THIS WAS COPY & PASTED FROM PROSEMIRROR!
class TooltipMenu {
  constructor (pm, config) {
    this.pm = pm
    this.config = config || {}

    this.showLinks = this.config.showLinks !== false
    this.selectedBlockMenu = this.config.selectedBlockMenu
    this.update = new UpdateScheduler(pm, 'change selectionChange blur commandsChanged', () => this.prepareUpdate())
    this.onContextMenu = this.onContextMenu.bind(this)
    pm.content.addEventListener('contextmenu', this.onContextMenu)
    this.onMouseDown = () => { if (this.menu.active) this.menu.reset() }
    pm.content.addEventListener('mousedown', this.onMouseDown)

    this.tooltip = new Tooltip(pm.wrapper, 'above')
    this.menu = new Menu(pm, new TooltipDisplay(this.tooltip), () => this.update.force())
  }

  detach () {
    this.update.detach()
    this.tooltip.detach()
    this.pm.content.removeEventListener('contextmenu', this.onContextMenu)
    this.pm.content.removeEventListener('mousedown', this.onMouseDown)
  }

  items (inline, block) {
    let result
    if (!inline) result = []
    else if (this.config.inlineItems) result = getItems(this.pm, this.config.inlineItems)
    else result = menuGroups(this.pm, this.config.inlineGroups || ['inline', 'insert'])

    if (block) {
      if (this.config.blockItems) addIfNew(result, getItems(this.pm, this.config.blockItems))
      else addIfNew(result, menuGroups(this.pm, this.config.blockGroups || ['insert', 'block']))
    }
    return result
  }

  prepareUpdate () {
    if (this.menu.active) return null

    let {empty, node, from, to} = this.pm.selection, link
    if (!this.pm.hasFocus()) {
      return () => this.tooltip.close()
    } else if (node && node.isBlock) {
      let coords = topOfNodeSelection(this.pm)
      return () => this.menu.show(this.items(false, true), coords)
    } else if (!empty) {
      let coords = node ? topOfNodeSelection(this.pm) : topCenterOfSelection()
      let showBlock = this.selectedBlockMenu && Pos.samePath(from.path, to.path) &&
          from.offset === 0 && to.offset === this.pm.doc.path(from.path).size
      return () => this.menu.show(this.items(true, showBlock), coords)
    } else if (this.selectedBlockMenu && this.pm.doc.path(from.path).size === 0) {
      let coords = this.pm.coordsAtPos(from)
      return () => this.menu.show(this.items(false, true), coords)
    } else if (this.showLinks && (link = this.linkUnderCursor())) {
      let coords = this.pm.coordsAtPos(from)
      return () => this.showLink(link, coords)
    } else {
      return () => this.tooltip.close()
    }
  }

  linkUnderCursor () {
    let head = this.pm.selection.head
    if (!head) return null
    let marks = this.pm.doc.marksAt(head)
    return marks.reduce((found, m) => found || (m.type.name === 'link' && m), null)
  }

  showLink (link, pos) {
    let node = elt('div', {class: classPrefix + '-linktext'}, elt('a', {href: link.attrs.href, title: link.attrs.title}, link.attrs.href))
    this.tooltip.open(node, pos)
  }

  onContextMenu (e) {
    if (!this.pm.selection.empty) return
    let pos = this.pm.posAtCoords({left: e.clientX, top: e.clientY})
    if (!pos || !pos.isValid(this.pm.doc, true)) return

    this.pm.setTextSelection(pos, pos)
    this.pm.flush()
    this.menu.show(this.items(true, false), topCenterOfSelection())
  }
}

// Get the x and y coordinates at the top center of the current DOM selection.
function topCenterOfSelection () {
  let rects = window.getSelection().getRangeAt(0).getClientRects()
  let {left, right, top} = rects[0], i = 1
  while (left === right && rects.length > i) {
    ;({left, right, top} = rects[i++])
  }
  for (; i < rects.length; i++) {
    if (rects[i].top < rects[0].bottom - 1 &&
        // Chrome bug where bogus rectangles are inserted at span boundaries
        (i === rects.length - 1 || Math.abs(rects[i + 1].left - rects[i].left) > 1)) {
      left = Math.min(left, rects[i].left)
      right = Math.max(right, rects[i].right)
      top = Math.min(top, rects[i].top)
    }
  }
  return {top, left: (left + right) / 2}
}

function topOfNodeSelection (pm) {
  let selected = pm.content.querySelector('.ProseMirror-selectednode')
  if (!selected) return {left: 0, top: 0}
  let box = selected.getBoundingClientRect()
  return {left: Math.min((box.left + box.right) / 2, box.left + 20), top: box.top}
}

function addIfNew (array, elts) {
  for (let i = 0; i < elts.length; i++)
    if (array.indexOf(elts[i]) === -1) array.push(elts[i])
}

insertCSS(`

.${classPrefix}-linktext a {
  color: white;
  text-decoration: none;
  padding: 0 5px;
}

.${classPrefix}-linktext a:hover {
  text-decoration: underline;
}

`)






// extend Tooltip
// ================================================

// TODO
// - PR to expose this const from PM
const prefix = 'ProseMirror-tooltip'

Tooltip.prototype.setDir = function (newDir) {
  if (newDir === this.dir) {
    return null
  }
  let oldPointerClass = prefix + '-pointer-' + this.dir
  let newPointerClass = prefix + '-pointer-' + newDir
  this.pointer.classList.remove(oldPointerClass)
  this.pointer.classList.add(newPointerClass)
  this.dir = newDir
}

// adds class to mirror element
Tooltip.prototype.setStyle = function (style) {

  if (style === this.style) {
    return null
  }

  if (this.style) {
    let oldClass = prefix + '-style-' + this.style
    this.wrapper.classList.remove(oldClass)
  }

  let newClass = prefix + '-style-' + style
  this.wrapper.classList.add(newClass)

  this.style = style
}

insertCSS(`

.${prefix}-style-light .${prefix} {
  background: hsl(0, 0%, 98%);
  border-color: hsl(0, 0%, 47%);
  color: hsl(0, 0%, 60%);
  box-shadow: 0 1.6px 3px hsla(0,0%,0%,0.2), inset 0 -2px 1px hsla(0,0%,100%,0.6);
}

.${prefix}-style-light .${prefix} a {
  color: hsl(0, 0%, 20%);
}

.${prefix}-style-light .${prefix} {
   margin-top: 0.75rem;
}

.${prefix}-style-light .${prefix}-pointer {
  display: none !important;
}



`)



// Context Menu
// ================================================

// **`emptyBlockMenu`**`: [union<string, [string]>]`
//   : ...

defineOption('contextMenu', false, function (pm, value) {
  if (pm.mod.tooltipMenu) pm.mod.tooltipMenu.detach()
  pm.mod.tooltipMenu = value ? new ContextMenu(pm, value) : null
})

class ContextMenu extends TooltipMenu {

  constructor (pm, config) {

    super(pm, config)
    this.emptyBlockMenu = this.config.emptyBlockMenu

  }

  // override
  items (inline, block, empty) {
    let _items = []
    if (!empty) {
      //return super.items(inline, block)
      _items = getItems(this.pm, [
        'strong:toggle',
        'em:toggle',
        'link:unset',
        'link:set',
        'textblockType',
        'blockquote:wrap',
        'bullet_list:wrap',
        'ordered_list:wrap'
      ])
    }
    else {
      _items = getItems(this.pm, [
        [
          'upload_embed',
          'insert_embed'
        ],
        [
          //'image:insert',
          'blockquote:wrap',
          'bullet_list:wrap',
          'ordered_list:wrap'
          //'textblockType'
        ]
      ])
    }
    //console.log(_items)
    //if (this.config.inlineItems) _items = getItems(this.pm, this.config.inlineItems)
    //else _items = menuGroups(this.pm, this.config.inlineGroups || ["inline"])
    //
    //if (block) {
    //  if (this.config.blockItems) _items = _items.concat(getItems(this.pm, this.config.blockItems))
    //  else _items = _items.concat(menuGroups(this.pm, this.config.blockGroups || ["block"]))
    //}
    return _items
  }

  // override
  prepareUpdate () {
    if (this.menu.active) return null

    let link, url, {empty, node, from, to} = this.pm.selection

    if (!this.pm.hasFocus()) {
      return () => this.tooltip.close()
    }

    else if (node && node.isBlock) {
      this.tooltip.setDir('above')
      this.tooltip.setStyle('default')
      let coords = topOfNodeSelection(this.pm)
      return () => this.menu.show(this.items(false, true), coords)
    }

    else if (!empty) {
      this.tooltip.setDir('above')
      this.tooltip.setStyle('default')
      let coords = node ? topOfNodeSelection(this.pm) : topCenterOfSelection()
      let showBlock = this.selectedBlockMenu && Pos.samePath(from.path, to.path) &&
          from.offset === 0 && to.offset === this.pm.doc.path(from.path).size
      return () => this.menu.show(this.items(true, showBlock), coords)
    }

    // D4: empty block menu
    else if (this.emptyBlockMenu && this.pm.doc.path(from.path).size === 0) {
      this.tooltip.setDir('right')
      this.tooltip.setStyle('light')
      let coords = this.pm.coordsAtPos(from)
      return () => this.menu.show(this.items(false, false, true), coords)
    }

    // D4: url embedder
    else if (this.showLinks && (url = this.urlUnderCursor())) {
      this.tooltip.setDir('below')
      this.tooltip.setStyle('light')
      let coords = this.pm.coordsAtPos(from)
      return () => this.showUrl(url, coords)
    }

    // above link
    else if (this.showLinks && (link = this.linkUnderCursor())) {
      this.tooltip.setDir('above')
      this.tooltip.setStyle('light')
      let coords = this.pm.coordsAtPos(from)
      return () => this.showLink(link, coords)
    }

    else {
      return () => this.tooltip.close()
    }
  }

  //
  urlUnderCursor () {
    let head = this.pm.selection.head
    if (!head) return null
    let url = getWordUnderCursor(this.pm)
    if (url.indexOf('http://') !== 0) url = null
    return url
  }

  showUrl (url, pos) {
    let wrapper = document.createElement('div')
    wrapper.innerHTML = `<svg class="logo-loader" width="48" height="48">
      <path d="M 24 24 L 32 24 L 32 32 L 16 32 L 16 16 L 40 16 L 40 40 L 8 40 L 8 8 L 40 8" stroke="rgba(0, 0, 0, .125)" fill="none" stroke-width="2" stroke-linecap="square"></path>
      <path class="logo-loader-path" d="M 24 24 L 32 24 L 32 32 L 16 32 L 16 16 L 40 16 L 40 40 L 8 40 L 8 8 L 40 8" stroke="#fff266" fill="none" stroke-width="2" stroke-linecap="square" style="transition: stroke-dashoffset 3000ms linear; stroke-dasharray: 211.2px, 211.2px; stroke-dashoffset: -4435.2px;"></path>
    </svg>`
    let loader = wrapper.firstChild

    let node = elt('div', {class: classPrefix + '-linktext'},
      elt('a', {href: url, title: url}, url),
      loader
    )
    this.tooltip.open(node, pos)
  }


}


function getLineOfTextToCursor (pm) {
  let line = ''
  let pos = pm.selection.head
  if (!pos) return line
  let i = pm.doc.path(pos.path).iter(0, pos.offset)
  let child
  for (;;) {
    child = i.next().value
    if (!child) break
    if (child.isText) {
      line += child.text
    }
    else {
      line = ''
    }
  }
  return line

}

function getWordUnderCursor (pm) {
  let word = ''
  let pos = pm.selection.head
  if (!pos) return word
  let path = pm.doc.path(pos.path)
  let pathText = path.textContent
  let pathTextToCursor = ''
  let i = path.iter(0, pos.offset)
  let child
  for (;;) {
    child = i.next().value
    if (!child) break
    if (child.isText) pathTextToCursor += child.text
  }
  let parts = pathTextToCursor.split(' ')
  //let lastPart = parts[parts.length-1]
  word = pathText.split(' ')[parts.length - 1]
  return word
}
