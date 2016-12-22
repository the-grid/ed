require('prosemirror-menu/style/menu.css')
require('prosemirror-view/style/prosemirror.css')
require('./editable.css')
require('./editable-menu.css')

import React, {createElement as el} from 'react'
import {EditorState, Plugin, PluginKey} from 'prosemirror-state'
import {history as pluginHistory} from 'prosemirror-history'
// import {dropCursor as pluginDropCursor} from 'prosemirror-dropcursor'

import {MenuBarEditorView} from 'prosemirror-menu'
import {edMenuPlugin} from '../menu/ed-menu'

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
      new Plugin({
        key: new PluginKey('store'),
        props: {store},
      }),
      new Plugin(PluginPlaceholder),
    ]

    let edPluginClasses = [
      PluginShareUrl,
      // PluginContentHints,
    ]

    if (menuBar) {
      edPlugins.push(edMenuPlugin)
      edPluginClasses.push(PluginFixedMenuHack)
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
      plugin.props = pluginProps
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

    const applyAction = (action) => {
      view.updateState(view.editor.state.applyAction(action))
      if (action.type === 'transform') {
        onChange('EDITABLE_CHANGE', this.pm)
      }
    }

    // PM setup
    let pmOptions =
      { state,
        autoInput: true,
        spellcheck: true,
        onAction: applyAction,
        handleClickOn: function (_view, _pos, node) { return node.type.name === 'media' },
        nodeViews: {
          media: (node, view, getPos) => {
            return new MediaNodeView(node, view, getPos, store, imgfloConfig, coverPrefs, widgetPath)
          },
        },
      }

    view = this.pm = new MenuBarEditorView(mirror, pmOptions)
    this.pm.ed = store

    // this.pm.on.change.add(() => {
    //   onChange('EDITABLE_CHANGE', this.pm)
    // })

    // this.pm.on.domDrop.add(this.boundOnDrop)

    // this.pm.addKeymap(EdKeymap)


    onChange('EDITABLE_INITIALIZE', this)
  }
  componentWillUnmount () {
    // this.pm.off('change')
    // this.pm.off('ed.plugin.url')
    // this.pm.off('ed.menu.file')
    // this.pm.off('drop', this.boundOnDrop)

    this.pm.editor.state.plugins.forEach((plugin) => {
      if (plugin.options && plugin.options.state && plugin.options.state.destroy) {
        plugin.options.state.destroy()
      }
    })
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
Editable.propTypes =
{ initialContent: React.PropTypes.array.isRequired,
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
export default React.createFactory(Editable)
