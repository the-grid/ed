require('./editable.css')
require('./editable-menu.css')
require('./editable-feature-flags.css')

import React, {createElement as el} from 'react'
import {ProseMirror} from 'prosemirror/dist/edit/main'
import {Plugin} from 'prosemirror/dist/edit/plugin'

import {menuBar as pluginMenuBar} from 'prosemirror/dist/menu'
import {patchMenuWithFeatureFlags} from '../menu/ed-menu'

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
      , style:
        { position: 'relative' /* So widgets can position selves */
        }
      }
    , el('div', {className: 'Editable-Mirror', ref: 'mirror'})
    , el('div', {className: 'Editable-Plugins', ref: 'plugins'})
    )
  }
  componentDidMount () {
    const {mirror, plugins} = this.refs
    const { initialContent
      , menuBar
      , onChange
      , onCommandsChanged
      , widgetPath
      , coverPrefs } = this.props
    const {store, featureFlags} = this.context

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
      const menuContent = patchMenuWithFeatureFlags(featureFlags)
      let menu = pluginMenuBar.config(
        { float: false
        , content: menuContent
        }
      )
      pmOptions.plugins.push(menu)
      edPluginClasses.push(PluginFixedMenuHack)
    }

    if (onCommandsChanged) {
      edPluginClasses.push(PluginCommandsInterface)
    }

    const pluginOptions =
      { ed: store
      , editableView: this
      , container: plugins
      , widgetPath
      , featureFlags
      , coverPrefs
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


    onChange('EDITABLE_INITIALIZE', this)
  }
  componentWillUnmount () {
    // this.pm.off('change')
    // this.pm.off('ed.plugin.url')
    // this.pm.off('ed.menu.file')
    // this.pm.off('drop', this.boundOnDrop)
    const pluginKeys = Object.keys(this.pm.plugin)
    pluginKeys.forEach((key) => this.pm.plugin[key].detach())
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
Editable.contextTypes = 
  { store: React.PropTypes.object
  , featureFlags: React.PropTypes.object
  }
Editable.propTypes =
  { initialContent: React.PropTypes.array.isRequired
  , menuBar: React.PropTypes.bool
  , onChange: React.PropTypes.func.isRequired
  , onShareFile: React.PropTypes.func
  , onShareUrl: React.PropTypes.func
  , onDropFiles: React.PropTypes.func
  , onEditableInit: React.PropTypes.func
  , onCommandsChanged: React.PropTypes.func
  , widgetPath: React.PropTypes.string
  , coverPrefs: React.PropTypes.object
  }
export default React.createFactory(Editable)
