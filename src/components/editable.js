require('prosemirror-menu/style/menu.css')
require('prosemirror-view/style/prosemirror.css')
require('./editable.css')
require('./editable-menu.css')

import React, {createElement as el} from 'react'
import {EditorState, Plugin} from 'prosemirror-state'
import {history as pluginHistory} from 'prosemirror-history'
// import {dropCursor as pluginDropCursor} from 'prosemirror-dropcursor'

import {MenuBarEditorView} from 'prosemirror-menu'
import {edMenuPlugin, edMenuEmptyPlugin} from '../menu/ed-menu'

import GridToDoc from '../convert/grid-to-doc'
import EdSchema from '../schema/ed-schema'
import {MediaNodeView} from '../schema/media'
import {edInputRules, edBaseKeymap, edKeymap} from '../inputrules/ed-input-rules'
import {posToIndex} from '../util/pm'

import PluginShareUrl from '../plugins/share-url'
// import PluginContentHints from '../plugins/content-hints'
import PluginPlaceholder from '../plugins/placeholder'
import PluginFixedMenuHack from '../plugins/fixed-menu-hack'
import PluginCommandsInterface from '../plugins/commands-interface'
import {PluginStoreRef} from '../plugins/store-ref'


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
    , { className: 'Editable' }
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
    const {store, imgfloConfig} = this.context

    let edPlugins = [
      pluginHistory(),
      // pluginDropCursor(),
      edInputRules,
      edKeymap,
      edBaseKeymap,
    ]

    let edPluginClasses = [
      PluginStoreRef,
      PluginShareUrl,
      PluginPlaceholder,
      // PluginContentHints,
    ]

    if (menuBar) {
      edPlugins.push(edMenuPlugin)
      edPluginClasses.push(PluginFixedMenuHack)
    } else {
      edPlugins.push(edMenuEmptyPlugin)
    }

    if (onCommandsChanged) {
      edPluginClasses.push(PluginCommandsInterface)
    }

    const pluginProps = {
      ed: store,
      editableView: this,
      elMirror: mirror,
      elPlugins: plugins,
      widgetPath,
      coverPrefs,
    }

    edPluginClasses.forEach(function (plugin) {
      // FIXME least knowledge per plugin
      plugin.edStuff = pluginProps
      const p = new Plugin(plugin)
      edPlugins.push(p)
    })

    const state = EditorState.create({
      schema: EdSchema,
      doc: GridToDoc(initialContent),
      plugins: edPlugins,
      ed: store,
    })

    let view

    const applyTransaction = (transaction) => {
      view.updateState(view.editor.state.apply(transaction))
      if (transaction.steps.length) {
        onChange('EDITABLE_CHANGE', this.pm)
      }
    }

    // PM setup
    let pmOptions =
      { state,
        autoInput: true,
        spellcheck: true,
        dispatchTransaction: applyTransaction,
        handleClickOn: function (_view, _pos, node) { return node.type.name === 'media' },
        nodeViews: {
          media: (node, view, getPos) => {
            return new MediaNodeView(node, view, getPos, store, imgfloConfig, coverPrefs, widgetPath)
          },
        },
        editable: function (state) { return true },
        attributes: { class: 'ProseMirror-content' },
      }

    view = this.pm = new MenuBarEditorView(mirror, pmOptions)
    this.pm.ed = store

    // this.pm.on.domDrop.add(this.boundOnDrop)

    onChange('EDITABLE_INITIALIZE', this)
  }
  componentWillUnmount () {
    this.pm.editor.destroy()
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
Editable.contextTypes = {
  store: React.PropTypes.object,
  imgfloConfig: React.PropTypes.object,
}
Editable.propTypes = {
  initialContent: React.PropTypes.array.isRequired,
  menuBar: React.PropTypes.bool,
  onChange: React.PropTypes.func.isRequired,
  onShareFile: React.PropTypes.func,
  onShareUrl: React.PropTypes.func,
  onDropFiles: React.PropTypes.func,
  onEditableInit: React.PropTypes.func,
  onCommandsChanged: React.PropTypes.func,
  widgetPath: React.PropTypes.string,
  coverPrefs: React.PropTypes.object,
}
Editable.defaultProps = {
  coverPrefs: {},
}
export default React.createFactory(Editable)
