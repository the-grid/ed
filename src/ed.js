require('./ed.css')
require('./menu/menu.css')

import {ProseMirror} from 'prosemirror/src/edit/main'
import _ from './util/lodash'
import uuid from 'uuid'

import commands from './commands/index'

import 'prosemirror/src/inputrules/autoinput'
import 'prosemirror/src/menu/tooltipmenu'
import 'prosemirror/src/menu/menubar'
// import 'prosemirror/src/collab'

import GridSchema from './schema'
import GridToDoc from './convert/grid-to-doc'
import DocToGrid from './convert/doc-to-grid'

// import './inputrules/autoinput'
// import './edit/schema-commands'

import {isMediaType} from './convert/types'
import {inlineMenu, blockMenu, barMenu} from './menu/ed-menu'

import PluginWidget from './plugins/widget.js'
import ShareUrl from './plugins/share-url'

function noop () { /* noop */ }

export default class Ed {
  constructor (options) {
    if (!options.initialContent) {
      throw new Error('Missing options.initialContent array')
    }
    if (!options.onChange) {
      throw new Error('Missing options.onChange')
    }

    if (!options.container) options.container = document.body
    this.container = options.container

    // PM setup

    let pmOptions = {
      place: this.container,
      autoInput: true,
      schema: GridSchema,
      commands: commands,
      label: 'the-grid-ed'
    }
    this._content = options.initialContent
    pmOptions.doc = GridToDoc(this._content)

    this.pm = new ProseMirror(pmOptions)

    if (options.menubar) {
      this.pm.setOption('menuBar', {
        float: true,
        content: barMenu
      })
    }
    if (options.menutip) {
      this.pm.setOption('tooltipMenu', {
        showLinks: true,
        emptyBlockMenu: true,
        selectedBlockMenu: true,
        inlineContent: inlineMenu,
        selectedBlockContent: inlineMenu,
        blockContent: blockMenu
      })
    }

    if (options.imgfloConfig) {
      this.imgfloConfig = options.imgfloConfig
    }

    // Change / autosave events setup
    let debouncedAutosave
    if (options.onAutosave) {
      const autosaveInterval = options.autosaveInterval || 100
      debouncedAutosave = _.debounce(function () {
        options.onAutosave()
      }, autosaveInterval)
    }
    this.onChange = function () {
      options.onChange()
      if (debouncedAutosave) {
        debouncedAutosave()
      }
    }
    this.pm.on('change', this.onChange)

    // Share events setup
    this.onShareFile = options.onShareFile || noop
    this.pm.on('ed.menu.file', this.onShareFile)

    this.onShareUrl = options.onShareUrl || noop
    this.pm.on('ed.plugin.url', this.onShareUrl)

    // Plugins setup
    this.pluginContainer = document.createElement('div')
    this.pluginContainer.className = 'EdPlugins'
    this.container.appendChild(this.pluginContainer)

    let plugins = [PluginWidget, ShareUrl]
    this.plugins = plugins.map((Plugin) => new Plugin(this))
  }
  teardown () {
    this.plugins.forEach((plugin) => plugin.teardown())
    this.pm.off('change')
    this.pm.off('ed.menu.file')
    this.pm.off('ed.plugin.url')
    this.pluginContainer.parentNode.removeChild(this.pluginContainer)
    this.container.innerHTML = ''
  }
  getBlock (id) {
    return getItemWithId(this._content, id)
  }
  updateMediaBlock (block) {
    // Widget plugin calls this to update a block in the content array
    // Only media blocks can use this.
    if (!block || !block.id || !block.type || !isMediaType(block.type)) {
      throw new Error('Cant update this block')
    }
    let index = getIndexWithId(this._content, block.id)
    if (index === -1) return

    // MUTATION
    this._content.splice(index, 1, block)
    this.onChange()

    // Trigger remeasure
    this.pm.signal('draw')
  }
  updatePlaceholderHeights (changes) {
    // Do this in a batch, with one widget remeasure/move
    for (let i = 0, len = changes.length; i < len; i++) {
      const change = changes[i]
      // TODO do this with standard pm.tr interface, not direct DOM
      const placeholder = document.querySelector(`.EdSchemaMedia[grid-id="${change.id}"]`)
      placeholder.style.height = change.height + 'px'
    }
    this.pm.signal('draw')
  }
  replaceBlock (index, block) {
    let content = this.getContent()
    // MUTATION
    content.splice(index, 1, block)
    this._content = content
    // Render
    this.setContent(content)
  }
  insertBlocks (index, blocks) {
    const content = this.getContent()
    // MUTATION
    const newContent = arrayInsertAll(content, index, blocks)
    this._content = newContent
    // Render
    this.setContent(newContent)
    // Signal
    this.onChange()
  }
  setContent (content) {
    this._content = mergeContent(this._content, content)
    let doc = GridToDoc(this._content)
    // Cache selection to restore after DOM update
    let selection = fixSelection(this.pm.selection, doc)
    // Populate ProseMirror
    this.pm.setDoc(doc, selection)
    // Let widgets know to update
    this.pm.signal('ed.content.changed')
  }
  insertPlaceholders (index, count) {
    let toInsert = []
    let ids = []
    for (let i = 0, length = count; i < length; i++) {
      const id = uuid.v4()
      ids.push(id)
      toInsert.push({
        id,
        type: 'placeholder',
        metadata: {}
      })
    }
    this.insertBlocks(index, toInsert)
    return ids
  }
  updatePlaceholder (id, status, progress) {
    let block = this.getBlock(id)
    // Mutation
    if (status != null) block.metadata.status = status
    if (progress != null) block.metadata.progress = progress
    // Let widgets know to update
    this.pm.signal('ed.content.changed')
  }
  getContent () {
    let dom = this.pm.content.children
    let doc = this.pm.getContent()
    return DocToGrid(dom, doc, this._content)
  }
}

// Util

function getIndexWithId (array, id) {
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i]
    if (item.id === id) {
      return i
    }
  }
  return -1
}

function getItemWithId (array, id) {
  let index = getIndexWithId(array, id)
  if (index === -1) return
  return array[index]
}

function arrayInsertAll (array, index, arrayToInsert) {
  let before = array.slice(0, index)
  const after = array.slice(index)
  return before.concat(arrayToInsert, after)
}

function mergeContent (oldContent, newContent) {
  // Only add new placeholders and update exiting placeholders
  let merged = oldContent.slice()
  // New placeholders
  for (let i = 0, len = newContent.length; i < len; i++) {
    const block = newContent[i]
    if (block.type === 'placeholder') {
      const index = getIndexWithId(merged, block.id)
      if (index > -1) {
        merged.splice(index, 1, block)
      } else {
        merged.splice(i, 0, block)
      }
    }
  }
  // Old placeholders
  for (let i = 0, len = merged.length; i < len; i++) {
    const block = merged[i]
    if (block.type === 'placeholder') {
      const index = getIndexWithId(newContent, block.id)
      if (index > -1) {
        merged.splice(i, 1, newContent[index])
      }
    }
  }
  return merged
}

// Can't restore selection to a non-focuable (Media) div
function fixSelection (selection, doc) {
  let index = selection.anchor.path[0]
  if (doc.content.content[index] && doc.content.content[index].type.contains !== null) {
    return selection
  }
  while (doc.content.content[index] && doc.content.content[index].type.contains === null) {
    index++
  }
  if (!doc.content.content[index]) {
    return
  }
  // MUTATION
  selection.anchor.path = [index]
  selection.head.path = [index]
  return selection
}
