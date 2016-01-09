import {ProseMirror} from 'prosemirror/src/edit/main'

import 'prosemirror/src/inputrules/autoinput'
import 'prosemirror/src/menu/tooltipmenu'
import 'prosemirror/src/menu/menubar'
import 'prosemirror/src/collab'

import GridSchema from './schema'
import GridToDoc from './convert/grid-to-doc'
import DocToGrid from './convert/doc-to-grid'
import './menu/context-menu'

import PluginWidget from './plugins/widget.js'
import CodeEmbedder from './plugins/code-embedder.js'

//import {commandGroups} from 'prosemirror/src/menu/menu'

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

    if (options.menutip) {
      this.pm.setOption('contextMenu', {
        emptyBlockMenu: true,
        selectedBlockMenu: true,
        //blockGroups: ['block','inline']
      })
    }

    if (options.onChange) {
      this.pm.on('change', options.onChange)
    }
    if (options.onPluginEvent) {
      this.onPluginEvent = options.onPluginEvent
    }

    if (options.content) {
      this.content = options.content
    }

    let plugins = [PluginWidget, CodeEmbedder]
    this.plugins = plugins.map(Plugin => new Plugin(this))
  }
  teardown () {
    this.plugins.forEach(plugin => plugin.teardown())
    this.pm.off('change')
    this.container.innerHTML = ''
  }
  set content (content) {
    // Cache the content object that we originally get from the API.
    // We'll need the content and block metadata later, in `get content`.
    this._content = content
    let doc = GridToDoc(content)
    // Cache selection to restore after DOM update
    let selection = this.pm.selection
    // Populate ProseMirror
    this.pm.setDoc(doc, selection)
  }
  get content () {
    let dom = this.pm.content.children
    let doc = this.pm.getContent()
    return DocToGrid(dom, doc, this._content)
  }
}
