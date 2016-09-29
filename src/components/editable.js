require('./editable.css')
require('./editable-menu.css')

import React, {createElement as el} from 'react'
import {ProseMirror} from 'prosemirror/dist/edit/main'
import {Plugin} from 'prosemirror/dist/edit/plugin'

import {menuBar as pluginMenuBar} from 'prosemirror/dist/menu'
import {edBarMenu} from '../menu/ed-menu'

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
    const { menuTip } = this.props

    return el('div'
    , { className: 'Editable'
      , style:
        { position: 'relative' /* So widgets can position selves */
        , marginTop: (menuTip ? 48 : 0)
        }
      }
    , el('div', {className: 'Editable-Mirror', ref: 'mirror'})
    , el('div', {className: 'Editable-Plugins', ref: 'plugins'})
    )
  }
  componentDidMount () {
    const {mirror, plugins} = this.refs
    const { initialContent
      , onChange
      , onCommandsChanged
      , widgetPath
      , coverPrefs } = this.props
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

    let menu = pluginMenuBar.config(
      { float: false
      , content: edBarMenu
      }
    )
    pmOptions.plugins.push(menu)
    edPluginClasses.push(PluginFixedMenuHack)

    if (onCommandsChanged) {
      edPluginClasses.push(PluginCommandsInterface)
    }

    const pluginOptions =
      { ed: store
      , editableView: this
      , container: plugins
      , widgetPath
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
  , widgetPath: React.PropTypes.string
  , coverPrefs: React.PropTypes.object
  }
export default React.createFactory(Editable)
