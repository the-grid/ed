require('./editable.css')

import React, {createElement as el} from 'react'
import {ProseMirror} from 'prosemirror/src/edit/main'
import 'prosemirror/src/inputrules/autoinput'
import 'prosemirror/src/menu/tooltipmenu'
import 'prosemirror/src/menu/menubar'

import GridToDoc from '../convert/grid-to-doc'
import {isMediaType} from '../convert/types'
import commands from '../commands/index'
import {inlineMenu, blockMenu, barMenu,
  foldBarMenu, foldBlockMenu, foldInlineMenu} from '../menu/ed-menu'
import EdSchemaFull from '../schema/ed-schema-full'

import PluginWidget from '../plugins/widget.js'
import ShareUrl from '../plugins/share-url'
import FixedMenuBarHack from '../plugins/fixed-menu-hack'

function noop () { /* noop */ }


class Editable extends React.Component {
  constructor (props) {
    super(props)
    
    const {initialContent} = this.props
    this.contentHash = {}
    for (let i = 0, len = initialContent.length; i < len; i++) {
      const block = initialContent[i]
      if (!block || !block.id) {
        continue
      }
      this.contentHash[block.id] = block
    }
  }
  setState () {
    throw new Error('Can not setState of Editable')
  }
  render () {
    return el('div'
    , { className: 'Editable'
      , style: {position: 'relative'} /* So widgets can position selves */
      }
    , el('div', {className: 'Editable-Mirror', ref: 'mirror'})
    , el('div', {className: 'Editable-Plugins', ref: 'plugins'})
    )
  }
  componentDidMount () {
    const containerEl = this.refs.mirror
    const pluginsEl = this.refs.plugins

    const {initialContent, isFold
      , menubar, menutip
      , onChange, onShareUrl, onShareFile
      , onEditableInit} = this.props

    // PM setup
    let pmOptions =
      { place: containerEl
      , autoInput: true
      , commands: commands
      , doc: GridToDoc(initialContent, EdSchemaFull)
      , schema: EdSchemaFull
      }

    this.pm = new ProseMirror(pmOptions)

    if (menubar) {
      this.pm.setOption('menuBar'
      , { content: (isFold ? foldBarMenu : barMenu) }
      )
    }
    if (menutip) {
      this.pm.setOption('tooltipMenu'
      , { showLinks: true
        , emptyBlockMenu: true
        , selectedBlockMenu: true
        , inlineContent: (isFold ? foldInlineMenu : inlineMenu)
        , selectedBlockContent: (isFold ? foldInlineMenu : inlineMenu)
        , blockContent: (isFold ? foldBlockMenu : blockMenu)
        }
      )
    }

    this.pm.on('change', onChange)

    // Setup plugins
    let plugins = [FixedMenuBarHack]

    if (!isFold) {
      plugins.push(PluginWidget)
      plugins.push(ShareUrl)
      this.pm.on('ed.plugin.url', (onShareUrl || noop))
      this.pm.on('ed.menu.file', (onShareFile || noop))
    }

    const pluginOptions =
      { ed: this
      , pm: this.pm
      , container: pluginsEl
      }

    this.plugins = plugins.map((Plugin) => new Plugin(pluginOptions))

    onEditableInit(this.pm)
  }
  componentWillUnmount () {
    this.pm.off('change')
    this.pm.off('ed.plugin.url')
    this.pm.off('ed.menu.file')
    this.plugins.forEach((plugin) => plugin.teardown())
  }
  getBlock (id) {
    return this.contentHash[id]
  }
  updatePlaceholderHeights (changes) {
    // Do this in a batch, with one widget remeasure/move
    for (let i = 0, len = changes.length; i < len; i++) {
      const change = changes[i]
      // TODO do this with standard pm.tr interface, not direct DOM
      const placeholder = this.refs.mirror.querySelector(`.EdSchemaMedia[grid-id="${change.id}"]`)
      placeholder.style.height = change.height + 'px'
    }
    this.pm.signal('draw')
  }
  updateMediaBlock (block) {
    // Widget plugin calls this to update a block in the content array
    // Only media blocks can use this.
    if (!block || !block.id || !block.type || !isMediaType(block.type)) {
      throw new Error('Can not update this block')
    }
    const currentBlock = this.getBlock(block.id)
    if (!currentBlock) {
      throw new Error('Can not find this block')
    }

    // MUTATION
    this.contentHash[block.id] = block
    this.props.onChange()

    // Trigger remeasure
    this.pm.signal('draw')
  }
}
Editable.propTypes =
  { initialContent: React.PropTypes.array.isRequired
  , isFold: React.PropTypes.bool.isRequired
  , onChange: React.PropTypes.func.isRequired
  , onShareFile: React.PropTypes.func
  , onShareUrl: React.PropTypes.func
  , onEditableInit: React.PropTypes.func
  , menubar: React.PropTypes.bool
  , menutip: React.PropTypes.bool
  }
export default React.createFactory(Editable)
