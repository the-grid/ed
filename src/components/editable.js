require('./editable.css')
require('./editable-menu.css')

import React, {createElement as el} from 'react'
import {ProseMirror} from 'prosemirror/dist/edit/main'
import {Plugin} from 'prosemirror/dist/edit/plugin'

import {menuBar as pluginMenuBar, tooltipMenu as pluginMenuTip} from 'prosemirror/dist/menu'
import {edBlockMenu, edInlineMenu, edBarMenu} from '../menu/ed-menu'

import GridToDoc from '../convert/grid-to-doc'
import EdKeymap from '../inputrules/ed-keymap'
import EdSchemaFull from '../schema/ed-schema-full'
import EdInputRules from '../inputrules/ed-input-rules'
import {posToIndex} from '../util/pm'

import PluginWidget from '../plugins/widget.js'
import PluginShareUrl from '../plugins/share-url'
import PluginContentHints from '../plugins/content-hints'
import PluginPlaceholder from '../plugins/placeholder'
import PluginFixedMenuHack from '../plugins/fixed-menu-hack'
import PluginCommandsInterface from '../plugins/commands-interface'


class Editable extends React.Component {
  constructor (props) {
    super(props)
    this.boundOnDrop = this.onDrop.bind(this)
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
    const {mirror, plugins} = this.refs
    const { initialContent
      , menuBar
      , menuTip
      , onChange
      , onCommandsChanged
      , widgetPath } = this.props
    const {store} = this.context

    // PM setup
    let pmOptions =
      { place: mirror
      , autoInput: true
      // , commands: commands
      , doc: GridToDoc(initialContent)
      , schema: EdSchemaFull
      , plugins: [ EdInputRules ]
      }

    let edPluginClasses =
      [ PluginWidget
      , PluginShareUrl
      , PluginContentHints
      , PluginPlaceholder
      ]
    if (menuBar) {
      let menu = pluginMenuBar.config(
        { float: false
        , content: edBarMenu
        }
      )
      pmOptions.plugins.push(menu)
      edPluginClasses.push(PluginFixedMenuHack)
    }
    if (menuTip) {
      let menu = pluginMenuTip.config(
        { showLinks: true
        , selectedBlockMenu: true
        , inlineContent: edInlineMenu
        , blockContent: edBlockMenu
        , selectedBlockContent: edBlockMenu
        }
      )
      pmOptions.plugins.push(menu)
    }
    if (onCommandsChanged) {
      edPluginClasses.push(PluginCommandsInterface)
    }

    const pluginOptions =
      { ed: store
      , editableView: this
      , container: plugins
      , widgetPath
      }

    edPluginClasses.forEach(function (plugin) {
      const p = new Plugin(plugin, pluginOptions)
      pmOptions.plugins.push(p)
    })

    this.pm = new ProseMirror(pmOptions)
    this.pm.ed = store

    this.pm.on.change.add(() => {
      onChange('EDITABLE_CHANGE', this.pm)
    })

    this.pm.on.domDrop.add(this.boundOnDrop)

    this.pm.addKeymap(EdKeymap)


    // this.plugins = pluginsToInit.map((Plugin) => new Plugin(pluginOptions))

    onChange('EDITABLE_INITIALIZE', this)
  }
  componentWillUnmount () {
    // this.pm.off('change')
    // this.pm.off('ed.plugin.url')
    // this.pm.off('ed.menu.file')
    // this.pm.off('drop', this.boundOnDrop)
    // this.plugins.forEach((plugin) => plugin.teardown())
  }
  onDrop (event) {
    if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) return
    const {onDropFiles} = this.props
    if (!onDropFiles) return
    const pos = this.pm.posAtCoords({left: event.clientX, top: event.clientY})
    if (pos == null) return
    const index = posToIndex(this.pm.doc, pos)
    if (index == null) return
    event.preventDefault()
    event.stopPropagation()
    onDropFiles(index, event.dataTransfer.files)
  }
}
Editable.contextTypes = {store: React.PropTypes.object}
Editable.propTypes =
  { initialContent: React.PropTypes.array.isRequired
  , onChange: React.PropTypes.func.isRequired
  , onShareFile: React.PropTypes.func
  , onShareUrl: React.PropTypes.func
  , onDropFiles: React.PropTypes.func
  , onEditableInit: React.PropTypes.func
  , onCommandsChanged: React.PropTypes.func
  , menuBar: React.PropTypes.bool
  , menuTip: React.PropTypes.bool
  , widgetPath: React.PropTypes.string
  }
export default React.createFactory(Editable)
