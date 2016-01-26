require('./index.css')

import {ProseMirror} from 'prosemirror/src/edit/main'
import _ from './util/lodash'

import {commands} from './edit'

import 'prosemirror/src/inputrules/autoinput'
import 'prosemirror/src/menu/tooltipmenu'
import 'prosemirror/src/menu/menubar'
import 'prosemirror/src/collab'

import GridSchema from './schema'
import GridToDoc from './convert/grid-to-doc'
import DocToGrid from './convert/doc-to-grid'

import {isMediaType} from './convert/types'
import './menu/context-menu'

import PluginWidget from './plugins/widget.js'
import CodeEmbedder from './plugins/code-embedder.js'

function noop () { /* noop */ }

export default class Ed {
  constructor (options) {
    if (!options.container) options.container = document.body
    this.container = options.container

    let pmOptions = {
      place: this.container,
      autoInput: true,
      docFormat: 'html',
      schema: GridSchema
    }

    if (options.menubar) {
      pmOptions.menuBar = {float: true}
    }

    this.pm = new ProseMirror(pmOptions)

    this.pm.setOption('commands', commands)

    if (options.menutip) {
      this.pm.setOption('contextMenu', {
        emptyBlockMenu: true,
        selectedBlockMenu: true
      })
    }

    if (options.onChange) {
      this.onChange = options.onChange || noop
      this.pm.on('change', this.onChange)
    }
    if (options.onAutosave) {
      const autosaveInterval = options.autosaveInterval || 100
      const debouncedAutosave = _.debounce(function () {
        options.onAutosave()
      }, autosaveInterval)
      this.pm.on('change', debouncedAutosave)
    }
    if (options.onPluginEvent) {
      this.onPluginEvent = options.onPluginEvent
    }

    if (options.initialContent && Array.isArray(options.initialContent)) {
      this.setContent(options.initialContent)
    } else {
      throw new Error('Missing options.initialContent array')
    }

    // Menu setup
    this.onShareFile = options.onShareFile || noop
    this.pm.on('ed.menu.file', this.onShareFile)

    // Plugins setup
    this.pluginContainer = document.createElement('div')
    this.pluginContainer.className = 'EdPlugins'
    this.container.appendChild(this.pluginContainer)

    let plugins = [PluginWidget, CodeEmbedder]
    this.plugins = plugins.map(Plugin => new Plugin(this))
  }
  teardown () {
    this.plugins.forEach(plugin => plugin.teardown())
    this.pm.off('change')
    this.pm.off('ed.menu.file')
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
  setContent (content) {
    // Cache the content object that we originally get from the API.
    // We'll need the content and block metadata later, in `get content`.
    this._content = content
    let doc = GridToDoc(content)
    // TODO merge placeholders
    // Cache selection to restore after DOM update
    let selection = this.pm.selection
    // Populate ProseMirror
    this.pm.setDoc(doc, selection)
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
